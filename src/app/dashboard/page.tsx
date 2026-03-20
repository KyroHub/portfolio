import { createClient } from '@/lib/supabase/server'
import { getAuthUnavailableLoginPath, hasSupabaseRuntimeEnv } from '@/lib/supabase/config'
import { getAuthenticatedUser, getUserSubmissions } from '@/lib/supabase/queries'
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

export default async function DashboardPage() {
  if (!hasSupabaseRuntimeEnv()) {
    return redirect(getAuthUnavailableLoginPath('/dashboard'))
  }

  const supabase = await createClient()

  const user = await getAuthenticatedUser(supabase)

  if (!user) {
    return redirect('/login')
  }

  const submissions = await getUserSubmissions(supabase, user.id)

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

      <SurfacePanel rounded="3xl" className="mb-10 p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-2 text-stone-800 dark:text-stone-200">Welcome Back!</h2>
        <p className="text-stone-600 dark:text-stone-400 font-medium">
          Logged in as <span className="text-sky-600 dark:text-sky-400 font-bold">{user.email}</span>
        </p>
      </SurfacePanel>

      <div className="space-y-8">
        <h3 className="text-2xl font-semibold tracking-tight mb-4 text-stone-800 dark:text-stone-200">Your Recent Exercises</h3>
        
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
    </PageShell>
  )
}
