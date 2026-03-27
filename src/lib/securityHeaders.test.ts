import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy, buildSecurityHeaders } from "./securityHeaders";

function getDirectiveValue(policy: string, directiveName: string) {
  const directive = policy
    .split("; ")
    .find((entry) => entry.startsWith(`${directiveName} `) || entry === directiveName);

  if (!directive) {
    return null;
  }

  return directive === directiveName ? "" : directive.slice(directiveName.length + 1);
}

describe("securityHeaders", () => {
  it("builds a tighter production CSP around embeds and script attributes", () => {
    const policy = buildContentSecurityPolicy({
      nodeEnv: "production",
      supabaseUrl: "https://project.supabase.co",
    });

    expect(getDirectiveValue(policy, "frame-src")).toBe("'none'");
    expect(getDirectiveValue(policy, "child-src")).toBe("'none'");
    expect(getDirectiveValue(policy, "script-src-attr")).toBe("'none'");
    expect(getDirectiveValue(policy, "media-src")).toBe("'self'");
    expect(getDirectiveValue(policy, "connect-src")).toBe("'self' https://project.supabase.co");
    expect(getDirectiveValue(policy, "img-src")).toContain("https://project.supabase.co");
    expect(policy).toContain("upgrade-insecure-requests");
  });

  it("keeps development CSP compatible with local tooling", () => {
    const policy = buildContentSecurityPolicy({
      nodeEnv: "development",
      supabaseUrl: "https://project.supabase.co",
    });

    expect(getDirectiveValue(policy, "script-src")).toContain("'unsafe-eval'");
    expect(getDirectiveValue(policy, "connect-src")).toBe(
      "'self' https://project.supabase.co http: https: ws: wss:",
    );
    expect(policy).not.toContain("upgrade-insecure-requests");
  });

  it("drops invalid Supabase URLs instead of emitting malformed origins", () => {
    const policy = buildContentSecurityPolicy({
      nodeEnv: "production",
      supabaseUrl: "not a url",
    });

    expect(getDirectiveValue(policy, "connect-src")).toBe("'self'");
    expect(getDirectiveValue(policy, "img-src")).not.toContain("not a url");
  });

  it("only emits HSTS in production", () => {
    expect(
      buildSecurityHeaders({
        nodeEnv: "production",
      }).some((header) => header.key === "Strict-Transport-Security"),
    ).toBe(true);

    expect(
      buildSecurityHeaders({
        nodeEnv: "development",
      }).some((header) => header.key === "Strict-Transport-Security"),
    ).toBe(false);
  });
});
