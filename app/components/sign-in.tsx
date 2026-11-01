"use client";

import { useState } from "react";
import type { ConfirmationResult } from "firebase/auth";
import { trackEvent } from "@/lib/events";
import {
  authErrorMessage,
  confirmPhoneCode,
  sendEmailLink,
  sendPasswordReset,
  sendPhoneCode,
  signInEmail,
  signInGuest,
  signInWithProvider,
  type ProviderId,
  type User,
} from "@/lib/firebase-client";
import {
  GithubIcon,
  GoogleIcon,
  GuestIcon,
  KeyIcon,
  MailIcon,
  PhoneIcon,
} from "./icons";
import { useToast } from "./toast";

// Exactly two social providers. Everything else is email (verification-first),
// phone, or a guest session.
const SOCIALS: { id: ProviderId; label: string; Icon: (p: { size?: number }) => React.ReactElement }[] = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "github", label: "GitHub", Icon: GithubIcon },
];

/**
 * Sign-in surface. Account creation is verification-first: name + email →
 * a one-time link → the account opens on click → set a password. Returning
 * users sign in with email + password, a one-time link, phone, or a social.
 */
export function SignInPanel({ onAuthChange }: { onAuthChange: (user: User) => void }) {
  const { push } = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [emailMode, setEmailMode] = useState<"create" | "signin">("create");
  const [sent, setSent] = useState(false);

  // Create-account form: name + email only.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Returning sign-in form.
  const [password, setPassword] = useState("");

  // Phone flow state.
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  async function run(key: string, fn: () => Promise<User | void>, method?: string) {
    setBusy(key);
    try {
      const u = await fn();
      if (u) {
        if (method) trackEvent("login", { method });
        onAuthChange(u);
      }
    } catch (err) {
      push({ kind: "error", message: authErrorMessage(err) });
    } finally {
      setBusy(null);
    }
  }

  const inputCls = "input w-full";
  const formGap = "flex flex-col gap-2";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex rounded-lg border border-line bg-surface2 p-0.5" role="tablist" aria-label="Sign-in method">
        {(
          [
            { id: "email", label: "Email", Icon: MailIcon },
            { id: "phone", label: "Phone", Icon: PhoneIcon },
          ] as const
        ).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
              mode === id ? "bg-surface text-ink shadow-sm" : "text-ink3 hover:text-ink2"
            }`}
            onClick={() => {
              setMode(id);
              setSent(false);
            }}
          >
            <Icon width={13} height={13} />
            {label}
          </button>
        ))}
      </div>

      {mode === "email" && sent && (
        <div className="card flex flex-col gap-3 p-5">
          <p className="text-[13px] font-medium text-ink">Check your email</p>
          <p className="text-[12px] leading-relaxed text-ink2">
            We sent a one-time link to <span className="text-ink">{email}</span>. Open
            it to verify your address — the link works once and expires shortly.
          </p>
          <button
            type="button"
            className="btn btn-ghost w-fit"
            disabled={busy !== null}
            onClick={() =>
              run("resend", async () => {
                await sendEmailLink(email, "/auth/verify", emailMode === "create" ? name : undefined);
                push({ message: "New link sent. The old one stopped working." });
                trackEvent("email_link_resent");
              })
            }
          >
            {busy === "resend" ? "Sending..." : "Send a new link"}
          </button>
          <button
            type="button"
            className="text-[11px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline"
            onClick={() => setSent(false)}
          >
            Wrong address? Go back
          </button>
        </div>
      )}

      {mode === "email" && !sent && (
        <>
          <div className="flex rounded-lg border border-line bg-surface2 p-0.5" role="tablist" aria-label="Email method">
            {(
              [
                { id: "create", label: "Create account" },
                { id: "signin", label: "Sign in" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={emailMode === id}
                className={`flex flex-1 items-center justify-center rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  emailMode === id ? "bg-surface text-ink shadow-sm" : "text-ink3 hover:text-ink2"
                }`}
                onClick={() => {
                  setEmailMode(id);
                  setPassword("");
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {emailMode === "create" ? (
            <form
              className={formGap}
              onSubmit={(e) => {
                e.preventDefault();
                if (!name || !email) return;
                run("create", async () => {
                  await sendEmailLink(email, "/auth/verify", name);
                  trackEvent("sign_up", { method: "email_link" });
                  setSent(true);
                });
              }}
            >
              <input
                className={inputCls}
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Your name"
                autoComplete="name"
                maxLength={80}
                required
              />
              <input
                className={inputCls}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                autoComplete="email"
                required
              />
              <button type="submit" className="btn btn-primary w-full" disabled={busy !== null}>
                <MailIcon width={14} height={14} />
                {busy === "create" ? "Sending link..." : "Send verification link"}
              </button>
              <p className="text-[11px] leading-relaxed text-ink3">
                We send a one-time link first — no password needed until your email
                is verified. The account opens only when you click it.
              </p>
            </form>
          ) : (
            <form
              className={formGap}
              onSubmit={(e) => {
                e.preventDefault();
                if (!email || !password) return;
                run("email", async () => {
                  const u = await signInEmail(email, password);
                  push({ kind: "success", message: "Signed in." });
                  return u;
                }, "email_password");
              }}
            >
              <input
                className={inputCls}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                autoComplete="email"
                required
              />
              <input
                className={inputCls}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                autoComplete="current-password"
                required
                minLength={6}
              />
              <button type="submit" className="btn btn-primary w-full" disabled={busy !== null}>
                <KeyIcon width={14} height={14} />
                {busy === "email" ? "Signing in..." : "Sign in with password"}
              </button>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-[11px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline"
                  disabled={busy !== null || !email}
                  onClick={() =>
                    run("link", async () => {
                      await sendEmailLink(email, "/auth/verify");
                      trackEvent("email_link_requested");
                      setSent(true);
                    })
                  }
                >
                  Email me a sign-in link instead
                </button>
                <button
                  type="button"
                  className="text-[11px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline"
                  disabled={busy !== null || !email}
                  onClick={() =>
                    run("reset", async () => {
                      await sendPasswordReset(email);
                      push({ message: `If ${email} has an account, a reset link is on its way.` });
                    })
                  }
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {mode === "phone" && (
        <form
          className={formGap}
          onSubmit={(e) => {
            e.preventDefault();
            if (confirmation) {
              if (!code) return;
              run("verify", async () => {
                const u = await confirmPhoneCode(confirmation, code);
                push({ kind: "success", message: "Signed in." });
                return u;
              }, "phone");
            } else {
              if (!phone) return;
              run("sms", async () => {
                const conf = await sendPhoneCode(phone);
                setConfirmation(conf);
                push({ message: `We texted a code to ${phone}.` });
              });
            }
          }}
        >
          {confirmation ? (
            <>
              <input
                className={inputCls}
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                aria-label="Verification code"
                autoComplete="one-time-code"
                required
              />
              <button type="submit" className="btn btn-primary w-full" disabled={busy !== null}>
                {busy === "verify" ? "Verifying..." : "Verify code"}
              </button>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-[11px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline"
                  disabled={busy !== null}
                  onClick={() =>
                    run("sms", async () => {
                      const conf = await sendPhoneCode(phone);
                      setConfirmation(conf);
                      push({ message: `We texted a new code to ${phone}.` });
                    })
                  }
                >
                  Send it again
                </button>
                <button
                  type="button"
                  className="text-[11px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline"
                  onClick={() => {
                    setConfirmation(null);
                    setCode("");
                  }}
                >
                  Use a different number
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                className={inputCls}
                type="tel"
                placeholder="+14155550100"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-label="Phone number"
                autoComplete="tel"
                required
              />
              <button type="submit" className="btn btn-primary w-full" disabled={busy !== null}>
                <PhoneIcon width={14} height={14} />
                {busy === "sms" ? "Sending..." : "Text me a code"}
              </button>
              <p className="text-[11px] text-ink3">
                Include the country code. Standard message rates may apply — we only
                use your number to sign you in.
              </p>
            </>
          )}
          {/* Invisible reCAPTCHA mounts here for phone verification. */}
          <div id="recaptcha-container" />
        </form>
      )}

      <button
        type="button"
        className="btn btn-ghost w-full"
        disabled={busy !== null}
        onClick={() =>
          run("guest", async () => {
            const u = await signInGuest();
            push({ kind: "success", message: "You're in as a guest. Sign in later to keep your links." });
            return u;
          }, "guest")
        }
      >
        <GuestIcon width={15} height={15} />
        {busy === "guest" ? "Starting..." : "Continue as guest"}
      </button>

      <div className="flex items-center gap-3">
        <hr className="divider flex-1" />
        <span className="faint text-[11px]">or</span>
        <hr className="divider flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SOCIALS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className="btn btn-ghost w-full"
            disabled={busy !== null}
            onClick={() => run(id, () => signInWithProvider(id), id)}
          >
            <Icon size={15} />
            {busy === id ? "Connecting..." : label}
          </button>
        ))}
      </div>
    </div>
  );
}
