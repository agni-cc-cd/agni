import Link from "next/link";
import type { Metadata } from "next";
import { COMPARISONS } from "@/lib/compare-data";

export const metadata: Metadata = {
  title: "Bitly alternatives and link shortener comparisons — agni",
  description:
    "Free Bitly alternatives compared: agni vs TinyURL, Rebrandly, Short.io, Dub and Cuttly — honest breakdowns of free-tier limits, analytics depth and price.",
  alternates: { canonical: "/alternatives" },
  openGraph: {
    title: "Bitly alternatives and link shortener comparisons — agni",
    description:
      "Free Bitly alternatives compared: agni vs TinyURL, Rebrandly, Short.io, Dub and Cuttly.",
    url: "https://agni.cc.cd/alternatives",
    siteName: "agni",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const FAQ = [
  {
    q: "What is the best free Bitly alternative?",
    a: "For most people it is agni: unlimited short links and complete click analytics (IP, location, device, referrer, full request data) on the free tier, with live dashboard counts. If you need a branded short domain, evaluate Rebrandly or Short.io instead; if you want to self-host, look at Dub.",
  },
  {
    q: "Why leave Bitly's free plan?",
    a: "Bitly's free plan caps link creation at roughly ten links a month and limits click history to about thirty days. Campaign work quickly hits both ceilings. Alternatives like agni remove the quotas and keep the full per-click dataset open on the free tier.",
  },
  {
    q: "Which alternative has the best analytics?",
    a: "agni records a complete request event per click — IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp — plus daily rollups and date-range filters, free. Compare that field list against whatever your shortener exposes before deciding.",
  },
  {
    q: "Do any of these support custom domains?",
    a: "Rebrandly, Short.io, Dub and Bitly's paid plans all support branded short domains. agni does not today — links are agni.cc.cd/your-slug with fully custom back-halves.",
  },
  {
    q: "Is switching shortener risky for live links?",
    a: "The danger is orphaned placements, not the redirect itself. Keep old links alive while you repoint every placement to the new ones, and only then retire the old short links.",
  },
];

export default function AlternativesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Bitly alternatives and link shortener comparisons",
        url: "https://agni.cc.cd/alternatives",
        description:
          "Free Bitly alternatives compared: agni vs TinyURL, Rebrandly, Short.io, Dub and Cuttly.",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://agni.cc.cd" },
          { "@type": "ListItem", position: 2, name: "Comparisons" },
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
      <div className="mx-auto max-w-3xl">
        <h1 className="text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]">
          Link shortener alternatives and comparisons
        </h1>
        <p className="mt-5 text-[14px] leading-relaxed text-ink2">
          Honest, feature-by-feature comparisons of the link shorteners people actually evaluate.
          Every page states plainly where the competitor wins (custom domains, teams, breadth) and
          where agni wins (unlimited free links, complete click analytics, live counts). Numbers
          about competitor plans are hedged on purpose — plans change, so verify current limits
          before you migrate.
        </p>

        <h2 className="mt-10 text-[20px] font-semibold tracking-tight">Compare agni with</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="card flex flex-col gap-2 p-5 transition-colors hover:bg-surface2"
            >
              <span className="text-[14px] font-medium text-ink">{c.headline}</span>
              <span className="text-[12px] leading-relaxed text-ink3">{c.metaDescription}</span>
              <span className="mt-auto pt-2 text-[11.5px] text-ink3">Read the comparison</span>
            </Link>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-[20px] font-semibold tracking-tight">Choosing an alternative — FAQ</h2>
          <div className="mt-4 flex flex-col gap-5">
            {FAQ.map((f) => (
              <div key={f.q}>
                <h3 className="text-[13.5px] font-medium text-ink">{f.q}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="card mt-12 flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-semibold tracking-tight">Skip the comparison</h2>
            <p className="mt-1 text-[12.5px] text-ink2">
              Shorten a link now and read the analytics yourself — that is the whole argument.
            </p>
          </div>
          <Link href="/#shorten" className="btn btn-primary">
            Shorten a link
          </Link>
        </div>
      </div>
    </div>
  );
}
