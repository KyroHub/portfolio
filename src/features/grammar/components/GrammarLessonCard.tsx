"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3 } from "lucide-react";
import { Badge } from "@/components/Badge";
import { cx } from "@/lib/classes";
import type { TranslationKey } from "@/lib/i18n";
import {
  getGrammarLessonRoute,
  isAvailableGrammarLesson,
  type GrammarLessonDefinition,
} from "@/features/grammar/lessons";

type GrammarLessonCardProps = {
  lesson: GrammarLessonDefinition;
  t: (key: TranslationKey) => string;
};

export function GrammarLessonCard({ lesson, t }: GrammarLessonCardProps) {
  const isAvailable = isAvailableGrammarLesson(lesson);
  const sharedClassName =
    "group relative min-h-[20rem] overflow-hidden rounded-3xl border p-8 shadow-md backdrop-blur-md transition-all duration-300 md:p-9 flex flex-col justify-between";

  const content = (
    <>
      <div className="relative">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div
            className={cx(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              isAvailable
                ? "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400"
                : "bg-stone-200 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
            )}
          >
            {isAvailable ? <BookOpenText className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
          </div>
          <Badge
            tone={isAvailable ? "accent" : "flat"}
            size="xs"
            caps
          >
            {isAvailable ? t("grammar.lessonBadge") : t("home.comingSoon")}
          </Badge>
        </div>

        <Badge tone="neutral" size="xs" className="mb-4 tracking-[0.14em]">
          {lesson.number}
        </Badge>
        <h2
          className={cx(
            "mb-3 text-2xl font-semibold",
            isAvailable
              ? "text-stone-800 dark:text-stone-200"
              : "text-stone-500 dark:text-stone-400"
          )}
        >
          {t(lesson.titleKey)}
        </h2>
        <p
          className={cx(
            "text-sm leading-7",
            isAvailable
              ? "text-stone-500 dark:text-stone-400"
              : "text-stone-400 dark:text-stone-500"
          )}
        >
          {t(lesson.descriptionKey)}
        </p>
      </div>

      <span
        className={cx(
          "relative mt-8 inline-flex items-center gap-2 text-sm font-semibold",
          isAvailable
            ? "text-sky-600 dark:text-sky-400"
            : "text-stone-400 dark:text-stone-500"
        )}
      >
        {isAvailable ? t("grammar.openLesson") : t("grammar.inPreparation")}
        {isAvailable && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
      </span>
    </>
  );

  if (!isAvailable) {
    return (
      <div
        className={cx(
          sharedClassName,
          "cursor-not-allowed border-stone-200 bg-stone-50/60 opacity-90 dark:border-stone-800 dark:bg-stone-900/30 dark:shadow-black/20"
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={getGrammarLessonRoute(lesson.slug)}
      className={cx(
        sharedClassName,
        "cursor-pointer border-stone-200 bg-white/70 hover:-translate-y-1 hover:border-sky-300 hover:shadow-sky-500/10 dark:border-stone-800 dark:bg-stone-900/50 dark:shadow-xl dark:shadow-black/20 dark:hover:border-sky-700"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {content}
    </Link>
  );
}
