import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type {
  DialectForms,
  LexicalEntry,
  LexicalGender,
} from '../src/lib/dictionaryTypes.ts';
import type { PartOfSpeech } from '../src/features/dictionary/config.ts';
import { normalizeDialectKey } from '../src/lib/dialects.ts';

interface WordData {
  word: string;
  meaning: string;
}

// The source spreadsheet encodes part-of-speech shorthand at the start of the
// meaning field, so we infer the typed enum from those recurring prefixes.
function classifyPOS(meaning: string): PartOfSpeech {
  const m = meaning.trim().toLowerCase();
  if (!m || m.startsWith("meaning unknown") || m.startsWith("nn(?), meaning unknown")) return "UNKNOWN";
  if (m.startsWith("intr") || m.startsWith("tr") || m.startsWith("impers vb") || m.startsWith("impers") || m.startsWith("qual")) return "V";
  if (m.startsWith("as adj") || m.startsWith("nn as adj") || m.startsWith("nn or adj")) return "ADJ";
  if (m.startsWith("as adv") || m.startsWith("adv")) return "ADV";
  if (m.includes("conj") || m.startsWith("conjunction")) return "CONJ";
  if (m.startsWith("as prep") || m.startsWith("prep")) return "PREP";
  if (m.startsWith("interj") || m.startsWith("deprecatory interj")) return "INTERJ";
  if (m.startsWith("pron") || m.startsWith("pers pron") || m.startsWith("dem pron") || m.startsWith("rel pron")) return "OTHER";
  if (m.startsWith("verbal prefix") || m.startsWith("prefix") || m.startsWith("article") || m.startsWith("def art") || m.startsWith("indef art")) return "OTHER";
  if (m.startsWith("nn") || m.startsWith("name") || m.startsWith("f ") || m.startsWith("m ")) return "N";
  return "N";
}

function classifyNounGender(
  meaning: string,
  pos: PartOfSpeech
): LexicalGender {
  const raw = meaning.trim();
  const first = raw.split('\n')[0].trim();
  const lower = raw.toLowerCase();
  
  let gender: LexicalGender = '';
  if (/^f(\s|,|:|$)/.test(first)) gender = 'F';
  else if (/^m(\s|,|:|$)/.test(first)) gender = 'M';
  else if (/\bnn\s+f\b/.test(lower)) gender = 'F';
  else if (/\bnn\s+m\b/.test(lower)) gender = 'M';
  else if (/\bnn\b/.test(lower) && !/\bnn\s+[mf]\b/.test(lower)) gender = 'BOTH';
  
  if (pos === 'V' && gender === 'BOTH') {
    return 'M';
  }
  
  return gender;
}

function extractGreek(meaning: string): string[] {
  const match = meaning.match(/\[(.*?)\]/g);
  if (!match) return [];
  return match.map(g => g.slice(1, -1).trim());
}

function extractDialectsAndHeadword(wordRaw: string): { headword: string, dialects: Record<string, DialectForms> } {
  // Each parenthesized line carries one or more dialect sigla followed by the
  // form to store for that grammatical state.
  const lines = wordRaw.split('\n');
  const dialectsObj: Record<string, DialectForms> = {};
  let primaryHeadword = '';

  for (const line of lines) {
    const parentheticalMatch = line.match(/^\(([^)]+)\)\s*(.*)/);
    if (parentheticalMatch) {
      const dialectKeys = parentheticalMatch[1].split(',').map((d) => normalizeDialectKey(d));
      let wordTokens = parentheticalMatch[2].trim();

      wordTokens = wordTokens.replace(/\{.*?\}/g, '').trim();

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getExcelPaths(): string[] {
  const cliPaths = process.argv.slice(2).map((value) => value.trim()).filter(Boolean);

  if (cliPaths.length > 0) {
    return cliPaths.map((value) => path.resolve(value));
  }

  const envPath = process.env.DICTIONARY_SOURCE_PATH?.trim();
  if (envPath) {
    return [path.resolve(envPath)];
  }

  return [];
}

function main() {
  const excelPaths = getExcelPaths();

  if (excelPaths.length === 0) {
    console.error("No source spreadsheet provided.");
    console.error("Pass one or more paths with `npm run data:parse -- /path/to/source.xlsx`");
    console.error("or set the `DICTIONARY_SOURCE_PATH` environment variable.");
    process.exit(1);
  }

  const rawData: WordData[] = [];
  let foundAnySource = false;

  for (const p of excelPaths) {
    if (fs.existsSync(p)) {
      foundAnySource = true;
      console.log(`Reading ${p}...`);
      const wb = XLSX.readFile(p);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<WordData>(sheet, { header: ["word", "meaning"], defval: "" });
      rawData.push(...data);
    } else {
      console.warn(`File not found: ${p}`);
    }
  }

  if (!foundAnySource) {
    console.error("None of the provided spreadsheet paths could be found.");
    process.exit(1);
  }

  const dictionary: LexicalEntry[] = [];
  let idCounter = 1;

  for (const item of rawData) {
    if (!item.word || !item.meaning) continue;

    const cleanWord = item.word.replace(/<[^>]+>/g, '');
    const cleanMeaningRaw = item.meaning.replace(/<[^>]+>/g, '');

    const { headword, dialects } = extractDialectsAndHeadword(cleanWord);
    const pos = classifyPOS(cleanMeaningRaw);
    const gender = classifyNounGender(cleanMeaningRaw, pos);
    const greek = extractGreek(cleanMeaningRaw);

    // Meaning lines stay split because downstream search and UI both rely on
    // preserving gloss boundaries from the source spreadsheet.
    const cleanMeaningLines = cleanMeaningRaw
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const entry: LexicalEntry = {
      id: `cd_${idCounter++}`,
      headword,
      dialects,
      pos,
      gender,
      english_meanings: cleanMeaningLines,
      greek_equivalents: greek,
      raw: {
        word: cleanWord,
        meaning: cleanMeaningRaw
      }
    };
    
    dictionary.push(entry);
  }

  const outDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'dictionary.json');
  fs.writeFileSync(outPath, JSON.stringify(dictionary, null, 2));

  console.log(`Successfully generated dictionary JSON with ${dictionary.length} entries at ${outPath}`);
}

main();
