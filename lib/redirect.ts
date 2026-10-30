/**
 * Hot-path redirect lookup: KV first (sub-ms edge reads), D1 as source of
 * truth. Negative results are cached briefly to absorb slug scanning.
 */
const POSITIVE_TTL = 3600; // 1h — invalidated explicitly on write/delete
const NEGATIVE_TTL = 60;

export interface CachedRedirect {
  id: string;
  target: string;
  slug: string;
}

export async function resolveRedirect(
  kv: KVNamespace,
  db: D1Database,
  slug: string,
): Promise<CachedRedirect | null> {
  const key = `redir:${slug}`;
  const cached = await kv.get<CachedRedirect>(key, "json");
  if (cached && cached.target === "") return null;
  // Entries without an id are stale (pre-id cache); fall through to D1 to re-prime.
  if (cached?.id && cached.target) return cached;

  const { getLinkBySlug } = await import("./db");
  const link = await getLinkBySlug(db, slug);
  if (!link) {
    await kv.put(key, JSON.stringify({ id: "", target: "", slug }), {
      expirationTtl: NEGATIVE_TTL,
    });
    return null;
  }
  const value: CachedRedirect = { id: link.id, target: link.target_url, slug };
  await kv.put(key, JSON.stringify(value), { expirationTtl: POSITIVE_TTL });
  return value;
}

export async function primeRedirectCache(
  kv: KVNamespace,
  id: string,
  slug: string,
  target: string,
): Promise<void> {
  await kv.put(`redir:${slug}`, JSON.stringify({ id, target, slug }), {
    expirationTtl: POSITIVE_TTL,
  });
}

export async function invalidateRedirectCache(kv: KVNamespace, slug: string): Promise<void> {
  await kv.delete(`redir:${slug}`);
}
