"use client";

import { useState, useEffect, useActionState } from "react";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/client";
import { submitExercise } from "@/actions/exercises";
import type {
  ExerciseLanguage,
  LessonExerciseQuestion,
} from "@/features/grammar/lib/lessonExercises";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StatusNotice } from "@/components/StatusNotice";

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
  const [loading, setLoading] = useState(authAvailable);

  const [state, formAction, isPending] = useActionState(submitExercise, null);

  useEffect(() => {
    if (!authAvailable) {
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      return;
    }

    let isMounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setUser(data.user);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [authAvailable]);

  if (loading) return <div className="animate-pulse h-20 bg-sky-50 dark:bg-sky-900/20 rounded-xl mt-6"></div>;

  if (!authAvailable) {
    return (
      <StatusNotice tone="default" size="comfortable" className="mt-6">
        <p className="mb-4">
          {t("exercise.authUnavailable")}
        </p>
      </StatusNotice>
    );
  }

  if (!user) {
    return (
      <StatusNotice
        tone="info"
        size="comfortable"
        className="mt-6"
        actions={
          <Link href="/login" className="btn-primary px-6">
            {t("exercise.loginCta")}
          </Link>
        }
      >
        {t("exercise.loginPrompt")}
      </StatusNotice>
    );
  }

  if (state?.success) {
    return (
      <StatusNotice
        tone="success"
        size="comfortable"
        className="mt-6"
        title={t("exercise.submittedTitle")}
        actions={
          <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400">
            {t("exercise.viewDashboard")}
          </Link>
        }
      >
        <p className="font-sans">{t("exercise.submittedBody")}</p>
      </StatusNotice>
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
        <StatusNotice tone="error" className="mt-4">
          {state.error}
        </StatusNotice>
      )}
    </form>
  )
}
