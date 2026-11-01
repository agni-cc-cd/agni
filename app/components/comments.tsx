"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

interface Comment {
  id: string;
  post_slug: string;
  name: string;
  body: string;
  created_at: string;
}

export function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; message: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      if (!res.ok) return;
      const data = (await res.json()) as { comments: Comment[] };
      setComments(data.comments);
    } catch {
      // listing is best-effort; the form still works
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, body: text, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setNotice({ kind: "error", message: data.error ?? "That comment did not go through. Try again." });
      } else {
        setNotice({ kind: "ok", message: "Comment posted." });
        setName("");
        setText("");
        load();
      }
    } catch {
      setNotice({ kind: "error", message: "Something went wrong. Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto mt-16 max-w-2xl" aria-label="Comments">
      <hr className="divider mb-8" />
      <h2 className="text-[18px] font-semibold tracking-tight">
        Comments{comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>

      <div className="mt-5 flex flex-col gap-5">
        {comments.length === 0 && (
          <p className="text-[12.5px] text-ink3">
            No comments yet — be the first to share what you think.
          </p>
        )}
        {comments.map((c) => (
          <article key={c.id} className="card p-5">
            <div className="flex items-center gap-2 text-[11px] text-ink3">
              <span className="font-medium text-ink2">{c.name}</span>
              <span>·</span>
              <time dateTime={c.created_at}>{c.created_at.slice(0, 10)}</time>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-ink2">{c.body}</p>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="card mt-8 flex flex-col gap-3 p-6">
        <h3 className="text-[13.5px] font-medium">Leave a comment</h3>
        <input
          className="input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
        />
        <textarea
          className="input min-h-[110px]"
          placeholder="Your comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          required
        />
        {/* honeypot: humans never see this */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        {notice && (
          <p className={notice.kind === "ok" ? "text-[12px] text-ok" : "text-[12px] text-danger"}>
            {notice.message}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-fit" disabled={busy}>
          {busy ? "Posting…" : "Post comment"}
        </button>
        <p className="text-[11px] text-ink3">
          Comments are public. Be kind, keep links to two or fewer.
        </p>
      </form>
    </section>
  );
}
