"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { safeNext } from "@/lib/drafts";
import { useAuth } from "../components/authed";
import { ArrowUpRightIcon, CheckIcon } from "../components/icons";
import { SignInPanel } from "../components/sign-in";

function LoginInner() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params?.get("next"), "/dashboard");

  useEffect(() => {
    if (!loading && user && !user.isAnonymous) {
      router.replace(next);
    }
  }, [user, loading, next, router]);

  return (
    <div className="container-x flex flex-col items-center gap-8 py-14">
      <div className="flex w-full max-w-sm flex-col gap-5">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[20px] font-semibold tracking-tight">Sign in to agni</h1>
          <p className="max-w-xs text-[12.5px] text-ink2">
            One account for your links, analytics and dashboard. Free forever.
          </p>
        </div>

        <div className="card p-5">
          <SignInPanel
            onAuthChange={(u) => {
              setUser(u);
              router.replace(next);
            }}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface2 px-4 py-3.5">
          {["Complete click analytics on every link", "Links stay attached to your account", "Upgrade from guest without losing anything"].map(
            (t) => (
              <p key={t} className="flex items-start gap-2 text-[11.5px] text-ink2">
                <span className="mt-0.5 text-ok">
                  <CheckIcon width={11} height={11} />
                </span>
                {t}
              </p>
            ),
          )}
        </div>

        <p className="text-center text-[11px] text-ink3">
          Just testing it out?{" "}
          <Link href="/#shorten" className="underline underline-offset-2 hover:text-ink2">
            Shorten a link without signing in
            <ArrowUpRightIcon width={10} height={10} className="ml-0.5 inline-block align-[-1px]" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-x py-14" />}>
      <LoginInner />
    </Suspense>
  );
}
