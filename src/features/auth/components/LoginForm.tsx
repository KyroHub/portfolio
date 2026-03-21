"use client";

import { login, signup, signInWithGoogle } from "@/actions/auth";
import type { TranslationKey } from "@/lib/i18n";
import { FormField } from "@/components/FormField";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { StatusNotice } from "@/components/StatusNotice";
import { SurfacePanel } from "@/components/SurfacePanel";
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';

const NOTICE_TRANSLATION_KEYS = {
  "auth-unavailable": "login.notice.authUnavailable",
  "login-invalid-input": "login.notice.loginInvalidInput",
  "login-error": "login.notice.loginError",
  "login-rate-limited": "login.notice.loginRateLimited",
  "signup-check-email": "login.notice.signupCheckEmail",
  "signup-confirmed": "login.notice.signupConfirmed",
  "signup-error": "login.notice.signupError",
  "signup-invalid-input": "login.notice.signupInvalidInput",
  "signup-rate-limited": "login.notice.signupRateLimited",
} as const satisfies Record<string, TranslationKey>;

type NoticeState = keyof typeof NOTICE_TRANSLATION_KEYS;
type NoticeType = "error" | "success" | "info";

export function LoginForm({
  message,
  messageType = "error",
  redirectTo,
  state,
}: {
  message?: string;
  messageType?: NoticeType;
  redirectTo?: string;
  state?: string;
}) {
  const { t } = useLanguage();
  const noticeKey =
    state && state in NOTICE_TRANSLATION_KEYS
      ? NOTICE_TRANSLATION_KEYS[state as NoticeState]
      : undefined;
  const noticeMessage = noticeKey ? t(noticeKey) : message;
  const noticeVariant = noticeKey ? "success" : messageType;

  return (
    <PageShell
      className="min-h-screen px-6 py-16 md:px-10"
      contentClassName="max-w-3xl mx-auto pt-8"
      accents={[
        pageShellAccents.topLeftSkyOrb,
        pageShellAccents.bottomRightEmeraldOrb,
      ]}
    >
      <PageHeader
        title={t("login.title")}
        description={t("login.subtitle")}
        tone="brand"
        className="mb-12"
      />

        <div className="max-w-xl mx-auto">
          <SurfacePanel rounded="3xl" className="p-8 md:p-10">
            <form className="space-y-6 text-stone-800 dark:text-stone-200">
              {redirectTo && (
                <input
                  type="hidden"
                  name="redirectTo"
                  value={redirectTo}
                />
              )}

              <FormField htmlFor="email" label={t("login.email")}>
                <input
                  id="email"
                  className="input-base"
                  name="email"
                  type="email"
                  placeholder={t("login.emailPlaceholder")}
                  required
                />
              </FormField>

              <FormField htmlFor="password" label={
                <div className="flex items-center justify-between w-full">
                  <span>{t("login.password")}</span>
                  <Link href="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              }>
                <input
                  id="password"
                  className="input-base"
                  type="password"
                  name="password"
                  placeholder={t("login.passwordPlaceholder")}
                  required
                />
              </FormField>

              <div className="space-y-3 pt-2">
                <button
                  formAction={login}
                  className="btn-primary w-full"
                >
                  {t("login.signIn")}
                </button>
                <button
                  formAction={signup}
                  className="btn-secondary w-full"
                >
                  {t("login.createAccount")}
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone-200 dark:border-stone-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-stone-900 px-2 text-stone-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                formAction={signInWithGoogle}
                formNoValidate
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-2.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors shadow-sm"
              >
                <FaGoogle className="h-4 w-4 text-red-500" />
                Sign in with Google
              </button>

              {noticeMessage && (
                <StatusNotice tone={noticeVariant}>
                  {noticeMessage}
                </StatusNotice>
              )}
            </form>
          </SurfacePanel>
        </div>
    </PageShell>
  );
}
