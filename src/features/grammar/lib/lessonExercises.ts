import type { Language } from "@/types/i18n";

export type ExerciseLanguage = Language;

type LessonQuestionDefinition = {
  id: string;
  prompt: Record<ExerciseLanguage, string>;
};

type LessonExerciseDefinition = {
  questions: readonly LessonQuestionDefinition[];
};

const lessonExerciseDefinitions = {
  "lesson-1": {
    questions: [
      {
        id: "q1",
        prompt: {
          en: "She is my daughter.",
          nl: "Zij is mijn dochter.",
        },
      },
      {
        id: "q2",
        prompt: {
          en: "She is my wife.",
          nl: "Zij is mijn echtgenote.",
        },
      },
      {
        id: "q3",
        prompt: {
          en: "It is heaven.",
          nl: "Het is de hemel.",
        },
      },
      {
        id: "q4",
        prompt: {
          en: "She is a lady.",
          nl: "Zij is een dame.",
        },
      },
      {
        id: "q5",
        prompt: {
          en: "They are the ladies.",
          nl: "Zij zijn de dames.",
        },
      },
      {
        id: "q6",
        prompt: {
          en: "He is a spirit.",
          nl: "Hij is een geest.",
        },
      },
      {
        id: "q7",
        prompt: {
          en: "It is the spirit.",
          nl: "Het is de geest.",
        },
      },
      {
        id: "q8",
        prompt: {
          en: "Every city.",
          nl: "Iedere stad.",
        },
      },
      {
        id: "q9",
        prompt: {
          en: "Every man.",
          nl: "Iedere man.",
        },
      },
      {
        id: "q10",
        prompt: {
          en: "The lord, the savior.",
          nl: "De heer, de verlosser.",
        },
      },
    ],
  },
} as const satisfies Record<string, LessonExerciseDefinition>;

export type LessonSlug = keyof typeof lessonExerciseDefinitions;

export type LessonExerciseQuestion = {
  id: string;
  prompt: string;
};

export function isExerciseLanguage(value: string): value is ExerciseLanguage {
  return value === "en" || value === "nl";
}

export function isLessonSlug(value: string): value is LessonSlug {
  return value in lessonExerciseDefinitions;
}

export function getLessonExerciseDefinition(value: string) {
  return isLessonSlug(value) ? lessonExerciseDefinitions[value] : null;
}

export function getLessonQuestions(
  lessonSlug: LessonSlug,
  language: ExerciseLanguage
): LessonExerciseQuestion[] {
  return lessonExerciseDefinitions[lessonSlug].questions.map((question) => ({
    id: question.id,
    prompt: question.prompt[language],
  }));
}
