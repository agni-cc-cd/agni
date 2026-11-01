// sitemap.xml — static pages plus every published post from D1.
import { listPosts } from "@/lib/db";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

const STATIC_PATHS: Array<[string, string, string]> = [
  ["/", "1.0", "daily"],
  ["/pricing", "0.8", "weekly"],
  ["/blog", "0.9", "daily"],
  ["/alternatives", "0.8", "weekly"],
  ["/compare/agni-vs-bitly", "0.8", "weekly"],
  ["/compare/agni-vs-tinyurl", "0.8", "weekly"],
  ["/compare/agni-vs-rebrandly", "0.8", "weekly"],
  ["/compare/agni-vs-short-io", "0.8", "weekly"],
  ["/compare/agni-vs-dub", "0.8", "weekly"],
  ["/compare/agni-vs-cuttly", "0.8", "weekly"],
  ["/about", "0.5", "monthly"],
  ["/terms", "0.3", "yearly"],
  ["/privacy", "0.3", "yearly"],
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function GET() {
  const urls: string[] = [];
  for (const [path, priority, changefreq] of STATIC_PATHS) {
    urls.push(
      `  <url>\n    <loc>https://agni.cc.cd${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
    );
  }
  try {
    const posts = await listPosts(getEnv().DB);
    for (const p of posts) {
      const lastmod = (p.published_at ?? p.updated_at)?.slice(0, 10) ?? "";
      urls.push(
        `  <url>\n    <loc>https://agni.cc.cd/blog/${esc(p.slug)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
      );
    }
  } catch {
    // static entries still render
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(xml, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=1800" },
  });
}
