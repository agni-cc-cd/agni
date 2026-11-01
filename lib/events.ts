// Product event tracking for GA4 (G-PW2B5FM3SG). The beacons are loaded once
// in app/layout.tsx; this helper only queues events (no-op before gtag loads).

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function trackSignUp(method: string) {
  trackEvent("sign_up", { method });
}

export function trackLogin(method: string) {
  trackEvent("login", { method });
}

export function trackShortLinkCreated(slug: string) {
  trackEvent("short_link_created", { slug });
}
