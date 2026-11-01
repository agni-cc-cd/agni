/**
 * Milestone analytics emails. When an account's total clicks cross one of
 * 1, 10, 50, 100, 200, 500, 1000 (then the 1-2-5 decade ladder forever),
 * the owner gets an analytics snapshot at the email they signed in with.
 * Each milestone fires exactly once per account (email_milestones dedupe);
 * a failed send releases the row so a later click retries it.
 */

// Exactly the user's ladder, then 1-2-5 decades "and so on".
export const MILESTONE_LADDER: number[] = (() => {
  const head = [1, 10, 50];
  const tail: number[] = [];
  for (let decade = 100; decade <= 1_000_000_000; decade *= 10) {
    tail.push(decade, decade * 2, decade * 5);
  }
  return [...head, ...tail];
})();

/** The milestones an account at `total` clicks has reached. */
export function crossedMilestones(total: number): number[] {
  return MILESTONE_LADDER.filter((m) => m <= total);
}

/** The next milestone after `total`, or null at the end of the ladder. */
export function nextMilestone(total: number): number | null {
  return MILESTONE_LADDER.find((m) => m > total) ?? null;
}

export interface MilestoneEmail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/** Compose the analytics snapshot email for one reached milestone. */
export function composeMilestoneEmail(input: {
  to: string;
  name?: string | null;
  milestone: number;
  totalClicks: number;
  totalLinks: number;
  topLinks: Array<{ slug: string; clicks: number }>;
  topCountries: Array<{ label: string; count: number }>;
  next: number | null;
}): MilestoneEmail {
  const { to, name, milestone, totalClicks, totalLinks, topLinks, topCountries, next } = input;
  const who = name ? ` ${name}` : "";
  const subject = `Your links just reached ${milestone.toLocaleString()} clicks`;

  const topLinksLines = topLinks.length
    ? topLinks.map((l) => `  ${l.slug} — ${l.clicks.toLocaleString()} clicks`).join("\n")
    : "  (none yet)";
  const topCountriesLines = topCountries.length
    ? topCountries.map((c) => `  ${c.label} — ${c.count.toLocaleString()}`).join("\n")
    : "  (no location data yet)";

  const text = [
    `Hi${who},`,
    ``,
    `Your agni links passed ${milestone.toLocaleString()} total clicks. Here is the analytics snapshot:`,
    ``,
    `Total clicks: ${totalClicks.toLocaleString()}`,
    `Short links: ${totalLinks.toLocaleString()}`,
    ``,
    `Top links:`,
    topLinksLines,
    ``,
    `Top countries:`,
    topCountriesLines,
    ``,
    next
      ? `Next milestone: ${next.toLocaleString()} clicks. Keep sharing.`
      : `You are at the top of the milestone ladder. Keep sharing.`,
    ``,
    `Full dashboard: https://agni.cc.cd/dashboard`,
    ``,
    `— agni`,
  ].join("\n");

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const linkRows = topLinks.length
    ? topLinks
        .map(
          (l) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#111"><a href="https://agni.cc.cd/dashboard/links?slug=${encodeURIComponent(l.slug)}" style="color:#111">${esc(l.slug)}</a></td><td style="padding:4px 0;color:#555" align="right">${l.clicks.toLocaleString()}</td></tr>`,
        )
        .join("")
    : `<tr><td style="padding:4px 0;color:#555">(none yet)</td></tr>`;
  const countryRows = topCountries.length
    ? topCountries
        .map(
          (c) =>
            `<tr><td style="padding:4px 12px 4px 0;color:#111">${esc(c.label)}</td><td style="padding:4px 0;color:#555" align="right">${c.count.toLocaleString()}</td></tr>`,
        )
        .join("")
    : `<tr><td style="padding:4px 0;color:#555">(no location data yet)</td></tr>`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f6f6f6;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace">
  <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:28px">
    <p style="margin:0 0 16px;font-size:14px;color:#111">Hi${esc(who)},</p>
    <h1 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#111">Your links just reached ${milestone.toLocaleString()} clicks</h1>
    <p style="margin:0 0 20px;font-size:13px;line-height:1.6;color:#555">Here is the analytics snapshot for your agni account.</p>
    <table style="border-collapse:collapse;font-size:13px;color:#111;margin:0 0 20px">
      <tr><td style="padding:4px 12px 4px 0;color:#555">Total clicks</td><td style="padding:4px 0;font-weight:600" align="right">${totalClicks.toLocaleString()}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#555">Short links</td><td style="padding:4px 0;font-weight:600" align="right">${totalLinks.toLocaleString()}</td></tr>
    </table>
    <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#888">Top links</p>
    <table style="border-collapse:collapse;font-size:13px;margin:0 0 20px">${linkRows}</table>
    <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#888">Top countries</p>
    <table style="border-collapse:collapse;font-size:13px;margin:0 0 24px">${countryRows}</table>
    <a href="https://agni.cc.cd/dashboard" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:13px;padding:10px 18px;border-radius:6px">Open your dashboard</a>
    <p style="margin:20px 0 0;font-size:12px;color:#888">${next ? `Next milestone: ${next.toLocaleString()} clicks.` : "You are at the top of the milestone ladder."} — agni</p>
  </div>
</body>
</html>`;

  return { to, subject, text, html };
}
