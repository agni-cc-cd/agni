# agni.cc.cd — SEO Keyword Universe and Conversion Funnel Map

Date: 2026-11-01

## Methodology and honesty note

On 2026-11-01, live search-demand tooling was attempted and failed: the WebSearch tool returned zero results for 8 queries ("free url shortener", "free url shortener with click analytics 2026", "best free url shortener no signup required", "bitly alternative free custom slug analytics", "url shortener with detailed click analytics IP location referrer", "bitly alternatives 2026", "tinyurl alternative", "what url shortener should I use recommendation", and related), and SERP scraping via WebFetch was refused or blocked by Google (error page), DuckDuckGo (bot CAPTCHA), Bing (irrelevant filler results), Mojeek (403), Ecosia (403), Brave (429), and SearXNG (anti-bot wall). External listicle fetches (Zapier, TechRadar, PCMag) returned 404 or were blocked.

What this document IS grounded in:

- The live content inventory of agni.cc.cd, fetched successfully from https://agni.cc.cd/llms.txt and https://agni.cc.cd/blog on 2026-11-01 (53 blog posts, 6 compare pages, /alternatives hub, /pricing, /about, /dashboard, root shortener form).
- Long-standing, well-documented structure of the URL-shortener search category (head terms owned by Bitly/TinyURL/Wikipedia; a thick "alternatives" and "best of" middle; long-tail tool-intent queries; question queries with low competition).
- Known market events that shape demand in 2026: Google's goo.gl shutdown (links stopped resolving during 2025) and the Firebase Dynamic Links shutdown (August 2025) both displaced users looking for a free tracked shortener.

What this document is NOT: every difficulty mark and demand tier below is a reasoned estimate based on category knowledge, not a keyword-tool volume or difficulty score. No precise search volumes are stated anywhere, because none could be verified. Difficulty scale: low / med / high, relative to a new-ish site competing for the query. Before committing production resources, re-verify any head-term bet with a working keyword tool.

Product scope guardrails honored throughout: agni has full click analytics (IP, location, referrer, device, browser, OS), a public multi-tenant dashboard, custom slugs, a URL shortener API, and edge-fast redirects. It does NOT have custom domains, QR code generation, or team workspaces, and nothing in this plan targets those as product features. (The existing post /blog/qr-codes-from-short-links is positioned as "use an external QR tool pointed at an agni link", which is consistent.)

Existing pages and posts referenced below (exact URLs as published):

- Product: / (root, has shorten form), /pricing, /about, /dashboard
- Compare: /compare/agni-vs-bitly, /compare/agni-vs-tinyurl, /compare/agni-vs-rebrandly, /compare/agni-vs-short-io, /compare/agni-vs-dub, /compare/agni-vs-cuttly
- Hub: /alternatives
- Blog: 53 posts under /blog/ (full slugs confirmed in llms.txt)

---

## 1. Keyword universe

Estimated difficulty is a reasoned estimate (low / med / high), not a tool score. Rows are ordered by priority for a free-tool product: direct tool-intent first, then alternatives/comparison, then supporting informational demand. Intent categories: transactional (wants the tool now), commercial (evaluating options), informational (learning), navigational (seeking a specific brand).

