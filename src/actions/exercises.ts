'use server'

import {
  getGrammarExerciseDocumentById,
  getGrammarLessonDocumentBySlug,
} from '@/content/grammar/registry'
import { getAuthenticatedServerContext } from '@/lib/supabase/auth'
import { hasSupabaseRuntimeEnv } from '@/lib/supabase/config'
import {
  consumeRateLimit,
  getUserRateLimitIdentifier,
} from '@/lib/rateLimit'
import { revalidatePath } from 'next/cache'
import {
  getFormString,
  hasLengthInRange,
  normalizeMultiline,
  normalizeWhitespace,
} from '@/lib/validation'
import type { SubmissionInsert } from '@/features/submissions/types'
import type { Language } from '@/types/i18n'

export type ExerciseActionState =
  | {
      success?: boolean
      error?: string
    }
  | null

function isExerciseLanguage(value: string): value is Language {
  return value === 'en' || value === 'nl'
}

export async function submitExercise(_prevState: ExerciseActionState, formData: FormData): Promise<ExerciseActionState> {
  if (!hasSupabaseRuntimeEnv()) {
    return {
      success: false,
      error: 'Exercise submission is temporarily unavailable.',
    }
  }

  const authContext = await getAuthenticatedServerContext()
  if (!authContext) return { success: false, error: 'Unauthorized. Please log in first.' }
  const { supabase, user } = authContext

  const lessonSlug = normalizeWhitespace(getFormString(formData, 'lessonSlug'))
  const exerciseId = normalizeWhitespace(getFormString(formData, 'exerciseId'))
  const exerciseLanguage = normalizeWhitespace(getFormString(formData, 'exerciseLanguage'))
  const lessonDefinition = getGrammarLessonDocumentBySlug(lessonSlug)
  const exerciseDefinition = getGrammarExerciseDocumentById(exerciseId)

  if (
    !lessonDefinition ||
    !exerciseDefinition ||
    exerciseDefinition.lessonId !== lessonDefinition.id ||
    !isExerciseLanguage(exerciseLanguage)
  ) {
    return { success: false, error: 'Invalid exercise submission.' }
  }

  const expectedAnswerKeys = new Set(
    exerciseDefinition.items.map((question) => `answer_${question.id}`)
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

  const answers = exerciseDefinition.items.map((question) => {
    const answer = normalizeMultiline(getFormString(formData, `answer_${question.id}`))
    return {
      prompt: question.prompt[exerciseLanguage],
      answer,
      answerSchema: question.answerSchema,
    }
  })

  if (
    answers.some(
      ({ answer, answerSchema }) =>
        !hasLengthInRange(answer, {
          min: answerSchema?.minLength ?? 1,
          max: answerSchema?.maxLength ?? 500,
        })
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
    namespace: `exercise:${exerciseDefinition.id}`,
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
    lesson_slug: lessonDefinition.slug,
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
      exerciseId,
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
  revalidatePath(`/grammar/${lessonDefinition.slug}`)

  return { success: true }
}
