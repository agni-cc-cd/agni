import { Suspense } from "react";
import { Dashboard } from "../components/dashboard";
import { RequireAuth } from "../components/require-auth";

export const metadata = { title: "Dashboard — agni" };

export default function DashboardPage() {
  return (
    <div className="container-x py-10">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight">Links</h1>
          <p className="mt-1 text-[12.5px] text-ink2">
            Manage your short links and watch clicks arrive in real time.
          </p>
        </div>
      </div>
      <RequireAuth>
        <Suspense fallback={<div className="shimmer h-96 w-full" />}>
          <Dashboard />
        </Suspense>
      </RequireAuth>
    </div>
  );
}