| Keyword | Intent | Funnel | Est. difficulty | Target page |
|---|---|---|---|---|
| free url shortener | transactional | BOFU | high | / |
| url shortener | transactional | BOFU | high | / |
| link shortener | transactional | BOFU | high | / |
| free link shortener | transactional | BOFU | high | / |
| shorten url | transactional | BOFU | high | / |
| shorten link | transactional | BOFU | high | / |
| short link | transactional | BOFU | high | / |
| short url | transactional | BOFU | high | / |
| free url shortener with analytics | transactional | BOFU | med | / (support post: /blog/url-shortener-with-analytics) |
| link shortener with analytics | transactional | BOFU | med | / (support post: /blog/url-shortener-with-analytics) |
| url shortener with click tracking | transactional | BOFU | med | / (support post: /blog/how-to-track-link-clicks) |
| free link tracker | transactional | BOFU | med | / (support post: /blog/click-tracking-for-marketing) |
| url shortener with location tracking | transactional | BOFU | low | /blog/geo-analytics-for-links |
| custom slug url shortener | transactional | BOFU | low | / (support post: /blog/custom-short-links) |
| custom slug shortener | transactional | BOFU | low | /blog/custom-short-links |
| custom back-half url | transactional | BOFU | low | /blog/custom-short-links |
| free url shortener api | transactional | BOFU | low | /blog/url-shortener-api |
| url shortener api | commercial | BOFU | med | /blog/url-shortener-api |
| free url shortener no signup | transactional | BOFU | low | /blog/free-url-shortener-no-signup |
| bitly alternative | commercial | BOFU | med | /alternatives |
| free bitly alternative | commercial | BOFU | med | /compare/agni-vs-bitly |
| bitly alternatives | commercial | MOFU | med | /alternatives (support post: /blog/bitly-alternatives) |
| bitly alternative for instagram | commercial | BOFU | low | /compare/agni-vs-bitly |
| tinyurl alternative | commercial | BOFU | low | /compare/agni-vs-tinyurl |
| rebrandly alternative | commercial | BOFU | low | /compare/agni-vs-rebrandly |
| short.io alternative | commercial | BOFU | low | /compare/agni-vs-short-io |
| dub alternative | commercial | BOFU | low | /compare/agni-vs-dub |
| dub.co alternative | commercial | BOFU | low | /compare/agni-vs-dub |
| cuttly alternative | commercial | BOFU | low | /compare/agni-vs-cuttly |
| goo.gl alternative | commercial | BOFU | low | new page idea (/blog/goo-gl-alternative) |
| firebase dynamic links alternative | commercial | BOFU | low | new page idea (/blog/firebase-dynamic-links-alternative) |
| best free url shorteners 2026 | commercial | MOFU | med | /blog/best-free-url-shorteners-2026 |
| best free link shortener | commercial | MOFU | med | /blog/best-free-url-shorteners-2026 |
| best url shortener for analytics | commercial | MOFU | low | /blog/url-shortener-with-analytics |
| url shortener comparison | commercial | MOFU | low | /blog/url-shortener-comparison |
| bitly vs tinyurl | commercial | MOFU | low | new page idea (/blog/bitly-vs-tinyurl) |
| bitly pricing | commercial | MOFU | med | new page idea (/blog/bitly-pricing-explained) |
| is bitly free | commercial | MOFU | med | new page idea (/blog/bitly-pricing-explained) |
| url shortener for instagram | commercial | MOFU | low | /blog/instagram-bio-links |
| link shortener for twitter | commercial | MOFU | low | /blog/url-shortener-for-social-media |
| url shortener for email marketing | commercial | MOFU | low | /blog/track-email-campaign-clicks |
| short links for sms marketing | commercial | MOFU | low | /blog/sms-marketing-links |
| url shortener for small business | commercial | MOFU | low | /blog/url-shortener-for-small-business |
| link shortener for marketing campaigns | commercial | MOFU | low | /blog/click-tracking-for-marketing |
| privacy friendly url shortener | commercial | MOFU | low | /blog/privacy-friendly-url-shortener |
| best link shortener for affiliates | commercial | MOFU | low | new page idea (/blog/best-url-shortener-for-affiliate-marketing) |
| can you see who clicked your link | informational | TOFU | low | /blog/who-clicked-my-link |
| how to shorten a link | informational | TOFU | med | /blog/how-to-shorten-a-link |
| how to track link clicks | informational | MOFU | med | /blog/how-to-track-link-clicks |
| what is a url shortener | informational | TOFU | med | /blog/what-is-a-url-shortener |
| how do url shorteners work | informational | TOFU | med | /blog/how-url-shorteners-work |
| utm parameters explained | informational | TOFU | med | /blog/utm-parameters-guide |
| do short links affect seo | informational | MOFU | low | /blog/301-vs-302-redirect-seo |
| are url shorteners safe | informational | TOFU | low | /blog/privacy-friendly-url-shortener |
| link rot | informational | TOFU | low | /blog/link-rot |
| what is a custom slug | informational | TOFU | low | /blog/custom-short-links |
| how to use qr codes with short links | informational | TOFU | low | /blog/qr-codes-from-short-links |
| do url shorteners hurt email deliverability | informational | MOFU | low | new page idea (/blog/short-links-email-deliverability) |
| gdpr compliant link tracking | commercial | MOFU | low | new page idea (/blog/gdpr-link-tracking) |

