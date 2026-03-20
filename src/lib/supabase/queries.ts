import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  AdminSubmission,
  ProfileRole,
  SubmissionRow,
} from '@/features/submissions/types'
import type { Database } from '@/types/supabase'

export type AppSupabaseClient = SupabaseClient<Database>

type QueryResult<T> = {
  data: T | null
  error: { message: string } | null
}

export async function getAuthenticatedUser(supabase: AppSupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getProfileRole(
  supabase: AppSupabaseClient,
  userId: string
): Promise<ProfileRole | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error) {
    return null
  }

  return data?.role ?? null
}

export async function getUserSubmissions(
  supabase: AppSupabaseClient,
  userId: string
): Promise<SubmissionRow[]> {
  const { data } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function getAdminSubmissions(
  supabase: AppSupabaseClient
): Promise<QueryResult<AdminSubmission[]>> {
  const submissionsResult = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (submissionsResult.error || !submissionsResult.data) {
    return {
      data: null,
      error: submissionsResult.error
        ? { message: submissionsResult.error.message }
        : { message: 'Could not load submissions.' },
    }
  }

  if (submissionsResult.data.length === 0) {
    return {
      data: [],
      error: null,
    }
  }

  const profileIds = Array.from(
    new Set(submissionsResult.data.map((submission) => submission.user_id))
  )

  const profilesResult = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', profileIds)

  if (profilesResult.error) {
    return {
      data: null,
      error: { message: profilesResult.error.message },
    }
  }

  const emailsByProfileId = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.id, profile.email])
  )

  return {
    data: submissionsResult.data.map((submission) => ({
      ...submission,
      studentEmail: emailsByProfileId.get(submission.user_id) ?? null,
    })),
    error: null,
  }
}
