---
title: "301 vs 302 Redirects for Short Links: The SEO Impact Explained"
slug: "301-vs-302-redirect-seo"
excerpt: "301 vs 302 redirect seo comes down to permanence: 301 moves a URL's signals, 302 keeps the original canonical. Short links should use 302. Here is why."
tags: ["seo", "redirects", "short links", "http"]
keywords: "301 vs 302 redirect seo; 302 redirect short links; do 302 redirects pass link equity; redirect seo"
published_at: "2026-10-22T09:30:00.000Z"
author_name: "Amit Anand"
---

The 301 vs 302 redirect seo debate is one of the oldest arguments in search, and most of it is aimed at people moving their own pages to new URLs. Short links sit in a different situation: the short URL is a pointer, not a page, and the destination is usually someone's canonical content. This post explains what the two status codes mean, how Google treats them, and why a 302 is the right answer for a short link hop.

## What the status codes actually mean

Both codes tell a client "the resource you asked for is somewhere else." The difference is a promise about permanence, defined in the HTTP semantics specification, [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110):

- **301 Moved Permanently.** The old URL is dead as an address. Clients and caches are entitled to rewrite future requests straight to the target. It says: this move is final.
- **302 Found.** The redirect is temporary and may change again. The original URL remains the address of record. It says: for now, look here.

That semantic difference drives everything else: how aggressively responses get cached, how search engines consolidate signals, and whether you can re-point the same short link later without anyone noticing.

Two neighbors on the same shelf:

- **307 Temporary Redirect** is a 302 that strictly preserves the request method and body (no rewriting POST into GET on the follow-up).
- **308 Permanent Redirect** is the strict version of 301.

| Code | Permanence | Method preserved | Caching expectation | Typical use |
|---|---|---|---|---|
| 301 | Permanent | May change to GET | Long-lived | Site moves, URL consolidation |
| 302 | Temporary | May change to GET | Short-lived or revalidated | Short links, A/B tests, re-pointable hops |
| 307 | Temporary | Yes | Short-lived or revalidated | Temporary moves of form endpoints |
| 308 | Permanent | Yes | Long-lived | Permanent moves that must preserve methods |

## How Google treats 301s and 302s

Google's [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects) documentation is refreshingly direct. Googlebot follows both kinds of server-side redirect. The indexing consequence differs:

- **Permanent redirects (301, 308)** tell Google to show the redirect target in search results and treat it as the canonical URL. Use them when you are sure the move will not be reverted.
- **Temporary redirects (302, 303, 307)** are not a canonicalization signal. The original URL may stay in the index, because the redirect is a statement that the move might end.

A few consequences worth internalizing before you pick a code.

**Signals are not "lost" in a 302; they are not committed.** The old SEO lore that a 302 passes "zero link equity" is outdated. Google's spokespeople have long said that when a temporary redirect stays in place for a long time, its systems may treat it like a permanent one. The safe summary: 301 commits to the move immediately, 302 leaves the decision open.

**Canonicalization follows the commit.** With a 301, the target is the canonical. With a 302, the source remains the canonical, which is exactly what you want when the source is a short link that must keep working as a short link.

**Request semantics matter less than they used to, but not zero.** Legacy clients historically rewrote POST to GET when following a 301 or 302; 307 and 308 exist to forbid that. For a simple GET hop from a short link, this rarely bites, but it is why the strict codes exist.

## Why short links should use 302

A short link is not a document you want ranked; it is a routing address you want to keep. That makes 302 the natural fit, for three reasons.

**1. The destination keeps its own SEO.** When `agni.cc.cd/launch` 302s to your landing page, search engines treat the landing page as the canonical resource. Nothing about the hop tries to transfer or dilute that. You are not asking Google to consolidate `agni.cc.cd/launch` into your domain; you are just telling browsers where to go.

**2. Re-pointing stays possible.** A short link is valuable precisely because the mapping behind it can change: a campaign page retires, a doc URL moves, a PDF in circulation needs a new destination. A 302 keeps the redirect temporary at the protocol level, so caches and clients stay honest about the fact that the answer may change tomorrow. A 301 invites everyone downstream to remember the old mapping forever.

**3. Caches behave.** Permanent redirects get stored and reused aggressively. That is a feature when your domain genuinely moved and a liability when a shared link needs to respond to a change you have not made yet. Temporary redirects short-circuit that failure mode.

