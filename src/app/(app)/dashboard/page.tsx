/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next'
import { requireAuthenticatedPageSession } from '@/lib/supabase/auth'
import { getLoginPath } from '@/lib/supabase/config'
import { getUserSubmissions } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { logout } from '@/actions/auth'
import { Badge } from '@/components/Badge'
import { PageHeader } from '@/components/PageHeader'
import { PageShell, pageShellAccents } from '@/components/PageShell'
import { SurfacePanel } from '@/components/SurfacePanel'
import { SubmissionCard } from '@/features/submissions/components/SubmissionCard'
import { SubmissionEmptyState } from '@/features/submissions/components/SubmissionEmptyState'
import { SubmissionFeedbackPanel } from '@/features/submissions/components/SubmissionFeedbackPanel'
import { SubmissionStatusBadge } from '@/features/submissions/components/SubmissionStatusBadge'
import { GrammarDashboardOverview } from '@/features/grammar/components/GrammarDashboardOverview'
import { buildGrammarLessonLearnerSummary } from '@/features/grammar/lib/grammarLearnerState'
import { getPublishedGrammarLessonBundleBySlug, listPublishedGrammarLessons } from '@/features/grammar/lib/grammarDataset'
import { AccountSettingsPanel } from '@/features/profile/components/AccountSettingsPanel'
import { getAccountAuthSettings } from '@/features/profile/lib/accountSettings'
import {
  getProfile,
  getUserLessonBookmarks,
  getUserLessonNotes,
  getUserLessonProgressRows,
  getUserSectionProgressRows,
} from '@/lib/supabase/queries'
import { antinoou } from '@/lib/fonts'
import { createNoIndexMetadata } from '@/lib/metadata'

export const metadata: Metadata = createNoIndexMetadata({
  title: 'Student Dashboard',
  description: 'Private student workspace for lessons, submissions, and progress.',
})

export default async function DashboardPage() {
  const { supabase, user } = await requireAuthenticatedPageSession('/dashboard')

  const profile = await getProfile(supabase, user.id)
  if (!profile) {
    return redirect(getLoginPath('/dashboard'))
  }

  const [
    submissions,
    lessonProgressRows,
    sectionProgressRows,
    lessonBookmarks,
    lessonNotes,
  ] = await Promise.all([
    getUserSubmissions(supabase, user.id),
    getUserLessonProgressRows(supabase, user.id),
    getUserSectionProgressRows(supabase, user.id),
    getUserLessonBookmarks(supabase, user.id),
    getUserLessonNotes(supabase, user.id),
  ])
  const grammarLessonSummaries = listPublishedGrammarLessons()
    .map((lesson) => getPublishedGrammarLessonBundleBySlug(lesson.slug))
    .filter((lessonBundle): lessonBundle is NonNullable<typeof lessonBundle> => lessonBundle !== null)
    .map((lessonBundle) =>
      buildGrammarLessonLearnerSummary({
        lessonBundle,
        lessonProgressRows,
        sectionProgressRows,
        bookmarkRows: lessonBookmarks,
        lessonNoteRows: lessonNotes,
      })
    )
  const { canUpdatePassword, providerLabel } = getAccountAuthSettings(
    user.app_metadata,
  )

  return (
    <PageShell
      className="min-h-screen px-6 py-16"
      contentClassName="mx-auto min-h-[80vh] max-w-5xl"
      accents={[
        pageShellAccents.topLeftSkyOrb,
        pageShellAccents.bottomRightEmeraldOrb,
      ]}
    >
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <Badge tone="accent" size="xs" caps className="mb-4">
            Student Workspace
          </Badge>
          <PageHeader
            title="Student Dashboard"
            description="Manage your grammar exercises and view feedback."
            align="left"
            tone="brand"
            size="compact"
          />
        </div>
        <form action={logout}>
          <button className="btn-secondary px-6">Sign Out</button>
        </form>
      </div>

      <div className="flex flex-col gap-12">
        <SurfacePanel rounded="3xl" className="p-6 md:p-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-stone-800 dark:text-stone-200">
              Welcome Back,{" "}
              {profile.full_name ? (
                <span className={`${antinoou.className} tracking-wide`}>
                  {profile.full_name}
                </span>
              ) : (
                'Student'
              )}
              !
            </h2>
            <p className="text-stone-600 dark:text-stone-400 font-medium">
              Logged in as <span className="text-sky-600 dark:text-sky-400 font-bold">{profile.email}</span>
            </p>
          </div>
          {profile.avatar_url && (
            <img 
              src={profile.avatar_url}
              alt="Avatar" 
              className="hidden md:block w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            />
          )}
        </SurfacePanel>
        <AccountSettingsPanel
          canUpdatePassword={canUpdatePassword}
          profile={profile}
          providerLabel={providerLabel}
        />

        <GrammarDashboardOverview lessonSummaries={grammarLessonSummaries} />

        <div className="space-y-8">
          <h3 className="text-2xl font-bold tracking-tight text-stone-800 dark:text-stone-200">Your Recent Exercises</h3>
        
        {submissions.map((submission) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            topRight={
              submission.status === 'reviewed' ? (
                <SubmissionStatusBadge
                  label="Reviewed"
                  tone="reviewed"
                  className="absolute right-0 top-0 rounded-none rounded-bl-xl px-4 py-1.5 text-white dark:text-emerald-200"
                />
              ) : undefined
            }
          >
            <SubmissionFeedbackPanel submission={submission} />
          </SubmissionCard>
        ))}

        {submissions.length === 0 && (
          <SubmissionEmptyState
            title="No Exercises Submitted Yet"
            description="Head over to the Grammar section to complete your first lesson!"
          />
        )}
        </div>
      </div>
    </PageShell>
  )
}
