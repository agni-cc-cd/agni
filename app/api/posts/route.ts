import { isAdminAuthorized } from "@/lib/auth";
import { ensureSchema, listPosts, upsertPost } from "@/lib/db";
import { getEnv } from "@/lib/env";

/** Public: published posts. Admin bearer may list drafts too. */
export async function GET(request: Request) {
  const { DB, ADMIN_TOKEN } = getEnv();
  await ensureSchema(DB);
  const admin = isAdminAuthorized(request, ADMIN_TOKEN);
  const posts = await listPosts(DB, admin);
  return Response.json({ posts: admin ? posts : posts.map(({ body_md: _body, ...rest }) => rest) });
}

/** Admin: create or update a post (CMS write). */
export async function POST(request: Request) {
  const { DB, ADMIN_TOKEN } = getEnv();
  if (!isAdminAuthorized(request, ADMIN_TOKEN)) {
    return Response.json({ error: "Admin only." }, { status: 403 });
  }
  await ensureSchema(DB);

  const body = (await request.json().catch(() => null)) as {
    id?: string;
    slug?: string;
    title?: string;
    excerpt?: string;
    body_md?: string;
    tags?: string[];
    published?: boolean;
    author_name?: string;
    published_at?: string;
  } | null;

  if (!body?.slug || !body.title || !body.body_md) {
    return Response.json({ error: "`slug`, `title` and `body_md` are required." }, { status: 400 });
  }

  const post = await upsertPost(DB, {
    id: body.id ?? crypto.randomUUID(),
    slug: body.slug,
    title: body.title,
    excerpt: body.excerpt ?? null,
    body_md: body.body_md,
    tags: body.tags ?? [],
    published: body.published ?? false,
    author_name: body.author_name ?? null,
    published_at: body.published_at ?? null,
  });
  return Response.json({ post }, { status: 201 });
}
