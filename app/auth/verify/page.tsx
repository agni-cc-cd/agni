"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import {
  authErrorMessage,
  completeEmailLink,
  isEmailLink,
  sendEmailLink,
} from "@/lib/firebase-client";

// Email links land here (forwarded from the Firebase Hosting bridge with the
// oobCode and mode intact). The account is created only at this moment — the
// address was proven first, exactly once.

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const codePresent = Boolean(params.get("oobCode")) || isEmailLink();
  const nameFromLink = params.get("name") ?? "";

  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"form" | "working" | "done" | "expired" | "error">(
    codePresent ? "form" : "expired",
  );
  const [error, setError] = useState("");
  const [resendBusy, setResendBusy] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("agni-link-email");
      if (saved && !email) setEmail(saved);
    } catch {
      // storage unavailable
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verify(e: FormEvent) {
    e.preventDefault();
    setPhase("working");
    setError("");
    try {
      const { user, isNewUser } = await completeEmailLink(email.trim());
      const name = nameFromLink || (() => {
        try {
          return sessionStorage.getItem("agni-link-name") ?? "";
        } catch {
          return "";
        }
      })();
      if (isNewUser) {
        if (name && !user.displayName) {
          try {
            const { setUserName } = await import("@/lib/firebase-client");
            await setUserName(name);
          } catch {
            // name can be added later
          }
        }
        setPhase("done");
        router.push("/auth/set-password?welcome=1");
      } else {
        setPhase("done");
        router.push("/dashboard?welcome=1");
      }
    } catch (err) {
      const msg = authErrorMessage(err);
      if (msg.includes("expired") || msg.includes("already used")) {
        setPhase("expired");
      } else {
        setError(msg);
        setPhase("form");
      }
    }
  }

  async function resend() {
    if (!email.trim() || resendBusy) return;
    setResendBusy(true);
    setError("");
    try {
      await sendEmailLink(email.trim(), "/auth/verify", nameFromLink || undefined);
      setResent(true);
      setPhase("form");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setResendBusy(false);
    }
  }

  return (
    <div className="container-x py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-[24px] font-semibold tracking-tight">
          {phase === "expired" ? "That link has expired" : "Verify your email"}
        </h1>

        {phase === "expired" ? (
          <div className="mt-5 flex flex-col gap-4">
            <p className="text-[13px] leading-relaxed text-ink2">
              Sign-in links work once and expire after a short time, so an old email
              can never open an account. Enter your address and we will send a fresh one.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); resend(); }} className="flex flex-col gap-3">
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
              {resent && (
                <p className="text-[12px] text-ok">
                  New link sent. Check your inbox — it works once.
                </p>
              )}
              <button type="submit" className="btn btn-primary" disabled={resendBusy}>
                {resendBusy ? "Sending…" : "Send a new link"}
              </button>
            </form>
            <p className="text-[11.5px] text-ink3">
              Rather use a password?{" "}
              <Link href="/login" className="underline underline-offset-2 hover:text-ink">
                Sign in instead
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={verify} className="mt-5 flex flex-col gap-4">
            <p className="text-[13px] leading-relaxed text-ink2">
              Confirm the address this link was sent to. This is the last step before
              your account opens.
            </p>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={!email}
            />
            {error && <p className="text-[12px] text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={phase === "working"}>
              {phase === "working" ? "Verifying…" : "Verify and continue"}
            </button>
            {resent && (
              <p className="text-[12px] text-ok">New link sent — open it to continue.</p>
            )}
            <button
              type="button"
              className="btn btn-ghost w-fit"
              onClick={resend}
              disabled={resendBusy}
            >
              {resendBusy ? "Sending…" : "Send me a new link"}
            </button>
          </form>
        )}

        {phase === "done" && (
          <p className="mt-5 text-[13px] text-ok">Verified. Taking you in…</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyInner />
    </Suspense>
  );
}
