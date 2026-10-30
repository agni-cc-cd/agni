import { describe, expect, it } from "vitest";
import { generateSlug, isValidSlug, normalizeTargetUrl } from "../lib/slug";

describe("isValidSlug", () => {
  it("accepts normal slugs", () => {
    expect(isValidSlug("abc")).toBe(true);
    expect(isValidSlug("my-link_2")).toBe(true);
    expect(isValidSlug("A1")).toBe(true);
  });

  it("rejects reserved, empty, and malformed slugs", () => {
    expect(isValidSlug("api")).toBe(false);
    expect(isValidSlug("Dashboard")).toBe(false);
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("has space")).toBe(false);
    expect(isValidSlug("a".repeat(65))).toBe(false);
  });
});

describe("generateSlug", () => {
  it("generates valid slugs of the requested length", () => {
    for (let i = 0; i < 50; i++) {
      const slug = generateSlug(7);
      expect(slug).toHaveLength(7);
      expect(isValidSlug(slug)).toBe(true);
    }
  });
});

describe("normalizeTargetUrl", () => {
  it("accepts http(s) URLs", () => {
    expect(normalizeTargetUrl("https://example.com/x")).toBe("https://example.com/x");
    expect(normalizeTargetUrl("http://example.com")).toBe("http://example.com/");
  });

  it("rejects dangerous or malformed URLs", () => {
    expect(normalizeTargetUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeTargetUrl("data:text/html,<b>x")).toBeNull();
    expect(normalizeTargetUrl("not a url")).toBeNull();
    expect(normalizeTargetUrl("")).toBeNull();
  });
});
