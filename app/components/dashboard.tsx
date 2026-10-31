"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Link as LinkModel, Overview } from "@/lib/types";
import { authHeaders, useAuth } from "./authed";
import { StatTile, TimeChart } from "./charts";
import {
  ArrowUpRightIcon,
  ChartIcon,
  CheckIcon,
  CopyIcon,
  LinkIcon,
  RefreshIcon,
  TrashIcon,
} from "./icons";
import { LinkForm } from "./link-form";
import { useToast } from "./toast";

export function timeAgo(iso: string | null): string {
  if (!iso) return "never";
  // SQLite datetime('now') is UTC without zone marker.
  const ts = new Date(iso.includes("T") ? iso : `${iso.replace(" ", "T")}Z`).getTime();
  if (Number.isNaN(ts)) return iso;
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86_400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86_400 * 30) return `${Math.floor(s / 86_400)}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function Dashboard() {
  const { bearer } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const days = Number(params?.get("days") ?? 30) || 30;
  const [links, setLinks] = useState<LinkModel[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/links?days=${days}`, { headers: authHeaders(bearer) });
      const data = (await res.json()) as { links: LinkModel[]; overview: Overview; error?: string };
      if (!res.ok) throw new Error(data.error ?? "We couldn't load your links. Refresh to try again.");
      setLinks(data.links);
      setOverview(data.overview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't load your links. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, [bearer, days]);

  useEffect(() => {
    if (bearer) load();
  }, [bearer, load]);

  async function remove(id: string) {
    if (!confirm("Delete this short link? Its analytics history will be removed too.")) return;
    const res = await fetch(`/api/links/${id}`, {
      method: "DELETE",
      headers: authHeaders(bearer),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      push({ kind: "error", message: data.error ?? "We couldn't delete that link. Try again." });
      return;
    }
    push({ kind: "success", message: "Link deleted." });
    load();
  }

  async function copy(slug: string) {
    try {
      await navigator.clipboard.writeText(`${location.origin}/${slug}`);
      setCopied(slug);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  const clicksWindow = overview?.series.reduce((a, b) => a + b.count, 0) ?? 0;

  function setDays(next: number) {
    const qs = new URLSearchParams(params?.toString());
    qs.set("days", String(next));
    router.replace(`?${qs.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-2.5 @md:grid-cols-4">
        <StatTile label="Total clicks" value={(overview?.totals.clicks ?? 0).toLocaleString()} hint="all time" />
        <StatTile
          label={`Clicks (${days} days)`}
          value={clicksWindow.toLocaleString()}
          trend={overview?.series ?? []}
        />
        <StatTile
          label="Unique visitors"
          value={(overview?.totals.uniqueVisitors ?? 0).toLocaleString()}
          hint={`distinct IPs, ${days}d`}
        />
        <StatTile label="Links" value={(overview?.totals.links ?? 0).toLocaleString()} hint="in your account" />
      </div>

      <div className="@container">
        <div className="grid gap-4 @lg:grid-cols-2">
          {overview && <TimeChart data={overview.series} days={days} />}
          <div className="card flex flex-col justify-center gap-3 p-6">
            <h3 className="text-[12.5px] font-medium">Create a new short link</h3>
            <LinkForm
              size="sm"
              onCreated={() => {
                load();
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[13px] font-medium">Your links</h2>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-line bg-surface2 p-0.5" role="group" aria-label="Date range">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    days === d ? "bg-surface text-ink shadow-sm" : "text-ink3 hover:text-ink2"
                  }`}
                  onClick={() => setDays(d)}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-ghost h-8" onClick={load} disabled={loading}>
              <RefreshIcon width={13} height={13} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="card mb-3 border-danger/40 px-4 py-2.5 text-[12px] text-danger">{error}</div>
        )}

        {loading && links.length === 0 ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="shimmer h-12 w-full" />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface3 text-ink3">
              <LinkIcon width={18} height={18} />
            </span>
            <p className="text-[13px] text-ink2">No links yet.</p>
            <p className="max-w-xs text-[11.5px] text-ink3">
              Paste a URL above to create your first short link. Every click will be tracked with
              full analytics.
            </p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">Short link</th>
                  <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">Destination</th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium text-ink3">Clicks</th>
                  <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">Created</th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium text-ink3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="group border-b border-line last:border-0 hover:bg-surface2">
                    <td className="max-w-[180px] px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/links/${link.id}`}
                          className="truncate text-[12.5px] font-medium text-ink underline-offset-2 hover:underline"
                        >
                          /{link.slug}
                        </Link>
                        <button
                          type="button"
                          className="text-ink3 opacity-0 transition-opacity group-hover:opacity-100 hover:text-ink"
                          onClick={() => copy(link.slug)}
                          aria-label="Copy short link"
                        >
                          {copied === link.slug ? (
                            <CheckIcon width={12} height={12} />
                          ) : (
                            <CopyIcon width={12} height={12} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="max-w-[280px] px-4 py-2.5">
                      <span className="block truncate text-[12px] text-ink2" title={link.target_url}>
                        {link.target_url}
                      </span>
                    </td>
                    <td className="tnum px-4 py-2.5 text-right text-[12.5px]">
                      {link.clicks.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-[11.5px] text-ink3">{timeAgo(link.created_at)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <a
                          href={`/${link.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-ghost btn-icon h-7 w-7"
                          aria-label="Open short link"
                          title="Open"
                        >
                          <ArrowUpRightIcon width={12} height={12} />
                        </a>
                        <Link
                          href={`/dashboard/links/${link.id}`}
                          className="btn btn-ghost btn-icon h-7 w-7"
                          aria-label="View analytics"
                          title="Analytics"
                        >
                          <ChartIcon width={12} height={12} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-danger btn-icon h-7 w-7"
                          onClick={() => remove(link.id)}
                          aria-label="Delete link"
                          title="Delete"
                        >
                          <TrashIcon width={12} height={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
