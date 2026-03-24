import fs from "fs";
import { fileURLToPath } from "url";
import { assertServerOnly } from "@/lib/server/assertServerOnly.ts";
import type { PartOfSpeech } from "../config.ts";
import type {
  DictionaryDialectFormsMap,
  LexicalGender,
  LexicalRelationType,
} from "../types.ts";

assertServerOnly("src/features/dictionary/lib/dictionarySourceConfig.ts");

export type DictionarySourceLocale = "en" | "nl";

export type CuratedDerivedEntryDefinition = {
  id: string;
  headword: string;
  dialects: DictionaryDialectFormsMap;
  pos: PartOfSpeech;
  gender: LexicalGender;
  parentEntryId: string;
  relationType: LexicalRelationType;
  meanings: Record<DictionarySourceLocale, string[]>;
  greekEquivalents: string[];
  raw: {
    word: string;
    meaning: string;
  };
};

export type PromotedRelatedEntryDefinition = {
  id: string;
  parentEntryId: string;
  relationLabel: "female";
  dialect: string;
  form: string;
  headword?: string;
  pos?: PartOfSpeech;
  gender?: LexicalGender;
  relationType?: LexicalRelationType;
  meanings: Record<DictionarySourceLocale, string[]>;
  greekEquivalents?: string[];
};

export type DictionarySourceConfig = {
  curatedDerivedEntries: CuratedDerivedEntryDefinition[];
  promotedRelatedEntries: PromotedRelatedEntryDefinition[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectString(value: unknown, label: string) {
  if (typeof value !== "string") {
    throw new Error(`${label} must be a string`);
  }

  return value;
}

function expectStringArray(value: unknown, label: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`${label} must be a string array`);
  }

  return value;
}

function expectLocalizedMeanings(
  value: unknown,
  label: string,
): Record<DictionarySourceLocale, string[]> {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object`);
  }

  return {
    en: expectStringArray(value.en, `${label}.en`),
    nl: expectStringArray(value.nl, `${label}.nl`),
  };
}

function expectDialectFormsMap(
  value: unknown,
  label: string,
): DictionaryDialectFormsMap {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object`);
  }

  const entries = Object.entries(value).map(([dialect, forms]) => {
    if (!isRecord(forms)) {
      throw new Error(`${label}.${dialect} must be an object`);
    }

    return [
      dialect,
      {
        absolute: expectString(forms.absolute, `${label}.${dialect}.absolute`),
        ...(forms.absoluteVariants !== undefined
          ? {
              absoluteVariants: expectStringArray(
                forms.absoluteVariants,
                `${label}.${dialect}.absoluteVariants`,
              ),
            }
          : {}),
        nominal: expectString(forms.nominal, `${label}.${dialect}.nominal`),
        pronominal: expectString(
          forms.pronominal,
          `${label}.${dialect}.pronominal`,
        ),
        stative: expectString(forms.stative, `${label}.${dialect}.stative`),
      },
    ] as const;
  });

  return Object.fromEntries(entries) as DictionaryDialectFormsMap;
}

function readJson(relativePath: string) {
  const filePath = fileURLToPath(new URL(relativePath, import.meta.url));
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
}

let dictionarySourceConfigCache: DictionarySourceConfig | null = null;

