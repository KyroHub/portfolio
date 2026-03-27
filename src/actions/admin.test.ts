import { beforeEach, describe, expect, it, vi } from "vitest";

type AdminModuleContext = {
  submitFeedback: typeof import("./admin").submitFeedback;
  updateEntryReportStatus: typeof import("./admin").updateEntryReportStatus;
  createClientMock: ReturnType<typeof vi.fn>;
  getUserMock: ReturnType<typeof vi.fn>;
  profileSingleMock: ReturnType<typeof vi.fn>;
  revalidatePathMock: ReturnType<typeof vi.fn>;
  reportUpdateEqMock: ReturnType<typeof vi.fn>;
  updateEqMock: ReturnType<typeof vi.fn>;
};

function createAdminFormData(overrides?: Partial<Record<"feedback" | "rating" | "submission_id", string>>) {
  const formData = new FormData();
  formData.set(
    "submission_id",
    overrides?.submission_id ?? "11111111-1111-4111-8111-111111111111"
  );
  formData.set("rating", overrides?.rating ?? "5");
  formData.set("feedback", overrides?.feedback ?? "Well done.");
  return formData;
}

function createEntryReportAdminFormData(
  overrides?: Partial<Record<"report_id" | "status", string>>,
) {
  const formData = new FormData();
  formData.set(
    "report_id",
    overrides?.report_id ?? "22222222-2222-4222-8222-222222222222",
  );
  formData.set("status", overrides?.status ?? "reviewed");
  return formData;
}

async function loadAdminModule(options?: {
  hasEnv?: boolean;
  isAdmin?: boolean;
  user?: { id: string } | null;
}) {
  vi.resetModules();

  const revalidatePathMock = vi.fn();
  const getUserMock = vi.fn().mockResolvedValue({
    data: {
      user: options?.user === undefined ? { id: "user_123" } : options.user,
    },
  });
  const profileSingleMock = vi.fn().mockResolvedValue({
    data: {
      role: options?.isAdmin === false ? "student" : "admin",
    },
  });
  const updateEqMock = vi.fn().mockResolvedValue({ error: null });
  const reportUpdateEqMock = vi.fn().mockResolvedValue({ error: null });
  const createClientMock = vi.fn().mockResolvedValue({
    auth: {
      getUser: getUserMock,
    },
    from: vi.fn((table: string) => {
      if (table === "profiles") {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: profileSingleMock,
            })),
          })),
        };
      }

      if (table === "entry_reports") {
        return {
          update: vi.fn(() => ({
            eq: reportUpdateEqMock,
          })),
        };
      }

      return {
        update: vi.fn(() => ({
          eq: updateEqMock,
        })),
      };
    }),
  });

  vi.doMock("next/cache", () => ({
    revalidatePath: revalidatePathMock,
  }));
  vi.doMock("@/lib/supabase/config", () => ({
    hasSupabaseRuntimeEnv: vi.fn(() => options?.hasEnv ?? true),
  }));
  vi.doMock("@/lib/supabase/server", () => ({
    createClient: createClientMock,
  }));

  const mod = await import("./admin");

  return {
    ...mod,
    createClientMock,
    getUserMock,
    profileSingleMock,
    revalidatePathMock,
    reportUpdateEqMock,
    updateEqMock,
  } satisfies AdminModuleContext;
}

describe("admin feedback action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("skips admin feedback when Supabase is unavailable", async () => {
    const { createClientMock, submitFeedback } = await loadAdminModule({
      hasEnv: false,
    });

    await expect(submitFeedback(createAdminFormData())).resolves.toBeUndefined();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("does nothing for non-admin users", async () => {
    const { submitFeedback, updateEqMock } = await loadAdminModule({
      isAdmin: false,
    });

    await expect(submitFeedback(createAdminFormData())).resolves.toBeUndefined();
    expect(updateEqMock).not.toHaveBeenCalled();
  });

  it("rejects invalid admin feedback payloads before updating submissions", async () => {
    const { submitFeedback, updateEqMock } = await loadAdminModule();

    await expect(
      submitFeedback(
        createAdminFormData({
          feedback: "",
          rating: "9",
          submission_id: "bad-id",
        })
      )
    ).resolves.toBeUndefined();

    expect(updateEqMock).not.toHaveBeenCalled();
  });

  it("updates submissions and revalidates the admin page for valid feedback", async () => {
    const { revalidatePathMock, submitFeedback, updateEqMock } = await loadAdminModule();

    await expect(submitFeedback(createAdminFormData())).resolves.toBeUndefined();

    expect(updateEqMock).toHaveBeenCalledWith(
      "id",
      "11111111-1111-4111-8111-111111111111"
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin");
  });

  it("rejects invalid entry report review payloads before updating reports", async () => {
    const { reportUpdateEqMock, updateEntryReportStatus } = await loadAdminModule();

    await expect(
      updateEntryReportStatus(
        createEntryReportAdminFormData({
          report_id: "bad-id",
          status: "not-a-status",
        })
      )
    ).resolves.toBeUndefined();

    expect(reportUpdateEqMock).not.toHaveBeenCalled();
  });

  it("updates dictionary entry reports and revalidates the admin page", async () => {
    const { revalidatePathMock, reportUpdateEqMock, updateEntryReportStatus } =
      await loadAdminModule();

    await expect(
      updateEntryReportStatus(createEntryReportAdminFormData())
    ).resolves.toBeUndefined();

    expect(reportUpdateEqMock).toHaveBeenCalledWith(
      "id",
      "22222222-2222-4222-8222-222222222222"
    );
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin");
  });
});
