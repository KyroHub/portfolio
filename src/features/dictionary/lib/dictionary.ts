import { cache } from "react";
import type { LexicalEntry } from "@/features/dictionary/types";
import { assertServerOnly } from "../../../lib/server/assertServerOnly.ts";
import { readProjectJsonFile } from "../../../lib/server/projectFiles.ts";

assertServerOnly("src/features/dictionary/lib/dictionary.ts");

function getDictionaryFilePath() {
  return "public/data/dictionary.json";
}

const readDictionary = cache((): LexicalEntry[] => {
  return readProjectJsonFile<LexicalEntry[]>(getDictionaryFilePath()) ?? [];
});

export function getDictionary(): LexicalEntry[] {
  return readDictionary();
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
