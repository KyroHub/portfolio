import { beforeEach, describe, expect, it, vi } from "vitest";

type ContactModuleContext = {
  sendContactEmail: typeof import("./contact").sendContactEmail;
  consumeRateLimitMock: ReturnType<typeof vi.fn>;
  getClientRateLimitIdentifierMock: ReturnType<typeof vi.fn>;
  sendEmailMock: ReturnType<typeof vi.fn>;
};

const ORIGINAL_ENV = {
  CONTACT_EMAIL: process.env.CONTACT_EMAIL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

function createContactFormData(
  overrides?: Partial<Record<"email" | "inquiryType" | "message" | "name" | "website", string>>
) {
  const formData = new FormData();
  formData.set("name", overrides?.name ?? "Kyrillos Wannes");
  formData.set("email", overrides?.email ?? "sender@example.com");
  formData.set("inquiryType", overrides?.inquiryType ?? "dictionary_feedback");
  formData.set("message", overrides?.message ?? "Hello from the test suite.");

  if (overrides?.website !== undefined) {
    formData.set("website", overrides.website);
  }

  return formData;
}

async function loadContactModule(options?: {
  hasEnv?: boolean;
  rateLimitOk?: boolean;
  sendEmailError?: {
    message: string;
    name: string;
    statusCode: number | null;
  } | null;
}) {
  vi.resetModules();

  if (options?.hasEnv === false) {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_EMAIL;
  } else {
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_EMAIL = "owner@example.com";
  }

  const consumeRateLimitMock = vi.fn().mockResolvedValue({
    ok: options?.rateLimitOk ?? true,
    remaining: 1,
    resetAt: Date.now() + 60_000,
    retryAfterMs: 60_000,
  });
  const getClientRateLimitIdentifierMock = vi.fn().mockResolvedValue("client-fingerprint");
  const sendEmailMock = vi.fn().mockResolvedValue(
    options?.sendEmailError
      ? {
          data: null,
          error: options.sendEmailError,
        }
      : {
          data: { id: "email_123" },
          error: null,
        }
  );

  vi.doMock("@/lib/rateLimit", () => ({
    consumeRateLimit: consumeRateLimitMock,
    getClientRateLimitIdentifier: getClientRateLimitIdentifierMock,
  }));
  vi.doMock("resend", () => ({
    Resend: class {
      emails = {
        send: sendEmailMock,
      };
    },
  }));

  const mod = await import("./contact");

  return {
    ...mod,
    consumeRateLimitMock,
    getClientRateLimitIdentifierMock,
    sendEmailMock,
  } satisfies ContactModuleContext;
}

describe("contact action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CONTACT_EMAIL = ORIGINAL_ENV.CONTACT_EMAIL;
    process.env.RESEND_API_KEY = ORIGINAL_ENV.RESEND_API_KEY;
  });

  it("returns a configuration error when email service env vars are missing", async () => {
    const { sendContactEmail } = await loadContactModule({ hasEnv: false });

    await expect(sendContactEmail(null, createContactFormData())).resolves.toEqual({
      success: false,
      error: "Email service is not configured yet.",
    });
  });

  it("silently accepts honeypot submissions without sending mail", async () => {
    const { sendContactEmail, sendEmailMock } = await loadContactModule();

    await expect(
      sendContactEmail(null, createContactFormData({ website: "https://spam.example" }))
    ).resolves.toEqual({
      success: true,
    });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("rejects invalid contact payloads before rate limiting or sending", async () => {
    const { consumeRateLimitMock, sendContactEmail, sendEmailMock } = await loadContactModule();

    await expect(
      sendContactEmail(
        null,
        createContactFormData({
          email: "invalid",
          inquiryType: "not-allowed",
          message: "bad",
        })
      )
    ).resolves.toEqual({
      success: false,
      error: "Please complete all fields with valid values.",
    });

    expect(consumeRateLimitMock).not.toHaveBeenCalled();
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("returns a friendly error when contact submissions are rate limited", async () => {
    const { sendContactEmail, sendEmailMock } = await loadContactModule({
      rateLimitOk: false,
    });

    await expect(sendContactEmail(null, createContactFormData())).resolves.toEqual({
      success: false,
      error:
        "Too many messages were sent from this connection. Please wait a few minutes and try again.",
    });

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("returns a failure when Resend responds with an API error", async () => {
    const { sendContactEmail } = await loadContactModule({
      sendEmailError: {
        message: "Domain not verified",
        name: "validation_error",
        statusCode: 422,
      },
    });

    await expect(sendContactEmail(null, createContactFormData())).resolves.toEqual({
      success: false,
      error: "Failed to send email",
    });
  });

  it("sends normalized contact emails with stable inquiry labels", async () => {
    const { sendContactEmail, sendEmailMock } = await loadContactModule();

    await expect(
      sendContactEmail(
        null,
        createContactFormData({
          email: " SENDER@Example.com ",
          inquiryType: "publication_inquiry",
          message: "Hello\n\n  Kyrillos  ",
          name: "  Test User  ",
        })
      )
    ).resolves.toEqual({
      success: true,
    });

    expect(sendEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "sender@example.com",
        subject: "New Contact: Publication / Book Inquiry from Test User",
        text: expect.stringContaining("Type: Publication / Book Inquiry"),
      })
    );
  });
});
