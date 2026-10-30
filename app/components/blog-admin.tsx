"use client";

import { useCallback, useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { authHeaders, useAuth } from "./authed";
import { CheckIcon, PenIcon, PlusIcon, TrashIcon } from "./icons";

interface FormState {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  body_md: string;
  tags: string;
  published: boolean;
}

const EMPTY: FormState = { slug: "", title: "", excerpt: "", body_md: "", tags: "", published: false };

/** Admin CMS: create, edit, publish and delete blog posts. */
export function BlogAdmin() {
  const { bearer } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [admin, setAdmin] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/posts", { headers: authHeaders(bearer) });
    if (res.status === 403) {
      setAdmin(false);
      return;
    }
    const data = (await res.json()) as { posts: Post[] };
    setPosts(data.posts);
  }, [bearer]);

  useEffect(() => {
    if (bearer) load();
  }, [bearer, load]);

  async function save() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "content-type": "application/json", ...authHeaders(bearer) },
        body: JSON.stringify({
          id: form.id,
          slug: form.slug,
          title: form.title,
          excerpt: form.excerpt || null,
          body_md: form.body_md,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          published: form.published,
        }),
      });
      const data = (await res.json()) as { post?: Post; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed.");
      setMessage(`Saved "${data.post?.title}".`);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(slug: string) {
    if (!confirm(`Delete post "${slug}"?`)) return;
    await fetch(`/api/posts/${slug}`, { method: "DELETE", headers: authHeaders(bearer) });
    load();
  }

  if (!admin) {
    return (
      <div className="card px-6 py-10 text-center text-[12.5px] text-ink2">
        The blog CMS is admin-only. Set the admin bearer token to manage posts.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* Post list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-medium">Posts</h2>
          <button type="button" className="btn btn-ghost h-8" onClick={() => setForm(EMPTY)}>
            <PlusIcon width={13} height={13} /> New
          </button>
        </div>
        {posts.length === 0 ? (
          <div className="card px-4 py-8 text-center text-[12px] text-ink3">No posts yet.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {posts.map((p) => (
              <div
                key={p.id}
                className="card flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface2"
              >
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() =>
                    setForm({
                      id: p.id,
                      slug: p.slug,
                      title: p.title,
                      excerpt: p.excerpt ?? "",
                      body_md: p.body_md,
                      tags: p.tags.join(", "),
                      published: p.published === 1,
                    })
                  }
                >
                  <p className="truncate text-[12.5px] font-medium">{p.title}</p>
                  <p className="truncate text-[11px] text-ink3">
                    /blog/{p.slug} · {p.published ? "published" : "draft"}
                  </p>
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-icon h-7 w-7"
                  onClick={() => remove(p.slug)}
                  aria-label="Delete post"
                >
                  <TrashIcon width={12} height={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="card flex flex-col gap-3 p-5">
        <h2 className="flex items-center gap-2 text-[13px] font-medium">
          <PenIcon width={13} height={13} />
          {form.id ? "Edit post" : "New post"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-ink3">Title</span>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] text-ink3">Slug</span>
            <input
              className="input"
              placeholder="my-post"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-ink3">Excerpt</span>
          <input
            className="input"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-ink3">Tags (comma-separated)</span>
          <input
            className="input"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] text-ink3">Body (Markdown)</span>
          <textarea
            className="input min-h-[260px] py-2 font-mono text-[12px]"
            value={form.body_md}
            onChange={(e) => setForm({ ...form, body_md: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 text-[12px]">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        {message && (
          <p className="flex items-center gap-1.5 text-[12px] text-ok">
            <CheckIcon width={12} height={12} /> {message}
          </p>
        )}
        {error && <p className="text-[12px] text-danger">{error}</p>}
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || !form.title || !form.slug || !form.body_md}
          onClick={save}
        >
          {busy ? "Saving..." : "Save post"}
        </button>
      </div>
    </div>
  );
}
