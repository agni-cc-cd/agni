---
title: "How URL Shorteners Work: From Click to Redirect in Milliseconds"
slug: "how-url-shorteners-work"
excerpt: "How do url shorteners work? A slug maps to a destination, the lookup runs at the edge, and a 302 sends the browser on. The full request path explained."
tags: ["how it works", "redirects", "infrastructure", "short links"]
keywords: "how do url shorteners work; how url shorteners work; url shortener redirect; short link lookup"
published_at: "2026-10-01T09:30:00.000Z"
author_name: "Amit Anand"
---

How do url shorteners work, mechanically? Almost everyone uses them; almost nobody has traced a click from the moment it arrives at the short domain to the moment the destination page starts rendering. The whole system is a lookup plus a redirect, and the engineering question is how to make that lookup so fast and reliable that the hop disappears. This post walks the request path end to end, explains what gets recorded along the way, and shows why the design is more subtle than "a database row and a 302."

## The core idea: a mapping and a key

A short link is a record: a **slug** (the back-half, like `launch-q4`) maps to a **destination URL**. When a request arrives for that slug, the service looks up the destination and tells the browser to go there. That is the entire concept.

Everything else in a shortener exists to serve that record fast, keep it available, and record what happened:

- The **short URL** is a key into a lookup table. Custom back-halves let you choose the key; random strings are generated when you do not.
- The **redirect response** is a 302 (Found), a temporary redirect, with the destination in the `Location` header.
- The **analytics record** captures the click: who asked, from where, with what client, and when.

