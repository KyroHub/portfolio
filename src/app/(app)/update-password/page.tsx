import type { Metadata } from 'next'
import { updatePassword } from '@/actions/auth'
import { FormField } from '@/components/FormField'
import { PageHeader } from '@/components/PageHeader'
import { PageShell, pageShellAccents } from '@/components/PageShell'
import { StatusNotice } from '@/components/StatusNotice'
import { SurfacePanel } from '@/components/SurfacePanel'
import { createNoIndexMetadata } from '@/lib/metadata'
import { requireAuthenticatedPageSession } from '@/lib/supabase/auth'

const NOTICE_MESSAGES: Record<string, string> = {
  'update-invalid-input': 'Password must be at least 8 characters long.',
  'update-error': 'Could not update your password. The link may have expired.',
  'update-rate-limited': 'Too many attempts. Please wait a bit before trying again.',
}

export const metadata: Metadata = createNoIndexMetadata({
  title: 'Update Password',
  description: 'Password update page for the Wannes learning workspace.',
})

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{
    messageType?: 'error' | 'success' | 'info'
    state?: string
  }>
}) {
  await requireAuthenticatedPageSession('/update-password')

  const { messageType = 'error', state } = await searchParams;
  const noticeMessage = state && state in NOTICE_MESSAGES ? NOTICE_MESSAGES[state] : undefined;
  const noticeVariant = messageType;

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
        title="Create New Password"
        description="Please choose a strong, new password for your account."
        tone="brand"
        className="mb-12"
      />

      <div className="mx-auto max-w-xl">
        <SurfacePanel rounded="3xl" className="p-8 md:p-10">
          <form className="space-y-6 text-stone-800 dark:text-stone-200">
            <FormField htmlFor="password" label="New Password">
              <input
                id="password"
                className="input-base"
                type="password"
                name="password"
                placeholder="Must be at least 8 characters"
                required
              />
            </FormField>

            <div className="space-y-3 pt-2">
              <button
                formAction={updatePassword}
                className="btn-primary w-full"
              >
                Update Password
              </button>
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
