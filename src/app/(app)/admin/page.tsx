import type { Metadata } from 'next'
import { requireAdminPageSession } from '@/lib/supabase/auth'
import {
  getAdminSubmissions,
} from '@/lib/supabase/queries'
import { PageHeader } from '@/components/PageHeader'
import { PageShell, pageShellAccents } from '@/components/PageShell'
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

  const { data: submissions, error } = await getAdminSubmissions(supabase)

  if (error) {
    return (
      <PageShell
        className="min-h-screen px-6 py-16"
        contentClassName="mx-auto max-w-5xl"
        accents={[
          pageShellAccents.heroEmeraldArc,
          pageShellAccents.topRightSkyOrbInset,
        ]}
      >
        <div className="mt-20 rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-bold text-red-500 dark:border-red-900/40 dark:bg-red-950/20">
          Database Error: Could not load submissions. Make sure you&apos;ve run the SQL setup
          script.
        </div>
      </PageShell>
    )
  }

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
      </div>
    </PageShell>
  )
}
