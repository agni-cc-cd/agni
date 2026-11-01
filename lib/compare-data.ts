// Comparison page data — powers /compare/agni-vs-* landing pages.
// Copy is monochrome-factual: honest about where competitors win (custom
// domains, teams) and where agni wins (free analytics, speed, privacy).

export interface CompareRow {
  feature: string;
  agni: string;
  them: string;
}

export interface CompareFaq {
  q: string;
  a: string;
}

export interface ComparePage {
  slug: string;
  competitor: string;
  title: string;
  metaDescription: string;
  headline: string;
  verdict: string;
  intro: string;
  rows: CompareRow[];
  sections: Array<{ heading: string; body: string }>;
  faq: CompareFaq[];
}

export const COMPARISONS: ComparePage[] = [
  {
    slug: "agni-vs-bitly",
    competitor: "Bitly",
    title: "agni vs Bitly: free analytics without the free-tier ceiling",
    metaDescription:
      "agni vs Bitly compared: Bitly caps free links at about 10 a month; agni gives unlimited short links and full click analytics free. Honest feature-by-feature breakdown.",
    headline: "agni vs Bitly",
    verdict:
      "Choose Bitly if you need a branded short domain and enterprise SLAs. Choose agni if you want unlimited free short links with complete click analytics — IP, location, device, referrer and full request data — on every plan, including free.",
    intro:
      "Bitly is the name everyone knows in link shortening. It is also the tool that taught the market to expect analytics behind a paywall. agni is built the other way around: every click record — IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp — is captured and shown on the free tier. Here is how the two compare on the things that matter day to day.",
    rows: [
      { feature: "Free links per month", agni: "Unlimited", them: "About 10 (free plan)" },
      { feature: "Click analytics on free plan", agni: "Complete (IP, geo, device, referrer, request data)", them: "30-day aggregate history" },
      { feature: "Raw click feed", agni: "Yes — every event with full request data", them: "Paid plans" },
      { feature: "Custom short domain", agni: "Not yet (agni.cc.cd back-halves)", them: "Paid plans" },
      { feature: "Dashboard refresh", agni: "Live counts, no refresh needed", them: "Manual refresh / delayed" },
      { feature: "QR codes", agni: "Pair any QR generator with your link", them: "Built-in generator" },
      { feature: "Teams and roles", agni: "Shared accounts today, workspaces planned", them: "Paid team plans" },
      { feature: "Price", agni: "Free today; Pro planned later", them: "Free (capped) then paid tiers" },
    ],
    sections: [
      {
        heading: "Where Bitly wins",
        body: "Bitly has been shipping link infrastructure for over a decade, and it shows where enterprise buyers look: custom branded short domains, role-based team workspaces, SSO, and support contracts. If marketing at a large company needs `go.brand.com/x` and an SLA, Bitly is the safer purchase. agni does not offer custom domains or team roles today.",
      },
      {
        heading: "Where agni wins",
        body: "On the free tier, the gap is not close. Bitly's free plan caps link creation at roughly ten links a month and holds click history for thirty days. agni creates unlimited links and keeps the complete click stream: every event carries IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp, with daily rollups and date-range filters on top. The dashboard counts live, so you watch a campaign fill in without refreshing.",
      },
      {
        heading: "Speed and architecture",
        body: "agni resolves every redirect from a KV-first hot cache at the Cloudflare edge with a 302, so the hop from short link to destination is sub-millisecond lookup work at the colo nearest the clicker. D1 stays the source of truth and Analytics Engine records the raw stream. Bitly runs a mature global edge too — both are fast; agni's edge placement is simply the same network that fronts a large share of the web.",
      },
      {
        heading: "Privacy posture",
        body: "agni records click data for the link owner and runs no ads. IPs are processed for location and ASN context and shown as network data, not identity. Bitly's free tier has historically leaned on aggregate metrics; either way, read each product's privacy policy before linking anything sensitive.",
      },
    ],
    faq: [
      {
        q: "Is agni really free compared with Bitly?",
        a: "Yes. agni's free tier includes unlimited short links and the complete analytics set — IP, location, device, referrer, protocol, TLS and timestamps. Bitly's free plan caps creation at around ten links per month and limits how long click history stays visible. A Pro tier for agni is planned later, but the analytics above will not move behind it.",
      },
      {
        q: "Can I use a custom branded domain on agni like Bitly's?",
        a: "Not today. agni serves short links on agni.cc.cd with custom back-halves (you pick the slug). If a vanity domain like go.yourbrand.com is mandatory, Bitly, Rebrandly or Short.io are the category to evaluate.",
      },
      {
        q: "Does agni show who clicked my link?",
        a: "It shows what the request revealed: IP, country, city, ASN, device, browser, OS, referrer and protocol/TLS. That is network data, not identity — treat location and device as inference, and remember the destination site sees the visitor too.",
      },
      {
        q: "How do I move my Bitly links to agni?",
        a: "Re-create each short link on agni with the same back-half slug, then update the places the old link is published. There is no bulk importer today; the blog post 'Moving from Bitly to agni' walks through the checklist.",
      },
      {
        q: "Which is better for social media campaigns?",
        a: "For most social campaigns agni is the better free option: unlimited links, live counts and full referrer and geo breakdowns. Pick Bitly when the campaign needs a branded domain or an enterprise team workflow.",
      },
    ],
  },
  {
    slug: "agni-vs-tinyurl",
    competitor: "TinyURL",
    title: "agni vs TinyURL: analytics TinyURL never had",
    metaDescription:
      "agni vs TinyURL: TinyURL shortens links with almost no analytics; agni adds full click tracking — IP, geo, device, referrer — free, with live counts and a real dashboard.",
    headline: "agni vs TinyURL",
    verdict:
      "TinyURL is fine for a one-off anonymous short link. Choose agni the moment you need to know what happened after you shared it — every click comes with complete request data and a live dashboard, free.",
    intro:
      "TinyURL is one of the oldest shorteners on the web and still works exactly as advertised: paste a long URL, get a short one, optionally set a custom alias. What it never grew was measurement. agni keeps the same two-second workflow and adds the analytics layer — who clicked (network-level), from where, with what, and when.",
    rows: [
      { feature: "Anonymous shortening", agni: "Yes (guest mode)", them: "Yes" },
      { feature: "Click analytics", agni: "Complete free analytics", them: "None on the free tier" },
      { feature: "Live click counts", agni: "Auto-updating dashboard", them: "Not offered" },
      { feature: "Link history / dashboard", agni: "Full dashboard with trends and breakdowns", them: "No account dashboard" },
      { feature: "Custom alias", agni: "Yes — custom back-halves", them: "Yes" },
      { feature: "Link expiry controls", agni: "Links work until you delete them", them: "Pro plans have expiry options" },
      { feature: "Price", agni: "Free today", them: "Free and Pro tiers" },
    ],
    sections: [
      {
        heading: "What TinyURL does well",
        body: "TinyURL is genuinely frictionless: no account required for a quick link, optional custom aliases, and a paid Pro tier that adds branding and link management. For throwaway links in a forum post or a printout that nobody needs to measure, it is enough.",
      },
      {
        heading: "What you give up",
        body: "Without analytics you cannot answer the basic questions a shared link raises: did anyone click, from which country, from my email or my social post, on phone or desktop, and did the campaign peak and die or keep going. agni answers all of it per click — IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp — and rolls it into daily trends with date-range filters.",
      },
      {
        heading: "Speed",
        body: "agni serves the redirect from a KV-first cache at the Cloudflare edge (302), keeping the hop tiny worldwide. TinyURL redirects are reliable and quick for a legacy service; agni's architecture is the same edge model the biggest modern CDNs use.",
      },
      {
        heading: "When to still pick TinyURL",
        body: "If you want zero footprint — no account, no analytics cookie, nothing to manage later — TinyURL's anonymous form is a legitimate choice. agni also has a guest mode, but its value shows up when you sign in and keep the data.",
      },
    ],
    faq: [
      {
        q: "Does TinyURL track clicks?",
        a: "TinyURL's free tier does not give you click analytics; some management features appear on paid Pro plans. agni gives complete analytics free — IP, country, city, referrer, device, browser, OS, protocol and TLS on every click.",
      },
      {
        q: "Can I shorten a link without signing up on agni?",
        a: "Yes. Guest mode shortens links immediately. Sign in when you want the links saved to a dashboard with live counts and full analytics.",
      },
      {
        q: "Do agni links expire?",
        a: "No. Links keep working until you delete them, same as TinyURL's default behavior. You can delete a link (and its analytics) any time from the dashboard.",
      },
      {
        q: "Is agni faster than TinyURL?",
        a: "Both redirect quickly. agni resolves from a KV-first cache at the Cloudflare edge nearest the clicker, which is the same network that fronts a large share of web traffic. Test both with your own audience if milliseconds matter.",
      },
    ],
  },
  {
    slug: "agni-vs-rebrandly",
    competitor: "Rebrandly",
    title: "agni vs Rebrandly: brand links vs free complete analytics",
    metaDescription:
      "agni vs Rebrandly compared. Rebrandly is built around branded domains; agni gives unlimited free links with full click analytics. Honest trade-offs on domains, teams and price.",
    headline: "agni vs Rebrandly",
    verdict:
      "Pick Rebrandly when branded short domains (go.yourbrand.com) are the whole point of the project. Pick agni when you want unlimited short links and complete click analytics for free, today.",
    intro:
      "Rebrandly's thesis is that the domain in a short link is brand equity — every link reinforces go.yourbrand.com instead of a generic host. That is a real marketing argument and it is the product's center of gravity. agni's thesis is different: the measurement behind the link is what you are actually buying, and it should not cost anything.",
    rows: [
      { feature: "Branded short domain", agni: "agni.cc.cd back-halves only", them: "Core feature, multiple domains" },
      { feature: "Free links", agni: "Unlimited", them: "Generous but quota-based" },
      { feature: "Free analytics depth", agni: "Full request data per click", them: "Summary analytics on lower tiers" },
      { feature: "QR codes", agni: "Use any QR generator", them: "Built-in branded QR" },
      { feature: "Team workspaces", agni: "Shared accounts; workspaces planned", them: "Yes — roles and shared libraries" },
      { feature: "Live counts", agni: "Yes, auto-updating", them: "Dashboard with refresh" },
      { feature: "Price", agni: "Free today; Pro planned later", them: "Free tier then paid plans" },
    ],
    sections: [
      {
        heading: "The branded-domain question",
        body: "If your requirement is a vanity domain on every link, Rebrandly (or Short.io, or Bitly's branded plans) is the category — agni does not sell custom domains today. Links on agni look like agni.cc.cd/your-slug, with the slug fully customizable so the back-half can still carry campaign meaning.",
      },
      {
        heading: "What agni gives you free",
        body: "Every click on an agni link produces a full record: IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp — plus daily rollups, date-range filters and a dashboard whose counts update live. That dataset usually sits on the paid side of the comparison table in this category.",
      },
      {
        heading: "Teams and collaboration",
        body: "Rebrandly wins here today: shared libraries, roles and workspaces are mature. agni is single-account today (share an account if you must) with workspaces on the roadmap. Small teams and solo operators will not feel the gap; larger marketing orgs will.",
      },
    ],
    faq: [
      {
        q: "Does agni support custom domains like Rebrandly?",
        a: "Not today. agni short links live on agni.cc.cd with custom back-halves. If a branded vanity domain is mandatory, Rebrandly is the natural fit; the agni blog's Rebrandly alternatives piece covers the full category.",
      },
      {
        q: "Which has better analytics?",
        a: "agni records complete request data on every click — IP, location, device, referrer, protocol, TLS — free. Rebrandly's analytics depth depends on the plan. If raw per-click data is what you need, agni's dataset is deeper on the free tier.",
      },
      {
        q: "Can agni generate QR codes?",
        a: "agni does not ship a QR generator — pair your short link with any QR generator and you get the same tracking, because the scan still hits the short URL and records a full click event.",
      },
      {
        q: "Is Rebrandly more expensive?",
        a: "Rebrandly has a free tier and paid plans as you add domains and seats. agni is free today with a Pro tier planned later; the analytics set above stays where free users can reach it.",
      },
    ],
  },
  {
    slug: "agni-vs-short-io",
    competitor: "Short.io",
    title: "agni vs Short.io: free depth vs branded-domain tooling",
    metaDescription:
      "agni vs Short.io compared on price, analytics depth, branded domains and team features. See where the free tiers actually differ before you migrate.",
    headline: "agni vs Short.io",
    verdict:
      "Short.io is a capable branded-domain shortener with strong link management. agni wins when the priority is free, complete click analytics and live counts with zero quota anxiety.",
    intro:
      "Short.io (formerly Shortcm) is a direct Rebrandly competitor: custom domains, deep link settings, retargeting pixels, teams. It is a solid tool for brand-led link programs. agni competes on a different axis — the analytics you get per click, and the price (free).",
    rows: [
      { feature: "Custom domains", agni: "Not yet — agni.cc.cd slugs", them: "Yes, multiple domains" },
      { feature: "Free-tier analytics", agni: "Full per-click request data", them: "Summary; depth grows with plan" },
      { feature: "Link settings (expiry, targeting)", agni: "Simple: create, track, delete", them: "Rich: expiry, geo/device rules" },
      { feature: "Retargeting pixels", agni: "Not offered", them: "Yes" },
      { feature: "Live counts", agni: "Yes", them: "Dashboard (periodic)" },
      { feature: "Free link volume", agni: "Unlimited", them: "Quota-based free tier" },
      { feature: "Price", agni: "Free today; Pro later", them: "Free tier then paid plans" },
    ],
    sections: [
      {
        heading: "Short.io strengths",
        body: "Custom domains at scale, link-level rules (expiry, country or device targeting), retargeting pixels and team sharing. If your workflow is 'build a campaign link with rules and pixels behind it', Short.io is purpose-built for that and agni deliberately stays simpler.",
      },
      {
        heading: "agni strengths",
        body: "The measurement layer, free and complete. Every click on agni is one raw event with IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp, rolled into daily trends with date-range filters, and the dashboard counts up live while a campaign runs.",
      },
      {
        heading: "Migration note",
        body: "Moving from Short.io to agni is the same drill as any migration: recreate each link with its back-half slug and repoint the placements. Keep the old links alive until the new ones are in place — old 302s can be retired once nothing references them.",
      },
    ],
    faq: [
      {
        q: "Is Short.io or agni better for branded links?",
        a: "Short.io. It supports custom short domains and link rules; agni does not offer custom domains today and keeps links on agni.cc.cd with custom slugs.",
      },
      {
        q: "Which free tier gives more analytics?",
        a: "agni. The free tier carries the full per-click record — IP, location, device, referrer, protocol, TLS and timestamps — plus daily rollups and live counts.",
      },
      {
        q: "Can I set link expiry on agni?",
        a: "Not as a setting. Links work until you delete them from the dashboard. If you need automatic expiry dates on links, Short.io and similar tools have that built in.",
      },
      {
        q: "Does agni support retargeting pixels?",
        a: "No. agni is about measuring clicks, not attaching ad pixels to them. Short.io and Rebrandly cover the pixel workflow.",
      },
    ],
  },
  {
    slug: "agni-vs-dub",
    competitor: "Dub",
    title: "agni vs Dub: open-source links vs free hosted analytics",
    metaDescription:
      "agni vs Dub compared. Dub is an open-source link platform you can self-host; agni is a hosted free shortener with complete click analytics and zero setup.",
    headline: "agni vs Dub",
    verdict:
      "Pick Dub if you want open-source software you can self-host and extend. Pick agni if you want complete click analytics working right now, free, with nothing to deploy or maintain.",
    intro:
      "Dub (dub.co) is the modern open-source link manager: clean API, self-hostable, custom domains, analytics, and a SaaS version for people who do not want to run it. agni is a hosted free shortener built on Cloudflare's edge stack that asks nothing of you — paste, shorten, measure.",
    rows: [
      { feature: "Open source / self-host", agni: "Hosted service (code open on GitHub)", them: "Open source, self-hostable" },
      { feature: "Custom domains", agni: "agni.cc.cd slugs only", them: "Yes" },
      { feature: "Free hosted tier", agni: "Unlimited links + full analytics", them: "Free tier with limits" },
      { feature: "API", agni: "REST API for links and stats", them: "Full-featured API" },
      { feature: "Analytics depth", agni: "Full request data per click, free", them: "Good analytics; depth varies by plan" },
      { feature: "Setup required", agni: "None", them: "None on SaaS; heavy if self-hosting" },
      { feature: "Price", agni: "Free today; Pro later", them: "Free + paid tiers (or your infra)" },
    ],
    sections: [
      {
        heading: "Where Dub wins",
        body: "Dub is developer-first and self-hostable: if you need custom domains, programable link rules, A/B testing hooks and the ability to run it inside your own infrastructure, Dub is the stronger platform. Its API surface is broader than agni's on purpose.",
      },
      {
        heading: "Where agni wins",
        body: "Zero-setup hosted analytics that are actually complete. Every click record on agni carries IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp — free, on a service that runs on Cloudflare's edge with a KV-first 302 path and a live dashboard.",
      },
      {
        heading: "Self-hosting cost truth",
        body: "Self-hosting Dub means running the stack (database, workers, DNS, certificates) or paying for the hosted version. agni removes that decision entirely: there is nothing to deploy, and the free tier is the real product, not a trial.",
      },
    ],
    faq: [
      {
        q: "Is Dub or agni better for developers?",
        a: "Dub, if you want self-hosting and a broad API. agni also has a REST API for creating, listing and deleting links and reading stats, but it is a hosted product first.",
      },
      {
        q: "Can I self-host agni?",
        a: "agni is a hosted service built on Cloudflare Workers, D1 and KV. The engineering handbook and repo are public for reading and replication, but there is no supported self-host distribution today.",
      },
      {
        q: "Which has better analytics?",
        a: "agni records complete request data per click — IP, geo, device, referrer, protocol, TLS — on the free tier with live counts. Dub's analytics are good; depth and retention depend on the plan you are on.",
      },
      {
        q: "Do both support custom domains?",
        a: "Dub does. agni does not offer custom domains today — links are agni.cc.cd/your-slug.",
      },
    ],
  },
  {
    slug: "agni-vs-cuttly",
    competitor: "Cuttly",
    title: "agni vs Cuttly: no-quota analytics vs feature-stacked free tiers",
    metaDescription:
      "agni vs Cuttly compared on free link quotas, analytics depth, QR features and price. What you actually get free on each, without the marketing gloss.",
    headline: "agni vs Cuttly",
    verdict:
      "Cuttly packs many features into its paid tiers — link pages, QR tools, bio pages. agni focuses on one thing done completely: short links with full click analytics, unlimited and free.",
    intro:
      "Cuttly is a Polish link shortener that grew into a mini marketing suite: short links, QR codes, link-in-bio pages and link retargeting, with a free tier that is quota-limited. agni stays narrow — shorten, track everything — and keeps that narrow slice unlimited and free.",
    rows: [
      { feature: "Free link quota", agni: "Unlimited", them: "Monthly quotas on free plan" },
      { feature: "Click analytics depth", agni: "Full request data per click", them: "Summary analytics; depth by plan" },
      { feature: "QR code tools", agni: "Pair any QR generator", them: "Built-in QR generator" },
      { feature: "Link-in-bio pages", agni: "Not offered", them: "Yes" },
      { feature: "Custom back-halves", agni: "Yes", them: "Yes" },
      { feature: "Live counts", agni: "Yes, auto-updating", them: "Dashboard with refresh" },
      { feature: "Price", agni: "Free today; Pro planned later", them: "Free (capped) + paid tiers" },
    ],
    sections: [
      {
        heading: "Cuttly strengths",
        body: "Breadth. If one vendor should provide short links, QR generation, link-in-bio pages and basic retargeting, Cuttly's higher tiers bundle that. The free tier works for light, occasional use within its monthly quotas.",
      },
      {
        heading: "agni strengths",
        body: "Depth and price. No link quotas on the free tier, and each click carries the full request record — IP, country, city, colo, ASN, protocol, TLS version, referrer, device, browser, OS and timestamp — with daily rollups, date-range filters and live dashboard counts.",
      },
      {
        heading: "Feature-stack honesty",
        body: "agni does not build QR generators, bio pages or pixel retargeting, and says so. Any QR generator can wrap an agni link and every scan still records a complete click event; for bio pages, a plain page of agni links does the job without a second subscription.",
      },
    ],
    faq: [
      {
        q: "Does Cuttly limit free links?",
        a: "Yes — Cuttly's free plan runs on monthly quotas that change over time; verify current limits on their site. agni has no link quota on the free tier.",
      },
      {
        q: "Which shows more about each click?",
        a: "agni. Every click records IP, country, city, ASN, device, browser, OS, referrer, protocol and TLS version, and the dashboard counts live. Check which of those your Cuttly plan includes before switching either way.",
      },
      {
        q: "Can agni replace Cuttly's QR and bio-page tools?",
        a: "Only the link part. agni short links work with any QR generator and keep full tracking; link-in-bio pages are not an agni feature — use a simple page of links instead.",
      },
      {
        q: "Is agni free forever?",
        a: "The core is free today with a Pro tier planned later. The analytics described here are part of the free product, not a trial.",
      },
    ],
  },
];

export const COMPARE_SLUGS = COMPARISONS.map((c) => c.slug);
