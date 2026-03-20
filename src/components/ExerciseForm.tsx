"use client";

import { useState, useEffect, useActionState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { submitExercise } from "@/actions/exercises";
import type {
  ExerciseLanguage,
  LessonExerciseQuestion,
} from "@/lib/lessonExercises";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export function ExerciseForm({
  lessonSlug,
  language,
  questions,
}: {
  lessonSlug: string;
  language: ExerciseLanguage;
  questions: LessonExerciseQuestion[];
}) {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const authAvailable = hasSupabaseEnv();
  const supabase = createClient();
  const [loading, setLoading] = useState(authAvailable);

  const [state, formAction, isPending] = useActionState(submitExercise, null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, [supabase]);

  if (loading) return <div className="animate-pulse h-20 bg-sky-50 dark:bg-sky-900/20 rounded-xl mt-6"></div>;

  if (!authAvailable) {
    return (
      <div className="mt-6 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/50 text-center shadow-sm backdrop-blur-md">
        <p className="text-stone-600 dark:text-stone-400 mb-4 font-medium">
          {t("exercise.authUnavailable")}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mt-6 p-6 rounded-2xl border border-sky-100 dark:border-sky-800/60 bg-white/60 dark:bg-stone-900/50 text-center shadow-sm backdrop-blur-md">
        <p className="text-stone-600 dark:text-stone-400 mb-4 font-medium">{t("exercise.loginPrompt")}</p>
        <Link href="/login" className="btn-primary px-6">
          {t("exercise.loginCta")}
        </Link>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="mt-6 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-center shadow-sm">
        <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">{t("exercise.submittedTitle")}</h3>
        <p className="text-emerald-600 dark:text-emerald-500 font-medium font-sans">
          {t("exercise.submittedBody")}
        </p>
        <Link href="/dashboard" className="inline-flex mt-4 h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400">
          {t("exercise.viewDashboard")}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-8">
      <input type="hidden" name="lessonSlug" value={lessonSlug} />
      <input type="hidden" name="exerciseLanguage" value={language} />
      {questions.map((question, idx) => (
        <div key={idx} className="space-y-3 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/30 p-5">
          <label className="block text-stone-700 dark:text-stone-300 font-medium text-lg leading-8">
            <span className="mr-2 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 text-sm font-semibold tabular-nums px-2">{idx + 1}</span>
            {question.prompt}
          </label>
          <input
            type="text"
            name={`answer_${question.id}`}
            className="input-base h-auto py-4 px-5 font-coptic text-xl"
            placeholder={t("exercise.answerPlaceholder")}
            autoComplete="off"
            required
          />
        </div>
      ))}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full sm:w-auto flex justify-center items-center gap-2 px-8"
        >
          {isPending ? t("exercise.submitting") : t("exercise.submit")}
          <ArrowRight size={20} />
        </button>
      </div>

      {state?.error && (
        <p className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-4 py-3 text-center font-medium text-red-600 dark:text-red-400 mt-4">
          {state.error}
        </p>
      )}
    </form>
  )
}
