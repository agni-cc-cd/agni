import type {
  Breakdown,
  ClickDay,
  Link,
  Overview,
  Post,
  RecentClick,
  Stats,
  UserProfile,
} from "./types";
import type { ClickEvent } from "./analytics";
import { crossedMilestones } from "./milestones";

const LINK_COLUMNS = "id, slug, target_url, title, created_at, created_by, clicks, last_clicked_at";

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}

function tsDaysAgo(days: number): number {
  return Math.floor(Date.now() / 1000) - days * 86_400;
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

export async function listLinks(
  db: D1Database,
  opts: { owner?: string | null; limit?: number } = {},
): Promise<Link[]> {
  const limit = opts.limit ?? 200;
  const { results } = opts.owner
    ? await db
        .prepare(`SELECT ${LINK_COLUMNS} FROM links WHERE created_by = ? ORDER BY created_at DESC LIMIT ?`)
        .bind(opts.owner, limit)
        .all<Link>()
    : await db
        .prepare(`SELECT ${LINK_COLUMNS} FROM links ORDER BY created_at DESC LIMIT ?`)
        .bind(limit)
        .all<Link>();
  return results;
}

export async function getLinkBySlug(db: D1Database, slug: string): Promise<Link | null> {
  return (
    (await db.prepare(`SELECT ${LINK_COLUMNS} FROM links WHERE slug = ?`).bind(slug).first<Link>()) ??
    null
  );
}

export async function getLinkById(db: D1Database, id: string): Promise<Link | null> {
  return (
    (await db.prepare(`SELECT ${LINK_COLUMNS} FROM links WHERE id = ?`).bind(id).first<Link>()) ??
    null
  );
}

export async function createLink(
  db: D1Database,
  link: Pick<Link, "id" | "slug" | "target_url" | "title" | "created_by">,
): Promise<Link> {
  await db
    .prepare(`INSERT INTO links (id, slug, target_url, title, created_by) VALUES (?, ?, ?, ?, ?)`)
    .bind(link.id, link.slug, link.target_url, link.title ?? null, link.created_by)
    .run();
  return (await getLinkById(db, link.id))!;
}

/** Delete a link and its click history (raw events + daily rollups). */
export async function deleteLink(db: D1Database, id: string): Promise<boolean> {
  const link = await getLinkById(db, id);
  if (!link) return false;
  await db.batch([
    db.prepare(`DELETE FROM click_events WHERE link_id = ?`).bind(id),
    db.prepare(`DELETE FROM clicks_daily WHERE slug = ?`).bind(link.slug),
    db.prepare(`DELETE FROM links WHERE id = ?`).bind(id),
  ]);
  return true;
}

// ---------------------------------------------------------------------------
// Click recording (hot path, called inside waitUntil)
// ---------------------------------------------------------------------------

/** Record a click: counter + daily rollup + raw request event. */
export async function recordClick(db: D1Database, event: ClickEvent): Promise<void> {
  const day = new Date(event.ts * 1000).toISOString().slice(0, 10);
  await db.batch([
    db
      .prepare(
        `UPDATE links SET clicks = clicks + 1, last_clicked_at = datetime('now') WHERE slug = ?`,
      )
      .bind(event.slug),
    db
      .prepare(
        `INSERT INTO clicks_daily (slug, day, count) VALUES (?, ?, 1)
         ON CONFLICT(slug, day) DO UPDATE SET count = count + 1`,
      )
      .bind(event.slug, day),
    db
      .prepare(
        `INSERT INTO click_events
           (link_id, slug, ts, ip, country, city, region, colo, asn,
            method, protocol, tls, referrer, ua, lang, browser, os, device, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        event.linkId,
        event.slug,
        event.ts,
        event.ip ?? null,
        event.country ?? null,
        event.city ?? null,
        event.region ?? null,
        event.colo ?? null,
        event.asn ?? null,
        event.method ?? null,
        event.protocol ?? null,
        event.tls ?? null,
        event.referrer ?? null,
        event.ua ?? null,
        event.lang ?? null,
        event.browser ?? null,
        event.os ?? null,
        event.device ?? null,
        event.status ?? null,
      ),
  ]);
}

// ---------------------------------------------------------------------------
// Stats & analytics
// ---------------------------------------------------------------------------

export async function getDailyClicks(
  db: D1Database,
  slug: string,
  days = 30,
): Promise<ClickDay[]> {
  const { results } = await db
    .prepare(`SELECT day, count FROM clicks_daily WHERE slug = ? AND day >= ? ORDER BY day ASC`)
    .bind(slug, daysAgo(days))
    .all<{ day: string; count: number }>();
  return results.map((r) => ({ day: r.day, count: Number(r.count) }));
}

async function breakdown(
  db: D1Database,
  column: string,
  where: string,
  binds: unknown[],
  limit = 8,
): Promise<Breakdown[]> {
  const { results } = await db
    .prepare(
      `SELECT COALESCE(NULLIF(${column}, ''), '(none)') AS label, COUNT(*) AS count
       FROM click_events WHERE ${where}
       GROUP BY label ORDER BY count DESC, label ASC LIMIT ?`,
    )
    .bind(...binds, limit)
    .all<{ label: string; count: number }>();
  return results.map((r) => ({ label: r.label, count: Number(r.count) }));
}

/** Full analytics for one link: totals, daily series, breakdowns, recent clicks. */
export async function getLinkStats(
  db: D1Database,
  link: Link,
  days = 30,
): Promise<Stats> {
  const sinceTs = tsDaysAgo(days);
  const where = `link_id = ?1 AND ts >= ?2`;
  const binds = [link.id, sinceTs];

  const [series, uniq, countries, cities, referrers, browsers, oses, devices, recent] =
    await Promise.all([
      getDailyClicks(db, link.slug, days),
      db
        .prepare(`SELECT COUNT(DISTINCT ip) AS c FROM click_events WHERE ${where}`)
        .bind(...binds)
        .first<{ c: number }>(),
      breakdown(db, "country", where, binds),
      breakdown(db, "city", where, binds),
      breakdown(db, "referrer", where, binds),
      breakdown(db, "browser", where, binds),
      breakdown(db, "os", where, binds),
      breakdown(db, "device", where, binds),
      db
        .prepare(`SELECT * FROM click_events WHERE ${where} ORDER BY ts DESC LIMIT 50`)
        .bind(...binds)
        .all<RecentClick>(),
    ]);

  return {
    rangeDays: days,
    totals: {
      clicks: link.clicks,
      uniqueVisitors: Number(uniq?.c ?? 0),
      lastClickAt: link.last_clicked_at,
    },
    series,
    breakdowns: { countries, cities, referrers, browsers, os: oses, devices },
    recent: recent.results,
  };
}

/** Cross-link overview for the dashboard. */
export async function getOverview(
  db: D1Database,
  owner: string | null,
  days = 30,
): Promise<Overview> {
  const since = daysAgo(days);
  const sinceTs = tsDaysAgo(days);
  const scope = owner ? `created_by = ?` : null;

  const [linkAgg, uniq, series] = await Promise.all([
    scope
      ? db
          .prepare(`SELECT COUNT(*) AS links, COALESCE(SUM(clicks), 0) AS clicks FROM links WHERE ${scope}`)
          .bind(owner)
          .first<{ links: number; clicks: number }>()
      : db
          .prepare(`SELECT COUNT(*) AS links, COALESCE(SUM(clicks), 0) AS clicks FROM links`)
          .first<{ links: number; clicks: number }>(),
    scope
      ? db
          .prepare(
            `SELECT COUNT(DISTINCT ip) AS c FROM click_events
             WHERE ts >= ?2 AND link_id IN (SELECT id FROM links WHERE created_by = ?1)`,
          )
          .bind(owner, sinceTs)
          .first<{ c: number }>()
      : db
          .prepare(`SELECT COUNT(DISTINCT ip) AS c FROM click_events WHERE ts >= ?`)
          .bind(sinceTs)
          .first<{ c: number }>(),
    scope
      ? db
          .prepare(
            `SELECT day, SUM(count) AS count FROM clicks_daily
             WHERE day >= ?2 AND slug IN (SELECT slug FROM links WHERE created_by = ?1)
             GROUP BY day ORDER BY day ASC`,
          )
          .bind(owner, since)
          .all<{ day: string; count: number }>()
      : db
          .prepare(
            `SELECT day, SUM(count) AS count FROM clicks_daily WHERE day >= ?
             GROUP BY day ORDER BY day ASC`,
          )
          .bind(since)
          .all<{ day: string; count: number }>(),
  ]);

  return {
    totals: {
      links: Number(linkAgg?.links ?? 0),
      clicks: Number(linkAgg?.clicks ?? 0),
      uniqueVisitors: Number(uniq?.c ?? 0),
    },
    series: series.results.map((r) => ({ day: r.day, count: Number(r.count) })),
  };
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function upsertUser(
  db: D1Database,
  user: { uid: string; email?: string | null; name?: string | null; picture?: string | null },
): Promise<UserProfile> {
  await db
    .prepare(
      `INSERT INTO users (id, email, name, picture) VALUES (?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         email = COALESCE(excluded.email, users.email),
         name = COALESCE(excluded.name, users.name),
         picture = COALESCE(excluded.picture, users.picture),
         last_seen_at = datetime('now')`,
    )
    .bind(user.uid, user.email ?? null, user.name ?? null, user.picture ?? null)
    .run();
  const row = await db
    .prepare(`SELECT id AS uid, email, name, picture, plan, created_at FROM users WHERE id = ?`)
    .bind(user.uid)
    .first<UserProfile>();
  return row!;
}

// ---------------------------------------------------------------------------
// Blog CMS
// ---------------------------------------------------------------------------

const POST_COLUMNS = "id, slug, title, excerpt, body_md, tags, published, author_name, published_at, updated_at";

function mapPost(row: Post & { tags: string }): Post {
  let tags: string[] = [];
  try {
    tags = JSON.parse(row.tags) as string[];
  } catch {
    tags = [];
  }
  return { ...row, tags };
}

export async function listPosts(db: D1Database, includeUnpublished = false): Promise<Post[]> {
  const { results } = includeUnpublished
    ? await db
        .prepare(`SELECT ${POST_COLUMNS} FROM posts ORDER BY COALESCE(published_at, updated_at) DESC`)
        .all<Post & { tags: string }>()
    : await db
        .prepare(
          `SELECT ${POST_COLUMNS} FROM posts WHERE published = 1
           ORDER BY COALESCE(published_at, updated_at) DESC`,
        )
        .all<Post & { tags: string }>();
  return results.map(mapPost);
}

export async function getPostBySlug(
  db: D1Database,
  slug: string,
  includeUnpublished = false,
): Promise<Post | null> {
  const row = includeUnpublished
    ? await db.prepare(`SELECT ${POST_COLUMNS} FROM posts WHERE slug = ?`).bind(slug).first<Post & { tags: string }>()
    : await db
        .prepare(`SELECT ${POST_COLUMNS} FROM posts WHERE slug = ? AND published = 1`)
        .bind(slug)
        .first<Post & { tags: string }>();
  return row ? mapPost(row) : null;
}

export async function upsertPost(
  db: D1Database,
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    body_md: string;
    tags?: string[];
    published: boolean;
    author_name?: string | null;
    published_at?: string | null;
  },
): Promise<Post> {
  const publishedAt = post.published
    ? (post.published_at ?? new Date().toISOString().slice(0, 19).replace("T", " "))
    : null;
  await db
    .prepare(
      `INSERT INTO posts (id, slug, title, excerpt, body_md, tags, published, author_name, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         slug = excluded.slug, title = excluded.title, excerpt = excluded.excerpt,
         body_md = excluded.body_md, tags = excluded.tags, published = excluded.published,
         author_name = excluded.author_name,
         published_at = COALESCE(excluded.published_at, posts.published_at),
         updated_at = datetime('now')`,
    )
    .bind(
      post.id,
      post.slug,
      post.title,
      post.excerpt ?? null,
      post.body_md,
      JSON.stringify(post.tags ?? []),
      post.published ? 1 : 0,
      post.author_name ?? null,
      publishedAt,
    )
    .run();
  return (await getPostBySlug(db, post.slug, true))!;
}

export async function deletePost(db: D1Database, id: string): Promise<boolean> {
  const res = await db.prepare(`DELETE FROM posts WHERE id = ?`).bind(id).run();
  return res.meta.changes > 0;
}

// ---------------------------------------------------------------------------
// Milestone emails
// ---------------------------------------------------------------------------

/**
 * Claim every reached-but-unsent milestone for an account in one shot.
 * INSERT OR IGNORE makes the claim exactly-once even under concurrent clicks.
 */
export async function claimMilestones(db: D1Database, userId: string, total: number): Promise<number[]> {
  const due = crossedMilestones(total);
  if (due.length === 0) return [];
  const { results: sentRows } = await db
    .prepare(`SELECT milestone FROM email_milestones WHERE user_id = ?`)
    .bind(userId)
    .all<{ milestone: number }>();
  const sent = new Set(sentRows.map((r) => Number(r.milestone)));
  const fresh = due.filter((m) => !sent.has(m));
  if (fresh.length === 0) return [];
  const inserted = await db.batch(
    fresh.map((m) =>
      db.prepare(`INSERT OR IGNORE INTO email_milestones (user_id, milestone) VALUES (?, ?)`).bind(userId, m),
    ),
  );
  // Only the rows we actually inserted are ours to send; a concurrent click
  // that reached the same milestone won the INSERT and owns the email.
  return fresh.filter((_, i) => Number(inserted[i]?.meta?.changes ?? 0) > 0);
}

/** Release a claimed milestone so a later click can retry a failed send. */
export async function releaseMilestones(db: D1Database, userId: string, milestones: number[]): Promise<void> {
  if (milestones.length === 0) return;
  await db.batch(
    milestones.map((m) =>
      db.prepare(`DELETE FROM email_milestones WHERE user_id = ? AND milestone = ?`).bind(userId, m),
    ),
  );
}

/** Aggregate snapshot for the milestone email. */
export async function getMilestoneSnapshot(
  db: D1Database,
  owner: string,
): Promise<{
  totalClicks: number;
  totalLinks: number;
  topLinks: Array<{ slug: string; clicks: number }>;
  topCountries: Array<{ label: string; count: number }>;
}> {
  const [totals, links, countries] = await Promise.all([
    db
      .prepare(`SELECT COALESCE(SUM(clicks), 0) AS clicks, COUNT(*) AS links FROM links WHERE created_by = ?`)
      .bind(owner)
      .first<{ clicks: number; links: number }>(),
    db
      .prepare(`SELECT slug, clicks FROM links WHERE created_by = ? ORDER BY clicks DESC LIMIT 5`)
      .bind(owner)
      .all<{ slug: string; clicks: number }>(),
    db
      .prepare(
        `SELECT COALESCE(NULLIF(e.country, ''), '(none)') AS label, COUNT(*) AS count
         FROM click_events e JOIN links l ON l.id = e.link_id
         WHERE l.created_by = ?
         GROUP BY label ORDER BY count DESC LIMIT 5`,
      )
      .bind(owner)
      .all<{ label: string; count: number }>(),
  ]);
  return {
    totalClicks: Number(totals?.clicks ?? 0),
    totalLinks: Number(totals?.links ?? 0),
    topLinks: links.results.map((r) => ({ slug: r.slug, clicks: Number(r.clicks) })),
    topCountries: countries.results.map((r) => ({ label: r.label, count: Number(r.count) })),
  };
}

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

export async function ensureSchema(db: D1Database): Promise<void> {
  // Note: D1's exec() mangles multi-statement input; batch() is the safe path.
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT,
      name TEXT,
      picture TEXT,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_seen_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      target_url TEXT NOT NULL,
      title TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_by TEXT NOT NULL DEFAULT 'admin',
      clicks INTEGER NOT NULL DEFAULT 0,
      last_clicked_at TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS click_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      link_id TEXT NOT NULL,
      slug TEXT NOT NULL,
      ts INTEGER NOT NULL DEFAULT (unixepoch()),
      ip TEXT, country TEXT, city TEXT, region TEXT,
      colo TEXT, asn INTEGER,
      method TEXT, protocol TEXT, tls TEXT,
      referrer TEXT, ua TEXT, lang TEXT,
      browser TEXT, os TEXT, device TEXT,
      status INTEGER
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS clicks_daily (
      slug TEXT NOT NULL,
      day TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (slug, day)
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT,
      body_md TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      published INTEGER NOT NULL DEFAULT 0,
      author_name TEXT,
      published_at TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_slug TEXT NOT NULL,
      name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'visible',
      ip_hash TEXT
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS email_milestones (
      user_id TEXT NOT NULL,
      milestone INTEGER NOT NULL,
      sent_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, milestone)
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_links_created_at ON links (created_at DESC)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_links_owner ON links (created_by, created_at DESC)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_clicks_daily_slug ON clicks_daily (slug, day)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_click_events_link_ts ON click_events (link_id, ts DESC)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_click_events_ts ON click_events (ts DESC)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published, published_at DESC)`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments (post_slug, created_at DESC)`),
  ]);
}
