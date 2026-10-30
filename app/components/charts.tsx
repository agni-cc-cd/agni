"use client";

/**
 * Chart primitives — monochrome, compact, dataviz-compliant:
 * single-series marks (no legends), hairline grid, 2px surface gaps,
 * 4px rounded data-ends, hover tooltips (value first), text in text tokens.
 */
import { useMemo, useRef, useState } from "react";
import type { Breakdown, ClickDay } from "@/lib/types";

// ---------------------------------------------------------------------------
// Stat tile
// ---------------------------------------------------------------------------

export function StatTile({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: ClickDay[];
}) {
  return (
    <div className="card flex flex-col gap-1 px-4 py-3">
      <span className="text-[11px] font-medium text-ink3">{label}</span>
      <span className="text-[22px] leading-tight font-semibold tracking-tight">{value}</span>
      <div className="flex items-end justify-between gap-2">
        {hint && <span className="text-[11px] text-ink3">{hint}</span>}
        {trend && trend.length > 1 && <Sparkline data={trend} />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline (tiny, decorative; the table carries the values)
// ---------------------------------------------------------------------------

export function Sparkline({ data, width = 72, height = 24 }: { data: ClickDay[]; width?: number; height?: number }) {
  const points = data.slice(-30);
  const max = Math.max(1, ...points.map((p) => p.count));
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const coords = points.map((p, i) => [i * step, height - 3 - (p.count / max) * (height - 8)] as const);
  const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="shrink-0">
      {coords.length > 1 && (
        <path d={path} fill="none" stroke="var(--chart)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
      {last && (
        <>
          <circle cx={last[0]} cy={last[1]} r="4" fill="var(--surface)" />
          <circle cx={last[0]} cy={last[1]} r="2.5" fill="var(--chart)" />
        </>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Time chart (columns, hover tooltip, keyboard focusable)
// ---------------------------------------------------------------------------

function niceMax(n: number): number {
  if (n <= 5) return 5;
  const pow = 10 ** Math.floor(Math.log10(n));
  const unit = n / pow;
  const nice = unit <= 2 ? 2 : unit <= 5 ? 5 : 10;
  return nice * pow;
}

function fmtDay(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" });
}

export function zeroFill(series: ClickDay[], days: number): ClickDay[] {
  const counts = new Map(series.map((s) => [s.day, s.count]));
  const out: ClickDay[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    out.push({ day, count: counts.get(day) ?? 0 });
  }
  return out;
}

export function TimeChart({ data, days }: { data: ClickDay[]; days: number }) {
  const filled = useMemo(() => zeroFill(data, days), [data, days]);
  const max = niceMax(Math.max(1, ...filled.map((d) => d.count)));
  const [active, setActive] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const total = filled.reduce((a, b) => a + b.count, 0);
  const peak = filled.reduce((a, b) => (b.count > a.count ? b : a), filled[0]);

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-[12.5px] font-medium">Clicks over time</h3>
          <p className="text-[11px] text-ink3">
            {total.toLocaleString()} clicks in the last {days} days
            {peak && peak.count > 0 ? ` · peak ${peak.count} on ${fmtDay(peak.day)}` : ""}
          </p>
        </div>
        <div className="tnum text-[11px] text-ink3">
          0 – {max.toLocaleString()}
        </div>
      </div>

      <div className="flex gap-3">
        {/* Y ticks */}
        <div className="flex h-36 flex-col justify-between py-[2px] text-right">
          {[max, Math.round(max / 2), 0].map((t) => (
            <span key={t} className="tnum text-[10px] leading-none text-ink3">
              {t.toLocaleString()}
            </span>
          ))}
        </div>

        <div ref={wrapRef} className="relative h-36 flex-1">
          {/* Hairline grid */}
          <div className="absolute inset-x-0 top-0 border-t border-line" />
          <div className="absolute inset-x-0 top-1/2 border-t border-line" />
          <div className="absolute inset-x-0 bottom-0 border-t border-line2" />

          <div className="relative flex h-full items-end gap-[2px]">
            {filled.map((d, i) => {
              const h = max > 0 ? (d.count / max) * 100 : 0;
              const isActive = active === i;
              return (
                <button
                  key={d.day}
                  type="button"
                  className="group flex h-full flex-1 cursor-pointer items-end justify-center border-0 bg-transparent p-0"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`${d.count} clicks on ${fmtDay(d.day)}`}
                >
                  <span
                    className="block w-full max-w-[24px] rounded-t-[4px] transition-colors"
                    style={{
                      height: `${Math.max(d.count > 0 ? 3 : 0, h)}%`,
                      background: isActive ? "var(--ink)" : "var(--chart)",
                    }}
                  />
                </button>
              );
            })}

            {/* Tooltip */}
            {active !== null && filled[active] && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-line bg-surface px-2.5 py-1.5 shadow-lg"
                style={{
                  left: `${((active + 0.5) / filled.length) * 100}%`,
                  bottom: `calc(${Math.max(
                    (filled[active].count / max) * 100,
                    4,
                  )}% + 10px)`,
                }}
              >
                <div className="tnum text-[12px] font-semibold leading-tight">
                  {filled[active].count.toLocaleString()}{" "}
                  <span className="font-normal text-ink2">
                    {filled[active].count === 1 ? "click" : "clicks"}
                  </span>
                </div>
                <div className="text-[10.5px] leading-tight text-ink3">{fmtDay(filled[active].day)}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* X labels */}
      <div className="mt-1.5 ml-9 flex justify-between text-[10px] text-ink3">
        <span>{fmtDay(filled[0].day)}</span>
        {filled.length > 2 && <span>{fmtDay(filled[Math.floor(filled.length / 2)].day)}</span>}
        <span>{fmtDay(filled[filled.length - 1].day)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bar list (top-N breakdown rows)
// ---------------------------------------------------------------------------

export function BarList({
  title,
  items,
  empty = "No data yet",
}: {
  title: string;
  items: Breakdown[];
  empty?: string;
}) {
  const total = items.reduce((a, b) => a + b.count, 0);
  const max = Math.max(1, ...items.map((i) => i.count));

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-[12.5px] font-medium">{title}</h3>
      {items.length === 0 ? (
        <p className="py-4 text-center text-[11px] text-ink3">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={item.label} className="group" title={`${item.label}: ${item.count} (${total ? Math.round((item.count / total) * 100) : 0}%)`}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-[12px] text-ink2 group-hover:text-ink">
                  {item.label}
                </span>
                <span className="tnum shrink-0 text-[11px] text-ink3">
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 h-[6px] w-full overflow-hidden rounded-l-[2px] bg-surface3">
                <div
                  className="h-full rounded-r-[4px] bg-chart transition-colors group-hover:bg-ink"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
