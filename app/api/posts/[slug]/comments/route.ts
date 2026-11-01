import { ensureSchema } from "@/lib/db";
import { getEnv } from "@/lib/env";

// Public blog comments — plain text, visible immediately, lightly rate-limited.
// A honeypot field ("website") plus length caps keep out naive spam; the
// comment list itself is server-rendered on the post page for SEO.

const NAME_MAX = 60;
const BODY_MAX = 2000;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { DB } = getEnv();
  await ensureSchema(DB);
  const { results } = await DB.prepare(
    `SELECT id, post_slug, name, body, created_at FROM comments
     WHERE post_slug = ? AND status = 'visible' ORDER BY created_at ASC`,
  )
    .bind(slug)
    .all();
  return Response.json({ comments: results });
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { DB } = getEnv();
  await ensureSchema(DB);

  const body = (await request.json().catch(() => null)) as {
    name?: string;
    body?: string;
    website?: string; // honeypot — must stay empty
  } | null;

  if (!body || typeof body.name !== "string" || typeof body.body !== "string") {
    return Response.json({ error: "A comment needs a name and text." }, { status: 400 });
  }
  if (body.website) {
    // honeypot tripped — pretend success so bots do not adapt
    return Response.json({ ok: true });
  }

  const name = body.name.trim().slice(0, NAME_MAX);
  const text = body.body.trim().slice(0, BODY_MAX);
  if (!name || !text) {
    return Response.json({ error: "A comment needs a name and text." }, { status: 400 });
  }
  if (/https?:\/\//.test(text) && (text.match(/https?:\/\//g)?.length ?? 0) > 2) {
    return Response.json({ error: "Comments can include at most 2 links." }, { status: 400 });
  }

  // Basic per-IP rate limit: at most 5 comments per IP per hour.
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(ip));
  const ipHash = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const { results: recent } = await DB.prepare(
    `SELECT COUNT(*) AS n FROM comments WHERE ip_hash = ? AND created_at > datetime('now', '-1 hour')`,
  )
    .bind(ipHash)
    .all<{ n: number }>();
  if ((recent?.[0]?.n ?? 0) >= 5) {
    return Response.json(
      { error: "You have commented a few times already — try again in a bit." },
      { status: 429 },
    );
  }

  // Duplicate-content guard.
  const { results: dup } = await DB.prepare(
    `SELECT COUNT(*) AS n FROM comments WHERE post_slug = ? AND body = ? AND created_at > datetime('now', '-1 day')`,
  )
    .bind(slug, text)
    .all<{ n: number }>();
  if ((dup?.[0]?.n ?? 0) > 0) {
    return Response.json({ ok: true });
  }

  const id = crypto.randomUUID();
  await DB.prepare(
    `INSERT INTO comments (id, post_slug, name, body, ip_hash) VALUES (?, ?, ?, ?, ?)`,
  )
    .bind(id, slug, name, text, ipHash)
    .run();

  return Response.json({ ok: true, comment: { id, post_slug: slug, name, body: text, created_at: new Date().toISOString() } }, { status: 201 });
}
