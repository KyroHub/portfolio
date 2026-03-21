import { beforeEach, describe, expect, it, vi } from "vitest";

type CallbackRouteContext = {
  GET: typeof import("./route").GET;
  createClientMock: ReturnType<typeof vi.fn>;
  exchangeCodeForSessionMock: ReturnType<typeof vi.fn>;
};

async function loadCallbackRoute(options?: {
  exchangeError?: unknown;
  siteUrl?: string;
}) {
  vi.resetModules();

  const exchangeCodeForSessionMock = vi
    .fn()
    .mockResolvedValue({ error: options?.exchangeError ?? null });
  const createClientMock = vi.fn().mockResolvedValue({
    auth: {
      exchangeCodeForSession: exchangeCodeForSessionMock,
    },
  });

  vi.doMock("@/lib/supabase/server", () => ({
    createClient: createClientMock,
  }));
  vi.doMock("@/lib/site", () => ({
    getSiteUrl: () =>
      new URL(options?.siteUrl ?? "https://www.kyrilloswannes.com"),
  }));

  const mod = await import("./route");

  return {
    ...mod,
    createClientMock,
    exchangeCodeForSessionMock,
  } satisfies CallbackRouteContext;
}

describe("auth callback route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to safe local paths after exchanging the auth code", async () => {
    const { GET, exchangeCodeForSessionMock } = await loadCallbackRoute();

    const response = await GET(
      new Request(
        "https://www.kyrilloswannes.com/auth/callback?code=test-code&next=/update-password",
      ),
    );

    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith("test-code");
    expect(response.headers.get("location")).toBe(
      "https://www.kyrilloswannes.com/update-password",
    );
  });

  it("allows exact same-origin absolute redirects", async () => {
    const { GET } = await loadCallbackRoute();

    const response = await GET(
      new Request(
        "https://www.kyrilloswannes.com/auth/callback?code=test-code&next=https://www.kyrilloswannes.com/dashboard?tab=profile",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://www.kyrilloswannes.com/dashboard?tab=profile",
    );
  });

  it("rejects attacker-controlled lookalike origins and falls back to the dashboard", async () => {
    const { GET } = await loadCallbackRoute();

    const response = await GET(
      new Request(
        "https://www.kyrilloswannes.com/auth/callback?code=test-code&next=https://www.kyrilloswannes.com.evil.example/steal",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://www.kyrilloswannes.com/dashboard",
    );
  });
});
