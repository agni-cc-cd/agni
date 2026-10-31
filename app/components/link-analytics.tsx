"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Link as LinkModel, Stats } from "@/lib/types";
import { authHeaders, useAuth } from "./authed";
import { BarList, StatTile, TimeChart } from "./charts";
import { ArrowLeftIcon, ArrowUpRightIcon, CheckIcon, CopyIcon, TrashIcon } from "./icons";
import { timeAgo } from "./dashboard";
import { useToast } from "./toast";

const RANGES = [7, 30, 90];

function fmtTs(ts: number): string {
  const d = new Date(ts * 1000);
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${d.toLocaleTimeString(
    undefined,
    { hour: "2-digit", minute: "2-digit" },
  )}`;
}

export function LinkAnalytics({ id }: { id: string }) {
  const { bearer } = useAuth();
  const { push } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const [link, setLink] = useState<LinkModel | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  // Range lives in the URL so refresh/share/back keep the same view.
  const days = RANGES.includes(Number(params?.get("days"))) ? Number(params?.get("days")) : 30;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/links/${id}/stats?days=${days}`, {
          headers: authHeaders(bearer),
        });
        const data = (await res.json()) as { link: LinkModel; stats: Stats; error?: string };
        if (!res.ok) throw new Error(data.error ?? "We couldn't load analytics for this link.");
        setLink(data.link);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "We couldn't load analytics for this link.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [bearer, id, days],
  );

  useEffect(() => {
    if (bearer) load();
  }, [bearer, load]);

  function setDays(next: number) {
    const qs = new URLSearchParams(params?.toString());
    qs.set("days", String(next));
    router.replace(`?${qs.toString()}`, { scroll: false });
  }

  async function remove() {
    if (!link) return;
    if (!confirm("Delete this short link? Its analytics history will be removed too.")) return;
    const res = await fetch(`/api/links/${id}`, { method: "DELETE", headers: authHeaders(bearer) });
    if (res.ok) {
      push({ kind: "success", message: "Link deleted." });
      router.push("/dashboard");
    } else {
      const data = (await res.json()) as { error?: string };
      push({ kind: "error", message: data.error ?? "We couldn't delete that link. Try again." });
    }
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(`${location.origin}/${link.slug}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      push({ kind: "error", message: "We couldn't copy to your clipboard. Copy the link manually." });
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="shimmer h-8 w-64" />
        <div className="shimmer h-24 w-full" />
        <div className="shimmer h-56 w-full" />
      </div>
    );
  }

  if (error || !link || !stats) {
    return (
      <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
        <p className="text-[13px] text-danger">{error ?? "This link doesn't exist."}</p>
        <Link href="/dashboard" className="btn btn-ghost">
          <ArrowLeftIcon width={13} height={13} /> Back to links
        </Link>
      </div>
    );
  }

  const perDay = stats.rangeDays > 0 ? stats.totals.clicks / stats.rangeDays : 0;

  return (
    <div className={`flex flex-col gap-5 transition-opacity ${refreshing ? "opacity-60" : ""}`}>
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard"
          className="flex w-fit items-center gap-1.5 text-[11.5px] text-ink3 hover:text-ink2"
        >
          <ArrowLeftIcon width={12} height={12} /> All links
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[20px] font-semibold tracking-tight">/{link.slug}</h1>
          <button type="button" className="btn btn-ghost h-8" onClick={copy}>
            {copied ? <CheckIcon width={13} height={13} /> : <CopyIcon width={13} height={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <a
            href={`/${link.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost h-8"
          >
            Open <ArrowUpRightIcon width={12} height={12} />
          </a>
          <button type="button" className="btn btn-danger h-8" onClick={remove}>
            <TrashIcon width={13} height={13} /> Delete
          </button>
        </div>
        <p className="max-w-2xl truncate text-[12px] text-ink2" title={link.target_url}>
          {link.target_url}
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-2.5 @md:grid-cols-4">
        <StatTile label="Total clicks" value={link.clicks.toLocaleString()} hint="all time" />
        <StatTile
          label="Unique visitors"
          value={stats.totals.uniqueVisitors.toLocaleString()}
          hint={`last ${stats.rangeDays}d`}
        />
        <StatTile label="Average per day" value={perDay.toFixed(1)} hint={`last ${stats.rangeDays}d`} />
        <StatTile label="Last click" value={timeAgo(stats.totals.lastClickAt)} />
      </div>

      {/* Filters row (scopes everything below) */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-ink3">Range</span>
        <div className="flex rounded-lg border border-line p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDays(r)}
              className={`rounded-md px-2.5 py-1 text-[11.5px] transition-colors ${
                days === r ? "bg-inv font-medium text-invink" : "text-ink2 hover:text-ink"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <TimeChart data={stats.series} days={stats.rangeDays} />

      {/* Breakdowns */}
      <div className="@container grid gap-4 @md:grid-cols-2 @xl:grid-cols-3">
        <BarList title="Countries" items={stats.breakdowns.countries} />
        <BarList title="Referrers" items={stats.breakdowns.referrers} empty="No referrer data yet" />
        <BarList title="Devices" items={stats.breakdowns.devices} />
        <BarList title="Browsers" items={stats.breakdowns.browsers} />
        <BarList title="Operating systems" items={stats.breakdowns.os} />
        <BarList title="Cities" items={stats.breakdowns.cities} empty="No city data yet" />
      </div>

      {/* Recent activity — the raw request log */}
      <div>
        <h2 className="mb-3 text-[12.5px] font-medium">Recent activity</h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">Time</th>
                <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">IP</th>
                <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">Location</th>
                <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">Client</th>
                <th className="px-4 py-2.5 text-[11px] font-medium text-ink3">Referrer</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[12px] text-ink3">
                    No clicks recorded yet. Share your link to start collecting data.
                  </td>
                </tr>
              ) : (
                stats.recent.map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-surface2">
                    <td className="tnum whitespace-nowrap px-4 py-2 text-[11.5px] text-ink2">
                      {fmtTs(c.ts)}
                    </td>
                    <td className="tnum whitespace-nowrap px-4 py-2 text-[11.5px] text-ink2">
                      {c.ip ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-[11.5px] text-ink2">
                      {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                      {c.colo && <span className="ml-1.5 text-ink3">/{c.colo}</span>}
                    </td>
                    <td
                      className="max-w-[220px] truncate px-4 py-2 text-[11.5px] text-ink2"
                      title={c.ua ?? undefined}
                    >
                      {[c.browser, c.os, c.device].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-2 text-[11.5px] text-ink2" title={c.referrer ?? undefined}>
                      {c.referrer ?? "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
