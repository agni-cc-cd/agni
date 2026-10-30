import { authenticate, forbidden, ownsLink, unauthorized } from "@/lib/auth";
import { ensureSchema, getLinkById, getLinkStats } from "@/lib/db";
import { getEnv } from "@/lib/env";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { DB, ADMIN_TOKEN } = getEnv();
  const auth = await authenticate(request, ADMIN_TOKEN);
  if (!auth) return unauthorized();
  await ensureSchema(DB);

  const { id } = await params;
  const link = await getLinkById(DB, id);
  if (!link) return Response.json({ error: "Link not found." }, { status: 404 });
  if (!ownsLink(auth, link)) return forbidden();

  const days = Math.min(365, Math.max(1, Number(new URL(request.url).searchParams.get("days") ?? 30) || 30));
  const stats = await getLinkStats(DB, link, days);
  return Response.json({ link, stats });
}
