"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { useAuth } from "@/app/components/authed";
import { authErrorMessage, setUserName, setUserPassword } from "@/lib/firebase-client";

// Shown right after a new account is verified: pick a password and confirm the
// name. Everything else about the account already exists at this point.

function SetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
    else {
      try {
        const saved = sessionStorage.getItem("agni-link-name");
        if (saved) setName(saved);
      } catch {
        // storage unavailable
      }
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  async function submit(e: FormEvent) {
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
      if (name.trim()) await setUserName(name.trim());
      await setUserPassword(password);
      router.push(params.get("welcome") ? "/dashboard?welcome=1" : "/dashboard");
    } catch (err) {
      setError(authErrorMessage(err));
      setBusy(false);
    }
  }

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-[24px] font-semibold tracking-tight">Set your password</h1>
        <p className="mt-3 text-[13px] leading-relaxed text-ink2">
          Your email is verified and your account is open. Choose a password so you
          can also sign in with email and password any time.
        </p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] text-ink3">Your name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amit Anand"
              maxLength={80}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] text-ink3">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11.5px] text-ink3">Confirm password</span>
            <input
              className="input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Type it again"
              minLength={8}
              required
            />
          </label>
          {error && <p className="text-[12px] text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save and open dashboard"}
          </button>
          <Link href="/dashboard" className="btn btn-ghost w-fit">
            Skip for now
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense>
      <SetPasswordInner />
    </Suspense>
  );
}
