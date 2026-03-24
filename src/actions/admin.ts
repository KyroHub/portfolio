'use server'

import { getAdminServerContext } from '@/lib/supabase/auth'
import { hasSupabaseRuntimeEnv } from '@/lib/supabase/config'
import { revalidatePath } from 'next/cache'
import {
  getFormString,
  hasLengthInRange,
  isUuid,
  normalizeMultiline,
  normalizeWhitespace,
  parseBoundedInteger,
} from '@/lib/validation'
import type { SubmissionUpdate } from '@/features/submissions/types'

export async function submitFeedback(formData: FormData) {
  if (!hasSupabaseRuntimeEnv()) {
    console.warn('Admin feedback submission skipped because Supabase is not configured.')
    return
  }

  const adminContext = await getAdminServerContext()
  if (!adminContext) return
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
