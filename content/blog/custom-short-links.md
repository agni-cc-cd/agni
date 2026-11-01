---
title: "Custom Short Links: How to Brand Every URL You Share"
slug: "custom-short-links"
excerpt: "Custom short links turn long URLs into readable, branded slugs. Here is how to name them, organize them, and track every click your links receive."
tags: ["custom slugs", "branding", "link management"]
keywords: "custom short links; branded short links; custom slug; short URL branding"
published_at: "2026-10-07T09:30:00.000Z"
author_name: "Amit Anand"
---

A random string like `x7Kq2` tells your audience nothing. A custom short link like `agni.cc.cd/launch` tells them the destination, the campaign, and that you are paying attention. Custom short links — short URLs with a back-half you choose instead of a generated one — are the cheapest branding upgrade available to anyone who shares links. This guide covers how to name your slugs, how to organize them so they still make sense a year later, and how to keep click tracking attached to every one.

## What Makes a Short Link "Custom"

Every short link has two parts: the domain and the back-half. On agni, links live on `agni.cc.cd` and you control the back-half — the part after the slash. That is the custom slug: `summer-sale`, `pricing-guide`, `q3-webinar` instead of an opaque code.

Be clear about what this does and does not do. A custom slug makes the link readable and memorable. It does not put your own brand name in the domain — agni does not offer custom domains today, so links stay on `agni.cc.cd`. If you need `go.yourbrand.com`, that is a custom-domain feature other tools sell (Rebrandly is built around it — see how things compare in our [Rebrandly comparison](https://agni.cc.cd/compare/agni-vs-rebrandly)). If what you actually want is readable, trackable, free links, the slug is where the branding happens.

### Why readable slugs change behavior

People are cautious about links, and they have reason to be. A readable back-half does real work:

- **Trust.** `agni.cc.cd/pricing` invites a click in a way `agni.cc.cd/b3x9Q` does not. The visible destination words are a promise.
- **Memory.** Someone who hears your link at a conference can type `agni.cc.cd/launch` from a seat. No one types a random string.
- **Self-documentation.** Six months later, the slug is the label. `oct-newsletter` explains itself in every dashboard, export, and meeting.

Studies on link design commonly report that users inspect URLs before clicking unfamiliar ones, and the readable segment of the path is exactly what they inspect. You do not need a study to believe the rest: your own click data will show whether readable placements outperform opaque ones.

## Naming Conventions That Survive Contact With Reality

The difference between custom short links that scale and ones that collapse into chaos is a naming system. Pick one before your tenth link, not after your fiftieth.

| Pattern | Example | Best for |
| --- | --- | --- |
| Placement-based | `oct-newsletter`, `li-founders-post` | Performance tracking per channel |
| Campaign-based | `summer-sale`, `beta-signup` | Time-bound launches |
| Destination-based | `pricing-guide`, `docs-setup` | Evergreen, long-lived links |
| Partner-based | `partner-acme`, `affinite-jules` | Attribution across partners |
| Sequence-based | `talk-01`, `talk-02` | Slide decks and presentations |

Five rules keep any of these conventions clean:

- **Lowercase, hyphenated, no underscores.** They read correctly in every app and survive being transcribed.
- **Under 20 characters where possible.** Long enough to be clear, short enough to speak.
- **One slug, one destination, forever.** Reusing a slug for a new target breaks the promise the words make.
- **Date only when the link is genuinely time-bound.** `webinar-signup` outlives `oct-webinar`; if the event ends, retire the link instead of renaming history.
- **Reserve a format for throwaway links** (`temp-...`) so you know which links you can delete without a meeting.

### The one-link-per-placement rule

The most common failure with custom short links is reuse. If the same `summer-sale` link goes into the newsletter, three social posts, and a printed card, your dashboard shows one number and tells you nothing about where the clicks came from. Create a distinct slug per placement — `sale-newsletter`, `sale-li`, `sale-card` — and the attribution is built in. This is the core habit behind clean [link management](https://agni.cc.cd/blog/link-management-best-practices).

## Branding the Whole URL, Not Just the Slug

Since the domain stays `agni.cc.cd`, the slug is your main surface. Use it deliberately.

- **Lead with the most useful word.** `pricing-guide` beats `guide-to-pricing-2026` in print.
- **Match the words to the CTA.** If the button says "Get the checklist," the link should read `agni.cc.cd/checklist`.
- **Keep the family visible.** A consistent pattern across your links is itself a signal: this is a maintained, professional operation.

The words in a URL are also read by machines. Search engines parse path segments like any other URL structure — Google's [URL structure guidance](https://developers.google.com/search/docs/crawling-indexing/url-structure) is the reference — and readable paths are friendlier to share previews and to pasted contexts where the text stands alone.

There is one more branding lever: where the link lands. A short link pointing at a slow, confusing page undoes the trust the slug built. The slug is the promise; the destination is the delivery.

### What about QR codes and print?

For printed materials, pair your short link with any QR generator and encode the short URL — not the long destination. Two reasons: the short link is smaller and denser to scan, and if the destination ever changes, you update the mapping once instead of reprinting the poster. More on that workflow in [How to Use QR Codes With Short Links](https://agni.cc.cd/blog/qr-codes-from-short-links).

## Tracking Clicks on Custom Short Links

Customization should never cost you data — and on agni it does not. Whether the back-half is generated or chosen by you, every click records the same set of signals: country, city, datacenter, ASN, protocol, TLS version, referrer, device, browser, OS, and timestamp. Live counts update without a refresh, daily rollups show the trend, and the raw activity feed is filterable by date range.

Two tracking habits specific to named links:

- **Put the naming convention in the link's context, not just its slug.** Keep a simple list of what each pattern means, especially if teammates create links through the [REST API](https://agni.cc.cd/).
- **Use milestone notifications as a heartbeat.** agni emails you when a link crosses 1, 10, 50, 100 clicks and beyond (browser notifications via Web Push are available too). A named link that never reaches its first milestone is a placement problem worth checking.

## Worked Examples: Slug Systems in the Wild

Abstract rules are hard to evaluate. Here are three systems teams actually run.

**The newsletter operator.** One weekly send, three links per issue: hero story, secondary story, archive link. Slugs look like `nl-214-hero`, `nl-214-side`, `nl-214-old`, where the number is the issue number. When someone asks which issue drove tool signups, the answer is a filter away — and the slugs read like a filing system, because they are one.

**The small event team.** Two events a year, dozens of surfaces: `city26-registration`, `city26-agenda`, `city26-sponsor-deck`, `city26-poster-lobby`. The city-and-year prefix keeps the whole event's links grouped at a glance, and the suffix names the surface. After the event, the poster link is retired and the registration link is repointed to the recordings page.

**The partner manager.** Every partner gets `partner-<name>` for the shared destination and `partner-<name>-page` for co-branded content. Partner links are the ones most likely to escape into other people's decks and emails, so they are never deleted — only repointed. When a partner's quarter ends, their links' activity feeds double as the recap.

Notice what none of these systems do: encode dates that will age, spell channel names inconsistently, or reuse slugs. The system does not need to be clever. It needs to be boring in a way that survives handoffs, which is also what makes the analytics legible to whoever reads them next quarter. For what those feeds look like in practice, the guide to [tracking link clicks](https://agni.cc.cd/blog/how-to-track-link-clicks) walks through the same links from the data side.

## When Custom Slugs Are Not Enough

Custom back-halves solve readability and organization. Two jobs they do not solve:

- **Custom domains.** If your requirement is links on your own domain, agni does not provide that today. Tools like [Rebrandly](https://agni.cc.cd/compare/agni-vs-rebrandly) and [Short.io](https://agni.cc.cd/compare/agni-vs-short-io) specialize in it, usually as paid features.
- **Expiry and access control.** agni links keep working until you delete them; there are no password-protected links. If a link needs to die on a schedule, put a reminder on the calendar and delete it from the dashboard or the API.

Knowing the boundary is useful. Readable, organized, fully tracked links for free is a different product than vanity domains at a price, and pretending otherwise wastes your time.

## FAQ

### What is a custom short link?

A custom short link is a short URL whose back-half is chosen by you instead of randomly generated — for example `agni.cc.cd/launch` instead of `agni.cc.cd/x7Kq2`. The words make the link readable, memorable, and self-documenting, and on agni the click tracking is identical either way.

### Can I use my own domain in a short link?

No. agni does not support custom domains today; links live on `agni.cc.cd` with your custom slug after it. If you specifically need your own branded domain, look at tools built around custom domains — but expect to pay for it, since that is their core upsell.

### Do custom slugs affect click tracking?

No. Every click on a custom-slug link records the same data as a generated one: location, network, device, browser, referrer, and timestamp. You get the readability at zero cost to the analytics.

### How should I name my short links?

Pick a convention — placement, campaign, destination, or partner — and stick to it. Use lowercase hyphenated words under about 20 characters, never reuse a slug for a different destination, and create one link per placement so attribution stays clean.

### Can I change where a custom short link points?

Yes. You control the destination mapping for links you create, so you can repoint a slug without changing the URL people already have. That is exactly why printed materials should encode the short link rather than the long URL.

Give every URL you share a name worth remembering at [agni.cc.cd/#shorten](https://agni.cc.cd/#shorten).
