import Link from "next/link";
import { CheckIcon } from "../components/icons";

export const metadata = {
  title: "Pricing — agni",
  description: "Simple, honest pricing. The full product is free today.",
};

const FREE = [
  "Unlimited short links",
  "Complete click analytics (IP, location, device, referrer)",
  "Custom slugs",
  "All sign-in providers + guest access",
  "Dashboard and per-link analytics",
];

const PRO = [
  "Everything in Free",
  "Custom domains",
  "Team seats and roles",
  "Data export and full API access",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-[30px] font-semibold tracking-tight sm:text-[38px]">
          Simple pricing. Actually free.
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ink2">
          agni is free today, for everyone. Paid plans will arrive later for teams and power
          users — and the free plan will stay free.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        <div className="card flex flex-col gap-5 p-7">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">Free</h2>
              <span className="chip">available now</span>
            </div>
            <p className="mt-3 text-[32px] font-semibold tracking-tight">
              $0<span className="text-[13px] font-normal text-ink3"> / forever</span>
            </p>
            <p className="mt-1 text-[12px] text-ink3">No credit card. No usage cliffs.</p>
          </div>
          <ul className="flex flex-col gap-2.5 text-[12.5px] text-ink2">
            {FREE.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 text-ok">
                  <CheckIcon width={12} height={12} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/#shorten" className="btn btn-primary mt-auto">
            Start for free
          </Link>
        </div>

        <div className="card flex flex-col gap-5 border-dashed p-7">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">Pro</h2>
              <span className="chip">coming soon</span>
            </div>
            <p className="mt-3 text-[32px] font-semibold tracking-tight">
              TBD<span className="text-[13px] font-normal text-ink3"> / month</span>
            </p>
            <p className="mt-1 text-[12px] text-ink3">For teams and serious link programs.</p>
          </div>
          <ul className="flex flex-col gap-2.5 text-[12.5px] text-ink2">
            {PRO.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-0.5 text-ink3">
                  <CheckIcon width={12} height={12} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn btn-ghost mt-auto">
            Talk to us
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <h2 className="text-[15px] font-semibold">Questions</h2>
        <div className="mt-4 flex flex-col gap-4">
          {[
            {
              q: "Will agni stay free?",
              a: "Yes. The free plan covers unlimited links and full analytics today, and it will keep existing when paid plans launch.",
            },
            {
              q: "What will Pro cost?",
              a: "Pricing is not final. It will be a simple monthly per-seat price aimed at teams that need custom domains, roles and export.",
            },
            {
              q: "Do you sell my data?",
              a: "No. Analytics data belongs to the account that created the link. See the Privacy page for details.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="card p-5">
              <h3 className="text-[12.5px] font-medium">{q}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink2">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
