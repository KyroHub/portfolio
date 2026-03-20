"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { GrammarLessonCard } from "./GrammarLessonCard";
import { grammarLessons } from "@/features/grammar/lessons";

export default function GrammarHubPageClient() {
  const { t } = useLanguage();

  return (
    <PageShell
      className="min-h-screen flex flex-col items-center p-6 md:p-10"
      contentClassName="max-w-5xl w-full space-y-12 pt-10"
      accents={[
        pageShellAccents.topRightSkyOrb,
        pageShellAccents.bottomLeftEmeraldOrb,
      ]}
    >
      <PageHeader
        title={t("grammar.title")}
        description={t("grammar.subtitle")}
        tone="sky"
      />

        <div className="grid grid-cols-1 gap-6 mx-auto max-w-5xl w-full md:grid-cols-2 lg:grid-cols-3">
          {grammarLessons.map((lesson) => (
            <GrammarLessonCard key={lesson.slug} lesson={lesson} t={t} />
          ))}
        </div>
    </PageShell>
  );
}
