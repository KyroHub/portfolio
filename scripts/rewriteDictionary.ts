import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { LexicalEntry, LexicalGender } from '../src/features/dictionary/types.ts';
import { applyDerivedDictionaryEntries, type DerivedDictionaryLocale } from '../src/features/dictionary/lib/derivedEntries.ts';
import { extractDialectsAndHeadword } from '../src/features/dictionary/build/rawEntry.ts';

export interface LegacyLexicalEntry {
  id: string;
  headword: string;
  dialects: Record<string, string>;
  pos: LexicalEntry["pos"];
  gender: LexicalGender;
  english_meanings: string[];
  greek_equivalents: string[];
  raw: {
    word: string;
    meaning: string;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const dictionaryPaths = [
    path.join(__dirname, "../public/data/dictionary.json"),
    path.join(__dirname, "../public/data/woordenboek.json"),
  ];

  for (const dictionaryPath of dictionaryPaths) {
    console.log(`Reading existing dictionary from ${dictionaryPath}...`);

    const rawData = fs.readFileSync(dictionaryPath, "utf8");
    const legacyEntries: LegacyLexicalEntry[] = JSON.parse(rawData);

    // Re-derive headwords and dialect forms so both dictionaries follow the
    // same parsing rules as the current import pipeline.
    const newEntries: LexicalEntry[] = legacyEntries.map((entry) => {
      const { headword, dialects } = extractDialectsAndHeadword(entry.raw.word);
      return {
        ...entry,
        headword,
        dialects,
      };
    });

    const locale: DerivedDictionaryLocale = dictionaryPath.endsWith('woordenboek.json')
      ? 'nl'
      : 'en';
    const entriesWithDerivedEntries = applyDerivedDictionaryEntries(newEntries, locale);

    fs.writeFileSync(dictionaryPath, JSON.stringify(entriesWithDerivedEntries, null, 2));
    console.log(`Successfully migrated ${entriesWithDerivedEntries.length} entries to their exact grammatical bindings!`);
  }
}

main();
