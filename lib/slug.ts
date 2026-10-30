const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Slugs that would shadow app routes and can never be claimed. */
export const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "admin",
  "login",
  "about",
  "health",
  "robots.txt",
  "sitemap.xml",
  "favicon.ico",
  "_next",
  "static",
  "public",
]);

export const SLUG_PATTERN = /^[a-zA-Z0-9_-]{1,64}$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug.toLowerCase());
}

/** Cryptographically random base62 slug, 7 chars (~3.5e12 space). */
export function generateSlug(length = 7): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** Validate a redirect target: http(s) only, no javascript: or data: tricks. */
export function normalizeTargetUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.toString();
}
