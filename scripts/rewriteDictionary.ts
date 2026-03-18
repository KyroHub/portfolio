import * as fs from 'fs';
import * as path from 'path';

export interface DialectForms {
  absolute: string;
  nominal: string;
  pronominal: string;
  stative: string;
}

export interface LegacyLexicalEntry {
  id: string;
  headword: string;
  dialects: Record<string, string>;
  pos: string;
  gender: string;
  english_meanings: string[];
  greek_equivalents: string[];
  raw: {
    word: string;
    meaning: string;
  }
}

export interface NewLexicalEntry {
  id: string;
  headword: string;
  dialects: Record<string, DialectForms>;
  pos: string;
  gender: string;
  english_meanings: string[];
  greek_equivalents: string[];
  raw: {
    word: string;
    meaning: string;
  }
}

function extractDialectsAndHeadword(wordRaw: string): { headword: string, dialects: Record<string, DialectForms> } {
  const lines = wordRaw.split('\n');
  const dialectsObj: Record<string, DialectForms> = {};
  let primaryHeadword = '';

  for (const line of lines) {
    const parentheticalMatch = line.match(/^\(([^)]+)\)\s*(.*)/);
    if (parentheticalMatch) {
      const dialectKeys = parentheticalMatch[1].split(',').map(d => d.trim().toUpperCase());
      let wordTokens = parentheticalMatch[2].trim();
      
      wordTokens = wordTokens.replace(/\{.*?\}/g, '').trim();

      // We only take the first explicit token string for the state
      let form = wordTokens.split(/,\s*/)[0].trim();
      if (!form) continue;

      let state: keyof DialectForms = 'absolute';
      if (form.endsWith('-')) {
        state = 'nominal';
      } else if (form.endsWith('=')) {
        state = 'pronominal';
      } else if (form.endsWith('+') || form.endsWith('†')) {
        state = 'stative';
        if (form.endsWith('+')) form = form.slice(0, -1) + '†';
      }

      if (state === 'absolute' && !primaryHeadword) primaryHeadword = form;
      
      dialectKeys.forEach(dk => {
        if (!dialectsObj[dk]) {
          dialectsObj[dk] = { absolute: '', nominal: '', pronominal: '', stative: '' };
        }
        if (!dialectsObj[dk][state]) {
          dialectsObj[dk][state] = form;
        }
      });
    }
  }

  if (!primaryHeadword) {
    primaryHeadword = wordRaw.split('\n')[0].replace(/\{.*?\}/g, '').replace(/^\(.*?\)\s*/, '').split(',')[0].trim();
  }

  return { headword: primaryHeadword, dialects: dialectsObj };
}

function main() {
  const dictPath = path.join(__dirname, '../public/data/dictionary.json');
  console.log(`Reading existing dictionary from ${dictPath}...`);
  
  const rawData = fs.readFileSync(dictPath, 'utf8');
  const legacyEntries: LegacyLexicalEntry[] = JSON.parse(rawData);

  const newEntries: NewLexicalEntry[] = legacyEntries.map(entry => {
    const { headword, dialects } = extractDialectsAndHeadword(entry.raw.word);
    return {
      ...entry,
      headword,
      dialects
    };
  });

  fs.writeFileSync(dictPath, JSON.stringify(newEntries, null, 2));
  console.log(`Successfully migrated ${newEntries.length} entries to their exact grammatical bindings!`);
}

main();
