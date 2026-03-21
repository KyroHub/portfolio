import { beforeEach, describe, expect, it, vi } from "vitest";

class RedirectError extends Error {
  constructor(readonly destination: string) {
    super(`Redirected to ${destination}`);
  }
}

type AuthModuleContext = {
  login: typeof import("./auth").login;
  signup: typeof import("./auth").signup;
  logout: typeof import("./auth").logout;
  consumeRateLimitMock: ReturnType<typeof vi.fn>;
  createClientMock: ReturnType<typeof vi.fn>;
  getClientRateLimitIdentifierMock: ReturnType<typeof vi.fn>;
  getAuthUnavailableLoginPathMock: ReturnType<typeof vi.fn>;
  hasSupabaseRuntimeEnvMock: ReturnType<typeof vi.fn>;
  revalidatePathMock: ReturnType<typeof vi.fn>;
  redirectMock: ReturnType<typeof vi.fn>;
  signInWithPasswordMock: ReturnType<typeof vi.fn>;
  signOutMock: ReturnType<typeof vi.fn>;
  signUpMock: ReturnType<typeof vi.fn>;
};

function createRedirectMock() {
  return vi.fn((destination: string) => {
    throw new RedirectError(destination);
  });
}

function createLoginFormData(overrides?: Partial<Record<"email" | "password" | "redirectTo", string>>) {
  const formData = new FormData();
  formData.set("email", overrides?.email ?? "user@example.com");
  formData.set("password", overrides?.password ?? "password123");

  if (overrides?.redirectTo !== undefined) {
    formData.set("redirectTo", overrides.redirectTo);
  }

  return formData;
}

async function loadAuthModule(options?: {
  hasEnv?: boolean;
  rateLimitOk?: boolean;
  signInError?: unknown;
  signOutError?: unknown;
  signUpError?: unknown;
  signUpSession?: unknown;
}) {
  vi.resetModules();

  const revalidatePathMock = vi.fn();
  const redirectMock = createRedirectMock();
  const consumeRateLimitMock = vi.fn().mockResolvedValue({
    ok: options?.rateLimitOk ?? true,
    remaining: 1,
    resetAt: Date.now() + 60_000,
    retryAfterMs: 60_000,
  });
  const getClientRateLimitIdentifierMock = vi.fn().mockResolvedValue("client-fingerprint");
  const getAuthUnavailableLoginPathMock = vi
    .fn((redirectTo?: string) =>
      redirectTo
        ? `/login?state=auth-unavailable&messageType=error&redirect_to=${encodeURIComponent(redirectTo)}`
        : "/login?state=auth-unavailable&messageType=error"
    );
  const hasSupabaseRuntimeEnvMock = vi.fn(() => options?.hasEnv ?? true);
  const signInWithPasswordMock = vi
    .fn()
    .mockResolvedValue({ error: options?.signInError ?? null });
  const signUpMock = vi.fn().mockResolvedValue({
    data: { session: options?.signUpSession ?? null },
    error: options?.signUpError ?? null,
  });
  const signOutMock = vi.fn().mockResolvedValue({ error: options?.signOutError ?? null });
  const createClientMock = vi.fn().mockResolvedValue({
    auth: {
      signInWithPassword: signInWithPasswordMock,
      signOut: signOutMock,
      signUp: signUpMock,
    },
  });

  vi.doMock("next/cache", () => ({
    revalidatePath: revalidatePathMock,
  }));
  vi.doMock("next/navigation", () => ({
    redirect: redirectMock,
  }));
  vi.doMock("@/lib/rateLimit", () => ({
    consumeRateLimit: consumeRateLimitMock,
    getClientRateLimitIdentifier: getClientRateLimitIdentifierMock,
  }));
  vi.doMock("@/lib/site", () => ({
    getSiteUrl: () => new URL("https://example.com"),
  }));
  vi.doMock("@/lib/supabase/config", () => ({
    getAuthUnavailableLoginPath: getAuthUnavailableLoginPathMock,
    hasSupabaseRuntimeEnv: hasSupabaseRuntimeEnvMock,
  }));
  vi.doMock("@/lib/supabase/server", () => ({
    createClient: createClientMock,
  }));

  const mod = await import("./auth");

  return {
    ...mod,
    consumeRateLimitMock,
    createClientMock,
    getClientRateLimitIdentifierMock,
    getAuthUnavailableLoginPathMock,
    hasSupabaseRuntimeEnvMock,
    revalidatePathMock,
    redirectMock,
    signInWithPasswordMock,
    signOutMock,
    signUpMock,
  } satisfies AuthModuleContext;
}

describe("auth actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects login attempts when auth is unavailable", async () => {
    const { createClientMock, getAuthUnavailableLoginPathMock, login } = await loadAuthModule({
      hasEnv: false,
    });

    await expect(login(createLoginFormData({ redirectTo: "/dashboard" }))).rejects.toMatchObject({
      destination: "/login?state=auth-unavailable&messageType=error&redirect_to=%2Fdashboard",
    });

    expect(getAuthUnavailableLoginPathMock).toHaveBeenCalledWith("/dashboard");
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("rejects invalid login input before contacting Supabase", async () => {
    const { createClientMock, login } = await loadAuthModule();

    await expect(
      login(createLoginFormData({ email: "bad-email", password: "" }))
    ).rejects.toMatchObject({
      destination:
        "/login?state=login-invalid-input&messageType=error&redirect_to=%2Fdashboard",
    });

    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("rate limits login attempts before contacting Supabase", async () => {
    const { createClientMock, login } = await loadAuthModule({
      rateLimitOk: false,
    });

    await expect(login(createLoginFormData({ redirectTo: "/dictionary" }))).rejects.toMatchObject({
      destination:
        "/login?state=login-rate-limited&messageType=error&redirect_to=%2Fdictionary",
    });

    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("normalizes login credentials and redirects to a safe local path", async () => {
    const { login, revalidatePathMock, signInWithPasswordMock } = await loadAuthModule();

    await expect(
      login(
        createLoginFormData({
          email: " USER@Example.com ",
          password: "password123",
          redirectTo: "https://evil.example",
        })
      )
    ).rejects.toMatchObject({
      destination: "/dashboard",
    });

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
    expect(revalidatePathMock).toHaveBeenCalledWith("/", "layout");
  });

  it("rejects invalid signup input before contacting Supabase", async () => {
    const { createClientMock, signup } = await loadAuthModule();

    await expect(
      signup(createLoginFormData({ email: "invalid", password: "short" }))
    ).rejects.toMatchObject({
      destination: "/login?state=signup-invalid-input&messageType=error",
    });

    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("redirects to the email confirmation state when signup has no session", async () => {
    const { revalidatePathMock, signup, signUpMock } = await loadAuthModule({
      signUpSession: null,
    });

    await expect(signup(createLoginFormData())).rejects.toMatchObject({
      destination: "/login?state=signup-check-email&messageType=success",
    });

    expect(signUpMock).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
      options: {
        emailRedirectTo:
          "https://example.com/login?state=signup-confirmed&messageType=success",
      },
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("signs out and redirects back to login", async () => {
    const { logout, revalidatePathMock, signOutMock } = await loadAuthModule();

    await expect(logout()).rejects.toMatchObject({
      destination: "/login",
    });

    expect(signOutMock).toHaveBeenCalled();
    expect(revalidatePathMock).toHaveBeenCalledWith("/", "layout");
  });
});
