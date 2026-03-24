import { cache } from "react";
import type { LexicalEntry } from "@/features/dictionary/types";
import type { Language } from "@/types/i18n";
import { assertServerOnly } from "../../../lib/server/assertServerOnly.ts";
import { readProjectJsonFile } from "../../../lib/server/projectFiles.ts";

assertServerOnly("src/features/dictionary/lib/dictionary.ts");

function getDictionaryFilePath(language: Language) {
  return language === "nl"
    ? "public/data/woordenboek.json"
    : "public/data/dictionary.json";
}

const readDictionary = cache((language: Language): LexicalEntry[] => {
  return readProjectJsonFile<LexicalEntry[]>(getDictionaryFilePath(language)) ?? [];
});

export function getDictionary(language: Language = "en"): LexicalEntry[] {
  return readDictionary(language);
}

export function getDictionaryEntryById(
  id: string,
  dictionary: readonly LexicalEntry[] = getDictionary(),
) {
  return dictionary.find((entry) => entry.id === id) ?? null;
}

export function getDictionaryEntryRelations(
  entry: LexicalEntry,
  dictionary: readonly LexicalEntry[] = getDictionary(),
) {
  const parentEntry = entry.parentEntryId
    ? getDictionaryEntryById(entry.parentEntryId, dictionary)
    : null;
  const relatedEntries = entry.parentEntryId
    ? dictionary.filter(
        (candidate) =>
          candidate.parentEntryId === entry.parentEntryId &&
          candidate.id !== entry.id,
      )
    : dictionary.filter((candidate) => candidate.parentEntryId === entry.id);

  return {
    parentEntry,
    relatedEntries: [...relatedEntries].sort((left, right) =>
      left.headword.localeCompare(right.headword),
    ),
  };
}
