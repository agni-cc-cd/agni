import Link from "next/link";
import { LinkForm } from "./components/link-form";
import {
  ArrowUpRightIcon,
  BoltIcon,
  ChartIcon,
  CheckIcon,
  GlobeIcon,
  PenIcon,
  ShieldIcon,
  SparkIcon,
} from "./components/icons";

export const metadata = {
  title: "agni — short links you can measure",
  description:
    "Create short links in seconds and see every click: location, device, referrer and full request data. Free, fast, built on Cloudflare.",
};

const FEATURES = [
  {
    Icon: BoltIcon,
    title: "Edge-fast redirects",
    body: "Every short link resolves from Cloudflare's edge cache in milliseconds. No cold starts, no region locks.",
  },
  {
    Icon: ChartIcon,
    title: "Complete analytics",
    body: "IP, country, city, device, browser, OS, referrer, protocol, timestamps — every request detail the edge can see.",
  },
  {
    Icon: PenIcon,
    title: "Custom slugs",
    body: "Claim memorable slugs for campaigns, bios and docs. Auto-generated base62 slugs when you just need a link.",
  },
  {
    Icon: ShieldIcon,
    title: "Your links, your account",
    body: "Sign in with Google, GitHub, Microsoft, X, Facebook, Yahoo or a passwordless email link. Guests welcome too.",
  },
  {
    Icon: GlobeIcon,
    title: "Built on Cloudflare",
    body: "Workers, D1, KV and Analytics Engine. The same infrastructure that fronts a huge share of the web.",
  },
  {
    Icon: SparkIcon,
    title: "Free forever",
    body: "The full product is free today. Generous limits, no credit card. Paid plans with more power will come later.",
  },
];

const STEPS = [
  { n: "01", title: "Paste", body: "Drop any long URL into the box. Add a custom slug if you want one." },
  { n: "02", title: "Share", body: "Get a clean, short agni.cc.cd link instantly and use it anywhere." },
  { n: "03", title: "Measure", body: "Watch clicks arrive in real time with full request-level analytics." },
];

const CAPTURED = [
  "IP address",
  "Country, city, region",
  "Datacenter (colo) and ASN",
  "Referrer",
  "Device type",
  "Browser and OS",
  "Language",
  "Protocol and TLS version",
  "Exact timestamp",
];

