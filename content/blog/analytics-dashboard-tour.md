---
title: "Reading Your Analytics Dashboard: A Tour of Every Panel"
slug: "analytics-dashboard-tour"
excerpt: "Your link analytics dashboard answers who clicked, where, and when. A panel-by-panel tour of agni's overview, detail, and live activity views."
tags: ["analytics", "dashboard", "link tracking", "product"]
keywords: "link analytics dashboard; click analytics; url shortener analytics"
published_at: "2026-09-05T09:30:00.000Z"
author_name: "Amit Anand"
---

Click data is only useful if you know where to look and what each field means. This is the panel-by-panel tour of the [agni link analytics dashboard](https://agni.cc.cd/): the overview that shows all your links at once, the per-link detail pages where the real diagnosis happens, and the raw activity feed that shows clicks as they land. By the end you will know which panel answers which question — and which fields are worth your attention every week versus which ones are there for the occasional deep dive.

## Two Levels: The Overview and the Detail

agni's dashboard works at two altitudes, and confusing them is the most common mistake.

- **The overview dashboard** lists every link you own with its click counts, live — the counts move without a refresh. This is the ranking surface: what is working this week, what flatlined, what quietly works forever.
- **The per-link detail page** is where one link's clicks become a profile: geography, network, device, protocol, referrer, and time. This is the diagnosis surface: why a link performed the way it did.

Work top-down. The overview tells you which link deserves a look; the detail page tells you what actually happened. If you open detail pages at random, you are reading interesting noise.

## The Overview: What Ranks, What Lives, What Died

The overview shows all your links with their live counts, so the first question it answers is simply "what is moving?" Three reads worth making habitually:

- **Sort by recent clicks.** The top of the list is your audience's current interest, independent of what you planned to promote.
- **Scan the bottom.** Links with zero clicks are unfinished business: a placement that never shipped, a slug nobody could type, an offer nobody wanted.
- **Watch the live counts move.** When a count ticks up while you are looking at it, something is happening right now — a send going out, a post gaining traction, a guest sharing. The live view is how you catch the wave while it is still forming.

Because every link sits on one page, the overview is also where naming discipline pays off. A list of `ev-email`, `ev-ig`, `book-maria`, and `acme-review` slugs reads like an operations log; a list of random strings reads like nothing. The use cases in our [small business link guide](https://agni.cc.cd/blog/url-shortener-for-small-business) lean on exactly this habit.

## The Per-Link Detail Page

Open any link and the page answers four questions in order: how many, who were they roughly, where did they come from, and when. The exact dimensions agni records per click:

- IP address, country, and city
- Datacenter (colo) and ASN
- Protocol (HTTP or HTTPS) and TLS version
- Referrer
- Device, browser, and OS, parsed from the user agent
- Exact timestamp

Those rows feed two views: the daily rollups for trends and the raw activity feed for exactly what happened. Date-range filters let you cut both to any window — launch week, the send day, the month.

### Geography: country, city, and datacenter

Country and city are the obvious pair: where the visitor roughly is. The datacenter field — the colo — is subtler and often more interesting. It names the Cloudflare edge location that served the redirect, which is a property of the visitor's network path, not their street address. A cluster of clicks served through one colo tells you where your audience's traffic concentrates on the backbone; a spike of colos that are home to cloud providers tells you the clicks may be machines.

### ASN: the network behind the click

The ASN (autonomous system number) identifies the visitor's network operator — a mobile carrier, a university, a corporate network, a cloud provider. In practice this field does two jobs:

- **Spotting non-human traffic.** Bots and scanners cluster on datacenter ASNs, usually with identical device profiles and instant timing after a send.
- **Understanding your audience's context.** Corporate ASNs mean desk traffic during work hours; carrier ASNs mean phones on mobile data — which lines up with the device field and confirms the read.

### Device, browser, and OS

Parsed from the user agent string of each click, these fields answer "how should the destination page be built?" A mobile-dominated link argues for a mobile-first landing page; a browser split heavy in one engine tells you what your visitors can actually use. One caveat to hold lightly: locked-down or reduced user agents produce less detail than rich ones, and some privacy tooling deliberately garbles this field. Treat the breakdown as a strong signal about the majority, not a census.

### Protocol and TLS version

Each click records whether it arrived over HTTP or HTTPS and which TLS version the connection used. For most links this is a background field — modern traffic is HTTPS over modern TLS. It earns its keep when something looks wrong: old TLS versions in a click stream suggest outdated clients or peculiar network paths, and an unexpected HTTP share suggests something between your visitor and the edge that needs a look.

### Referrer: where the click came from

The referrer names the page or app that sent the visitor — a blog post, a newsletter web view, a search result. The pattern that matters most is the empty referrer: SMS apps, email clients, QR scans, and typed visits all arrive without one. Empty referrer plus a spike right after a send is normal and interpretable; empty referrer with steady trickle traffic on a readable slug is often word of mouth.

## Time: Rollups, Ranges, and the Raw Feed

The time dimensions are where click data becomes narrative.

- **Timestamps** on every click give you the exact sequence — what happened minutes after a post, an email, or a slide went up.
- **Daily rollups** compress the stream into a per-day line, which is the only sane way to compare this week to last or this episode to the previous one.
- **Date-range filters** cut both views to the window you care about: launch week, the event weekend, the quarter.
- **The raw activity feed** is the stream itself, newest first, with live counts that move without a refresh. This is the panel to have open during a launch or a live event, because it shows the room responding in real time — our [event marketing links guide](https://agni.cc.cd/blog/event-marketing-links) builds a whole day-of workflow around it.
- **Milestone notifications** do the watching for you: email when a link crosses 1, 10, 50, 100 clicks and onward, plus browser notifications if you enable them, so you hear about a breakout link without refreshing anything.

### The panel-to-question cheat sheet

| Panel | The question it answers | The action it enables |
| --- | --- | --- |
| Overview list | What is moving right now? | Decide what deserves attention |
| Live counts | Is something happening this minute? | Catch a wave while it forms |
| Daily rollups | What is the trend per link? | Compare weeks, episodes, sends |
| Date-range filters | How did that window perform? | Judge a campaign honestly |
| Raw activity feed | What exactly happened, in order? | Reconstruct a launch or event |
| Country and city | Where are the visitors? | Target, localize, sanity-check |
| Colo and ASN | What kind of network sent this? | Spot bots, confirm mobile audience |
| Device, browser, OS | What did they arrive on? | Prioritize the landing experience |
| Protocol and TLS | How secure was the arrival? | Notice outdated or odd traffic |
| Referrer | Which source sent them? | Attribute channels and shares |

## The Ten-Minute Review

A dashboard without a routine becomes wallpaper. The version that works:

1. **Overview, last seven days.** Note the top three links and anything at zero.
2. **Detail on the top three.** Referrer and device first — is the traffic where you expected it from?
3. **One range comparison.** Put launch week next to the week before, or this send next to the last. Ranges make trends visible; single totals do not.
4. **One anomaly hunt.** Glance at ASN and timing on a spiky link. Human interest spreads out and mixes devices; machines do neither.

When those reads need to become an ROI argument, our [marketing ROI guide](https://agni.cc.cd/blog/measure-marketing-roi-links) carries them the rest of the way.

## How the Numbers Get There

One note on why the dashboard can show live, click-level data at all: the redirect and the recording are separate jobs. Each short link resolves at the edge with a KV-first lookup and a 302 redirect — the semantics of that status code are defined in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) — so the visitor is forwarded immediately. The click event is recorded after the fact and aggregated in [Cloudflare's Analytics Engine](https://developers.cloudflare.com/analytics-engine/), which is what makes per-click rows and live counts practical without slowing the redirect down. The visitor never waits for your analytics; the analytics never miss the visit.

All of this is included for free on agni today — every panel on this page, no credit card, sign-in by email, phone, Google, or GitHub. The [about page](https://agni.cc.cd/about) covers the same pipeline from the product side, the [pricing page](https://agni.cc.cd/pricing) keeps the money question short, more guides live on the [agni blog](https://agni.cc.cd/blog), and if you are deciding between tools, our [Bitly comparison](https://agni.cc.cd/compare/agni-vs-bitly) puts the analytics side by side.

## FAQ

### What does a link analytics dashboard show?

For every click on your short links: IP, country, city, datacenter (colo), ASN, protocol, TLS version, referrer, device, browser, OS, and timestamp — rolled up daily and streamable in a raw activity feed with live counts. The overview ranks all your links; each link's detail page profiles its traffic. Date-range filters cut any view to the window you care about.

### What is colo in click analytics?

Colo names the Cloudflare datacenter (edge location) that served the redirect. It is a property of the visitor's network path, not their exact location — but clusters tell you where traffic concentrates, and colos associated with cloud providers often signal automated traffic rather than people.

### What is ASN and why does it matter?

ASN is the autonomous system number of the visitor's network operator — a mobile carrier, an enterprise, a university, or a datacenter. It helps you separate human traffic from bots (which cluster on cloud ASNs with identical device profiles) and understand whether your audience is on phones, corporate networks, or something else.

### How do I filter clicks by date on agni?

Every link's detail page takes date-range filters, applied to both the daily rollups and the raw activity feed. Set the window to a launch week, a send day, or a month and the panels recalculate to just that range. Comparing two windows side by side is how trends become visible.

### Does the dashboard show who clicked my link?

It shows each click with its technical context — network, device, geography, referrer, and time — but not the identity of the person behind it. On agni, that analytics data belongs to you as the link owner and is not used for advertising. Treat it as behavior patterns, not surveillance.

Open your own dashboard and watch the first clicks land at [agni.cc.cd](https://agni.cc.cd/#shorten).