[Agni](https://agni.cc.cd/) answers short links with a 302 resolved by a KV-first lookup at the edge. The trade-off is deliberate: slightly less cache stickiness on the hop, in exchange for a link that stays live and re-pointable. The full request path is covered in [how url shorteners work](https://agni.cc.cd/blog/how-url-shorteners-work), and the latency side of edge resolution in our post on [redirect speed](https://agni.cc.cd/blog/redirect-speed). If you are evaluating shorteners on this distinction, the [TinyURL comparison](https://agni.cc.cd/compare/agni-vs-tinyurl) and the broader [alternatives](https://agni.cc.cd/alternatives) page show where the tools differ, and the free tier is spelled out on the [pricing page](https://agni.cc.cd/pricing).

## When 301 is the right call

Do not read this as "302 is always better." For your own site's URL moves, 301 is exactly right, and choosing 302 there is a classic mistake:

- **Domain migrations.** Old pages to new pages: 301 (or 308 if you need method preservation).
- **URL consolidation.** Duplicates, trailing-slash variants, parameter cleanup: 301 to the canonical version.
- **Merged content.** Two articles into one: 301 the retired URL to the survivor.

The rule of thumb: use 301 when the old URL has no future and you want every signal attached to the new one. Use 302 when the old address is still the address of record and the redirect is a current preference.

Short links fall squarely in the second category. The short URL is the asset; the destination is a configuration detail.

## What actually affects SEO when you share short links

If 301 vs 302 barely matters for a short hop, what does? These are the levers that move rankings and click-through when your traffic path runs through a shortener.

- **The destination page.** Rankings attach to content, speed, mobile usability, and links pointing at the destination. The hop does none of that work for you.
- **Where the short link appears.** A short link in a post, a doc, or a message is just a link. Anchor text still matters when you control it; a descriptive slug (`/launch-q4`) gives humans a hint even when the anchor is "here."
- **No cloaking, no masking.** Serving someone else's content under your URL in an iframe, or redirecting users and search engines to different places, is the kind of manipulation Google's spam policies target. A clean 302 for everyone is not.
- **No redirect chains.** Short link to shortener to shortener to destination adds latency and confusion for every client in the path. One hop, one destination.
- **Longevity of the short URL.** Short links get embedded in emails, PDFs, and print. Keeping one stable — same slug, live mapping — is worth more than a fresh random string every quarter. This is the practical core of avoiding link rot in everything you distribute.

If you care about whether a branded-looking back-half changes any of this, the short answer is that readable slugs help people, not crawlers; [branded short links and SEO](https://agni.cc.cd/blog/branded-short-links-seo) unpacks that claim properly.

## Common mistakes to avoid

- **302 for a permanent site move.** If your domain changed and you 302 the old pages, you are asking search engines to keep both addresses in play indefinitely. Use 301.
- **301 for a short link.** If the mapping behind a short link needs to change and you advertised a permanent redirect, some clients will never ask again. Use 302.
- **Redirect chains and double-shortening.** Each extra hop is another failure point and more latency.
- **Chasing rankings for the short URL itself.** `agni.cc.cd/launch` is not going to outrank your landing page for your brand term, and it should not. Optimize the destination.
- **Ignoring the protocol data your shortener gives you.** A modern audience arrives over https with current TLS; if your stats show legacy clients or plain http, that is a real signal about your audience, not an SEO afterthought.

## FAQ

### Do 302 redirects pass link equity?

They are not a blocker in the way old SEO folklore claimed. Google's documentation treats temporary redirects as a non-canonicalization signal and keeps the source URL in play, while its engineers have said a 302 left in place long enough may be handled like a 301. For a short link, this is the correct behavior: the destination keeps its own signals.

### Is a 301 or 302 better for short links?

302. A short link is a re-pointable pointer, not a permanent move, and a 302 states exactly that. Use 301 only when you are retiring a URL forever and want search engines to consolidate everything to the new one.

### Will using a URL shortener hurt my rankings?

No, if the redirect is a clean server-side hop to a real destination. Rankings attach to the destination page's content and reputation. The things that do hurt are cloaking, masking content, redirect chains, and destinations that are thin or slow.

### Does Google index short URLs?

It can, but a short URL's job is to redirect, not to rank. With a temporary redirect, the short URL may remain in the index as the address of record while Google shows the destination for ordinary queries. If you want the destination to be canonical — and you do — a 302 hop keeps that relationship clean.

### What redirect does agni use for short links?

Agni answers with a 302, resolved through a KV-first lookup at the edge and served from a global CDN. That keeps every short link fast and leaves the mapping free to change later without breaking URLs already in circulation.

Test a 302 hop for yourself and start sharing links you can still re-point at [agni.cc.cd](https://agni.cc.cd/#shorten).
