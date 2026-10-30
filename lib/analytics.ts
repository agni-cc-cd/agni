/**
 * Click analytics: full request capture. Every redirect records the request
 * details the edge can see into D1 click_events (queryable) and Workers
 * Analytics Engine (raw stream for large-scale analysis). Fire-and-forget:
 * analytics must never block or break the redirect.
 */
export interface ClickEvent {
  linkId: string;
  slug: string;
  ts: number;
  ip?: string | null;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  colo?: string | null;
  asn?: number | null;
  method?: string | null;
  protocol?: string | null;
  tls?: string | null;
  referrer?: string | null;
  ua?: string | null;
  lang?: string | null;
  browser?: string | null;
  os?: string | null;
  device?: string | null;
  status?: number | null;
}

interface CfProps {
  colo?: string;
  country?: string;
  city?: string;
  region?: string;
  asn?: number;
  httpProtocol?: string;
  tlsVersion?: string;
}

export function parseUserAgent(ua: string): Pick<ClickEvent, "browser" | "os" | "device"> {
  let browser = "Other";
  if (/\bEdg[eA]?\//.test(ua)) browser = "Edge";
  else if (/\bOPR\/|\bOpera\//.test(ua)) browser = "Opera";
  else if (/\bFirefox\//.test(ua)) browser = "Firefox";
  else if (/\bChrome\//.test(ua)) browser = "Chrome";
  else if (/\bSafari\//.test(ua)) browser = "Safari";
  else if (/\bcurl\/|\bWget\/|\bpython-requests\/|\bGo-http-client\//i.test(ua)) browser = "Bot/CLI";

  let os = "Other";
  if (/\bWindows NT\b/.test(ua)) os = "Windows";
  else if (/\bAndroid\b/.test(ua)) os = "Android";
  else if (/\biPhone\b|\biPad\b|\biPod\b/.test(ua)) os = "iOS";
  else if (/\bMac OS X\b|\bMacintosh\b/.test(ua)) os = "macOS";
  else if (/\bCrOS\b/.test(ua)) os = "ChromeOS";
  else if (/\bLinux\b/.test(ua)) os = "Linux";

  let device = "desktop";
  if (/\biPad\b|\bTablet\b/.test(ua)) device = "tablet";
  else if (/\bMobi\b|\bMobile\b|\biPhone\b|\bAndroid\b/.test(ua)) device = "mobile";

  return { browser, os, device };
}

/** Build a full click event from the incoming redirect request. */
export function requestClickEvent(
  request: Request,
  link: { id: string; slug: string },
): ClickEvent {
  const headers = request.headers;
  const ua = headers.get("user-agent") ?? "";
  const cf = (request as Request & { cf?: CfProps }).cf;
  const parsed = parseUserAgent(ua);
  return {
    linkId: link.id,
    slug: link.slug,
    ts: Math.floor(Date.now() / 1000),
    ip: headers.get("cf-connecting-ip") ?? null,
    country: headers.get("cf-ipcountry") ?? cf?.country ?? null,
    city: headers.get("cf-ipcity") ?? cf?.city ?? null,
    region: headers.get("cf-ipregion") ?? cf?.region ?? null,
    colo: cf?.colo ?? null,
    asn: cf?.asn ?? null,
    method: request.method,
    protocol: cf?.httpProtocol ?? null,
    tls: cf?.tlsVersion ?? null,
    referrer: headers.get("referer") ?? null,
    ua: ua || null,
    lang: headers.get("accept-language")?.split(",")[0] ?? null,
    browser: parsed.browser,
    os: parsed.os,
    device: parsed.device,
    status: 302,
  };
}

/** Write the raw event to Analytics Engine (optional binding). Never throws. */
export function trackClick(
  analytics: AnalyticsEngineDataset | undefined,
  event: ClickEvent,
): void {
  if (!analytics) return;
  try {
    analytics.writeDataPoint({
      blobs: [
        event.slug,
        event.country ?? "",
        event.city ?? "",
        event.referrer ?? "",
        event.browser ?? "",
        event.os ?? "",
        event.device ?? "",
        event.ua ?? "",
      ],
      doubles: [event.ts, event.asn ?? 0],
      indexes: [event.slug],
    });
  } catch {
    // Analytics must never break redirects.
  }
}
