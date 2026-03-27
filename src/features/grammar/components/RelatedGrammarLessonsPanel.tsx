import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SurfacePanel } from "@/components/SurfacePanel";
import { getGrammarLessonPath } from "@/features/grammar/lib/grammarPaths";
import type { GrammarLessonReference } from "@/features/grammar/lib/grammarContentGraph";
import type { Language } from "@/types/i18n";

type RelatedGrammarLessonsPanelProps = {
  contained?: boolean;
  description: string;
  eyebrow?: string;
  language: Language;
  lessons: readonly GrammarLessonReference[];
  title: string;
};

export function RelatedGrammarLessonsPanel({
  contained = false,
  description,
  eyebrow,
  language,
  lessons,
  title,
}: RelatedGrammarLessonsPanelProps) {
  if (lessons.length === 0) {
    return null;
  }

  const sectionContent = (
    <>
      <div className={contained ? "space-y-3" : "space-y-2"}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={
            contained
              ? "text-xl font-semibold tracking-tight text-stone-800 dark:text-stone-100 md:text-2xl"
              : "text-2xl font-bold tracking-tight text-stone-800 dark:text-stone-100"
          }
        >
          {title}
        </h2>
        <p className="text-stone-500 dark:text-stone-400">{description}</p>
      </div>

      <div className={`grid gap-4 ${lessons.length > 1 ? "md:grid-cols-2" : ""}`}>
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={getGrammarLessonPath(lesson.slug, language)}
            className="group"
          >
            <SurfacePanel
              rounded="3xl"
              shadow={contained ? "soft" : "panel"}
              variant={contained ? "elevated" : "default"}
              className="flex h-full flex-col justify-between p-5 transition-colors hover:border-sky-300 dark:hover:border-sky-700"
            >
              <div className="space-y-3">
                <span className="inline-flex w-fit rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300">
                  {language === "nl" ? "Les" : "Lesson"}{" "}
                  {String(lesson.number).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
                    {lesson.title[language]}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                    {lesson.summary[language]}
                  </p>
                </div>
              </div>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition-colors group-hover:text-sky-500 dark:text-sky-400 dark:group-hover:text-sky-300">
                {language === "nl" ? "Open les" : "Open lesson"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </SurfacePanel>
          </Link>
        ))}
      </div>
    </>
  );

  if (contained) {
    return (
      <SurfacePanel as="section" rounded="3xl" variant="subtle" className="p-6 md:p-7">
        <div className="space-y-5">{sectionContent}</div>
      </SurfacePanel>
    );
  }

  return (
    <section className="space-y-5">
      {sectionContent}
    </section>
  );
}