export default function Home() {
  return (
    <>
      {/* Hero — the shorten box IS the call to action */}
      <section id="shorten" className="relative overflow-hidden border-b border-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-25"
          style={{
            background:
              "radial-gradient(60rem 30rem at 50% -10rem, color-mix(in srgb, var(--ink) 7%, transparent), transparent)",
          }}
        />
        <div className="container-x relative flex flex-col items-center gap-7 py-16 text-center sm:py-20">
          <span className="chip">
            <CheckIcon width={11} height={11} />
            Free forever · No credit card
          </span>
          <h1 className="max-w-3xl text-balance text-[clamp(2.15rem,5.5vw,3.45rem)] font-semibold leading-[1.06] tracking-tight">
            Short links you can measure.
          </h1>
          <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-ink2 sm:text-[16.5px]">
            Create short links in seconds and see every click: where it came from, what device
            was used, and exactly when it happened.
          </p>
          <div className="w-full max-w-2xl">
            <LinkForm size="lg" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11.5px] text-ink3">
            {["Millisecond redirects", "Full click data", "Custom slugs", "No signup required"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckIcon width={12} height={12} />
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-x py-16 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">
            Everything a link shortener should have been.
          </h2>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink2">
            agni is built like infrastructure and priced like a utility. Fast, observable, and
            yours.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-2.5 bg-surface p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface2 text-ink">
                <Icon width={15} height={15} />
              </span>
              <h3 className="text-[13.5px] font-semibold">{title}</h3>
              <p className="text-[12.5px] leading-relaxed text-ink2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics showcase */}
      <section className="border-y border-line bg-surface2">
        <div className="container-x grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">
              Every click, traced completely.
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink2">
              Most shorteners show you a number. agni shows you the whole request. Each click is
              stored with everything the edge can see — so you can answer who, where, when and
              how.
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CAPTURED.map((t) => (
                <li key={t} className="flex items-center gap-2 text-[12.5px] text-ink2">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-line bg-surface text-ok">
                    <CheckIcon width={10} height={10} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Link href="/login?next=%2Fdashboard" className="btn btn-primary mt-7">
              Get your dashboard
              <ArrowUpRightIcon width={13} height={13} />
            </Link>
          </div>

          {/* Stylized dashboard mock (pure markup) */}
          <div className="card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-ink3">Campaign</p>
                <p className="text-[13px] font-semibold">/launch-day</p>
              </div>
              <span className="chip">live</span>
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                ["Clicks", "12,481"],
                ["Visitors", "8,214"],
                ["Countries", "47"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-line bg-surface2 px-3 py-2.5">
                  <p className="text-[10px] text-ink3">{k}</p>
                  <p className="tnum text-[15px] font-semibold">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex h-28 items-end gap-[3px] rounded-lg border border-line bg-surface2 px-3 pb-2 pt-3">
              {[22, 30, 26, 41, 36, 52, 47, 60, 55, 71, 64, 78, 69, 88, 82, 95, 74, 86, 92, 70].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-[3px]"
                    style={{ height: `${h}%`, background: "var(--chart)" }}
                  />
                ),
              )}
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {[
                ["United States", "4,102"],
                ["Germany", "1,864"],
                ["India", "1,530"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[11.5px]">
                  <span className="text-ink2">{k}</span>
                  <span className="tnum text-ink3">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-x py-16 sm:py-20">
        <h2 className="mb-10 text-[26px] font-semibold tracking-tight sm:text-[32px]">
          Three steps. Ten seconds.
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card flex flex-col gap-2 p-6">
              <span className="tnum text-[11px] font-medium text-ink3">{s.n}</span>
              <h3 className="text-[15px] font-semibold">{s.title}</h3>
              <p className="text-[12.5px] leading-relaxed text-ink2">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-y border-line bg-surface2">
        <div className="container-x py-16 sm:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[26px] font-semibold tracking-tight sm:text-[32px]">
                Simple pricing. Actually free.
              </h2>
              <p className="mt-2 text-[14px] text-ink2">
                Everything is free today. Paid plans arrive later for teams and power users.
              </p>
            </div>
            <Link href="/pricing" className="btn btn-ghost">
              See full pricing
              <ArrowUpRightIcon width={13} height={13} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex flex-col gap-4 p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold">Free</h3>
                <span className="chip">today</span>
              </div>
              <p className="text-[28px] font-semibold tracking-tight">
                $0<span className="text-[13px] font-normal text-ink3"> / forever</span>
              </p>
              <ul className="flex flex-col gap-2 text-[12.5px] text-ink2">
                {["Unlimited short links", "Complete click analytics", "Custom slugs", "All sign-in methods"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckIcon width={12} height={12} /> {t}
                    </li>
                  ),
                )}
              </ul>
              <Link href="/#shorten" className="btn btn-primary mt-auto">
                Start now
              </Link>
            </div>
            <div className="card flex flex-col gap-4 border-dashed p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold">Pro</h3>
                <span className="chip">coming soon</span>
              </div>
              <p className="text-[28px] font-semibold tracking-tight">
                —<span className="text-[13px] font-normal text-ink3"> / month</span>
              </p>
              <ul className="flex flex-col gap-2 text-[12.5px] text-ink2">
                {["Custom domains", "Team seats and roles", "Data export and API", "Priority support"].map(
                  (t) => (
                    <li key={t} className="flex items-center gap-2">
                      <CheckIcon width={12} height={12} /> {t}
                    </li>
                  ),
                )}
              </ul>
              <Link href="/pricing" className="btn btn-ghost mt-auto">
                Join the waitlist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-x py-20 text-center">
        <h2 className="mx-auto max-w-2xl text-[26px] font-semibold tracking-tight sm:text-[34px]">
          Ready to shorten your first link?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink2">
          No signup wall, no credit card. Paste a URL and get a fully tracked short link in
          seconds.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <Link href="/#shorten" className="btn btn-primary btn-lg">
            Shorten a link
          </Link>
          <Link href="/dashboard" className="btn btn-ghost btn-lg">
            Open dashboard
          </Link>
        </div>
      </section>
    </>
  );
}
