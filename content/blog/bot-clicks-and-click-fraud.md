---
title: "Bot Clicks and Click Fraud: How to Read Your Numbers Honestly"
slug: "bot-clicks-and-click-fraud"
excerpt: "Bot clicks inflate analytics and click fraud wastes budgets. Learn the ASN, timing, and device patterns that separate real clicks from junk."
tags: ["bot traffic", "click fraud", "link analytics", "traffic quality"]
keywords: "bot clicks analytics; click fraud detection; fake clicks traffic; bot traffic filter"
published_at: "2026-09-14T09:30:00.000Z"
author_name: "Amit Anand"
---

Not every click is a person. Security scanners, link-preview bots, scrapers, and outright click fraud all generate clicks on your links, and they all land in your totals. Bot clicks analytics is the skill of separating real attention from automated noise—before you report a number, renew a budget, or make a decision on bad data.

This guide covers where fake clicks come from, which fields in a click record expose them, and how to build an honest reading of your numbers that survives scrutiny.

## Where non-human clicks come from

First, a distinction that changes your reaction: most automated clicks are not fraud. They fall into three buckets with very different meanings:

1. **Infrastructure bots (usually harmless).** Corporate mail security scanners prefetch links in every email. Chat apps unfurl previews by fetching URLs. Monitoring tools probe links. These inflate counts but are not malicious—they are the cost of links passing through modern infrastructure.
2. **Scrapers and research crawlers.** They follow links to index or extract content. Noise, but impersonal.
3. **Click fraud (actually malicious).** Bots or click farms clicking paid links to drain an advertiser's budget, or to inflate a publisher's revenue. This is the bucket that costs money directly.

Your analytics should make all three visible, because the honest fix differs: discount infrastructure bots from engagement reporting, ignore scrapers where they do not distort trends, and act on fraud—usually by fixing where your paid links appear.

## The fields that expose bots

A click record with network and client detail makes automation recognizable. The signals, roughly in order of reliability:

**ASN and datacenter.** The strongest single signal. Real audiences arrive through residential ISPs and mobile carriers. Automation arrives through cloud providers—Amazon, Google Cloud, DigitalOcean, OVH, and similar. A "campaign spike" composed mainly of datacenter ASN clicks is not a campaign spike. (This is exactly why agni records ASN and colo on every click.)

**Timing patterns.** Humans click in waking-hour clusters with irregular spacing. Bots click in machine-perfect intervals—every 3.0 seconds—or in impossible bursts, like 500 clicks in two minutes on a link you just created privately. The raw activity feed with per-click timestamps is where this shows.

