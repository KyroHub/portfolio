import type { Metadata } from 'next'
import { requireAdminPageSession } from '@/lib/supabase/auth'
import {
  getAdminEntryReports,
  getAdminSubmissions,
} from '@/lib/supabase/queries'
import { PageHeader } from '@/components/PageHeader'
import { PageShell, pageShellAccents } from '@/components/PageShell'
import { EmptyState } from '@/components/EmptyState'
import { EntryReportReviewCard } from '@/features/dictionary/components/EntryReportReviewCard'
import { getDictionaryEntryById } from '@/features/dictionary/lib/dictionary'
import { SubmissionCard } from '@/features/submissions/components/SubmissionCard'
import { SubmissionEmptyState } from '@/features/submissions/components/SubmissionEmptyState'
import { SubmissionReviewForm } from '@/features/submissions/components/SubmissionReviewForm'
import { SubmissionStatusBadge } from '@/features/submissions/components/SubmissionStatusBadge'
import { createNoIndexMetadata } from '@/lib/metadata'

export const metadata: Metadata = createNoIndexMetadata({
  title: 'Instructor Workspace',
  description: 'Private instructor workspace for reviewing grammar submissions.',
})

export default async function AdminDashboard() {
  const { supabase } = await requireAdminPageSession('/admin')

  const [
    { data: submissions, error: submissionsError },
    { data: entryReports, error: entryReportsError },
  ] = await Promise.all([
    getAdminSubmissions(supabase),
    getAdminEntryReports(supabase),
  ])
  const resolvedEntryReports =
    entryReports?.map((report) => ({
      entry: getDictionaryEntryById(report.entry_id),
      report,
    })) ?? []

  return (
    <PageShell
      className="min-h-screen px-6 py-16"
      contentClassName="mx-auto min-h-[80vh] max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700"
      accents={[
        pageShellAccents.heroEmeraldArc,
        pageShellAccents.topRightSkyOrbInset,
      ]}
    >
      <PageHeader
        eyebrow="Instructor Workspace"
        eyebrowVariant="badge"
        title="Instructor Terminal"
        description="Review submitted exercises, score translations, and send feedback."
        align="left"
        tone="analytics"
        size="compact"
        className="mb-12"
      />
      
      <div className="space-y-10">
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Exercise submissions
            </h2>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              Review translation work, assign a score, and return feedback to students.
            </p>
          </div>

          {submissionsError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-bold text-red-500 dark:border-red-900/40 dark:bg-red-950/20">
              Database Error: Could not load submissions. Make sure you&apos;ve run the SQL setup
              script.
            </div>
          ) : (
            <>
              {submissions?.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  subtitle={
                    <p className="font-medium">
                      Student: {submission.studentEmail || 'Unknown User'}
                    </p>
                  }
                  contentClassName="text-xl"
                  topRight={
                    submission.status === 'reviewed' ? (
                      <SubmissionStatusBadge
                        label="Graded"
                        tone="reviewed"
                        className="absolute right-0 top-0 rounded-none rounded-bl-2xl px-5 py-1.5"
                      />
                    ) : undefined
                  }
                >
                  {submission.status === 'pending' && (
                    <div className="mb-6">
                      <SubmissionStatusBadge label="Needs Review" tone="pending" />
                    </div>
                  )}
                  <SubmissionReviewForm submission={submission} />
                </SubmissionCard>
              ))}
              {submissions?.length === 0 && (
                <SubmissionEmptyState
                  title="No active submissions."
                  description="Your inbox is clear. Waiting for students to complete exercises."
                />
              )}
            </>
          )}
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Dictionary entry reports
            </h2>
            <p className="mt-2 text-stone-600 dark:text-stone-400">
              Review flagged lemmas, inspect the current published meaning, and move each report through your inbox.
            </p>
          </div>

          {entryReportsError ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-bold text-red-500 dark:border-red-900/40 dark:bg-red-950/20">
              Database Error: Could not load dictionary entry reports. Make sure you&apos;ve run the latest SQL setup
              script.
            </div>
          ) : resolvedEntryReports.length === 0 ? (
            <EmptyState
              title="No dictionary reports yet."
              description="When readers flag entries from the dictionary, they will appear here for review."
            />
          ) : (
            resolvedEntryReports.map((reportWithEntry) => (
              <EntryReportReviewCard
                key={reportWithEntry.report.id}
                reportWithEntry={reportWithEntry}
              />
            ))
          )}
        </section>
      </div>
    </PageShell>
  )
}
