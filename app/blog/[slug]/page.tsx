import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { renderMarkdown } from "@/lib/markdown";
import { blogPostingJsonLd } from "@/lib/seo";
import { ArrowLeftIcon } from "@/app/components/icons";
import { CommentsSection } from "@/app/components/comments";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  let title = "Blog — agni";
  let description = "Notes on links, analytics, and building fast things on Cloudflare.";
  try {
    const post = await getPostBySlug(getEnv().DB, slug);
    if (post) {
      title = `${post.title} — agni`;
      description = post.excerpt ?? description;
    }
  } catch {
    // fall through to defaults
  }
  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://agni.cc.cd/blog/${slug}`,
      siteName: "agni",
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
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
  const jsonLd = blogPostingJsonLd(post);

  return (
    <div className="container-x py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      <CommentsSection slug={post.slug} />
    </div>
  );
}
