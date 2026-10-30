import type { Metadata } from "next";
import Link from "next/link";
import { AuthProvider } from "./components/authed";
import { Logo, SiteNav } from "./components/nav";
import { ThemeToggle } from "./components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "agni — short links you can measure",
  description:
    "Free, fast link shortener with complete click analytics: IP, location, device, referrer and full request data. Built on Cloudflare.",
  metadataBase: new URL("https://agni.cc.cd"),
  openGraph: {
    title: "agni — short links you can measure",
    description:
      "Free, fast link shortener with complete click analytics. Built on Cloudflare Workers.",
    url: "https://agni.cc.cd",
    siteName: "agni",
    type: "website",
  },
};

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
