import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { renderMarkdown } from "@/lib/markdown";
import { ArrowLeftIcon } from "@/app/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let title = "Blog — agni";
  try {
    const post = await getPostBySlug(getEnv().DB, slug);
    if (post) title = `${post.title} — agni`;
  } catch {
    // fall through to default title
  }
  return { title };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = null;
  try {
    post = await getPostBySlug(getEnv().DB, slug);
  } catch {
    post = null;
  }
  if (!post) notFound();

  const html = renderMarkdown(post.body_md);

  return (
    <div className="container-x py-14">
      <article className="mx-auto max-w-2xl">
        <Link href="/blog" className="flex w-fit items-center gap-1.5 text-[11.5px] text-ink3 hover:text-ink2">
          <ArrowLeftIcon width={12} height={12} /> All posts
        </Link>
        <div className="mt-5 flex items-center gap-2 text-[11px] text-ink3">
          <time>{post.published_at?.slice(0, 10) ?? ""}</time>
          {post.author_name && <span>· {post.author_name}</span>}
          {post.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-3 text-[30px] font-semibold leading-tight tracking-tight sm:text-[36px]">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-[15px] leading-relaxed text-ink2">{post.excerpt}</p>
        )}
        <hr className="divider my-8" />
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </div>
  );
}
