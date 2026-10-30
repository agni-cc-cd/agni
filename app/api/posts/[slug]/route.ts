import { isAdminAuthorized } from "@/lib/auth";
import { deletePost, ensureSchema, getPostBySlug } from "@/lib/db";
import { getEnv } from "@/lib/env";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { DB, ADMIN_TOKEN } = getEnv();
  await ensureSchema(DB);
  const { slug } = await params;
  const post = await getPostBySlug(DB, slug, isAdminAuthorized(request, ADMIN_TOKEN));
  if (!post) return Response.json({ error: "Post not found." }, { status: 404 });
  return Response.json({ post });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { DB, ADMIN_TOKEN } = getEnv();
  if (!isAdminAuthorized(request, ADMIN_TOKEN)) {
    return Response.json({ error: "Admin only." }, { status: 403 });
  }
  const { slug } = await params;
  const post = await getPostBySlug(DB, slug, true);
  if (!post) return Response.json({ error: "Post not found." }, { status: 404 });
  await deletePost(DB, post.id);
  return Response.json({ ok: true });
}
