import type { ReactNode } from "react";
import type { GrammarLessonBundle, GrammarSectionDocument } from "@/content/grammar/schema";
import type { Language } from "@/types/i18n";
import {
  GrammarLessonEndnotes,
  GrammarLessonSection,
} from "@/features/grammar/components/GrammarLessonPrimitives";
import {
  GrammarLessonConceptGlossary as GrammarLessonConceptGlossarySection,
  GrammarLessonBibliography as GrammarLessonBibliographySection,
} from "@/features/grammar/components/GrammarLessonSemantics";
import { GrammarAbbreviation } from "@/features/grammar/components/GrammarAbbreviation";
import {
  getGrammarLessonAbbreviationAnchorId,
  getGrammarLessonAbbreviationSectionId,
} from "@/features/grammar/lib/grammarPresentation";
import { GrammarBlockRenderer } from "./GrammarBlockRenderer";

type GrammarLessonDocumentRendererProps = {
  lessonBundle: GrammarLessonBundle;
  language: Language;
  renderSectionFooter?: (section: GrammarSectionDocument) => ReactNode;
};

function GrammarLessonAbbreviationAppendix({
  lessonId,
  language,
  index,
}: {
  lessonId: string;
  language: Language;
  index: number;
}) {
  const title =
    language === "en"
      ? "Abbreviations used in this lesson"
      : "Afkortingen in deze les";
  const intro =
    language === "en"
      ? "These short labels appear throughout the lesson tables and explanations."
      : "Deze korte labels komen doorheen de tabellen en uitleg van de les voor.";
  const entries = [
    {
      key: "masculine",
      label: <GrammarAbbreviation className="small-caps">m</GrammarAbbreviation>,
      description: language === "en" ? "masculine" : "mannelijk",
    },
    {
      key: "feminine",
      label: (
        <GrammarAbbreviation className="small-caps">
          {language === "en" ? "f" : "v"}
        </GrammarAbbreviation>
      ),
      description: language === "en" ? "feminine" : "vrouwelijk",
    },
    {
      key: "singular",
      label: <GrammarAbbreviation className="small-caps">s</GrammarAbbreviation>,
      description: language === "en" ? "singular" : "enkelvoud",
    },
    {
      key: "plural",
      label: <GrammarAbbreviation className="small-caps">p</GrammarAbbreviation>,
      description: language === "en" ? "plural" : "meervoud",
    },
    {
      key: "ipa",
      label: <GrammarAbbreviation>/.../</GrammarAbbreviation>,
      description:
        language === "en"
          ? "pronunciation in the IPA"
          : "uitspraak in het IPA",
    },
    {
      key: "nm",
      label: (
        <GrammarAbbreviation>
          N<sup><em className="small-caps">m</em></sup>
        </GrammarAbbreviation>
      ),
      description:
        language === "en"
          ? "proper noun"
          : "eigennaam",
    },
  ] as const;

  return (
    <GrammarLessonSection
      id={getGrammarLessonAbbreviationSectionId(lessonId)}
      index={index}
      title={title}
      defaultOpen={false}
      openOnHashMatch
    >
      <div className="space-y-4">
        <p className="leading-7 text-stone-700 dark:text-stone-300">{intro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {entries.map((entry) => (
            <article
              key={entry.key}
              id={getGrammarLessonAbbreviationAnchorId(lessonId, entry.key)}
              className="scroll-mt-28 rounded-xl border border-stone-200/80 bg-stone-50/70 px-4 py-3 dark:border-stone-800/80 dark:bg-stone-950/40"
            >
              <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                {entry.label}
              </h3>
              <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                {entry.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </GrammarLessonSection>
  );
}

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

export function GrammarLessonDocumentRenderer({
  lessonBundle,
  language,
  renderSectionFooter,
}: GrammarLessonDocumentRendererProps) {
  const orderedSections = getOrderedSections(lessonBundle);
  const endnotesTitle = language === "en" ? "Endnotes" : "Eindnoten";
  const appendixIndex = orderedSections.length + 1;

  return (
    <div className="space-y-4 font-sans leading-relaxed text-stone-800 dark:text-stone-200">
      {orderedSections.map((section, index) => (
        <GrammarLessonSection
          key={section.id}
          id={section.id}
          index={index + 1}
          title={section.title[language]}
          footer={renderSectionFooter?.(section)}
        >
          <GrammarBlockRenderer
            blocks={section.blocks[language]}
            language={language}
            lessonBundle={lessonBundle}
          />
        </GrammarLessonSection>
      ))}

      <GrammarLessonConceptGlossarySection
        lessonBundle={lessonBundle}
        language={language}
      />
      <GrammarLessonBibliographySection
        lessonBundle={lessonBundle}
        language={language}
      />
      <GrammarLessonAbbreviationAppendix
        lessonId={lessonBundle.lesson.id}
        language={language}
        index={appendixIndex}
      />
      <GrammarLessonEndnotes title={endnotesTitle} />
    </div>
  );
}
