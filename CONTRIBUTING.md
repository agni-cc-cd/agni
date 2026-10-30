# Contributing to agni

## Workflow

1. Branch from `main` (`feat/…`, `fix/…`, `chore/…`).
2. Keep PRs small and focused; fill in the PR template.
3. CI (typecheck + tests + commit lint) must be green before review.
4. One approving review from the owning team (see `CODEOWNERS`) is required.
5. Squash-merge into `main`; release-please handles versioning and changelogs.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add per-link qr code endpoint
fix: invalidate kv cache on link delete
chore: bump vinext to 1.4
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`.
Breaking changes: add `!` after the type (`feat!: …`) and describe in the footer.

## Local development

```bash
npm install
npm run dev        # vinext dev server
npm test           # unit tests
npm run typecheck  # generated worker types + tsc
```

## Data & migrations

D1 schema lives in `db/schema.sql` (idempotent). Any schema change must update that file
AND stay compatible with `ensureSchema()` in `lib/db.ts`. Never delete columns without a
migration plan; additive changes only on `main`.
