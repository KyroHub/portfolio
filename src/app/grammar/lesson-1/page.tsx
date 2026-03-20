"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";
import { Lesson01Content } from "@/features/grammar/components/Lesson01Content";
import { getGrammarLessonBySlug } from "@/features/grammar/lessons";

export default function GrammarPage() {
  const { language, t } = useLanguage();
  const lesson = getGrammarLessonBySlug("lesson-1");

  if (!lesson) {
    return null;
  }

  return (
    <PageShell
      className="min-h-screen px-6 py-16 md:px-10"
      contentClassName="max-w-5xl mx-auto"
      accents={[
        pageShellAccents.topRightSkyOrb,
        pageShellAccents.bottomLeftEmeraldOrbSoft,
      ]}
    >
        <div className="mb-8">
          <Link href="/grammar" className="btn-secondary gap-2 px-4">
            <ArrowLeft className="h-4 w-4" />
            {t("grammar.back")}
          </Link>
        </div>

        <PageHeader
          eyebrow={t("grammar.lessonBadge")}
          eyebrowVariant="badge"
          title={`${t("nav.grammar")} - ${t(lesson.titleKey)}`}
          description={t(lesson.descriptionKey)}
          tone="sky"
          size="compact"
          className="mb-10"
        />

        <SurfacePanel
          rounded="3xl"
          variant="elevated"
          className="p-6 transition-colors duration-300 md:p-10"
        >
          <Lesson01Content language={language} />
        </SurfacePanel>
    </PageShell>
  );
}