Notes on the estimates:

- Head terms ("url shortener", "free url shortener", "shorten url", etc.): high difficulty, but they define the category. Reality check: these SERPs are owned by Bitly, TinyURL, ShortURL.at, and a rotating cast of listicles; a newer site wins them only via long-tail accumulation and aggregate "best of" inclusion. They stay on the plan because the homepage must be built for them, not because they are quick wins.
- "with analytics", "with click tracking", "location tracking", "custom slug" variants: genuinely lower competition because most competitors paywall analytics or push QR/teams features instead. This is agni's strongest wedge — every one of these maps to a real product strength.
- Alternative/compare queries ("tinyurl alternative", "cuttly alternative", "dub alternative", and the post-shutdown "goo.gl alternative"): low difficulty and high conversion intent. The domain "cc.cd" is unusual, so compare pages must earn trust fast (see funnel map).
- "free url shortener no signup": keep expectations honest — the existing post explains what you trade away with no-signup tools; if agni requires an account to manage links, this page should sell the free-account trade, not pretend to be a no-signup tool.
- Question queries ("can you see who clicked your link", "are url shorteners safe", "do short links affect seo"): low difficulty, strong snippet potential, best used to feed MOFU pages.

---

## 2. Funnel map

### TOFU — awareness ("I have a link problem")

Audience: creators, small marketers, students, devs who just want shorter/trackable links and are not shopping yet.

Content that serves it:

- Definitions and mechanics: /blog/what-is-a-url-shortener, /blog/how-url-shorteners-work, /blog/how-to-shorten-a-link
- Curiosity questions with snippet potential: /blog/who-clicked-my-link ("can you see who clicked your link"), /blog/link-rot, /blog/301-vs-302-redirect-seo ("do short links affect seo")
- Technique primers: /blog/utm-parameters-guide, /blog/how-to-track-link-clicks, /blog/link-analytics-explained
- Product story (trust): /blog/why-we-built-agni, /about

CTA at TOFU: soft and single-purpose — a "Shorten a link free" inline CTA to /#shorten on every post, plus one contextual link to the relevant MOFU post (e.g. who-clicked-my-link -> link-analytics-explained). Do not push pricing at TOFU.

### MOFU — consideration ("which shortener should I pick")

Audience: now comparing; cares about free-plan limits, analytics depth, speed, privacy, "will this disappear on me".

Content that serves it:

- Listicles and comparisons: /blog/best-free-url-shorteners-2026, /blog/url-shortener-comparison, /blog/how-to-choose-a-link-shortener, /blog/free-forever-url-shortener
- Category explainers that double as product filters: /blog/url-shortener-with-analytics ("what to look for in a URL shortener with analytics"), /blog/privacy-friendly-url-shortener, /blog/redirect-speed, /blog/free-url-shortener-no-signup
- Competitor alternatives (blog side): /blog/bitly-alternatives, /blog/rebrandly-alternatives, /blog/short-io-alternatives, /blog/dub-alternatives, /blog/cuttly-alternatives, /blog/tinyurl-vs-agni
- Hub: /alternatives
- New: /blog/bitly-pricing-explained, /blog/goo-gl-alternative (proposed)

CTA MOFU: "Compare agni side by side" -> /compare/agni-vs-{bitly,tinyurl,rebrandly,short-io,dub,cuttly}; "See what is actually free" -> /pricing. Every listicle names agni in the ranked table with a link to the relevant compare page.

### BOFU — decision ("give me the tool now")

Audience: ready to shorten, sign up, or migrate.

Content that serves it:

- Tool entry: / (root shorten form), /dashboard
- Compare pages (the real closers): /compare/agni-vs-bitly, /compare/agni-vs-tinyurl, /compare/agni-vs-rebrandly, /compare/agni-vs-short-io, /compare/agni-vs-dub, /compare/agni-vs-cuttly
- Commercial reassurance: /pricing (free plan terms in plain language), /blog/moving-from-bitly-to-agni (migration close), /blog/url-shortener-api (dev close)
- Feature proof: /blog/analytics-dashboard-tour, /blog/geo-analytics-for-links, /blog/custom-short-links

CTA BOFU: "Start shortening free" -> /#shorten; "Open the dashboard" -> /dashboard; on /pricing, one unambiguous free-plan CTA. Compare pages end with the shortener form embedded or linked — the last click before signup should never be a dead end.

