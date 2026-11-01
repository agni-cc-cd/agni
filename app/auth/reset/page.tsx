"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import {
  authErrorMessage,
  completePasswordReset,
  sendPasswordReset,
} from "@/lib/firebase-client";

// Two states on one route: without a code it requests a reset link, with an
// oobCode in the URL it sets the new password. Expired codes fall back to
// requesting a fresh link.

function ResetInner() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get("oobCode") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) {
      try {
        const saved = sessionStorage.getItem("agni-reset-email");
        if (saved) setEmail(saved);
      } catch {
        // storage unavailable
      }
    }
  }, [code]);

  async function requestLink(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function setNewPassword(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (password.length < 8) {
      setError("Please choose a password with at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await completePasswordReset(code, password);
      router.push("/login?reset=1");
    } catch (err) {
      const msg = authErrorMessage(err);
      if (msg.includes("expired") || msg.includes("already used")) {
        setError(msg + " Request a new one below.");
        window.history.replaceState(null, "", "/auth/reset");
      } else {
        setError(msg);
      }
      setBusy(false);
    }
  }

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-[24px] font-semibold tracking-tight">
          {code ? "Choose a new password" : "Reset your password"}
        </h1>

        {code ? (
          <form onSubmit={setNewPassword} className="mt-6 flex flex-col gap-3">
            <p className="text-[13px] leading-relaxed text-ink2">
              Pick something you have not used before. The link works once.
            </p>
            <input
              className="input"
              type="password"
              placeholder="New password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
              autoFocus
            />
            <input
              className="input"
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              required
            />
            {error && <p className="text-[12px] text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : "Save new password"}
            </button>
          </form>
        ) : sent ? (
          <div className="mt-6 flex flex-col gap-4">
            <p className="text-[13px] leading-relaxed text-ink2">
              If that address has an account, a reset link is on its way. The link
              works once and expires shortly — request another any time.
            </p>
            <button type="button" className="btn btn-ghost w-fit" onClick={() => setSent(false)}>
              Use a different address
            </button>
          </div>
        ) : (
          <form onSubmit={requestLink} className="mt-6 flex flex-col gap-3">
            <p className="text-[13px] leading-relaxed text-ink2">
              Enter the email you signed up with. We will send a one-time link to
              set a new password.
            </p>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
            {error && <p className="text-[12px] text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-[11.5px] text-ink3">
          Remembered it?{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-ink">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPage() {
  return (
    <Suspense>
      <ResetInner />
    </Suspense>
  );
}
