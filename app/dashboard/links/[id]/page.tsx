import { LinkAnalytics } from "@/app/components/link-analytics";
import { RequireAuth } from "@/app/components/require-auth";

export const metadata = { title: "Link analytics — agni" };

export default async function LinkAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container-x py-10">
      <RequireAuth>
        <LinkAnalytics id={id} />
      </RequireAuth>
    </div>
  );
}
