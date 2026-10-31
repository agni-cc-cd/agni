# agni

Short links you can measure. A fast, free link shortener for **agni.cc.cd** with complete
click analytics, a full dashboard, and a blog CMS. Built with [vinext](https://vinext.dev)
and deployed to **Cloudflare Workers**.

- **Edge redirects** — KV-first lookups, sub-millisecond resolution worldwide
- **D1** — source of truth: users, links, raw click events, daily rollups, posts
- **Analytics Engine** — raw click stream for large-scale analysis
- **Complete tracking** — IP, country, city, referrer, device, browser, OS, protocol, TLS, timestamps
- **Multi-tenant auth** — email/password, phone, anonymous guest, Google, Apple, GitHub, Facebook (Firebase)
- **Typed config** — `cloudflare.config.ts` via the [`cf` CLI](https://developers.cloudflare.com/cf/) (not wrangler)

## Quick start

```bash
npm install
npm run dev          # local dev server
npm run build        # production build
npm run test         # vitest
npm run typecheck    # cf workers types + tsc
npm run deploy       # deploy to Cloudflare Workers (use: npx cf deploy --secrets-file secrets.env)
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Landing page with the shorten box |
| `/login` | Multi-provider sign-in (email/password, phone, social, guest) |
| `/dashboard` | Auth-guarded links dashboard with overview analytics |
| `/dashboard/links/:id` | Per-link analytics: totals, trends, breakdowns, raw activity |
| `/dashboard/blog` | Admin CMS for blog posts (markdown) |
| `/blog`, `/blog/:slug` | Public blog |
| `/pricing`, `/about`, `/terms`, `/privacy` | Supporting pages |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/:slug` | 302 redirect; records a full click event |
| `GET` | `/api/links` | list your links + overview stats |
| `POST` | `/api/links` | create link `{ url, slug?, title? }` |
| `GET` | `/api/links/:id` | one link (owner only) |
| `DELETE` | `/api/links/:id` | delete link + its analytics (owner only) |
| `GET` | `/api/links/:id/stats?days=30` | full analytics for a link |
| `GET` | `/api/me` | current user profile (syncs the users table) |
| `GET` | `/api/posts` | published blog posts |
| `POST` | `/api/posts` | create/update post (admin) |
| `DELETE` | `/api/posts/:slug` | delete post (admin) |
| `GET` | `/api/health` | health probe |

Auth: `Authorization: Bearer <firebase-id-token>` for user calls, `Bearer <ADMIN_TOKEN>` for
ops/admin calls.

## Architecture

```
request → Worker (vinext) → KV cache (hot) → D1 (source of truth)
                          ↘ waitUntil → click_events + rollups + Analytics Engine
```

See [AGENTS.md](AGENTS.md) for agent-facing project guidance and the full command table.
