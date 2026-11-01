// robots.txt — open to search engines and to AI/LLM crawlers, so assistants
// (ChatGPT, Claude, Perplexity, Gemini) can read and cite the site.
export const dynamic = "force-dynamic";

const BODY = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /login
Disallow: /api/

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://agni.cc.cd/sitemap.xml
`;

export async function GET() {
  return new Response(BODY, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