### CTA path between stages

1. TOFU post -> inline "try it" CTA (/#shorten) captures the impatient; a "learn more" text link moves researchers to the MOFU post of the same cluster.
2. TOFU/MOFU post -> /alternatives or /blog/best-free-url-shorteners-2026 (the decision hub).
3. /alternatives and listicles -> /compare/agni-vs-X (match the competitor named in the query).
4. /compare/agni-vs-X -> /#shorten or /dashboard ("Start free"), with /pricing linked for limit-checkers.
5. /blog/moving-from-bitly-to-agni sits between MOFU and BOFU: read it, then a single "move your links" CTA to /dashboard.
6. Retargeting path for browsers who leave: any compare page visitor who does not sign up is the audience worth any future email/remarketing effort — they are the highest-intent non-converters.

---

## 3. Page-by-page title / meta / H1 plan (top 15 priority keywords)

Title tags are <= 60 characters and meta descriptions <= 155 characters (see verification note at end of this section). Zero emoji. Where two keywords share a page, the title targets the primary and the supporting keyword is carried in the H1 or body.

1. Keyword: free url shortener
   Host: / (existing)
   Title: Free URL Shortener With Click Analytics - agni
   Meta: Shorten any URL free and see every click: IP, location, referrer, device, browser, OS. Fast edge redirects, no credit card, no bloat.
   H1: The free URL shortener that shows you every click

2. Keyword: url shortener with analytics
   Host: /blog/url-shortener-with-analytics (existing)
   Title: URL Shortener With Analytics: What to Look For
   Meta: Not all click analytics are equal. The metrics that matter, the fine print on free plans, and how to pick a shortener that shows real data.
   H1: URL Shortener With Analytics: What to Look For in 2026

3. Keyword: bitly alternative
   Host: /alternatives (existing hub)
   Title: Bitly Alternatives: 11 Free Options Compared (2026)
   Meta: Evaluating Bitly alternatives? Compare free link shorteners on analytics, limits, and what is actually free - agni included.
   H1: Bitly Alternatives: 11 Free Options Compared

4. Keyword: free bitly alternative
   Host: /compare/agni-vs-bitly (existing)
   Title: Free Bitly Alternative With Analytics: agni vs Bitly
   Meta: See how agni and Bitly compare on free click analytics, link limits, custom slugs, and price. Your free Bitly alternative, side by side.
   H1: Free Bitly Alternative: agni vs Bitly

5. Keyword: tinyurl alternative
   Host: /compare/agni-vs-tinyurl (existing)
   Title: TinyURL Alternative With Analytics: agni vs TinyURL
   Meta: TinyURL shortens links and stops there. Compare agni vs TinyURL on free analytics, speed, custom slugs, and what you get without paying.
   H1: TinyURL Alternative: agni vs TinyURL

6. Keyword: rebrandly alternative
   Host: /compare/agni-vs-rebrandly (existing)
   Title: Rebrandly Alternative With Free Analytics - agni
   Meta: Compare agni vs Rebrandly on free click analytics, custom slugs, plan limits, and price. A Rebrandly alternative that keeps analytics free.
   H1: Rebrandly Alternative: agni vs Rebrandly

7. Keyword: short.io alternative
   Host: /compare/agni-vs-short-io (existing)
   Title: Short.io Alternative: Free Plans Compared (2026)
   Meta: agni vs Short.io: what each free plan really includes - click analytics, link caps, custom slugs, and what stays locked behind upgrades.
   H1: Short.io Alternative: agni vs Short.io

8. Keyword: dub alternative
   Host: /compare/agni-vs-dub (existing)
   Title: Dub Alternative for Simpler Free Links: agni vs Dub
   Meta: Dub is built for developer teams. Compare agni vs Dub on free analytics, setup time, and what solo builders and marketers actually need.
   H1: Dub Alternative: agni vs Dub

9. Keyword: cuttly alternative
   Host: /compare/agni-vs-cuttly (existing)
   Title: Cuttly Alternative With Better Analytics - agni
   Meta: Compare agni vs Cuttly on click analytics, ads, redirect speed, and free plan limits. Cleaner numbers, fewer distractions, zero cost.
   H1: Cuttly Alternative: agni vs Cuttly

10. Keyword: best free url shorteners 2026
    Host: /blog/best-free-url-shorteners-2026 (existing)
    Title: 12 Best Free URL Shorteners in 2026, Ranked
    Meta: We ranked 12 free URL shorteners on analytics, limits, speed, and honest free tiers. Updated for 2026, with the tradeoffs spelled out.
    H1: The 12 Best Free URL Shorteners in 2026

11. Keyword: free url shortener no signup
    Host: /blog/free-url-shortener-no-signup (existing)
    Title: Free URL Shortener With No Signup: What You Trade
    Meta: No-signup shorteners are quick and disposable. What you give up - data, reliability, control - and when a free account is worth it.
    H1: Free URL Shortener With No Signup: What You Trade Away

12. Keyword: custom slug url shortener
    Host: /blog/custom-short-links (existing)
    Title: Custom Slug URL Shortener: Brand Every Link You Share
    Meta: Custom slugs turn random back-halves into links people trust. How they work, what they do for clicks, and how to choose good ones.
    H1: Custom Slug URL Shortener: How to Brand Every URL

13. Keyword: url shortener api
    Host: /blog/url-shortener-api (existing)
    Title: URL Shortener API: Automate Links and Reporting
    Meta: Create short links and pull click reports by API. Endpoints, auth, and copy-paste examples for the agni URL shortener API.
    H1: URL Shortener API: Automate Link Creation and Reporting

14. Keyword: url shortener for instagram
    Host: /blog/instagram-bio-links (existing)
    Title: URL Shortener for Instagram: Bios, Posts, and Stories
    Meta: One bio link, crowded captions, no native analytics. How short links show you what your Instagram audience actually taps.
    H1: URL Shortener for Instagram: Make Every Click Count

15. Keyword: can you see who clicked your link
    Host: /blog/who-clicked-my-link (existing)
    Title: Can You See Who Clicked Your Link? What's Possible
    Meta: What a click can reveal - IP, location, device, referrer - what it cannot, and why names and emails are not part of link analytics.
    H1: Can You See Who Clicked Your Link?

Verification note: every title above is 60 characters or fewer and every meta description is 155 characters or fewer (programmatically verified when this file was written). No emoji in any field.

---

## 4. New page and content briefs (gaps the 53 existing posts do not cover)

Checked against the full /blog and /llms.txt inventory on 2026-11-01; none of these duplicate an existing post. None of them require features agni lacks.

Brief 1 — goo.gl is gone: where to move your links
- Target keyword: goo.gl alternative (secondary: "goo.gl replacement", "goo.gl stopped working")
- Angle: Google's URL shortener stopped resolving links during 2025. Millions of links in decks, bios, and print are dead. This post catches displaced searchers at exactly the moment they need a new tool — high-intent, low-competition, and time-stamped demand that keeps resurfacing.
- Outline: What happened to goo.gl and when links stopped working; why Google's replacement (Firebase Dynamic Links) also shut down; what to do with existing goo.gl links (audit, recreate as agni short links with custom slugs mirroring the old back-halves); checklist for choosing a replacement (analytics, durability, free tier, export); CTA to /#shorten and /compare/agni-vs-bitly.
- Honest-bounds note: do not claim agni can "rescue" old goo.gl redirects; it can only re-issue new short links pointing at the original destinations.

Brief 2 — Firebase Dynamic Links alternative for app and growth devs
- Target keyword: firebase dynamic links alternative (secondary: "FDL alternative", "what replaced firebase dynamic links")
- Angle: FDL shut down in August 2025 and served exactly agni's audience — devs and growth engineers who wanted tracked short links. Position agni as the simple stopgap for pure link-tracking use cases (not deep linking/app-routing, which agni does not do — say so plainly).
- Outline: Timeline of the FDL shutdown; what FDL was used for (attribution, deferred deep linking, email/SMS links); which use cases map to a plain tracked shortener and which genuinely need a deep-linking platform; how to create and track links via the agni API (link to /blog/url-shortener-api); migration checklist; CTA to /dashboard.

Brief 3 — Bitly pricing explained: is Bitly still free in 2026?
- Target keyword: bitly pricing (secondary: "is bitly free", "bitly free plan limits", "bitly cost")
- Angle: Pricing pages are the number-one trust gap in this category. A plain-language teardown of Bitly's tiers and free-plan limits (verify current numbers against Bitly's pricing page at publish time — do not hardcode stale limits), then a fair pointer to what a genuinely free analytics-first alternative looks like.
- Outline: What Bitly's free plan includes and what it caps (links per month, history, analytics depth); what each paid tier adds and roughly who it is for; hidden-cost patterns (annual lock-in, feature gating); when paying for Bitly is actually right; when agni's free plan is the better fit; comparison table -> /compare/agni-vs-bitly.

