"use client";

import { useState } from "react";
import type { ConfirmationResult } from "firebase/auth";
import {
  authErrorMessage,
  confirmPhoneCode,
  sendPhoneCode,
  sendPasswordReset,
  signInEmail,
  signInGuest,
  signInWithProvider,
  signUpEmail,
  type ProviderId,
  type User,
} from "@/lib/firebase-client";
import {
  AppleIcon,
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  GuestIcon,
  KeyIcon,
  MailIcon,
  PhoneIcon,
} from "./icons";
import { useToast } from "./toast";

const SOCIALS: { id: ProviderId; label: string; Icon: (p: { size?: number }) => React.ReactElement }[] = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "apple", label: "Apple", Icon: AppleIcon },
  { id: "github", label: "GitHub", Icon: GithubIcon },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
];

/**
 * Sign-in surface: top 3 methods (email/password, phone, anonymous guest),
 * then the 4 social providers. Transient feedback goes to the toast chips.
 */
export function SignInPanel({ onAuthChange }: { onAuthChange: (user: User) => void }) {
  const { push } = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [creating, setCreating] = useState(false);

  // Email/password form state.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone flow state.
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  async function run(key: string, fn: () => Promise<User | void>) {
    setBusy(key);
    try {
      const u = await fn();
      if (u) onAuthChange(u);
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
      {/* Top 3: email/password and phone behind a compact switch, guest below. */}
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
            onClick={() => setMode(id)}
          >
            <Icon width={13} height={13} />
            {label}
          </button>
        ))}
      </div>

      {mode === "email" && (
        <form
          className={formGap}
          onSubmit={(e) => {
            e.preventDefault();
            if (!email || !password) return;
            run("email", async () => {
              const u = creating ? await signUpEmail(email, password) : await signInEmail(email, password);
              push({ kind: "success", message: creating ? "Account created. Welcome to agni." : "Signed in." });
              return u;
            });
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
            autoComplete={creating ? "new-password" : "current-password"}
            required
            minLength={6}
          />
          <button type="submit" className="btn btn-primary w-full" disabled={busy !== null}>
            <KeyIcon width={14} height={14} />
            {busy === "email"
              ? "Working..."
              : creating
                ? "Create account"
                : "Sign in with email"}
          </button>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-[11px] text-ink3 underline-offset-2 hover:text-ink2 hover:underline"
              onClick={() => setCreating((v) => !v)}
            >
              {creating ? "I already have an account" : "Create an account"}
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
              });
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
                Standard message rates may apply. We only use your number to sign you in.
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
          })
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
            onClick={() => run(id, () => signInWithProvider(id))}
          >
            <Icon size={15} />
            {busy === id ? "Connecting..." : label}
          </button>
        ))}
      </div>
    </div>
  );
}
