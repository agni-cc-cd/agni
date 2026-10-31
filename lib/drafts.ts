"use client";

/**
 * Return-to flow helpers: everything the user typed survives the trip to the
 * sign-in page and back, and every page that needs auth carries its full
 * location (path + query + hash) in `?next=`.
 *
 * Drafts live in sessionStorage (per tab, per user) — the right lifetime for
 * "I was mid-form when I got asked to sign in".
 */

const DRAFT_PREFIX = "agni:draft:";

export function saveDraft(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(DRAFT_PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode quota) — drafts are best-effort.
  }
}

export function loadDraft<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearDraft(key: string): void {
  try {
    sessionStorage.removeItem(DRAFT_PREFIX + key);
  } catch {
    // Best-effort.
  }
}

/** Current full location as a `next` value (client-only). */
export function currentNext(): string {
  return window.location.pathname + window.location.search + window.location.hash;
}

/** `/login?next=...` for the given destination (defaults to where we are). */
export function loginHref(next?: string): string {
  const target = next ?? (typeof window !== "undefined" ? currentNext() : "/");
  return `/login?next=${encodeURIComponent(target)}`;
}

/**
 * Only same-origin relative paths are allowed as return targets — blocks
 * `//evil.com` and absolute URLs (open-redirect protection).
 */
export function safeNext(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}