Brief 4 — Bitly vs TinyURL: which should you actually use?
- Target keyword: bitly vs tinyurl (secondary: "tinyurl vs bitly", "is tinyurl better than bitly")
- Angle: A head-to-head between the two most recognized names — a query with real volume that agni cannot rank its own pages for directly. Rank both fairly, then name the third option (agni) for readers who want what neither gives free (analytics). This is a discovery page, not a sales page.
- Outline: What each tool is for in 2026; feature-by-feature table (analytics, custom back-half, reliability, accounts, history); speed and redirect behavior; privacy posture; who should pick which; "what both are missing" section -> /blog/url-shortener-with-analytics and /compare/agni-vs-bitly.

Brief 5 — Ow.ly, T.ly, and BL.INK alternatives
- Target keyword: ow.ly alternative (secondary: "t.ly alternative", "bl.ink alternative", "hootsuite link shortener alternative")
- Angle: The /alternatives hub covers the six big rivals but not the second tier, where queries are cheap and specific. Ow.ly (Hootsuite) users in particular get pushed toward paid suites; T.ly users hit free-tier limits. One roundup page, each section able to graduate into its own /compare page later if demand shows.
- Outline: Why people leave Ow.ly (tied to Hootsuite, limited standalone analytics); why people leave T.ly and BL.INK (limits, pricing); what to require from an alternative (per-link analytics, free tier honesty, speed); ranked list with agni included and clearly labeled; add these to the /alternatives hub index.

