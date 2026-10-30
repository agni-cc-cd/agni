"use client";

import { useState } from "react";
import {
  authErrorMessage,
  sendEmailSignInLink,
  signInGuest,
  signInWithProvider,
  type ProviderId,
  type User,
} from "@/lib/firebase-client";
import {
  FacebookIcon,
  GithubIcon,
  GoogleIcon,
  GuestIcon,
  MailIcon,
  MicrosoftIcon,
  XIcon,
  YahooIcon,
} from "./icons";

const PROVIDERS: { id: ProviderId; label: string; Icon: (p: { size?: number }) => React.ReactElement }[] = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "github", label: "GitHub", Icon: GithubIcon },
  { id: "microsoft", label: "Microsoft", Icon: MicrosoftIcon },
  { id: "twitter", label: "X", Icon: XIcon },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
  { id: "yahoo", label: "Yahoo", Icon: YahooIcon },
];

/** Multi-provider sign-in: 6 social buttons + magic email + instant guest. */
export function SignInPanel({ onAuthChange }: { onAuthChange: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(key: string, fn: () => Promise<User | void>) {
    setBusy(key);
    setError(null);
    setMessage(null);
    try {
      const u = await fn();
      if (u) onAuthChange(u);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {PROVIDERS.map(({ id, label, Icon }) => (
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

      <div className="flex items-center gap-3">
        <hr className="divider flex-1" />
        <span className="faint text-[11px]">or</span>
        <hr className="divider flex-1" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="input flex-1"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy !== null || !email}
            onClick={() =>
              run("email", async () => {
                await sendEmailSignInLink(email);
                setMessage(`Sign-in link sent to ${email}. Check your inbox.`);
              })
            }
          >
            <MailIcon size={14} />
            {busy === "email" ? "Sending..." : "Email link"}
          </button>
        </div>
        <p className="faint text-[11px]">
          Passwordless: we email you a one-time sign-in link. No password to remember.
        </p>
      </div>

      <button
        type="button"
        className="btn btn-ghost w-full"
        disabled={busy !== null}
        onClick={() => run("guest", () => signInGuest())}
      >
        <GuestIcon size={15} />
        {busy === "guest" ? "Starting..." : "Continue as guest"}
      </button>

      {message && <p className="text-[12px] text-ok">{message}</p>}
      {error && <p className="text-[12px] text-danger">{error}</p>}
    </div>
  );
}
