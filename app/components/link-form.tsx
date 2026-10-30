"use client";

import Link from "next/link";
import { useState } from "react";
import type { Link as LinkModel } from "@/lib/types";
import { authHeaders, useAuth } from "./authed";
import { ArrowUpRightIcon, ChartIcon, CheckIcon, CopyIcon, LinkIcon, SparkIcon } from "./icons";

export function LinkForm({
  size = "lg",
  onCreated,
}: {
  size?: "lg" | "sm";
  onCreated?: (link: LinkModel) => void;
}) {
  const { bearer, user } = useAuth();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [showSlug, setShowSlug] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<LinkModel | null>(null);
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://agni.cc.cd";
  const shortUrl = created ? `${origin}/${created.slug}` : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCreated(null);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "content-type": "application/json", ...authHeaders(bearer) },
        body: JSON.stringify({ url, slug: slug || undefined }),
      });
      const data = (await res.json()) as { link?: LinkModel; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setCreated(data.link!);
      setUrl("");
      setSlug("");
      onCreated?.(data.link!);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={submit} className="flex flex-col gap-2.5">
        <div
          className={`flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5 transition-shadow focus-within:border-line2 focus-within:shadow-[0_0_0_4px_rgba(120,120,128,0.12)] ${
            size === "lg" ? "" : ""
          }`}
        >
          <span className="pl-2 text-ink3">
            <LinkIcon width={size === "lg" ? 17 : 15} height={size === "lg" ? 17 : 15} />
          </span>
          <input
            className={`min-w-0 flex-1 border-0 bg-transparent text-ink outline-none placeholder:text-ink3 ${
              size === "lg" ? "h-10 text-[15px]" : "h-8 text-[13px]"
            }`}
            type="url"
            required
            placeholder="Paste a long URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-label="Destination URL"
          />
          {showSlug && (
            <span className="hidden items-center gap-1 border-l border-line pl-2 sm:flex">
              <span className="text-[12px] text-ink3">agni.cc.cd/</span>
              <input
                className="h-8 w-28 border-0 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink3"
                placeholder="custom"
                pattern="[a-zA-Z0-9_-]{0,64}"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                aria-label="Custom slug"
              />
            </span>
          )}
          <button type="submit" className={`btn btn-primary shrink-0 ${size === "lg" ? "btn-lg" : ""}`} disabled={loading}>
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-1.5">
          <button
            type="button"
            className="text-[11.5px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline"
            onClick={() => setShowSlug((v) => !v)}
          >
            {showSlug ? "Hide custom slug" : "Custom slug"}
          </button>
          {!user && (
            <Link href="/login" className="text-[11.5px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline">
              Sign in to keep your links and analytics
            </Link>
          )}
        </div>
      </form>

      {error && (
        <div className="card flex items-center gap-2 border-danger/40 px-4 py-2.5 text-[12px] text-danger">
          {error}
          {/sign in|unauthorized/i.test(error) && (
            <Link href="/login" className="btn btn-ghost ml-auto h-7 text-[11px]">
              Sign in
            </Link>
          )}
        </div>
      )}

      {shortUrl && created && (
        <div className="card flex flex-wrap items-center gap-3 px-4 py-3 fade-in">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface3 text-ok">
            <CheckIcon width={14} height={14} />
          </span>
          <a
            href={shortUrl}
            className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            {shortUrl.replace(/^https?:\/\//, "")}
          </a>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-ghost h-8" onClick={() => copy(shortUrl)}>
              {copied ? <CheckIcon width={13} height={13} /> : <CopyIcon width={13} height={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <Link href={`/dashboard/links/${created.id}`} className="btn btn-ghost h-8">
              <ChartIcon width={13} height={13} />
              Analytics
              <ArrowUpRightIcon width={12} height={12} />
            </Link>
          </div>
          <p className="w-full text-[11px] text-ink3">
            <SparkIcon width={11} height={11} className="mr-1 inline-block align-[-1px]" />
            Every click is tracked: location, device, referrer, and full request data.
          </p>
        </div>
      )}
    </div>
  );
}