Brief 6 — Best URL shortener for affiliate marketing in 2026
- Target keyword: best url shortener for affiliate marketing (secondary: "affiliate link shortener", "track affiliate links")
- Angle: /blog/affiliate-link-management covers compliance and cloaking concepts; what is missing is the actual tool-choice post for affiliates — comparison intent, monetization-adjacent, and consistent with agni's strength (per-click data). Keep claims conservative: agni tracks clicks, not conversions.
- Outline: What affiliates need from a shortener (click analytics, custom slugs, reliability, not getting links flagged); what to avoid (spammer-shared domains, opaque redirects); how to use UTM + custom slugs for affiliate campaigns (link /blog/utm-parameters-guide); tool comparison with honest "best for" labels; FTC/Amazon-Associates disclosure reminder -> /blog/affiliate-link-management.

Brief 7 — GDPR and link click tracking: what you can legally collect
- Target keyword: gdpr link tracking (secondary: "is click tracking gdpr compliant", "ip logging legal", "cookieless link tracking")
- Angle: /blog/privacy-friendly-url-shortener covers agni's posture; this is the compliance-shaped question marketers and EU-focused teams actually type. Informational with commercial tail. State plainly that this is practical guidance, not legal advice.
- Outline: What data a shortener click exposes (IP, referrer, UA); why IP is personal data in the EU; lawful-basis and retention basics; privacy-friendly practices (short retention, no resale, transparency pages); what to put in your own privacy notice when you share tracked links; how agni handles retention (link /blog/geo-analytics-for-links and /privacy).

Brief 8 — Do URL shorteners hurt email deliverability?
- Target keyword: do url shorteners hurt email deliverability (secondary: "are shortened links bad for email", "short links spam filter")
- Angle: Real, recurring question from email marketers (alongside the SMS deliverability post already covering SMS). Deliverability anxiety is high-intent for agni's email use case posts, and no existing post answers it directly.
- Outline: Why shared short domains get flagged (spammer abuse of free shorteners); what actually triggers filters (redirect chains, domain reputation, user complaints); how to protect yourself (custom slug hygiene, consistent sending domain, engagement); what agni does at the edge (link /blog/edge-fast-redirects); practical checklist for marketers; CTA -> /blog/track-email-campaign-clicks.

