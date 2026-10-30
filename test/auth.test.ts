import { describe, expect, it } from "vitest";
import { authenticate, isAdminAuthorized } from "../lib/auth";

function req(auth?: string): Request {
  return new Request("https://agni.cc.cd/api/links", {
    headers: auth ? { authorization: auth } : {},
  });
}

describe("isAdminAuthorized", () => {
  it("allows everything when no token is configured (open mode)", () => {
    expect(isAdminAuthorized(req(), undefined)).toBe(true);
    expect(isAdminAuthorized(req("Bearer whatever"), undefined)).toBe(true);
  });

  it("requires the exact admin bearer token when configured", () => {
    expect(isAdminAuthorized(req("Bearer s3cret"), "s3cret")).toBe(true);
    // The Fetch API trims header OWS before it reaches the handler, so a
    // trailing space on the wire is equivalent to no trailing space.
    expect(isAdminAuthorized(req("Bearer s3cret "), "s3cret")).toBe(true);
    expect(isAdminAuthorized(req("Bearer wrong"), "s3cret")).toBe(false);
    expect(isAdminAuthorized(req(), "s3cret")).toBe(false);
    expect(isAdminAuthorized(req("Basic s3cret"), "s3cret")).toBe(false);
    expect(isAdminAuthorized(req("Bearer s3cret extra"), "s3cret")).toBe(false);
    expect(isAdminAuthorized(req("Bearer  s3cret"), "s3cret")).toBe(false);
  });
});

describe("authenticate", () => {
  it("is open mode when no admin token is configured", async () => {
    await expect(authenticate(req("Bearer anything"), undefined)).resolves.toBe("open");
  });

  it("accepts the admin token", async () => {
    await expect(authenticate(req("Bearer s3cret"), "s3cret")).resolves.toBe("open");
  });

  it("rejects missing or malformed headers when a token is configured", async () => {
    await expect(authenticate(req(), "s3cret")).resolves.toBeNull();
    await expect(authenticate(req("Basic s3cret"), "s3cret")).resolves.toBeNull();
  });

  it("rejects non-Firebase bearer tokens when admin token is configured", async () => {
    await expect(authenticate(req("Bearer not-a-jwt"), "s3cret")).resolves.toBeNull();
  });
});
