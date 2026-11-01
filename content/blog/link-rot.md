---
title: "Link Rot: How Short Links Keep Old URLs Alive"
slug: "link-rot"
excerpt: "Link rot kills shared URLs quietly. Short links add a layer you control, so old emails, PDFs, and print keep working when destinations move."
tags: ["link rot", "link management", "short links", "maintenance"]
keywords: "link rot; what is link rot; dead links; short links maintenance"
published_at: "2026-10-15T09:30:00.000Z"
author_name: "Amit Anand"
---

Link rot is the slow death of URLs: the page you linked to last year returns a 404, redirects to a homepage, or now serves something unrecognizable. It is not a hypothetical problem. A 2024 Pew Research Center study found that 38% of webpages that existed in 2013 were no longer accessible a decade later. This post explains where rot comes from, and why a short link you control is one of the few practical defenses for URLs you have already sent into the world.

## What link rot actually is

The term covers more than a clean 404. In practice, a "dead" link takes several forms:

- **Gone.** The page returns an error, or the whole domain has lapsed and been parked.
- **Moved.** The content lives at a new URL and nothing redirects you there.
- **Drifted.** The URL works, but the content has been rewritten, truncated, or turned into a marketing page.
- **Captured.** The domain was re-registered by someone else and now serves unrelated or hostile content. This is the worst case for anyone whose email or paper sent readers there.

The Pew study is the most careful recent measurement I know: beyond the 38% figure for 2013 pages, roughly a quarter of all pages sampled between 2013 and 2023 had become inaccessible, and about one in five pages from 2021 was already gone two years later. Newness buys you time, not immunity.

## Why URLs die

Rot is rarely malice. It is ordinary web operations with long tails:

- **Site restructures.** A CMS migration changes URL patterns wholesale. Every old path becomes a redirect map entry that eventually gets deleted.
- **Campaign cleanup.** Marketing pages for finished launches are retired, usually without checking where their URLs are still referenced.
- **Docs reorganizations.** That page you linked from a support macro moved into a new help center with new slugs.
- **Parameterized URLs.** Links full of session IDs, tracking parameters, or locale paths break first, because they were never stable identifiers to begin with.
- **Domain churn.** Projects end, registrars lapse, companies merge. The domain behind the URL disappears.
- **Shortener churn.** Even link shorteners get shut down. When a service retires — Google's goo.gl being the highest-profile example — every short link it ever minted can die at once. Slugs on a service you actively maintain hedge this; printed URLs pointing at someone else's infrastructure do not.

Each mechanism is boring on its own. Multiplied across every link in every email, PDF, slide deck, and print run you have ever shipped, the aggregate is what the Pew numbers describe.

## Where the damage lands

A dead link in a blog post is a small annoyance. The expensive rot lives in artifacts people still use but nobody re-reads:

- **Email sequences.** Onboarding mails go out for years. Nobody audits their links quarterly.
- **PDFs and whitepapers.** Once downloaded, they are frozen. Their links cannot be fixed in place.
- **Print and packaging.** QR-adjacent URLs on cards, flyers, manuals, and packaging have no patch mechanism except the one behind the URL.
- **Support macros and canned replies.** Agents paste the same links for months.
- **Academic and legal citations.** The most studied corner of link rot, and the one with no marketing owner at all.

The common property: once a URL leaves your control as a file, you can no longer edit it. The only variable left is whether the address you published still resolves to something useful.

## How short links keep old URLs alive

A short link separates the two roles a URL plays: the **address you publish** and the **place it points today**. Once those are different things, you have a layer you control.

- **The shared identifier stays stable.** You print `agni.cc.cd/launch` on a card and paste it in a hundred messages. That string never has to change again.
- **The mapping is yours to maintain.** When a destination genuinely moves, you retire the old mapping and create a new one behind the same custom back-half. Readers of the old PDF arrive at the current page instead of a 404. Because agni serves short links with a 302, clients are not entitled to remember the old mapping forever; the hop can honestly reflect the current destination.
- **Custom slugs make the layer legible.** `/launch`, `/pricing-2026`, `/docs-setup` are greppable in your codebase and comprehensible in your analytics. Random strings work, but they do not tell you what you are looking at a year later.
- **Analytics tell you what is still load-bearing.** This is the part people skip. A link you think is dead may still get clicks every week from an email sequence you forgot. Agni's per-link pages show a raw activity feed, daily rollups, and date-range filters, and the overview dashboard shows counts across all your links with live updates. Milestone email notifications (1, 10, 50, 100 clicks, and on) also surface links that are quietly alive.