function parseCuratedDerivedEntryDefinitions(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error(
      "master-dictionary.json.curatedDerivedEntries must be an array",
    );
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        `master-dictionary.json.curatedDerivedEntries[${index}] must be an object`,
      );
    }

    if (!isRecord(item.raw)) {
      throw new Error(
        `master-dictionary.json.curatedDerivedEntries[${index}].raw must be an object`,
      );
    }

    return {
      id: expectString(
        item.id,
        `master-dictionary.curatedDerivedEntries[${index}].id`,
      ),
      headword: expectString(
        item.headword,
        `master-dictionary.curatedDerivedEntries[${index}].headword`,
      ),
      dialects: expectDialectFormsMap(
        item.dialects,
        `master-dictionary.curatedDerivedEntries[${index}].dialects`,
      ),
      pos: expectString(
        item.pos,
        `master-dictionary.curatedDerivedEntries[${index}].pos`,
      ) as PartOfSpeech,
      gender: expectString(
        item.gender,
        `master-dictionary.curatedDerivedEntries[${index}].gender`,
      ) as LexicalGender,
      parentEntryId: expectString(
        item.parentEntryId,
        `master-dictionary.curatedDerivedEntries[${index}].parentEntryId`,
      ),
      relationType: expectString(
        item.relationType,
        `master-dictionary.curatedDerivedEntries[${index}].relationType`,
      ) as LexicalRelationType,
      meanings: expectLocalizedMeanings(
        item.meanings,
        `master-dictionary.curatedDerivedEntries[${index}].meanings`,
      ),
      greekEquivalents: expectStringArray(
        item.greekEquivalents,
        `master-dictionary.curatedDerivedEntries[${index}].greekEquivalents`,
      ),
      raw: {
        word: expectString(
          item.raw.word,
          `master-dictionary.curatedDerivedEntries[${index}].raw.word`,
        ),
        meaning: expectString(
          item.raw.meaning,
          `master-dictionary.curatedDerivedEntries[${index}].raw.meaning`,
        ),
      },
    } satisfies CuratedDerivedEntryDefinition;
  });
}

function parsePromotedRelatedEntryDefinitions(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error(
      "master-dictionary.json.promotedRelatedEntries must be an array",
    );
  }

  return value.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(
        `master-dictionary.json.promotedRelatedEntries[${index}] must be an object`,
      );
    }

    return {
      id: expectString(
        item.id,
        `master-dictionary.promotedRelatedEntries[${index}].id`,
      ),
      parentEntryId: expectString(
        item.parentEntryId,
        `master-dictionary.promotedRelatedEntries[${index}].parentEntryId`,
      ),
      relationLabel: expectString(
        item.relationLabel,
        `master-dictionary.promotedRelatedEntries[${index}].relationLabel`,
      ) as "female",
      dialect: expectString(
        item.dialect,
        `master-dictionary.promotedRelatedEntries[${index}].dialect`,
      ),
      form: expectString(
        item.form,
        `master-dictionary.promotedRelatedEntries[${index}].form`,
      ),
      ...(item.headword !== undefined
        ? {
            headword: expectString(
              item.headword,
              `master-dictionary.promotedRelatedEntries[${index}].headword`,
            ),
          }
        : {}),
      ...(item.pos !== undefined
        ? {
            pos: expectString(
              item.pos,
              `master-dictionary.promotedRelatedEntries[${index}].pos`,
            ) as PartOfSpeech,
          }
        : {}),
      ...(item.gender !== undefined
        ? {
            gender: expectString(
              item.gender,
              `master-dictionary.promotedRelatedEntries[${index}].gender`,
            ) as LexicalGender,
          }
        : {}),
      ...(item.relationType !== undefined
        ? {
            relationType: expectString(
              item.relationType,
              `master-dictionary.promotedRelatedEntries[${index}].relationType`,
            ) as LexicalRelationType,
          }
        : {}),
      meanings: expectLocalizedMeanings(
        item.meanings,
        `master-dictionary.promotedRelatedEntries[${index}].meanings`,
      ),
      ...(item.greekEquivalents !== undefined
        ? {
            greekEquivalents: expectStringArray(
              item.greekEquivalents,
              `master-dictionary.promotedRelatedEntries[${index}].greekEquivalents`,
            ),
          }
        : {}),
    } satisfies PromotedRelatedEntryDefinition;
  });
}

export function loadDictionarySourceConfig() {
  if (dictionarySourceConfigCache) {
    return dictionarySourceConfigCache;
  }

  const value = readJson("../../../content/dictionary/master-dictionary.json");

  if (!isRecord(value)) {
    throw new Error("master-dictionary.json must export an object");
  }

  dictionarySourceConfigCache = {
    curatedDerivedEntries: parseCuratedDerivedEntryDefinitions(
      value.curatedDerivedEntries,
    ),
    promotedRelatedEntries: parsePromotedRelatedEntryDefinitions(
      value.promotedRelatedEntries,
    ),
  };

  return dictionarySourceConfigCache;
}

export function loadCuratedDerivedEntryDefinitions() {
  return loadDictionarySourceConfig().curatedDerivedEntries;
}

export function loadPromotedRelatedEntryDefinitions() {
  return loadDictionarySourceConfig().promotedRelatedEntries;
}
