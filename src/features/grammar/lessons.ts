import type { TranslationKey } from "@/lib/i18n";
import type { LessonSlug } from "@/features/grammar/lib/lessonExercises";

export type GrammarLessonSlug = LessonSlug | "lesson-2";
export type GrammarLessonStatus = "available" | "comingSoon";

export type GrammarLessonDefinition = {
  slug: GrammarLessonSlug;
  number: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  status: GrammarLessonStatus;
};

export const grammarLessons = [
  {
    slug: "lesson-1",
    number: "01",
    titleKey: "grammar.lesson1.title",
    descriptionKey: "grammar.lesson1.desc",
    status: "available",
  },
  {
    slug: "lesson-2",
    number: "02",
    titleKey: "grammar.lesson2.title",
    descriptionKey: "grammar.lesson2.desc",
    status: "comingSoon",
  },
] as const satisfies readonly GrammarLessonDefinition[];

export function getGrammarLessonBySlug(slug: GrammarLessonSlug) {
  return grammarLessons.find((lesson) => lesson.slug === slug) ?? null;
}

export function getGrammarLessonRoute(slug: GrammarLessonSlug) {
  return `/grammar/${slug}`;
}

export function isAvailableGrammarLesson(lesson: GrammarLessonDefinition) {
  return lesson.status === "available";
}