Brief 9 — URL shortener for real estate agents (vertical play)
- Target keyword: url shortener for real estate (secondary: "short links for property listings", "track clicks on listings")
- Angle: Vertical posts convert better than generic ones and the SERP for "url shortener for [profession]" is thin. Real estate is the best first vertical: listing links get shared across flyers, signage, and social, and agents care a lot about which channel produced a viewing.
- Outline: Where short links pay off in real estate (listing flyers, open-house signage, Instagram bio, email blasts); using location and referrer analytics to see which channel drives inquiries; custom slugs like agni.cc.cd/123-main-st; example campaign with UTM; CTA -> /#shorten. (If this works, clone the format for recruiters and educators.)

---

## 5. Internal linking plan (hub and spoke)

Spoke cluster A — "Alternatives and comparison" (highest commercial value)
- Hub: /alternatives. Links out to all six /compare/* pages and to the competitor-alternative blog posts (/blog/bitly-alternatives, /blog/rebrandly-alternatives, /blog/short-io-alternatives, /blog/dub-alternatives, /blog/cuttly-alternatives, /blog/tinyurl-vs-agni).
- Spokes link back to the hub with anchors like "all Bitly alternatives compared" or "see every free alternative we tested".
- Every /compare/* page links to the two nearest rivals (e.g. agni-vs-bitly -> agni-vs-tinyurl and agni-vs-rebrandly) so comparison traffic circulates instead of bouncing.
- Anchor text ideas: "free Bitly alternative with analytics", "compare agni vs TinyURL", "Short.io free plan limits", "Rebrandly alternative that keeps analytics free".

Spoke cluster B — "Analytics education"
- Hub: /blog/link-analytics-explained (or /blog/link-analytics-guide; pick one canonical hub and link the other to it).
- Spokes: /blog/how-to-track-link-clicks, /blog/click-tracking-for-marketing, /blog/who-clicked-my-link, /blog/geo-analytics-for-links, /blog/referrer-tracking, /blog/device-and-browser-analytics, /blog/bot-clicks-and-click-fraud, /blog/analytics-dashboard-tour.
- Every spoke ends with one link to the hub and one product CTA (/#shorten or /dashboard).
- Anchor text ideas: "what click analytics can reveal", "track link clicks step by step", "see where your clicks come from", "read your analytics dashboard".

Spoke cluster C — "Choosing a shortener"
- Hub: /blog/best-free-url-shorteners-2026.
- Spokes: /blog/url-shortener-comparison, /blog/how-to-choose-a-link-shortener, /blog/url-shortener-with-analytics, /blog/free-forever-url-shortener, /blog/free-url-shortener-no-signup, /blog/url-shortener-comparison.
- The listicle's ranked table links each tool name to its /compare page when one exists (agni row -> /, Bitly row -> /compare/agni-vs-bitly).
- Anchor text ideas: "best free URL shortener with analytics", "how to choose a link shortener", "what is actually free in 2026".

Spoke cluster D — "Migration from Bitly"
- Hub: /blog/moving-from-bitly-to-agni.
- Spokes: /blog/bitly-alternatives, /compare/agni-vs-bitly, /blog/link-hygiene (reorganizing after a move), new /blog/bitly-pricing-explained.
- Anchor text ideas: "move your links from Bitly", "Bitly pricing explained", "free Bitly alternative".

Spoke cluster E — "Use cases"
- Hub: /blog/url-shortener-for-small-business (broadest use-case post).
- Spokes: /blog/instagram-bio-links, /blog/url-shortener-for-social-media, /blog/track-email-campaign-clicks, /blog/sms-marketing-links, /blog/email-signature-links, /blog/event-marketing-links, /blog/podcast-show-notes-links, /blog/affiliate-link-management, /blog/measure-marketing-roi-links.
- New vertical posts (real estate, affiliate, GDPR) slot in as new spokes.
- Anchor text ideas: "shorten links for Instagram", "track email campaign clicks", "link shortener for small business".

Cross-cluster rules:
- Homepage (/) links to: /pricing, /alternatives, /blog/best-free-url-shorteners-2026, /blog/what-is-a-url-shortener, and one analytics post. Keep the root nav shallow; let hubs carry the depth.
- /pricing links to /compare/agni-vs-bitly (the most common "why not just use Bitly" objection) and to the free-plan honesty post (/blog/free-forever-url-shortener).
- Terms and privacy pages stay out of the content mesh; privacy links to /blog/privacy-friendly-url-shortener only if natural.
- Blog posts: minimum two internal links each (one same-cluster, one product CTA), descriptive anchors, never "click here".
- New proposed pages must slot into clusters on day one: goo.gl and Firebase posts -> cluster D (migration intent); bitly-pricing and bitly-vs-tinyurl -> cluster A/D bridge; ow.ly alternatives -> cluster A hub; affiliate/real-estate/GDPR/email-deliverability -> cluster E.

---

## 6. LLM-discovery notes (ChatGPT / Claude / Perplexity / AI Overviews)

Queries people ask assistants (these do not show in keyword tools; they are conversational):

- "What is the best free URL shortener right now?"
- "Recommend a URL shortener with real click analytics — not Bitly, I don't want to pay."
- "Is there a free Bitly alternative that keeps analytics free?"
- "What should I use now that goo.gl is dead?" / "Firebase Dynamic Links shut down — what do I use?"
- "Which shortener shows me IP, location, and referrer for each click?"
- "What's the difference between Bitly and TinyURL?"
- "I need to shorten links for Instagram and see which ones get clicked — what tool?"
- "Is there a link shortener with an API that has a free tier?"
- "What's a good shortener to recommend to a client that costs nothing?"
- "Do free URL shorteners sell my data / are they safe?"

What makes an assistant answer "agni" (phrasing to put on the site, verbatim where possible):

1. A single canonical self-description, repeated identically on /, /about, and llms.txt, in the form an LLM would lift: "agni is a free URL shortener with built-in click analytics — every click shows IP, location, referrer, device, browser, and OS — with custom slugs, a fast edge redirect network, and a public API. The free plan includes full analytics; agni does not offer custom domains, QR code generation, or team workspaces." The honest scope sentence matters: assistants prefer recommendations whose limits are stated, and it prevents hallucinated feature claims.
2. Machine-readable facts in llms.txt / llms-full.txt as tight key-value lines (product, price: free tier exists and what it includes, analytics dimensions, API exists, custom slugs: yes, custom domains: no, QR codes: no, teams: no, redirect speed claim, privacy/retention stance). Assistants quote these blocks almost verbatim.
3. Comparison pages that answer "X vs Y" in the first 40 words with a scannable table. Assistants pulling answers for "bitly vs tinyurl" or "free bitly alternative" need a page whose summary sentence stands alone.
4. An FAQ block (visible text, plus FAQPage schema) on /pricing and /alternatives: "Is agni really free?", "What analytics do I get?", "Do you support custom domains or QR codes?" (answer honestly: no), "How is agni different from Bitly?". Assistants favor pages that contain the question and the direct answer.
5. Freshness markers: "Updated November 2026" on listicles and compare pages; assistants and AI Overviews deprioritize stale comparisons, and "best free url shortener 2026" style prompts are explicitly time-bound.
6. Third-party presence: assistants weight external corroboration. The realistic playbook — get agni named in external "best free URL shortener" listicles, GitHub awesome-lists, and dev newsletters; consistent NAP-style description everywhere it is listed. llms.txt alone cannot win a recommendation if nothing else on the web mentions the product.
7. Recommendation-shaped pages win: "best for X" framing (best free option with analytics, best Bitly alternative for solo marketers, best for tracking Instagram clicks) gives assistants a ready-made superlative to repeat — provided each claim is defensible from the compare pages.

Measurement: you cannot see assistant referrals cleanly in analytics today. Proxy metrics: direct/typed traffic growth on / and /compare/* after third-party mentions; growth in branded queries ("agni url shortener"); presence of agni in AI Overview citations for the head comparison queries (manual checks monthly).

---

## Quick-reference priorities

1. Treat /compare/agni-vs-* and /alternatives as the conversion engine; the blog exists to feed them.
2. Win the low-difficulty analytics and custom-slug long tail first ("url shortener with location tracking", "custom slug url shortener") — these match real product strengths.
3. Ship the goo.gl and Firebase Dynamic Links posts: displaced audiences, low competition, decision-ready.
4. Build Bitly pricing / is-bitly-free content: high-intent, no strong dedicated target page on agni today.
5. Keep every title, meta, and feature claim inside product reality: analytics yes, custom domains/QR/teams no.