The division of labor in agni follows the shapes of the modern edge stack it is built on — Cloudflare Workers, KV, D1, and Analytics Engine. Workers run the redirect logic at the edge. KV serves the hot lookup path first. D1 holds the durable account and link data. Analytics Engine takes in click events. The [Cloudflare KV documentation](https://developers.cloudflare.com/kv/) describes the storage layer's read characteristics if you want the substrate details.

## The request journey, step by step

Trace one click on `agni.cc.cd/launch-q4`:

| Step | What happens | Where it runs |
|---|---|---|
| 1. DNS and routing | The browser resolves the short domain; anycast routes it to a nearby datacenter | Global CDN edge |
| 2. Request arrives | A Worker receives the request for `/launch-q4` | Edge, near the visitor |
| 3. KV-first lookup | The slug is looked up in KV; on a hit, the destination is known immediately | Edge, same datacenter |
| 4. Fallback on miss | If KV does not have the mapping, the system falls back to the durable store and can repopulate the fast path | D1, then back to edge |
| 5. Redirect issued | The service responds 302 with `Location: https://example.com/launch` | Edge |
| 6. Browser follows | The browser requests the destination directly from the destination's own servers | Destination origin |
| 7. Click recorded | The request's metadata (IP, headers, timing) becomes a click event | Analytics Engine |
| 8. Dashboard updates | The link's counts and activity feed reflect the click, live | Your agni dashboard |

Two properties of that path deserve emphasis.

**The lookup runs where the visitor is.** There is no round trip to a central server in one region before the redirect can be issued. The KV-first design means the common case — a slug that has been clicked before — resolves at the edge datacenter that already received the request. [Cloudflare Workers](https://developers.cloudflare.com/workers/) docs explain the execution model; the practical consequence is that geography stops being a factor in the hop.

**The destination is fetched by the client, not the proxy.** A 302 hands the browser the destination URL and lets it go there directly. The shortener does not proxy the page content, which keeps the hop cheap and keeps the destination's own servers responsible for the page.

## What gets recorded on the way past

The redirect is the fast path; the analytics are the reason most people tolerate an extra hop. Each click carries metadata that a bare link share cannot give you:

- **Where.** IP address, country, city, and the datacenter (colo) that served the request, plus ASN (the network operator the visitor came through).
- **How.** Protocol (http or https) and TLS version.
- **With what.** Device, browser, and operating system, parsed from the user agent.
- **From where.** Referrer, when the client sends one.
- **When.** Timestamps, rolled up into daily counts and kept as a raw activity feed for the moments you need individual events.

Date-range filters sit on top of all of it, so "how did the launch week compare to the week after" is a query, not a manual diff. The per-link pages show this data for one link; the overview dashboard aggregates counts across everything you have shared, with live updates and no refresh. If you want the analytics philosophy rather than the plumbing, the longer treatment is in our link analytics explainer on the [blog](https://agni.cc.cd/blog).

## Why 302, and why "temporary" is a feature

The redirect status matters, and for short links the right answer is a 302, not a 301. A temporary redirect states honestly what is true: this mapping may change. That keeps clients from permanently memorizing the old destination, which matters when a short link gets re-pointed (a campaign page retires, a docs URL moves). It also leaves the destination page as the canonical resource, rather than asking search engines to consolidate anything into the short URL. The full comparison lives in [301 vs 302 for short links](https://agni.cc.cd/blog/301-vs-302-redirect-seo).

A note on caching: browsers and intermediaries treat temporary redirects conservatively. That is the correct trade for re-pointable links. The speed problem is solved by the lookup being fast, not by letting stale mappings live on in client caches.

## Why the design is fast

Latency in a redirect hop comes from four places: DNS, network distance to the service, the lookup itself, and then the destination's own load time. A shortener can only influence the first three.

- **DNS** for a domain on a global CDN resolves to a nearby edge; this cost is mostly a one-time tax per session.
- **Network distance** is handled by anycast: the visitor's request lands in a datacenter close to them, which is why the colo field in your analytics is meaningful (it is the point of presence that served the click).
- **The lookup** is the part the architecture controls. KV-first resolution keeps the hot path in edge-local storage instead of a cross-continent database query.
- **The destination** is out of the shortener's hands entirely. The hop can be effectively instant and the page can still take five seconds.

That last point is why redirect speed is a small, solvable problem and page speed is a large, ongoing one. But the small problem is worth solving: the hop is on every single visit to every link you share, and on mobile networks its cost is felt most. The full argument is in [why redirect speed matters](https://agni.cc.cd/blog/redirect-speed).

## What happens when you create a link

The write path is the mirror of the read path. You create a link through the [dashboard](https://agni.cc.cd/) or the REST API, passing a destination URL and optionally a custom back-half. The service validates the slug, stores the mapping in the durable layer, and makes it available to the fast lookup path. After that, creation and redirection are decoupled: your visitors' clicks do not wait on anything you do.

The API side (create, list, delete, and read stats) is covered in our [url shortener api](https://agni.cc.cd/blog/url-shortener-api) guide. The one operational habit worth stealing from that post: treat slugs as stable, meaningful keys. The lookup system does not care whether a slug is `x7k2p9` or `launch-q4`, but your analytics and your future self do.

## What a shortener cannot do

An honest map of the boundaries:

- **It cannot fix a dead destination.** If the target page is gone, the redirect delivers readers faithfully to whatever is there now.
- **It cannot make a slow page fast.** The hop and the page are separate budgets.
- **It cannot see what happens after arrival.** Click analytics tell you who arrived, not what they did on the destination page. For that, you need analytics on the destination itself.
- **It is not a security filter.** A short link is a redirect, not a content scanner. The value of a readable slug is that a human can judge the destination's intent before clicking.

Within those bounds, the machinery is remarkably effective: one edge-local lookup, one 302, one event record, and a link that keeps working in inboxes and PDFs for years. That combination is why short links became infrastructure rather than a novelty, a history worth knowing if you are new to the category. It is all free today on the [pricing page](https://agni.cc.cd/pricing), and the comparison to mainstream shorteners is laid out in [agni vs Bitly](https://agni.cc.cd/compare/agni-vs-bitly).

## FAQ

### How do url shorteners work in one sentence?

They store a mapping from a short slug to a destination URL, and when someone visits the short link, an edge lookup finds the destination and the server responds with a redirect (302) that sends the browser there.

### What happens when I click a short link?

The request reaches a datacenter near you, the slug is looked up (KV-first on agni), and a 302 response points your browser at the destination, which your browser then loads directly. The click is recorded with its metadata and shows up in the link's analytics.

### Which redirect do URL shorteners use?

Most use a 302 Found, a temporary redirect. Temporary is correct because the mapping behind a short link may be re-pointed later, and because it leaves the destination page as the canonical resource.

### Are short links slower than normal links?

A well-built shortener adds a hop that resolves at the edge, which is negligible next to loading the destination page. Slow shorteners are slow because their lookup goes to a distant database or their infrastructure is concentrated in one region.

### What data does a URL shortener see?

Every request exposes metadata: IP address (from which country, city, and ASN are derived), protocol and TLS version, referrer when present, and a user agent that can be parsed into device, browser, and OS, plus the request timestamp. On agni this data belongs to the link owner.

Trace one of your own links through the hop at [agni.cc.cd](https://agni.cc.cd/#shorten).
