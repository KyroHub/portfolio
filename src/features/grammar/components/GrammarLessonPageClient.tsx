"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbTrail } from "@/components/BreadcrumbTrail";
import type { GrammarLessonBundle, GrammarSectionDocument } from "@/content/grammar/schema";
import { useLanguage } from "@/components/LanguageProvider";
import { DownloadPdfButton } from "@/components/DownloadPdfButton";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";
import {
  GrammarLessonLearnerPanel,
  GrammarLessonNotesPanel,
  GrammarLessonSectionProgressButton,
} from "@/features/grammar/components/GrammarLessonLearnerPanel";
import { GrammarLessonOutline } from "@/features/grammar/components/GrammarLessonPrimitives";
import { GrammarLessonRenderProvider } from "@/features/grammar/components/GrammarLessonRenderContext";
import {
  GrammarLessonConceptSummary,
} from "@/features/grammar/components/GrammarLessonSemantics";
import { getGrammarLessonAbbreviationSectionId } from "@/features/grammar/lib/grammarPresentation";
import { getGrammarPath, getLocalizedHomePath } from "@/lib/locale";
import { useGrammarLessonLearnerState } from "@/features/grammar/lib/useGrammarLessonLearnerState";
import { GrammarLessonDocumentRenderer } from "@/features/grammar/renderers/GrammarLessonDocumentRenderer";

type GrammarLessonPageClientProps = {
  lessonBundle: GrammarLessonBundle;
};

function getOrderedSections(
  lessonBundle: GrammarLessonBundle,
): GrammarSectionDocument[] {
  const sectionsById = new Map(
    lessonBundle.lesson.sections.map((section) => [section.id, section] as const),
  );

  return lessonBundle.lesson.sectionOrder
    .map((sectionId) => sectionsById.get(sectionId))
    .filter((section): section is GrammarSectionDocument => section !== undefined);
}

export function GrammarLessonPageClient({
  lessonBundle,
}: GrammarLessonPageClientProps) {
  const { language, t } = useLanguage();
  const [renderMode, setRenderMode] = useState<"web" | "pdf">("web");
  const lesson = lessonBundle.lesson;
  const orderedSections = getOrderedSections(lessonBundle);
  const lessonContentId = `${lesson.id}-pdf-content`;
  const lessonOutlineEyebrow = language === "en" ? "Lesson map" : "Lesoverzicht";
  const lessonOutlineTitle = language === "en" ? "On this page" : "Op deze pagina";
  const lessonAbbreviationAppendixTitle =
    language === "en"
      ? "Abbreviations used in this lesson"
      : "Afkortingen in deze les";
  const lessonRenderSessionKey = `${lesson.id}:${language}:${renderMode}`;
  const lessonDescription = lesson.description?.[language] ?? lesson.summary[language];
  const learnerState = useGrammarLessonLearnerState(lessonBundle);
  const hasSemanticSidebar =
    (renderMode === "web" && learnerState.status !== "unavailable") ||
    lessonBundle.concepts.length > 0;
  const lessonOutlineSections = [
    ...orderedSections.map((section) => ({
      id: section.id,
      title: section.title[language],
    })),
    {
      id: getGrammarLessonAbbreviationSectionId(lesson.id),
      title: lessonAbbreviationAppendixTitle,
    },
  ];

  return (
    <PageShell
      className="min-h-screen px-6 py-16 md:px-10"
      contentClassName="max-w-5xl mx-auto"
      accents={[
        pageShellAccents.topRightSkyOrb,
        pageShellAccents.bottomLeftEmeraldOrbSoft,
      ]}
    >
      <div className="mb-8 space-y-4">
        <BreadcrumbTrail
          items={[
            { label: t("nav.home"), href: getLocalizedHomePath(language) },
            { label: t("nav.grammar"), href: getGrammarPath(language) },
            { label: lesson.title[language] },
          ]}
        />

        <div className="flex items-center justify-between">
          <Link href={getGrammarPath(language)} className="btn-secondary gap-2 px-4">
            <ArrowLeft className="h-4 w-4" />
            {t("grammar.back")}
          </Link>
          <DownloadPdfButton
            targetId={lessonContentId}
            fileName={`Coptic_${lesson.title.en.replace(/\s+/g, "_")}.pdf`}
            beforeCapture={() => {
              flushSync(() => {
                setRenderMode("pdf");
              });
            }}
            afterCapture={() => {
              flushSync(() => {
                setRenderMode("web");
              });
            }}
          />
        </div>
      </div>

      <div id={lesson.id} className="bg-transparent pb-4 dark:bg-transparent">
        <GrammarLessonRenderProvider
          renderMode={renderMode}
          sessionKey={lessonRenderSessionKey}
        >
          <div id={lessonContentId}>
            <PageHeader
              eyebrow={t("grammar.lessonBadge")}
              eyebrowVariant="badge"
              title={`${t("nav.grammar")} - ${lesson.title[language]}`}
              description={lessonDescription}
              tone="sky"
              size="compact"
              className="mb-10"
            />

            <SurfacePanel
              rounded="3xl"
              variant="elevated"
              className="p-6 transition-colors duration-300 md:p-10"
            >
              {hasSemanticSidebar ? (
                <div className="mb-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(19rem,1fr)]">
                  <GrammarLessonOutline
                    eyebrow={lessonOutlineEyebrow}
                    title={lessonOutlineTitle}
                    sections={lessonOutlineSections}
                  />
                  <div className="space-y-6">
                    {renderMode === "web" ? (
                      <GrammarLessonLearnerPanel
                        errorMessage={learnerState.errorMessage}
                        isBookmarkPending={learnerState.isBookmarkPending}
                        language={language}
                        onToggleBookmark={learnerState.toggleBookmark}
                        status={learnerState.status}
                        summary={learnerState.summary}
                      />
                    ) : null}
                    <GrammarLessonConceptSummary
                      lessonBundle={lessonBundle}
                      language={language}
                    />
                  </div>
                </div>
              ) : (
                <GrammarLessonOutline
                  className="mb-8"
                  eyebrow={lessonOutlineEyebrow}
                  title={lessonOutlineTitle}
                  sections={lessonOutlineSections}
                />
              )}
              <GrammarLessonDocumentRenderer
                lessonBundle={lessonBundle}
                language={language}
                renderSectionFooter={
                  learnerState.sectionCompletionEnabled
                    ? (section) => (
                        <div className="flex justify-end">
                          <GrammarLessonSectionProgressButton
                            isCompleted={learnerState.completedSectionIds.includes(
                              section.id,
                            )}
                            isPending={learnerState.pendingSectionId === section.id}
                            language={language}
                            onToggle={() =>
                              learnerState.toggleSectionComplete(section)
                            }
                          />
                        </div>
                      )
                    : undefined
                }
              />
            </SurfacePanel>
          </div>

          {renderMode === "web" ? (
            <div className="mt-6">
              <GrammarLessonNotesPanel
                errorMessage={learnerState.errorMessage}
                hasUnsavedNoteChanges={learnerState.hasUnsavedNoteChanges}
                isNotePending={learnerState.isNotePending}
                language={language}
                noteText={learnerState.noteText}
                noteUpdatedAt={learnerState.noteUpdatedAt}
                onSaveNote={learnerState.saveNote}
                onNoteChange={learnerState.setNoteText}
                status={learnerState.status}
              />
            </div>
          ) : null}
        </GrammarLessonRenderProvider>
      </div>
    </PageShell>
  );
}
