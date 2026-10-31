"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { loginHref } from "@/lib/drafts";
import { useAuth } from "./authed";

/**
 * Client-side auth guard for dashboard routes. When a page needs auth, the
 * user is sent to /login?next=<full path+query+hash> and returned to that
 * exact page once signed in. Server APIs still enforce 401.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(loginHref());
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex flex-col gap-3">
        <div className="shimmer h-8 w-48" />
        <div className="shimmer h-24 w-full" />
        <div className="shimmer h-56 w-full" />
      </div>
    );
  }

  return <>{children}</>;
}
