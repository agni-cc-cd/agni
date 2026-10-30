import { authenticate, unauthorized } from "@/lib/auth";
import { ensureSchema, upsertUser } from "@/lib/db";
import { getEnv } from "@/lib/env";

export async function GET(request: Request) {
  const { DB, ADMIN_TOKEN } = getEnv();
  const auth = await authenticate(request, ADMIN_TOKEN);
  if (!auth) return unauthorized();
  await ensureSchema(DB);

  if (auth === "open") {
    return Response.json({
      user: { uid: "admin", email: null, name: "Admin", picture: null, plan: "admin", created_at: null },
    });
  }
  const user = await upsertUser(DB, {
    uid: auth.uid,
    email: auth.email,
    name: auth.name,
    picture: auth.picture,
  });
  return Response.json({ user });
}
