import type { TranslationKey } from "@/lib/i18n";

export const DICTIONARY_DIALECT_CODES = [
  "A",
  "B",
  "F",
  "Fb",
  "L",
  "Sl",
  "O",
  "S",
  "Sa",
  "Sf",
] as const;

export const ANALYTICS_DIALECTS = ["ALL", "S", "B", "A", "L", "F"] as const;

export const PARTS_OF_SPEECH = [
  "V",
  "N",
  "ADJ",
  "ADV",
  "CONJ",
  "INTERJ",
  "OTHER",
  "PREP",
  "UNKNOWN",
] as const;

export type DictionaryDialectCode = (typeof DICTIONARY_DIALECT_CODES)[number];
export type AnalyticsDialect = (typeof ANALYTICS_DIALECTS)[number];
export type DialectFilter = AnalyticsDialect;
export type PartOfSpeech = (typeof PARTS_OF_SPEECH)[number];
export type DictionaryPartOfSpeechFilter = "ALL" | "V" | "N" | "ADJ" | "ADV" | "PREP";

type DialectOption = {
  value: DialectFilter;
  labelKey: TranslationKey;
};

type PartOfSpeechOption = {
  value: DictionaryPartOfSpeechFilter;
  labelKey: TranslationKey;
};

const DIALECT_LABEL_KEYS: Record<"ALL" | DictionaryDialectCode, TranslationKey> = {
  ALL: "dialect.ALL",
  A: "dialect.A",
  B: "dialect.B",
  F: "dialect.F",
  Fb: "dialect.Fb",
  L: "dialect.L",
  Sl: "dialect.Sl",
  O: "dialect.O",
  S: "dialect.S",
  Sa: "dialect.Sa",
  Sf: "dialect.Sf",
};

const DIALECT_KEYS_WITH_SUFFIX = new Set<DictionaryDialectCode>(["Fb", "Sl", "Sa", "Sf"]);

export const DEFAULT_DICTIONARY_DIALECT_FILTER: DialectFilter = "B";
export const DEFAULT_PART_OF_SPEECH_FILTER: DictionaryPartOfSpeechFilter = "ALL";

export const dialectFilterOptions = [
  { value: "ALL", labelKey: "dialect.ALL" },
  { value: "S", labelKey: "dialect.S" },
  { value: "B", labelKey: "dialect.B" },
  { value: "A", labelKey: "dialect.A" },
  { value: "L", labelKey: "dialect.L" },
  { value: "F", labelKey: "dialect.F" },
] as const satisfies readonly DialectOption[];

export const dictionaryPartOfSpeechFilterOptions = [
  { value: "ALL", labelKey: "dict.any" },
  { value: "V", labelKey: "dict.verb" },
  { value: "N", labelKey: "dict.noun" },
  { value: "ADJ", labelKey: "dict.adj" },
  { value: "ADV", labelKey: "dict.adv" },
  { value: "PREP", labelKey: "dict.prep" },
] as const satisfies readonly PartOfSpeechOption[];

export function getDialectLabelKey(siglum: string): TranslationKey | undefined {
  if (siglum === "La") {
    return DIALECT_LABEL_KEYS.Sl;
  }

  return DIALECT_LABEL_KEYS[siglum as keyof typeof DIALECT_LABEL_KEYS];
}

export function getDialectFilterOptionLabel(
  dialect: DialectFilter,
  translate: (key: TranslationKey) => string
) {
  const label = translate(DIALECT_LABEL_KEYS[dialect]);
  return dialect === "ALL" ? label : `${label} (${dialect})`;
}

export function getPartOfSpeechFilterLabel(
  partOfSpeech: DictionaryPartOfSpeechFilter,
  translate: (key: TranslationKey) => string
) {
  const option = dictionaryPartOfSpeechFilterOptions.find(
    (candidate) => candidate.value === partOfSpeech
  );

  return option ? translate(option.labelKey) : partOfSpeech;
}

export function isDictionaryDialectCode(value: string): value is DictionaryDialectCode {
  return DICTIONARY_DIALECT_CODES.includes(value as DictionaryDialectCode);
}

export function isDialectFilter(value: string): value is DialectFilter {
  return ANALYTICS_DIALECTS.includes(value as DialectFilter);
}

export function normalizeDialectKey(dialectKey: string): string {
  // Import scripts still encounter legacy sigla from source spreadsheets, so
  // we normalize them before they reach the typed UI and analytics layers.
  const trimmedKey = dialectKey.trim();

  if (trimmedKey === "sA") {
    return "L";
  }

  if (trimmedKey === "NH") {
    return "Sl";
  }

  if (trimmedKey === "La") {
    return "Sl";
  }

  if (DIALECT_KEYS_WITH_SUFFIX.has(trimmedKey as DictionaryDialectCode)) {
    return trimmedKey;
  }

  return trimmedKey.toUpperCase();
}
