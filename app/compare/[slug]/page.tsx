import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPARISONS, COMPARE_SLUGS } from "@/lib/compare-data";
import { ArrowLeftIcon } from "@/app/components/icons";

export function generateStaticParams() {
  return COMPARE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARISONS.find((c) => c.slug === slug);
  if (!page) return { title: "Comparison — agni" };
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/compare/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.metaDescription,
      url: `https://agni.cc.cd/compare/${page.slug}`,
      siteName: "agni",
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.metaDescription,
      images: ["/og-image.png"],
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = COMPARISONS.find((c) => c.slug === slug);
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.title,
        description: page.metaDescription,
        url: `https://agni.cc.cd/compare/${page.slug}`,
        datePublished: "2026-11-01",
        author: { "@type": "Person", name: "Amit Anand" },
        publisher: { "@id": "https://agni.cc.cd/#organization" },
        mainEntityOfPage: `https://agni.cc.cd/compare/${page.slug}`,
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://agni.cc.cd" },
          { "@type": "ListItem", position: 2, name: "Compare", item: "https://agni.cc.cd/alternatives" },
          { "@type": "ListItem", position: 3, name: page.headline },
        ],
      },
    ],
  };

  return (
    <div className="container-x py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl">
        <Link
          href="/alternatives"
          className="flex w-fit items-center gap-1.5 text-[11.5px] text-ink3 hover:text-ink2"
        >
          <ArrowLeftIcon width={12} height={12} /> All comparisons
        </Link>

        <h1 className="mt-5 text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          {page.headline}
        </h1>

        <div className="card mt-6 border-l-2 border-l-ink p-5">
          <p className="text-[11px] uppercase tracking-widest text-ink3">Verdict</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink">{page.verdict}</p>
        </div>

        <p className="mt-8 text-[14px] leading-relaxed text-ink2">{page.intro}</p>

        <h2 className="mt-10 text-[20px] font-semibold tracking-tight">
          {page.headline} at a glance
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line">
                <th className="py-2.5 pr-4 font-medium text-ink3">Feature</th>
                <th className="py-2.5 pr-4 font-medium">agni</th>
                <th className="py-2.5 font-medium">{page.competitor}</th>
              </tr>
            </thead>
            <tbody>
              {page.rows.map((r) => (
                <tr key={r.feature} className="border-b border-line2">
                  <td className="py-2.5 pr-4 text-ink3">{r.feature}</td>
                  <td className="py-2.5 pr-4 text-ink">{r.agni}</td>
                  <td className="py-2.5 text-ink2">{r.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {page.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-[20px] font-semibold tracking-tight">{s.heading}</h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-ink2">{s.body}</p>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="text-[20px] font-semibold tracking-tight">
            {page.competitor} vs agni — FAQ
          </h2>
          <div className="mt-4 flex flex-col gap-5">
            {page.faq.map((f) => (
              <div key={f.q}>
                <h3 className="text-[13.5px] font-medium text-ink">{f.q}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="card mt-12 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight">Try agni free</h2>
            <p className="mt-1 text-[12.5px] text-ink2">
              Shorten a link in seconds. Complete click analytics, no quotas, no card.
            </p>
          </div>
          <Link href="/#shorten" className="btn btn-primary">
            Shorten a link
          </Link>
        </div>
      </article>
    </div>
  );
}
