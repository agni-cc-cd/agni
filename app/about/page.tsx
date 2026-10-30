import Link from "next/link";
import { BoltIcon, ChartIcon, ShieldIcon } from "../components/icons";

export const metadata = {
  title: "About — agni",
  description: "Why we built agni: a link shortener that is fast, complete and genuinely free.",
};

export default function AboutPage() {
  return (
    <div className="container-x py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-[30px] font-semibold tracking-tight sm:text-[38px]">
          Links should be infrastructure.
        </h1>
        <div className="prose mt-6">
          <p>
            Most link shorteners treat a click as a number. We think a click is a request: it
            has a place, a device, a moment and a source. agni records all of it, serves the
            redirect from the edge, and hands you a dashboard that tells the whole story.
          </p>
          <p>
            It runs entirely on Cloudflare — Workers for compute, D1 for storage, KV for the
            hot cache path, and Analytics Engine for the raw event stream. That means
            millisecond redirects and a cost base that lets us keep the product free.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { Icon: BoltIcon, title: "Fast by default", body: "Edge-cached redirects with a D1 source of truth." },
            { Icon: ChartIcon, title: "Observable", body: "Full request-level analytics on every single click." },
            { Icon: ShieldIcon, title: "Yours", body: "Your links live behind your account. Export anytime." },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="card p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface2 text-ink">
                <Icon width={15} height={15} />
              </span>
              <h2 className="mt-3 text-[13px] font-semibold">{title}</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-ink2">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#shorten" className="btn btn-primary">
            Shorten a link
          </Link>
          <Link href="/blog" className="btn btn-ghost">
            Read the blog
          </Link>
        </div>
      </div>
    </div>
  );
}
