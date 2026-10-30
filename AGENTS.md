# AGENTS.md — guidance for coding agents working on this repo

## Project

`agni` is a fast link shortener (agni.cc.cd) built with **vinext** (Next.js App Router
conventions running on Vite) and deployed to **Cloudflare Workers**. D1 is the source of
truth, KV is the hot redirect cache, and Workers Analytics Engine records raw click events.

## When working with Cloudflare, use the `cf` CLI (NOT wrangler)

This project is configured with `cloudflare.config.ts` (typed TypeScript config), not
`wrangler.toml`/`wrangler.jsonc`. Always prefer `cf` commands:

| Task | Command |
| --- | --- |
| Authenticate | `cf auth login` (or `CLOUDFLARE_API_TOKEN`) |
| Local dev | `npm run dev` (vinext dev server) |
| Build | `npm run build` |
| Deploy | `npx cf deploy --secrets-file secrets.env` |
| Worker types | `cf workers types` (before standalone `tsc`) |
| D1 queries | `cf d1 query <database-id> --sql="SELECT 1"` (see `cloudflare.config.ts` for the id) |
| KV | `cf kv namespaces create --title <name>` |
| Secrets | `cf workers secrets update <NAME> --worker agni` |
| DNS records | `cf dns records ...` |
| Find a command | `cf cli search "<what you want to do>"` (keep queries anonymous) |
| Docs search | `cf docs search "<topic>"` |

Do not introduce `wrangler` config files or wrangler-only workflows.

## Layout

```
app/                  # vinext App Router (pages, layout, route handlers)
  api/links/          # REST API: list/create/delete links, stats
  api/health/         # health probe
  [slug]/route.ts     # THE redirect hot path (KV-first, 302)
  components/         # client components (link form, dashboard)
lib/                  # typed domain logic (db, redirect cache, analytics, slug, auth)
db/schema.sql         # D1 schema (idempotent; also ensured at runtime)
cloudflare.config.ts  # typed Cloudflare config: bindings, triggers, env
```

## Architecture rules

- **Redirect hot path must stay fast**: resolve from `LINKS_KV` first, fall back to `DB`
  (D1), then repopulate KV. Click recording (`recordClick` → `click_events` + rollups,
  Analytics Engine) goes through `waitUntil(...)` — never block the 302.
- **D1 is the source of truth** for users, links, raw click events, daily rollups and
  posts. KV values are caches (`redir:<slug>`) with TTLs; on write/delete,
  prime/invalidate them.
- **Only http(s) redirect targets** (`normalizeTargetUrl`). Slugs must pass
  `isValidSlug` and never shadow app routes (see `RESERVED_SLUGS`).
- **Multi-tenant auth**: the product is public — anyone can sign in (Firebase: Google,
  GitHub, Microsoft, X, Facebook, Yahoo, email link, guest) and owns the links they
  create (`links.created_by = uid`). APIs verify Firebase ID tokens server-side
  (Google JWKS via `jose`). The `ADMIN_TOKEN` secret is an ops principal ("open") for
  scripts/CI and the blog CMS. Ownership checks use `ownsLink()`.
- Bindings are typed in `cloudflare.config.ts` and consumed via `lib/env.ts`
  (`getEnv()`). Never hand-roll `process.env` for bindings.

## Commands

```bash
npm install        # install deps (npm; packageManager pinned in package.json)
npm run dev        # local dev
npm run build      # production build
npm run typecheck  # cf workers types + tsc
npm run deploy     # deploy to Cloudflare Workers
```

## Conventions

- TypeScript strict, ESM (`"type": "module"`), Tailwind for styling.
- **Git identity**: the sole author and contributor of this repository is the repo owner.
  Never add `Co-Authored-By`, `Generated-with`, or any other attribution trailers to
  commits or PR descriptions.
- **No emoji anywhere** — not in the UI, docs, comments, or commit messages. Use the
  inline SVG icons in `app/components/icons.tsx` for visual marks.
- The UI is monochrome (black/white/gray, light + dark themes via `data-theme`); color
  is reserved for status (ok/danger) and brand marks where recognition needs it.
- Conventional Commits for all commit messages (enforced by CI).
- PRs target `main`; CI must be green before merge. Keep PRs small and focused.
- Never commit secrets. `ADMIN_TOKEN` lives only in Cloudflare secrets.
