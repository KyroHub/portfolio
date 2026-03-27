'use server'

import { getAdminServerContext } from '@/lib/supabase/auth'
import { hasSupabaseRuntimeEnv } from '@/lib/supabase/config'
import { revalidatePath } from 'next/cache'
import {
  isEntryReportStatus,
  type EntryReportStatus,
} from '@/features/dictionary/lib/entryActions'
import {
  getFormString,
  hasLengthInRange,
  isUuid,
  normalizeMultiline,
  normalizeWhitespace,
  parseBoundedInteger,
} from '@/lib/validation'
import type { SubmissionUpdate } from '@/features/submissions/types'

async function getValidatedAdminContext() {
  if (!hasSupabaseRuntimeEnv()) {
    return null
  }

  const adminContext = await getAdminServerContext()
  if (!adminContext) {
    return null
  }

  return adminContext
}

export async function submitFeedback(formData: FormData) {
  const adminContext = await getValidatedAdminContext()
  if (!adminContext) {
    console.warn('Admin feedback submission skipped because Supabase is not configured.')
    return
  }

  const { supabase, user } = adminContext

  const submissionId = normalizeWhitespace(getFormString(formData, 'submission_id'))
  const rating = parseBoundedInteger(normalizeWhitespace(getFormString(formData, 'rating')), {
    min: 1,
    max: 5,
  })
  const feedback = normalizeMultiline(getFormString(formData, 'feedback'))

  if (!isUuid(submissionId) || rating === null || !hasLengthInRange(feedback, { min: 1, max: 5000 })) {
    console.warn('Rejected invalid admin feedback submission', {
      userId: user.id,
      submissionId,
      rating,
      feedbackLength: feedback.length,
    })
    return
  }

  const updates: SubmissionUpdate = {
    status: 'reviewed',
    rating,
    feedback_text: feedback,
  }

  const { error } = await supabase
    .from('submissions')
    .update(updates)
    .eq('id', submissionId)

  if (error) {
    console.error('Error submitting feedback:', error)
  }

  revalidatePath('/admin')
}

export async function updateEntryReportStatus(formData: FormData) {
  const adminContext = await getValidatedAdminContext()
  if (!adminContext) {
    console.warn('Dictionary entry report review skipped because Supabase is not configured.')
    return
  }

  const { supabase, user } = adminContext
  const reportId = normalizeWhitespace(getFormString(formData, 'report_id'))
  const status = normalizeWhitespace(
    getFormString(formData, 'status'),
  ) as EntryReportStatus

  if (!isUuid(reportId) || !isEntryReportStatus(status)) {
    console.warn('Rejected invalid entry report review payload', {
      reportId,
      status,
      userId: user.id,
    })
    return
  }

  const { error } = await supabase
    .from('entry_reports')
    .update({ status })
    .eq('id', reportId)

  if (error) {
    console.error('Error updating dictionary entry report status:', error)
  }

  revalidatePath('/admin')
}
