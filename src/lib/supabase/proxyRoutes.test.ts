import { describe, expect, it } from "vitest";
import { requiresAuthSessionProxy } from "./proxyRoutes";

describe("requiresAuthSessionProxy", () => {
  it("matches protected dashboard and admin routes", () => {
    expect(requiresAuthSessionProxy("/dashboard")).toBe(true);
    expect(requiresAuthSessionProxy("/admin")).toBe(true);
    expect(requiresAuthSessionProxy("/nl/dashboard")).toBe(true);
    expect(requiresAuthSessionProxy("/en/dashboard/settings")).toBe(true);
  });

  it("matches the password update route", () => {
    expect(requiresAuthSessionProxy("/update-password")).toBe(true);
  });

  it("skips public API, data, and content routes", () => {
    expect(requiresAuthSessionProxy("/api/v1/grammar")).toBe(false);
    expect(requiresAuthSessionProxy("/data/dictionary.json")).toBe(false);
    expect(requiresAuthSessionProxy("/en/dictionary")).toBe(false);
    expect(requiresAuthSessionProxy("/en/grammar/lesson-1")).toBe(false);
  });
});
