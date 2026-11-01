// SEO helpers: FAQ extraction from post markdown, JSON-LD builders.

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Pull "## FAQ" sections out of post markdown: each "### question" with its
 * answer paragraphs becomes one FAQPage entry. Returns [] when no FAQ block.
 */
export function extractFaq(bodyMd: string): FaqItem[] {
  const faqIdx = bodyMd.search(/^##\s+FAQ\s*$/m);
  if (faqIdx < 0) return [];
  const rest = bodyMd.slice(faqIdx).replace(/^##\s+FAQ\s*$/m, "");
  // Stop at the next H2 if the FAQ is not last (the CTA after FAQ is usually
  // just a paragraph + link, so we run to the next "## " heading if any).
  const nextH2 = rest.search(/^##\s+/m);
  const faqBody = nextH2 >= 0 ? rest.slice(0, nextH2) : rest;

  const items: FaqItem[] = [];
  const parts = faqBody.split(/^###\s+/m).slice(1);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const q = (nl >= 0 ? part.slice(0, nl) : part).replace(/[#*`]/g, "").trim();
    const a = (nl >= 0 ? part.slice(nl + 1) : "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*`_#>]/g, "")
      .replace(/\n+/g, " ")
      .trim();
    if (q && a) items.push({ q, a: a.length > 500 ? `${a.slice(0, 497)}...` : a });
  }
  return items.slice(0, 8);
}

export function blogPostingJsonLd(post: {
  title: string;
  slug: string;
  excerpt: string | null;
  body_md: string;
  published_at: string | null;
  updated_at: string;
  author_name: string | null;
  tags: string[];
}) {
  const faq = extractFaq(post.body_md);
  const url = `https://agni.cc.cd/blog/${post.slug}`;
  const words = post.body_md.split(/\s+/).length;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt ?? undefined,
      url,
      datePublished: post.published_at ?? post.updated_at,
      dateModified: post.updated_at,
      author: { "@type": "Person", name: post.author_name ?? "Amit Anand" },
      publisher: { "@id": "https://agni.cc.cd/#organization" },
      mainEntityOfPage: url,
      wordCount: words,
      keywords: post.tags.join(", "),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://agni.cc.cd" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://agni.cc.cd/blog" },
        { "@type": "ListItem", position: 3, name: post.title },
      ],
    },
  ];
  if (faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