| Rot source | Without a short link layer | With a short link you control |
|---|---|---|
| CMS migration changes paths | Old links 404 everywhere | Re-create the mapping behind the same slug |
| Campaign page retired | Print and PDFs die | Point the shared slug somewhere that still makes sense |
| Domain change for the destination | Every published URL breaks | Only the mapping changes; published URLs stand |
| Forgotten legacy link | You discover it when a customer complains | Click activity shows it is still receiving traffic |
| Tracking-parameter URLs rot | Links break in odd ways | You publish a clean short URL and keep params on the destination |

Note what a short link does not do: it cannot rescue a destination you do not control. If someone else's page dies, your short link faithfully sends readers to the 404. The layer's value is protecting URLs *you* published to destinations you *do* control, and giving you one place to fix them.

## Practices that compound the benefit

Short links are the spine, not the whole skeleton. A few habits make the difference between a maintained layer and another source of rot:

1. **Point short links at stable canonical URLs.** Deep links full of session state break on their own. Use the cleanest permanent URL of the destination as the mapping target.
2. **Keep a slug convention.** Naming by purpose and date (`/launch-q4`, `/docs-setup`) makes the inventory auditable. This is the core of [link hygiene](https://agni.cc.cd/blog/link-hygiene).
3. **Audit on a schedule.** Once a quarter, list your links, check the destinations still resolve to the right thing, and delete what you no longer stand behind. If your links live in a pipeline, the list and delete operations come from the [REST API](https://agni.cc.cd/blog/url-shortener-api).
4. **Archive what you cite.** For research and legal writing, pair live links with [Internet Archive](https://web.archive.org/) snapshots. The archive catches what no redirect can.
5. **Prefer https destinations.** They survive infrastructure changes better and avoid mixed-content breakage in the artifacts where your links get embedded.

## The economics of fixing rot late

The reason rot persists is that the cost is deferred. A link takes five seconds to create and five years to break, and the bill lands on whoever handles the customer complaint. A maintained short-link layer front-loads five minutes of naming discipline to avoid that bill.

There is also a trust dimension that does not fit in a spreadsheet. A 404 in an onboarding email reads as "this product is abandoned," whether or not that is true. The Pew data tells you the web at large is losing pages constantly; your users experience that as your URLs failing. Keeping published addresses alive is cheaper than the impression of neglect — a standard we hold ourselves to and write down plainly on the [about page](https://agni.cc.cd/about).

None of this requires a large toolchain. A free account with custom slugs, per-link analytics, and an API covers the mechanics on [agni](https://agni.cc.cd/), with the whole free tier laid out on the [pricing page](https://agni.cc.cd/pricing), and the reasoning behind what link management is turning into is in our piece on the [future of link management](https://agni.cc.cd/blog/future-of-link-management).

## FAQ

### What is link rot?

Link rot is the gradual failure of URLs: pages return errors, move without redirects, drift into different content, or their domains expire or change hands. Studies of large web samples commonly find that a substantial share of links a decade old no longer resolve to the intended page.

### How common is link rot?

More common than most teams assume. Pew Research Center reported in 2024 that 38% of webpages from 2013 were inaccessible ten years later, and about one in five pages from 2021 had vanished within two years. Anything you publish today will face the same decay.

### Can a short link prevent a dead destination?

No. If the destination page is gone, the redirect lands readers on whatever is there now. What a short link does is keep the URL you published stable and under your control, so you can change where it points when the destination moves.

### How do I fix a short link whose destination changed?

Retire the old mapping and create a new one with the same custom back-half pointing at the current URL. Because agni serves short links as 302 redirects, clients pick up the new mapping instead of caching the old one forever.

### How do I know which old links are still being used?

Check per-link analytics: a raw activity feed with timestamps and referrers, daily rollups, and date-range filters show which links still receive clicks. The overview dashboard tracks live counts across everything you have shared.

Keep the URLs you have already published alive at [agni.cc.cd](https://agni.cc.cd/#shorten).
