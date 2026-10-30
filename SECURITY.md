# Security policy

## Reporting

Report vulnerabilities privately via [GitHub Security Advisories](https://github.com/agni-cc-cd/agni/security/advisories/new)
for this repository. Do not open public issues for security reports.

## Model

- Redirect targets are restricted to `http(s)` URLs (`lib/slug.ts`) — no `javascript:`/`data:`.
- Slugs cannot shadow app routes (`RESERVED_SLUGS`).
- Mutations (`POST`/`DELETE /api/links`) require `Authorization: Bearer <ADMIN_TOKEN>`
  when the secret is set. Set it in production: `cf secret put ADMIN_TOKEN`.
- No secrets in the repo. Cloudflare secrets store `ADMIN_TOKEN` only.
