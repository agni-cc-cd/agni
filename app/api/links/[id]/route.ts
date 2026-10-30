import { waitUntil } from "cloudflare:workers";
import { authenticate, forbidden, ownsLink, unauthorized } from "@/lib/auth";
import { deleteLink, ensureSchema, getLinkById } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { invalidateRedirectCache } from "@/lib/redirect";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { DB, ADMIN_TOKEN } = getEnv();
  const auth = await authenticate(request, ADMIN_TOKEN);
  if (!auth) return unauthorized();
  await ensureSchema(DB);

  const { id } = await params;
  const link = await getLinkById(DB, id);
  if (!link) return Response.json({ error: "Link not found." }, { status: 404 });
  if (!ownsLink(auth, link)) return forbidden();
  return Response.json({ link });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { DB, LINKS_KV, ADMIN_TOKEN } = getEnv();
  const auth = await authenticate(request, ADMIN_TOKEN);
  if (!auth) return unauthorized();

  const { id } = await params;
  const link = await getLinkById(DB, id);
  if (!link) return Response.json({ error: "Link not found." }, { status: 404 });
  if (!ownsLink(auth, link)) return forbidden();

  await deleteLink(DB, id);
  waitUntil(invalidateRedirectCache(LINKS_KV, link.slug));
  return Response.json({ ok: true });
}
