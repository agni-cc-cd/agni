import { BlogAdmin } from "@/app/components/blog-admin";
import { RequireAuth } from "@/app/components/require-auth";

export const metadata = { title: "Blog CMS — agni" };

export default function BlogAdminPage() {
  return (
    <div className="container-x py-10">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold tracking-tight">Blog</h1>
        <p className="mt-1 text-[12.5px] text-ink2">
          Write, edit and publish posts. Markdown in, fast pages out.
        </p>
      </div>
      <RequireAuth>
        <BlogAdmin />
      </RequireAuth>
    </div>
  );
}
