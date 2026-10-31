import { waitUntil } from "cloudflare:workers";
import { authenticate, unauthorized } from "@/lib/auth";
import { createLink, ensureSchema, getLinkBySlug, getOverview, listLinks, upsertUser } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { primeRedirectCache } from "@/lib/redirect";
import { generateSlug, isValidSlug, normalizeTargetUrl } from "@/lib/slug";

export async function GET(request: Request) {
  const { DB } = getEnv();
  await ensureSchema(DB);
  const auth = await authenticate(request, getEnv().ADMIN_TOKEN);
  if (!auth) return unauthorized();

  const owner = auth === "open" ? null : auth.uid;
  const days = Number(new URL(request.url).searchParams.get("days") ?? 30) || 30;
  const [links, overview] = await Promise.all([listLinks(DB, { owner }), getOverview(DB, owner, days)]);
  return Response.json({ links, overview });
}

export async function POST(request: Request) {
  const { DB, LINKS_KV, ADMIN_TOKEN } = getEnv();
  const auth = await authenticate(request, ADMIN_TOKEN);
  if (!auth) return unauthorized();

  await ensureSchema(DB);

  const body = (await request.json().catch(() => null)) as {
    url?: string;
    slug?: string;
    title?: string;
  } | null;
  if (!body?.url) {
    return Response.json({ error: "Please paste a URL to shorten." }, { status: 400 });
  }

  const target = normalizeTargetUrl(body.url);
  if (!target) {
    return Response.json(
      { error: "That doesn't look like a valid link. Use a full web address starting with http:// or https://." },
      { status: 400 },
    );
  }

  let slug = body.slug?.trim() || generateSlug();
  if (!isValidSlug(slug)) {
    return Response.json(
      { error: "Custom names can use letters, numbers, dashes and underscores — up to 64 characters." },
      { status: 400 },
    );
  }

  if (await getLinkBySlug(DB, slug)) {
    return Response.json(
      { error: `The name "${slug}" is already taken. Try another one.` },
      { status: 409 },
    );
  }

  const id = crypto.randomUUID();
  const link = await createLink(DB, {
    id,
    slug,
    target_url: target,
    title: body.title?.trim() || null,
    created_by: auth === "open" ? "admin" : auth.uid,
  });

  if (auth !== "open") {
    waitUntil(
      upsertUser(DB, {
        uid: auth.uid,
        email: auth.email,
        name: auth.name,
        picture: auth.picture,
      }),
    );
  }
  waitUntil(primeRedirectCache(LINKS_KV, id, slug, target));
  return Response.json({ link }, { status: 201 });
}
