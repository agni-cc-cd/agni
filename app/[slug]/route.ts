import { waitUntil } from "cloudflare:workers";
import { requestClickEvent, trackClick } from "@/lib/analytics";
import { recordClick } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { resolveRedirect } from "@/lib/redirect";

/**
 * The redirect hot path: KV-first lookup, 302 to the target, full click
 * capture out-of-band so the redirect response never waits on writes.
 */
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { DB, LINKS_KV, CLICKS_ANALYTICS } = getEnv();
  const { slug } = await params;

  const hit = await resolveRedirect(LINKS_KV, DB, slug);
  if (!hit) {
    return new Response("Not found", {
      status: 404,
      headers: { "cache-control": "public, max-age=60" },
    });
  }

  const event = requestClickEvent(request, { id: hit.id, slug: hit.slug });
  waitUntil(
    (async () => {
      await recordClick(DB, event);
      trackClick(CLICKS_ANALYTICS, event);
    })(),
  );

  return new Response(null, {
    status: 302,
    headers: {
      location: hit.target,
      "cache-control": "no-store",
      "x-agni-slug": hit.slug,
    },
  });
}
