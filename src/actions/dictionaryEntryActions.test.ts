import { beforeEach, describe, expect, it, vi } from "vitest";

type DictionaryEntryActionsModuleContext = {
  consumeRateLimitMock: ReturnType<typeof vi.fn>;
  fromMock: ReturnType<typeof vi.fn>;
  getAuthenticatedServerContextMock: ReturnType<typeof vi.fn>;
  getDictionaryEntryByIdMock: ReturnType<typeof vi.fn>;
  hasSupabaseRuntimeEnvMock: ReturnType<typeof vi.fn>;
  insertMock: ReturnType<typeof vi.fn>;
  sendEmailMock: ReturnType<typeof vi.fn>;
  submitEntryReport: typeof import("./dictionaryEntryActions").submitEntryReport;
};

const ORIGINAL_ENV = {
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

function createReportFormData(
  overrides?: Partial<Record<"commentary" | "entryId" | "language" | "reason", string>>,
) {
  const formData = new FormData();
  formData.set("language", overrides?.language ?? "en");
  formData.set("entryId", overrides?.entryId ?? "cd_173");
  formData.set("reason", overrides?.reason ?? "translation");
  formData.set(
    "commentary",
    overrides?.commentary ?? "The Dutch meaning could use a clearer gloss here.",
  );
  return formData;
}

async function loadDictionaryEntryActionsModule(options?: {
  authContext?: null | {
    supabase: {
      from: (table: string) => {
        insert: (payload: unknown) => Promise<{ error: unknown }>;
      };
    };
    user: {
      email: string | null;
      id: string;
    };
  };
  dictionaryEntry?: {
    headword: string;
    id: string;
  } | null;
  hasEnv?: boolean;
  insertError?: {
    code?: string;
    details?: string | null;
    hint?: string | null;
    message?: string;
  } | null;
  rateLimitOk?: boolean;
  sendEmailError?: {
    message: string;
    name: string;
    statusCode: number | null;
  } | null;
}) {
  vi.resetModules();

  if (options?.hasEnv === false) {
    delete process.env.CONTACT_EMAIL;
    delete process.env.RESEND_API_KEY;
  } else {
    process.env.CONTACT_EMAIL = "owner@example.com";
    process.env.RESEND_API_KEY = "test-resend-key";
  }

  const insertMock = vi.fn().mockResolvedValue({
    error: options?.insertError ?? null,
  });
  const fromMock = vi.fn(() => ({
    insert: insertMock,
  }));
  const getAuthenticatedServerContextMock = vi
    .fn()
    .mockResolvedValue(
      options?.authContext === undefined
        ? {
            supabase: {
              from: fromMock,
            },
            user: {
              email: "reporter@example.com",
              id: "user-123",
            },
          }
        : options.authContext,
    );
  const getDictionaryEntryByIdMock = vi
    .fn()
    .mockReturnValue(
      options?.dictionaryEntry === undefined
        ? {
            headword: "ϭⲟⲗ",
            id: "cd_173",
          }
        : options.dictionaryEntry,
    );
  const hasSupabaseRuntimeEnvMock = vi
    .fn()
    .mockReturnValue(options?.hasEnv ?? true);
  const consumeRateLimitMock = vi.fn().mockResolvedValue({
    ok: options?.rateLimitOk ?? true,
    remaining: 4,
    resetAt: Date.now() + 60_000,
    retryAfterMs: 60_000,
  });
  const getUserRateLimitIdentifierMock = vi.fn().mockReturnValue("hashed-user-id");
  const sendEmailMock = vi.fn().mockResolvedValue(
    options?.sendEmailError
      ? {
          data: null,
          error: options.sendEmailError,
        }
      : {
          data: { id: "email_123" },
          error: null,
        },
  );

  vi.doMock("@/features/dictionary/lib/dictionary", () => ({
    getDictionaryEntryById: getDictionaryEntryByIdMock,
  }));
  vi.doMock("@/lib/rateLimit", () => ({
    consumeRateLimit: consumeRateLimitMock,
    getUserRateLimitIdentifier: getUserRateLimitIdentifierMock,
  }));
  vi.doMock("@/lib/supabase/auth", () => ({
    getAuthenticatedServerContext: getAuthenticatedServerContextMock,
  }));
  vi.doMock("@/lib/supabase/config", () => ({
    hasSupabaseRuntimeEnv: hasSupabaseRuntimeEnvMock,
  }));
  vi.doMock("resend", () => ({
    Resend: class {
      emails = {
        send: sendEmailMock,
      };
    },
  }));

  const mod = await import("./dictionaryEntryActions");

  return {
    ...mod,
    consumeRateLimitMock,
    fromMock,
    getAuthenticatedServerContextMock,
    getDictionaryEntryByIdMock,
    hasSupabaseRuntimeEnvMock,
    insertMock,
    sendEmailMock,
  } satisfies DictionaryEntryActionsModuleContext;
}

describe("dictionary entry actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CONTACT_EMAIL = ORIGINAL_ENV.CONTACT_EMAIL;
    process.env.RESEND_API_KEY = ORIGINAL_ENV.RESEND_API_KEY;
  });

  it("returns a storage error when Supabase runtime env vars are missing", async () => {
    const { getAuthenticatedServerContextMock, submitEntryReport } =
      await loadDictionaryEntryActionsModule({ hasEnv: false });

    await expect(
      submitEntryReport(null, createReportFormData({ language: "nl" })),
    ).resolves.toEqual({
      success: false,
      error: "Het melden van lemma's is nog niet geconfigureerd.",
    });

    expect(getAuthenticatedServerContextMock).not.toHaveBeenCalled();
  });

  it("requires an authenticated user before submitting a report", async () => {
    const { consumeRateLimitMock, submitEntryReport } =
      await loadDictionaryEntryActionsModule({
        authContext: null,
      });

    await expect(submitEntryReport(null, createReportFormData())).resolves.toEqual({
      success: false,
      error: "Please sign in before reporting an entry.",
    });

    expect(consumeRateLimitMock).not.toHaveBeenCalled();
  });

  it("rejects invalid report payloads before rate limiting or inserting", async () => {
    const { consumeRateLimitMock, insertMock, submitEntryReport } =
      await loadDictionaryEntryActionsModule();

    await expect(
      submitEntryReport(
        null,
        createReportFormData({
          commentary: "too short",
          reason: "not-a-real-reason",
        }),
      ),
    ).resolves.toEqual({
      success: false,
      error: "Please choose a reason and include a short explanation.",
    });

    expect(consumeRateLimitMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns a friendly error when report submissions are rate limited", async () => {
    const { insertMock, sendEmailMock, submitEntryReport } =
      await loadDictionaryEntryActionsModule({
        rateLimitOk: false,
      });

    await expect(submitEntryReport(null, createReportFormData())).resolves.toEqual({
      success: false,
      error:
        "Too many reports were sent recently. Please wait a bit before submitting another one.",
    });

    expect(insertMock).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("returns a configuration error when the entry_reports table is unavailable", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { sendEmailMock, submitEntryReport } =
      await loadDictionaryEntryActionsModule({
        insertError: {
          code: "42P01",
          message: 'relation "entry_reports" does not exist',
        },
      });

    await expect(submitEntryReport(null, createReportFormData())).resolves.toEqual({
      success: false,
      error: "Entry reports are not configured yet.",
    });

    expect(sendEmailMock).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("stores a normalized report and still succeeds when the email notification fails", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { insertMock, sendEmailMock, submitEntryReport } =
      await loadDictionaryEntryActionsModule({
        sendEmailError: {
          message: "Domain not verified",
          name: "validation_error",
          statusCode: 422,
        },
      });

    await expect(
      submitEntryReport(
        null,
        createReportFormData({
          commentary: "  The Dutch translation looks too broad.\n\n  Maybe use a narrower gloss.  ",
        }),
      ),
    ).resolves.toEqual({
      success: true,
      message: "Thanks. Your report was submitted successfully.",
    });

    expect(insertMock).toHaveBeenCalledWith({
      commentary:
        "The Dutch translation looks too broad.\n\nMaybe use a narrower gloss.",
      entry_headword: "ϭⲟⲗ",
      entry_id: "cd_173",
      reason: "translation",
      status: "open",
      user_id: "user-123",
    });
    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "Dictionary entry report: ϭⲟⲗ (cd_173)",
        text: expect.stringContaining("Reason: translation"),
      }),
    );

    consoleErrorSpy.mockRestore();
  });
});
