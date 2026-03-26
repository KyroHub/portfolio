import type { DictionaryDialectCode, PartOfSpeech } from "@/features/dictionary/config";

export type LexicalGender = "" | "BOTH" | "F" | "M";
export type LexicalRelationType =
  | "feminine-counterpart"
  | "derived-subentry"
  | "paradigm-member";

export interface DialectForms {
  absolute: string;
  absoluteVariants?: string[];
  nominal: string;
  pronominal: string;
  stative: string;
}

export type DictionaryDialectFormsMap = Partial<Record<DictionaryDialectCode, DialectForms>>;

export interface LexicalEntry {
  id: string;
  headword: string;
  dialects: DictionaryDialectFormsMap;
  pos: PartOfSpeech;
  gender: LexicalGender;
  parentEntryId?: string;
  relationType?: LexicalRelationType;
  english_meanings: string[];
  dutch_meanings?: string[];
  greek_equivalents: string[];
  bohairicParadigmData?: unknown;
  raw: {
    word: string;
    meaning: string;
  };
}