**Device and user-agent coherence.** Spoofed agents combine devices, OSes, and browsers that never ship together. Bulk traffic claiming ancient browser versions in 2026 is default strings from old automation libraries. Device data cross-checked against ASN turns "looks weird" into "is fake." See [device and browser analytics](https://agni.cc.cd/blog/device-and-browser-analytics) for the parsing side.

**Referrer and TLS.** Real navigations often carry referrers and always negotiate modern TLS over HTTPS. Bots frequently arrive with missing or synthetic referrers and, in older tooling, stale TLS versions. No single field convicts; combinations do.

**Geography coherence.** Clicks geolocated to one distant city with cloud ASN traffic, on a link promoted locally, are telling you exactly what they are. Read geo alongside ASN per our [geo analytics for links](https://agni.cc.cd/blog/geo-analytics-for-links) guide.

| Signal | Human traffic | Bot traffic |
|---|---|---|
| ASN | Residential ISP, mobile carrier | Cloud and hosting providers |
| Timing | Irregular, waking-hour clusters | Metronomic or superhuman bursts |
| Device/OS/browser | Coherent, current combinations | Incoherent or decade-old strings |
| Referrer | Present or plausible gaps | Missing, synthetic, or constant |
| TLS | 1.2 / 1.3 | Stale versions in bulk |
| Geography | Matches promotion footprint | Distant clusters near datacenters |

## How to read your numbers honestly

The goal is not a perfect bot-free count—that does not exist. The goal is a consistent, defensible reading you can explain to anyone. Four practices:

- **Separate "clicks" from "engaged clicks" in your reporting.** Report the raw total with a note, and base decisions on the portion that survives your quality checks. Hedging honestly beats false precision.
- **Establish per-link baselines.** Every link has a normal traffic profile—its usual ASN mix, its usual hourly shape. Deviations from the baseline matter more than absolute numbers.
- **Discount known scanner windows.** For email links, the minutes right after delivery are scanner-heavy. Counting that window as engagement inflates every send; our [email click tracking guide](https://agni.cc.cd/blog/track-email-campaign-clicks) covers the pattern.
- **Never subtract "the bot number" to the click.** Bot estimation is inference. Give ranges and describe the method; anyone who promises exact human counts is guessing with a formula.

A side effect worth naming: reading click data honestly trains better instincts. You start noticing when a "win" is hollow and when a quiet link is quietly working.

## Click fraud on paid campaigns specifically

Fraud matters most where money moves per click. If you run paid promotion of short links—affiliate links, sponsored placements, paid social—the fraud surface is real. Practices that limit the damage:

- **Track paid links with their own short links and UTMs** so paid traffic is never mixed with organic. The structure is in our UTM parameters guide.
- **Compare your link's click record against the platform's reported clicks.** If the ad platform reports 1,000 link clicks and your raw feed shows 600 redirects with 250 of them from datacenter ASNs, you have found something worth a refund conversation.
- **Watch for geographically impossible performance.** Paid campaigns with defined targeting that "perform" overwhelmingly outside the target are a classic fraud shape.
- **Check quality within hours, not weeks.** Fraud is billed fast; discovering it in a monthly report means the budget is already spent.

No analytics tool can block fraud for you at the link layer—you are measuring, not enforcing—but measurement is what makes fraud actionable instead of merely suspected.

## The preview-bot special case

Link-preview unfurlers—Slack, Discord, Telegram, iMessage, LinkedIn, and every messaging app that shows a thumbnail—fetch your links automatically whenever a message is posted. This produces real, measurable clicks that represent zero human attention.

How to read them: preview fetches cluster at the exact moment a message is posted (often before any human could tap), arrive from the app provider's ASN or from the poster's own connection, and repeat when the message is re-shared. On links dropped in busy chat rooms, preview fetches can double raw counts. The raw activity feed's timestamps make them identifiable—another reason per-click timestamps matter more than a headline counter.

## What honest link analytics looks like in practice

A defensible weekly routine: skim the raw feed for any link that moved; check ASN mix and timing shape against the link's baseline; flag anything datacenter-heavy; adjust "engaged" counts accordingly; note the method in the report. It takes minutes per link once the fields are on the dashboard—this is exactly the per-link detail [agni](https://agni.cc.cd/) provides (IP, country, city, colo, ASN, protocol, TLS, referrer, device, browser, OS, timestamps, plus daily rollups and date-range filters). For how the incumbent tools handle traffic quality, compare [agni vs Dub](https://agni.cc.cd/compare/agni-vs-dub) or browse [alternatives](https://agni.cc.cd/alternatives).

## What to do when you find bad traffic

Finding bots is analysis; acting on it is procedure. Start by documenting: which links, which window, which signals—ASN mix, timing shape, device strings. A screenshot of the raw activity feed with timestamps visible settles more disputes than any adjective.

Then branch on the source. If the noise is infrastructure—mail scanners, preview unfurlers—discount it in engagement reporting and move on; blocking it is neither possible nor desirable. If it is scrapers and you did not invite them, note the baseline shift so future spikes are read against the new normal. If it is click fraud on paid placements, act within the billing window: compare your link's raw redirects against the platform's reported clicks, export the evidence with ASN and timestamps, and raise it with the platform promptly. Fraud discovered in a monthly report is fraud you have already paid for.

Finally, adjust the reporting rather than the history. Keep the raw totals, add a quality note, and base decisions on the engaged portion. Public classification guides like Cloudflare's [bots documentation](https://developers.cloudflare.com/bots/) reinforce what your own click record shows: the request fields that betray automation, from stale user agents to old TLS versions, are part of the HTTP request itself, as defined in [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html).

Agni keeps those fields visible on every click—ASN, datacenter, TLS version, device strings, timestamps—so the diagnosis above takes minutes. All of it sits on the [free tier](https://agni.cc.cd/pricing) alongside live counts and milestone emails.

## FAQ

### How do I know if clicks on my link are from bots?

Check the ASN and timing in the click record. Cloud-provider ASNs, machine-regular intervals, superhuman bursts, incoherent user agents, and stale TLS versions are the combined fingerprint of automation. No single field is conclusive; several together are.

### Do bot clicks affect my analytics?

Yes. Bot and scanner clicks inflate totals, distort referrer and geography breakdowns, and can mislead budget decisions on paid campaigns. They do not harm your links themselves—they simply make raw click counts less meaningful unless you read them with traffic-quality context.

### Can link shorteners block bot clicks?

Measuring and blocking are different jobs. A good link analytics tool makes bots visible through ASN, colo, timing, and device data so you can discount them; actual blocking happens at the application or ad platform layer. Be skeptical of any tool that claims perfect automatic bot elimination.

### Is every click from a datacenter ASN fake?

Not necessarily—some legitimate corporate and VPN traffic routes through hosted infrastructure—but heavy datacenter concentration, especially with bursty timing, is a strong automation signal. Real audience traffic is dominated by residential ISPs and mobile carriers.

### How much of web traffic is bots?

Estimates vary by source and year, and studies commonly report automated traffic as a very large share of all requests—but most of it never touches your links. What matters is the pattern in your own click records: measure the ASN and timing mix per link instead of relying on industry averages.

Read your numbers like you would defend them in a room—[shorten a link and see the full click record](https://agni.cc.cd/#shorten).
