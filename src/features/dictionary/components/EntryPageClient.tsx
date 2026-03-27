"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { RelatedGrammarLessonsPanel } from "@/features/grammar/components/RelatedGrammarLessonsPanel";
import type { GrammarLessonReference } from "@/features/grammar/lib/grammarContentGraph";
import type { LexicalEntry } from "@/features/dictionary/types";
import DictionaryEntryCard from "./DictionaryEntry";
import EntryRelationsPanel from "./EntryRelationsPanel";

type EntryPageClientProps = {
  initialEntry: LexicalEntry;
  initialParentEntry: LexicalEntry | null;
  initialRelatedEntries: readonly LexicalEntry[];
  relatedGrammarLessons: readonly GrammarLessonReference[];
};

export default function EntryPageClient({
  initialEntry,
  initialParentEntry,
  initialRelatedEntries,
  relatedGrammarLessons,
}: EntryPageClientProps) {
  const { language } = useLanguage();

  return (
    <>
      <DictionaryEntryCard
        entry={initialEntry}
        headingLevel="h1"
        linkHeadword={false}
      />
      <EntryRelationsPanel
        entry={initialEntry}
        parentEntry={initialParentEntry}
        relatedEntries={initialRelatedEntries}
      />
      <RelatedGrammarLessonsPanel
        description={
          language === "nl"
            ? "Bekijk grammaticaonderdelen waarin dit lemma expliciet voorkomt of wordt toegelicht."
            : "Explore grammar lessons where this entry appears explicitly or is discussed in context."
        }
        language={language}
        lessons={relatedGrammarLessons}
        title={
          language === "nl"
            ? "Gebruikt in grammaticahandleidingen"
            : "Used in grammar lessons"
        }
      />
    </>
  );
}
