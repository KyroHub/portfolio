import type { SupabaseClient } from '@supabase/supabase-js'
import {
  compareEntryReportPriority,
} from '@/features/dictionary/lib/entryActions'
import type {
  AdminEntryReport,
  EntryFavoriteRow,
} from '@/features/dictionary/lib/entryActions'
import type {
  LessonBookmarkRow,
  LessonNoteRow,
  LessonProgressRow,
  SectionProgressRow,
} from '@/features/grammar/types'
import type {
  AdminSubmission,
  ProfileRole,
  SubmissionRow,
} from '@/features/submissions/types'
import type { Database, Tables } from '@/types/supabase'

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

export async function getProfile(
  supabase: AppSupabaseClient,
  userId: string
): Promise<Tables<'profiles'> | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return null
  }

  return data
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

export async function getUserLessonProgressRows(
  supabase: AppSupabaseClient,
  userId: string
): Promise<LessonProgressRow[]> {
  const { data } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_viewed_at', { ascending: false })

  return data ?? []
}

export async function getUserSectionProgressRows(
  supabase: AppSupabaseClient,
  userId: string
): Promise<SectionProgressRow[]> {
  const { data } = await supabase
    .from('section_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  return data ?? []
}

export async function getUserLessonBookmarks(
  supabase: AppSupabaseClient,
  userId: string
): Promise<LessonBookmarkRow[]> {
  const { data } = await supabase
    .from('lesson_bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function getUserLessonNotes(
  supabase: AppSupabaseClient,
  userId: string
): Promise<LessonNoteRow[]> {
  const { data } = await supabase
    .from('lesson_notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  return data ?? []
}

export async function getUserEntryFavorites(
  supabase: AppSupabaseClient,
  userId: string,
): Promise<EntryFavoriteRow[]> {
  const { data } = await supabase
    .from('entry_favorites')
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

export async function getAdminEntryReports(
  supabase: AppSupabaseClient,
): Promise<QueryResult<AdminEntryReport[]>> {
  const reportsResult = await supabase
    .from('entry_reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (reportsResult.error || !reportsResult.data) {
    return {
      data: null,
      error: reportsResult.error
        ? { message: reportsResult.error.message }
        : { message: 'Could not load dictionary entry reports.' },
    }
  }

  if (reportsResult.data.length === 0) {
    return {
      data: [],
      error: null,
    }
  }

  const profileIds = Array.from(
    new Set(reportsResult.data.map((report) => report.user_id)),
  )

  const profilesResult = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', profileIds)

  if (profilesResult.error) {
    return {
      data: null,
      error: { message: profilesResult.error.message },
    }
  }

  const profileMetadataById = new Map(
    (profilesResult.data ?? []).map((profile) => [
      profile.id,
      {
        email: profile.email,
        fullName: profile.full_name,
      },
    ]),
  )

  return {
    data: reportsResult.data
      .map((report) => ({
        ...report,
        reporterEmail: profileMetadataById.get(report.user_id)?.email ?? null,
        reporterName: profileMetadataById.get(report.user_id)?.fullName ?? null,
      }))
      .sort(compareEntryReportPriority),
    error: null,
  }
}
