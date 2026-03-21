import { resetPassword } from '@/actions/auth'
import { FormField } from '@/components/FormField'
import { PageHeader } from '@/components/PageHeader'
import { PageShell, pageShellAccents } from '@/components/PageShell'
import { StatusNotice } from '@/components/StatusNotice'
import { SurfacePanel } from '@/components/SurfacePanel'
import Link from 'next/link'

const NOTICE_MESSAGES: Record<string, string> = {
  'forgot-invalid-input': 'Please enter a valid email address.',
  'forgot-error': 'An error occurred. Please try again.',
  'forgot-rate-limited': 'Too many requests. Please wait a bit before trying again.',
  'forgot-success': 'If an account exists, a password reset link has been sent. Check your inbox!',
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    messageType?: 'error' | 'success' | 'info'
    state?: string
  }>
}) {
  const { messageType = 'error', state } = await searchParams;
  const noticeMessage = state && state in NOTICE_MESSAGES ? NOTICE_MESSAGES[state] : undefined;
  const noticeVariant = state === 'forgot-success' ? 'success' : messageType;

  return (
    <PageShell
      className="min-h-screen px-6 py-16 md:px-10"
      contentClassName="mx-auto max-w-3xl pt-8"
      accents={[
        pageShellAccents.topLeftSkyOrb,
        pageShellAccents.bottomRightEmeraldOrb,
      ]}
    >
      <PageHeader
        title="Reset Password"
        description="Enter the email associated with your account, and we'll send you a link to reset your password."
        tone="brand"
        className="mb-12"
      />

      <div className="mx-auto max-w-xl">
        <SurfacePanel rounded="3xl" className="p-8 md:p-10">
          <form className="space-y-6 text-stone-800 dark:text-stone-200">
            <FormField htmlFor="email" label="Email Address">
              <input
                id="email"
                className="input-base"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </FormField>

            <div className="space-y-3 pt-2">
              <button
                formAction={resetPassword}
                className="btn-primary w-full"
              >
                Send Reset Link
              </button>
              <Link
                href="/login"
                className="block text-center text-sm font-medium text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
              >
                Back to Sign In
              </Link>
            </div>

            {noticeMessage && (
              <StatusNotice tone={noticeVariant}>
                {noticeMessage}
              </StatusNotice>
            )}
          </form>
        </SurfacePanel>
      </div>
    </PageShell>
  )
}
