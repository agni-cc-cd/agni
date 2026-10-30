export interface Link {
  id: string;
  slug: string;
  target_url: string;
  title: string | null;
  created_at: string;
  created_by: string;
  clicks: number;
  last_clicked_at: string | null;
}

export interface ClickDay {
  day: string;
  count: number;
}

export interface Breakdown {
  label: string;
  count: number;
}

export interface RecentClick {
  id: number;
  ts: number;
  ip: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
  colo: string | null;
  asn: number | null;
  referrer: string | null;
  ua: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  lang: string | null;
  protocol: string | null;
  tls: string | null;
  status: number | null;
}

export interface Stats {
  rangeDays: number;
  totals: {
    clicks: number;
    uniqueVisitors: number;
    lastClickAt: string | null;
  };
  series: ClickDay[];
  breakdowns: {
    countries: Breakdown[];
    cities: Breakdown[];
    referrers: Breakdown[];
    browsers: Breakdown[];
    os: Breakdown[];
    devices: Breakdown[];
  };
  recent: RecentClick[];
}

export interface Overview {
  totals: {
    links: number;
    clicks: number;
    uniqueVisitors: number;
  };
  series: ClickDay[];
}

export interface CreateLinkInput {
  url: string;
  slug?: string;
  title?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  plan: string;
  created_at: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  tags: string[];
  published: number;
  author_name: string | null;
  published_at: string | null;
  updated_at: string;
}

export interface ApiError {
  error: string;
}
