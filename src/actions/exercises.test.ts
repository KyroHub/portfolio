import { beforeEach, describe, expect, it, vi } from "vitest";

type ExercisesModuleContext = {
  submitExercise: typeof import("./exercises").submitExercise;
  consumeRateLimitMock: ReturnType<typeof vi.fn>;
  createClientMock: ReturnType<typeof vi.fn>;
  fromMock: ReturnType<typeof vi.fn>;
  getUserMock: ReturnType<typeof vi.fn>;
  insertMock: ReturnType<typeof vi.fn>;
  revalidatePathMock: ReturnType<typeof vi.fn>;
};

function createExerciseFormData(overrides?: {
  answers?: Record<string, string>;
  exerciseLanguage?: string;
  extraAnswerKey?: string;
  lessonSlug?: string;
}) {
  const formData = new FormData();
  formData.set("lessonSlug", overrides?.lessonSlug ?? "lesson-1");
  formData.set("exerciseLanguage", overrides?.exerciseLanguage ?? "en");

  for (let i = 1; i <= 10; i += 1) {
    formData.set(`answer_q${i}`, overrides?.answers?.[`q${i}`] ?? `Answer ${i}`);
  }

  if (overrides?.extraAnswerKey) {
    formData.set(overrides.extraAnswerKey, "Unexpected");
  }

  return formData;
}

async function loadExercisesModule(options?: {
  hasEnv?: boolean;
  insertError?: {
    code?: string;
    details?: string | null;
    hint?: string | null;
    message?: string;
  } | null;
  rateLimitOk?: boolean;
  user?: { id: string } | null;
}) {
  vi.resetModules();

  const revalidatePathMock = vi.fn();
  const consumeRateLimitMock = vi.fn().mockResolvedValue({
    ok: options?.rateLimitOk ?? true,
    remaining: 1,
    resetAt: Date.now() + 60_000,
    retryAfterMs: 60_000,
  });
  const getUserMock = vi.fn().mockResolvedValue({
    data: {
      user: options?.user === undefined ? { id: "user_123" } : options.user,
    },
  });
  const insertMock = vi.fn().mockResolvedValue({
    error: options?.insertError ?? null,
  });
  const fromMock = vi.fn(() => ({
    insert: insertMock,
  }));
  const createClientMock = vi.fn().mockResolvedValue({
    auth: {
      getUser: getUserMock,
    },
    from: fromMock,
  });

  vi.doMock("next/cache", () => ({
    revalidatePath: revalidatePathMock,
  }));
  vi.doMock("@/lib/rateLimit", () => ({
    consumeRateLimit: consumeRateLimitMock,
    getUserRateLimitIdentifier: vi.fn(() => "user-rate-limit-id"),
  }));
  vi.doMock("@/lib/supabase/config", () => ({
    hasSupabaseRuntimeEnv: vi.fn(() => options?.hasEnv ?? true),
  }));
  vi.doMock("@/lib/supabase/server", () => ({
    createClient: createClientMock,
  }));

  const mod = await import("./exercises");

  return {
    ...mod,
    consumeRateLimitMock,
    createClientMock,
    fromMock,
    getUserMock,
    insertMock,
    revalidatePathMock,
  } satisfies ExercisesModuleContext;
}

describe("exercise submission action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a friendly error when Supabase auth is unavailable", async () => {
    const { createClientMock, submitExercise } = await loadExercisesModule({
      hasEnv: false,
    });

    await expect(submitExercise(null, createExerciseFormData())).resolves.toEqual({
      success: false,
      error: "Exercise submission is temporarily unavailable.",
    });

    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated exercise submissions", async () => {
    const { submitExercise } = await loadExercisesModule({
      user: null,
    });

    await expect(submitExercise(null, createExerciseFormData())).resolves.toEqual({
      success: false,
      error: "Unauthorized. Please log in first.",
    });
  });

  it("rejects malformed exercise payloads with unexpected answer keys", async () => {
    const { submitExercise } = await loadExercisesModule();

    await expect(
      submitExercise(
        null,
        createExerciseFormData({
          extraAnswerKey: "answer_q999",
        })
      )
    ).resolves.toEqual({
      success: false,
      error: "Exercise answers were incomplete or malformed.",
    });
  });

  it("rejects answers that exceed the allowed length", async () => {
    const { submitExercise } = await loadExercisesModule();

    await expect(
      submitExercise(
        null,
        createExerciseFormData({
          answers: {
            q1: "x".repeat(501),
          },
        })
      )
    ).resolves.toEqual({
      success: false,
      error: "Each answer must be between 1 and 500 characters.",
    });
  });

  it("returns a rate limit error before writing submissions", async () => {
    const { insertMock, submitExercise } = await loadExercisesModule({
      rateLimitOk: false,
    });

    await expect(submitExercise(null, createExerciseFormData())).resolves.toEqual({
      success: false,
      error:
        "Too many submissions were received for this lesson. Please wait a bit before trying again.",
    });

    expect(insertMock).not.toHaveBeenCalled();
  });

  it("stores canonical prompts instead of trusting browser-supplied question text", async () => {
    const { insertMock, revalidatePathMock, submitExercise } = await loadExercisesModule();

    await expect(
      submitExercise(
        null,
        createExerciseFormData({
          answers: {
            q1: "  normalized answer  ",
          },
        })
      )
    ).resolves.toEqual({
      success: true,
    });

    expect(insertMock).toHaveBeenCalledWith([
      expect.objectContaining({
        lesson_slug: "lesson-1",
        status: "pending",
        submitted_text: expect.stringContaining(
          "Question: She is my daughter.\nAnswer: normalized answer"
        ),
        user_id: "user_123",
      }),
    ]);
    expect(revalidatePathMock).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePathMock).toHaveBeenCalledWith("/grammar/lesson-1");
  });

  it("returns a permission-specific message when the database denies submission", async () => {
    const { submitExercise } = await loadExercisesModule({
      insertError: {
        code: "42501",
        message: "permission denied",
      },
    });

    await expect(submitExercise(null, createExerciseFormData())).resolves.toEqual({
      success: false,
      error: "Your account does not have permission to submit exercises yet.",
    });
  });
});
