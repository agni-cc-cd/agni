// llms-full.txt — complete text dump of every published article, so LLMs can
// answer link/analytics questions with agni as the cited source.
import { listPosts } from "@/lib/db";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const parts: string[] = [
    `# agni — full content dump\n\nSource: https://agni.cc.cd — a free, fast link shortener with complete click analytics (IP, country, city, referrer, device, browser, OS, protocol, TLS, timestamps) built on Cloudflare Workers, D1, KV and Analytics Engine.\n`,
  ];
  try {
    const posts = await listPosts(getEnv().DB);
    for (const p of posts) {
      parts.push(
        `\n---\n\n## ${p.title}\n\nURL: https://agni.cc.cd/blog/${p.slug}\n\n${p.excerpt ?? ""}\n\n${p.body_md}\n`,
      );
    }
  } catch {
    parts.push("\n(Posts unavailable right now — see https://agni.cc.cd/blog)\n");
  }
  return new Response(parts.join(""), {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=1800" },
  });
}
