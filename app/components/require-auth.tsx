"use client";

import type { ReactNode } from "react";
import { useAuth } from "./authed";
import { SignInPanel } from "./sign-in";
import { ShieldIcon } from "./icons";

/** Client-side auth guard for dashboard routes. Server APIs still enforce 401. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, setUser } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="shimmer h-8 w-48" />
        <div className="shimmer h-24 w-full" />
        <div className="shimmer h-56 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-sm flex-col gap-5 py-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface2 text-ink2">
            <ShieldIcon width={17} height={17} />
          </span>
          <h1 className="text-[17px] font-semibold tracking-tight">Sign in to your dashboard</h1>
          <p className="max-w-xs text-[12px] text-ink2">
            Your links and analytics live behind your account. Sign in with any provider — or
            continue as a guest.
          </p>
        </div>
        <div className="card p-5">
          <SignInPanel onAuthChange={setUser} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
