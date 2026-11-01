/**
 * Milestone email orchestration: called from the redirect waitUntil path
 * after every recorded click. Exactly-once per account milestone, one email
 * per burst (the highest milestone reached), retried on send failure.
 */
import { claimMilestones, getMilestoneSnapshot, releaseMilestones } from "./db";
import { canSendEmail, sendEmail } from "./email";
import type { AgniEnv } from "./env";
import { composeMilestoneEmail, nextMilestone } from "./milestones";

const FROM = "notifications@agni.cc.cd";

/** Never throws; the redirect must not care whether mail worked. */
export async function runMilestoneCheck(env: AgniEnv, linkId: string): Promise<void> {
  try {
    const { DB } = env;
    if (!canSendEmail(env)) return;

    const link = await DB.prepare(`SELECT created_by FROM links WHERE id = ?`)
      .bind(linkId)
      .first<{ created_by: string }>();
    if (!link) return;

    const totals = await DB.prepare(
      `SELECT COALESCE(SUM(clicks), 0) AS total FROM links WHERE created_by = ?`,
    )
      .bind(link.created_by)
      .first<{ total: number }>();
    const total = Number(totals?.total ?? 0);

    const claimed = await claimMilestones(DB, link.created_by, total);
    if (claimed.length === 0) return;

    const user = await DB.prepare(`SELECT email, name FROM users WHERE id = ?`)
      .bind(link.created_by)
      .first<{ email: string | null; name: string | null }>();
    if (!user?.email) {
      // Guest or phone account with no address on file. Keep the claim so
      // the check stays quiet instead of re-attempting on every later click.
      return;
    }

    const highest = Math.max(...claimed);
    const snapshot = await getMilestoneSnapshot(DB, link.created_by);
    const mail = composeMilestoneEmail({
      to: user.email,
      name: user.name,
      milestone: highest,
      totalClicks: snapshot.totalClicks,
      totalLinks: snapshot.totalLinks,
      topLinks: snapshot.topLinks,
      topCountries: snapshot.topCountries,
      next: nextMilestone(snapshot.totalClicks),
    });

    const ok = await sendEmail(env, { from: FROM, ...mail });
    if (!ok) {
      // Release the claim so a later click retries the send.
      await releaseMilestones(DB, link.created_by, claimed);
    }
  } catch {
    // Analytics mail must never disturb the redirect.
  }
}
