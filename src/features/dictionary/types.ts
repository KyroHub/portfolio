import type { DictionaryDialectCode, PartOfSpeech } from "@/features/dictionary/config";

export type LexicalGender = "" | "BOTH" | "F" | "M";

export interface DialectForms {
  absolute: string;
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
  english_meanings: string[];
  greek_equivalents: string[];
  raw: {
    word: string;
    meaning: string;
  };
}
