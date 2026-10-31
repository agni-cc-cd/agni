import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

/**
 * Multi-tenant auth for a public product. Two accepted principals:
 *
 * 1. `Authorization: Bearer <firebase-id-token>` — any signed-in user
 *    (email/password, phone, Google, Apple, GitHub, Facebook, or anonymous
 *    guest), verified against Google JWKS. The uid owns the user's links.
 * 2. `Authorization: Bearer <ADMIN_TOKEN>` — instance secret for ops/CI,
 *    mapped to the "open" (admin) principal. If no secret is configured the
 *    instance runs in "open mode" (local demos only).
 */

const FIREBASE_PROJECT_ID = "agni-dd35c";
const JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

// Cache Google's rotating signing keys across requests (Workers keep isolates warm).
let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}

export type Principal = AuthenticatedUser | "open";

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer (\S+)$/.exec(header);
  return match ? match[1] : null;
}

export async function verifyFirebaseToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    jwks ??= createRemoteJWKSet(new URL(JWKS_URL));
    const { payload } = await jwtVerify(token, jwks, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    const p = payload as JWTPayload & {
      user_id?: string;
      email?: string;
      name?: string;
      picture?: string;
    };
    if (!p.sub) return null;
    return { uid: p.sub, email: p.email, name: p.name, picture: p.picture };
  } catch {
    return null;
  }
}

export async function authenticate(
  request: Request,
  adminToken: string | undefined,
): Promise<Principal | null> {
  const token = bearerToken(request);
  if (!token) return adminToken ? null : "open";

  if (adminToken && token === adminToken) return "open";

  const user = await verifyFirebaseToken(token);
  if (user) return user;

  if (!adminToken) return "open";
  return null;
}

/** Owner check: admin ("open") passes; users only touch their own rows. */
export function ownsLink(principal: Principal, link: { created_by: string }): boolean {
  return principal === "open" || principal.uid === link.created_by;
}

export function isAdminAuthorized(request: Request, adminToken: string | undefined): boolean {
  if (!adminToken) return true;
  const token = bearerToken(request);
  return token !== null && token === adminToken;
}

export function unauthorized(): Response {
  return Response.json(
    {
      error: "Please sign in to continue.",
      code: "auth_required",
    },
    { status: 401 },
  );
}

export function forbidden(): Response {
  return Response.json(
    {
      error: "You can only manage links you created.",
      code: "forbidden",
    },
    { status: 403 },
  );
}
