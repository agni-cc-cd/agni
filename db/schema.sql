-- agni link shortener — D1 schema
-- Idempotent; also ensured at runtime by lib/db.ts ensureSchema().

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  picture TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_seen_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  target_url TEXT NOT NULL,
  title TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_by TEXT NOT NULL DEFAULT 'admin',
  clicks INTEGER NOT NULL DEFAULT 0,
  last_clicked_at TEXT
);

-- Raw click stream: every request detail the edge can see.
CREATE TABLE IF NOT EXISTS click_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  link_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  ts INTEGER NOT NULL DEFAULT (unixepoch()),
  ip TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  colo TEXT,
  asn INTEGER,
  method TEXT,
  protocol TEXT,
  tls TEXT,
  referrer TEXT,
  ua TEXT,
  lang TEXT,
  browser TEXT,
  os TEXT,
  device TEXT,
  status INTEGER
);

CREATE TABLE IF NOT EXISTS clicks_daily (
  slug TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, day)
);

CREATE TABLE IF NOT EXISTS posts (
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
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'visible',
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS idx_links_created_at ON links (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_links_owner ON links (created_by, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_daily_slug ON clicks_daily (slug, day);
CREATE INDEX IF NOT EXISTS idx_click_events_link_ts ON click_events (link_id, ts DESC);
CREATE INDEX IF NOT EXISTS idx_click_events_ts ON click_events (ts DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts (published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments (post_slug, created_at DESC);
