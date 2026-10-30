import Link from "next/link";
import { listPosts } from "@/lib/db";
import { getEnv } from "@/lib/env";
import type { Post } from "@/lib/types";

export const metadata = {
  title: "Blog — agni",
  description: "Notes on links, analytics, and building fast things on Cloudflare.",
};

export const dynamic = "force-dynamic";

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="card flex flex-col gap-2.5 p-6 transition-colors hover:bg-surface2"
    >
      <div className="flex items-center gap-2 text-[11px] text-ink3">
        <time>{post.published_at?.slice(0, 10) ?? ""}</time>
        {post.tags.slice(0, 2).map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      <h2 className="text-[15px] font-semibold leading-snug tracking-tight">{post.title}</h2>
      {post.excerpt && <p className="text-[12.5px] leading-relaxed text-ink2">{post.excerpt}</p>}
      <span className="mt-auto pt-2 text-[11.5px] text-ink3">Read more</span>
    </Link>
  );
}

export default async function BlogIndexPage() {
  let posts: Post[] = [];
  try {
    posts = await listPosts(getEnv().DB);
  } catch {
    posts = [];
  }

  return (
    <div className="container-x py-14">
      <div className="max-w-2xl">
        <h1 className="text-[30px] font-semibold tracking-tight sm:text-[38px]">Blog</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-ink2">
          Notes on links, analytics, and building fast things on Cloudflare.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="card mt-10 px-6 py-12 text-center text-[12.5px] text-ink3">
          No posts published yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
