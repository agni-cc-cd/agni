import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider } from "./components/authed";
import { Logo, SiteNav } from "./components/nav";
import { ThemeToggle } from "./components/theme-toggle";
import { ToastProvider } from "./components/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "agni — short links you can measure",
  description:
    "Free, fast link shortener with complete click analytics: IP, location, device, referrer and full request data. Built on Cloudflare.",
  metadataBase: new URL("https://agni.cc.cd"),
  applicationName: "agni",
  keywords: [
    "link shortener",
    "url shortener",
    "free url shortener",
    "short link analytics",
    "click analytics",
    "custom short links",
  ],
  openGraph: {
    title: "agni — short links you can measure",
    description:
      "Free, fast link shortener with complete click analytics. Built on Cloudflare Workers.",
    url: "https://agni.cc.cd",
    siteName: "agni",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "agni — short links you can measure" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "agni — short links you can measure",
    description:
      "Free, fast link shortener with complete click analytics: IP, location, device, referrer and full request data.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

// GA4 (Google) + Cloudflare Web Analytics — both free-tier, both first-party sanctioned.
const ga4Init = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-PW2B5FM3SG',{send_page_view:true})`;
const cfBeacon = `{"token":"aa0c39d56cef472399226d2e6a7fe33a"}`;

const ROOT_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://agni.cc.cd/#organization",
      name: "agni",
      url: "https://agni.cc.cd",
      logo: "https://agni.cc.cd/favicon-512.png",
      sameAs: ["https://github.com/agni-cc-cd"],
    },
    {
      "@type": "WebSite",
      "@id": "https://agni.cc.cd/#website",
      name: "agni",
      url: "https://agni.cc.cd",
      description:
        "Free, fast link shortener with complete click analytics: IP, location, device, referrer and full request data.",
      publisher: { "@id": "https://agni.cc.cd/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      name: "agni",
      url: "https://agni.cc.cd",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Free link shortener with complete click analytics: IP, location, device, referrer and full request data. Built on Cloudflare Workers.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

const FOOTER = [
  {
    title: "Product",
    links: [
      { href: "/#shorten", label: "Shorten a link" },
      { href: "/dashboard", label: "Dashboard" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "https://github.com/agni-cc-cd/handbook", label: "Docs", external: true },
      { href: "https://github.com/agni-cc-cd/agni", label: "GitHub", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PW2B5FM3SG" />
        <script dangerouslySetInnerHTML={{ __html: ga4Init }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Noto+Emoji&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ROOT_JSONLD) }}
        />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <SiteNav />
            <main className="min-h-[70vh]">{children}</main>
            <footer className="mt-20 border-t border-line bg-surface2">
              <div className="container-x grid gap-10 py-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
              <div className="flex flex-col items-start gap-3">
                <span className="text-ink">
                  <Logo size={20} />
                </span>
                <p className="max-w-xs text-[12px] leading-relaxed text-ink3">
                  Short links you can measure. Fast edge redirects, complete click analytics,
                  and a dashboard built for real work.
                </p>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>
              {FOOTER.map((col) => (
                <div key={col.title}>
                  <h3 className="mb-3 text-[11px] font-medium text-ink3">{col.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        {l.external ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[12px] text-ink2 transition-colors hover:text-ink"
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link
                            href={l.href}
                            className="text-[12px] text-ink2 transition-colors hover:text-ink"
                          >
                            {l.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              </div>
              <div className="border-t border-line">
              <div className="container-x flex flex-wrap items-center justify-between gap-3 py-5">
                <p className="text-[11px] text-ink3">
                  © {new Date().getFullYear()} agni. All rights reserved.
                </p>
                <p className="text-[11px] text-ink3">
                  Built on Cloudflare Workers · D1 · KV · Analytics Engine
                </p>
              </div>
              </div>
            </footer>
          </ToastProvider>
        </AuthProvider>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon={cfBeacon}
        />
      </body>
    </html>
  );
}
