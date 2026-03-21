'use server'

import { hasSupabaseRuntimeEnv } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'
import {
  consumeRateLimit,
  getUserRateLimitIdentifier,
} from '@/lib/rateLimit'
import { revalidatePath } from 'next/cache'
import {
  getLessonExerciseDefinition,
  isExerciseLanguage,
} from '@/features/grammar/lib/lessonExercises'
import {
  getFormString,
  hasLengthInRange,
  normalizeMultiline,
  normalizeWhitespace,
} from '@/lib/validation'
import type { SubmissionInsert } from '@/features/submissions/types'

export type ExerciseActionState =
  | {
      success?: boolean
      error?: string
    }
  | null

export async function submitExercise(_prevState: ExerciseActionState, formData: FormData): Promise<ExerciseActionState> {
  if (!hasSupabaseRuntimeEnv()) {
    return {
      success: false,
      error: 'Exercise submission is temporarily unavailable.',
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Unauthorized. Please log in first.' }

  const lessonSlug = normalizeWhitespace(getFormString(formData, 'lessonSlug'))
  const exerciseLanguage = normalizeWhitespace(getFormString(formData, 'exerciseLanguage'))
  const lessonDefinition = getLessonExerciseDefinition(lessonSlug)

  if (!lessonDefinition || !isExerciseLanguage(exerciseLanguage)) {
    return { success: false, error: 'Invalid exercise submission.' }
  }

  const expectedAnswerKeys = new Set(
    lessonDefinition.questions.map((question) => `answer_${question.id}`)
  )
  const providedAnswerKeys = new Set(
    Array.from(formData.keys()).filter((key) => key.startsWith('answer_'))
  )

  if (
    providedAnswerKeys.size !== expectedAnswerKeys.size ||
    Array.from(providedAnswerKeys).some((key) => !expectedAnswerKeys.has(key))
  ) {
    return { success: false, error: 'Exercise answers were incomplete or malformed.' }
  }

  const answers = lessonDefinition.questions.map((question) => {
    const answer = normalizeMultiline(getFormString(formData, `answer_${question.id}`))
    return {
      prompt: question.prompt[exerciseLanguage],
      answer,
    }
  })

  if (
    answers.some(
      ({ answer }) => !hasLengthInRange(answer, { min: 1, max: 500 })
    )
  ) {
    return {
      success: false,
      error: 'Each answer must be between 1 and 500 characters.',
    }
  }

  const exerciseRateLimit = await consumeRateLimit({
    identifier: getUserRateLimitIdentifier(user.id),
    limit: 6,
    namespace: `exercise:${lessonSlug}`,
    windowMs: 60 * 60 * 1000,
  })

  if (!exerciseRateLimit.ok) {
    return {
      success: false,
      error: 'Too many submissions were received for this lesson. Please wait a bit before trying again.',
    }
  }

  const submittedText = answers
    .map(({ prompt, answer }) => `Question: ${prompt}\nAnswer: ${answer}`)
    .join('\n\n')

  const submission: SubmissionInsert = {
    user_id: user.id,
    lesson_slug: lessonSlug,
    submitted_text: submittedText.trim(),
    status: 'pending',
  }

  const { error } = await supabase
    .from('submissions')
    .insert([submission])

  if (error) {
    console.error('Error submitting exercise:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
      lessonSlug,
      userId: user.id,
    })

    if (
      error.code === 'PGRST205' ||
      error.code === '42P01' ||
      error.message?.includes('Could not find the table')
    ) {
      return {
        success: false,
        error: 'Exercise submissions are not configured yet. Please contact the administrator.',
      }
    }

    if (error.code === '42501') {
      return {
        success: false,
        error: 'Your account does not have permission to submit exercises yet.',
      }
    }

    return { success: false, error: 'Failed to submit exercise. Please try again.' }
  }

  revalidatePath('/dashboard')
  revalidatePath(`/grammar/${lessonSlug}`)

  return { success: true }
}
