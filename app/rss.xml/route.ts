// rss.xml — feed of published posts, for readers and for SEO discovery.
import { listPosts } from "@/lib/db";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  let items = "";
  try {
    const posts = await listPosts(getEnv().DB);
    items = posts
      .map((p) => {
        const date = p.published_at ? new Date(p.published_at).toUTCString() : new Date(p.updated_at).toUTCString();
        return `    <item>
      <title>${esc(p.title)}</title>
      <link>https://agni.cc.cd/blog/${esc(p.slug)}</link>
      <guid isPermaLink="true">https://agni.cc.cd/blog/${esc(p.slug)}</guid>
      <description>${esc(p.excerpt ?? "")}</description>
      <pubDate>${date}</pubDate>
    </item>`;
      })
      .join("\n");
  } catch {
    items = "";
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>agni — short links you can measure</title>
    <link>https://agni.cc.cd/blog</link>
    <description>Notes on links, analytics, and building fast things on Cloudflare.</description>
    <language>en</language>
    <atom:link href="https://agni.cc.cd/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=1800" },
  });
}
