import { ANALYTICS_DIALECTS, type AnalyticsDialect } from "@/features/dictionary/config";
import type { LexicalEntry } from "@/features/dictionary/types";

export type AnalyticsChartDatum = {
  name: string;
  value: number;
};

export type AnalyticsSnapshot = {
  totalRoots: number;
  unknownMeaning: number;
  uncertainMeaning: number;
  posChartData: AnalyticsChartDatum[];
  genderChartData: AnalyticsChartDatum[];
  verbalNouns: number;
  totalNouns: number;
  totalMasculine: number;
};

export type AnalyticsSnapshotMap = Record<AnalyticsDialect, AnalyticsSnapshot>;

function createAnalyticsSnapshot(dictionary: LexicalEntry[]): AnalyticsSnapshot {
  const posCounts: Record<string, number> = {
    V: 0,
    N: 0,
    ADJ: 0,
    ADV: 0,
    CONJ: 0,
    PREP: 0,
    INTERJ: 0,
    OTHER: 0,
    UNKNOWN: 0,
  };
  const genderCounts = { M: 0, F: 0, BOTH: 0, UNSPECIFIED: 0 };

  let unknownMeaning = 0;
  let uncertainMeaning = 0;

  for (const entry of dictionary) {
    const meaningString = entry.english_meanings.join(" ").toLowerCase();

    if (meaningString.includes("meaning unknown")) {
      unknownMeaning++;
    }

    if (meaningString.includes("meaning uncertain")) {
      uncertainMeaning++;
    }

    if (posCounts[entry.pos] !== undefined) {
      posCounts[entry.pos]++;
    } else {
      posCounts[entry.pos] = 1;
    }

    if (entry.pos === "N") {
      if (entry.gender === "M") {
        genderCounts.M++;
      } else if (entry.gender === "F") {
        genderCounts.F++;
      } else if (entry.gender === "BOTH") {
        genderCounts.BOTH++;
      } else {
        genderCounts.UNSPECIFIED++;
      }
    }
  }

  // Verbs are treated as verbal nouns elsewhere in the app, so the noun panel
  // folds them into the totals used for the gender breakdown.
  const verbalNouns = posCounts.V || 0;
  const totalNouns = posCounts.N + verbalNouns;
  const totalMasculine = genderCounts.M + verbalNouns;

  return {
    totalRoots: dictionary.length,
    unknownMeaning,
    uncertainMeaning,
    posChartData: [
      { name: "Verbs", value: posCounts.V },
      { name: "Nouns", value: posCounts.N },
      { name: "Adjectives", value: posCounts.ADJ || 0 },
      { name: "Adverbs", value: posCounts.ADV || 0 },
      { name: "Conjunctions", value: posCounts.CONJ || 0 },
      { name: "Prepositions", value: posCounts.PREP || 0 },
      { name: "Other", value: (posCounts.OTHER || 0) + (posCounts.INTERJ || 0) },
    ].filter((item) => item.value > 0),
    genderChartData: [
      { name: "Masculine (explicit)", value: genderCounts.M },
      { name: "Feminine", value: genderCounts.F },
      { name: "Epicene (Both)", value: genderCounts.BOTH },
      { name: "Unspecified", value: genderCounts.UNSPECIFIED },
    ].filter((item) => item.value > 0),
    verbalNouns,
    totalNouns,
    totalMasculine,
  };
}

export function createAnalyticsSnapshots(dictionary: LexicalEntry[]): AnalyticsSnapshotMap {
  return ANALYTICS_DIALECTS.reduce<AnalyticsSnapshotMap>((snapshots, dialect) => {
    const filteredDictionary =
      dialect === "ALL"
        ? dictionary
        : dictionary.filter((entry) => entry.dialects[dialect] !== undefined);

    snapshots[dialect] = createAnalyticsSnapshot(filteredDictionary);
    return snapshots;
  }, {} as AnalyticsSnapshotMap);
}
