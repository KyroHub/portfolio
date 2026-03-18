import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

interface WordData {
  word: string;
  meaning: string;
}

export interface DialectForms {
  absolute: string;
  nominal: string;
  pronominal: string;
  stative: string;
}

export interface LexicalEntry {
  id: string;
  headword: string;
  dialects: Record<string, DialectForms>; // e.g. { S: { absolute: "ⲙⲟⲩϩ", nominal: "ⲙⲉϩ-", pronominal: "ⲙⲁϩ=", stative: "ⲙⲉϩ†" } }
  pos: string; // V, N, ADJ, etc.
  gender: string; // F, M, BOTH, ''
  english_meanings: string[];
  greek_equivalents: string[];
  raw: {
    word: string;
    meaning: string;
  }
}

// Reuse logic from data-analysis.ts
function classifyPOS(meaning: string): string {
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

function classifyNounGender(meaning: string, pos: string): string {
  const raw = meaning.trim();
  const first = raw.split('\n')[0].trim();
  const lower = raw.toLowerCase();
  
  let gender = '';
  if (/^f(\s|,|:|$)/.test(first)) gender = 'F';
  else if (/^m(\s|,|:|$)/.test(first)) gender = 'M';
  else if (/\bnn\s+f\b/.test(lower)) gender = 'F';
  else if (/\bnn\s+m\b/.test(lower)) gender = 'M';
  else if (/\bnn\b/.test(lower) && !/\bnn\s+[mf]\b/.test(lower)) gender = 'BOTH';
  
  // Verbs used as nouns take masculine determination in Coptic natively
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
  // Typical line: "(S, A, sA) ⲟⲩⲁ(ⲉ)ⲓⲛⲉ"
  const lines = wordRaw.split('\n');
  const dialectsObj: Record<string, DialectForms> = {};
  let primaryHeadword = '';

  for (const line of lines) {
    const parentheticalMatch = line.match(/^\(([^)]+)\)\s*(.*)/);
    if (parentheticalMatch) {
      const dialectKeys = parentheticalMatch[1].split(',').map(d => d.trim().toUpperCase());
      let wordTokens = parentheticalMatch[2].trim();
      
      // Strip out corpus ext references for the clean headword e.g. {ext codex...}
      wordTokens = wordTokens.replace(/\{.*?\}/g, '').trim();

      // We'll take the first word listed for this block as the representative spelling
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

  // If we couldn't parse properly, just taking the first word
  if (!primaryHeadword) {
    primaryHeadword = wordRaw.split('\n')[0].replace(/\{.*?\}/g, '').replace(/^\(.*?\)\s*/, '').split(',')[0].trim();
  }

  return { headword: primaryHeadword, dialects: dialectsObj };
}

import * as os from 'os';

function main() {
  const excelPaths = [
    path.join(os.homedir(), 'Desktop/Coptic/marcion-test.xlsx')
  ];

  let rawData: WordData[] = [];

  for (const p of excelPaths) {
    if (fs.existsSync(p)) {
      console.log(`Reading ${p}...`);
      const wb = XLSX.readFile(p);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<WordData>(sheet, { header: ["word", "meaning"], defval: "" });
      rawData.push(...data);
    } else {
      console.warn(`File not found: ${p}`);
    }
  }

  const dictionary: LexicalEntry[] = [];
  let idCounter = 1;

  for (const item of rawData) {
    if (!item.word || !item.meaning) continue;

    // HTML tags are now stripped during the initial data extraction
    const cleanWord = item.word.replace(/<[^>]+>/g, '');
    const cleanMeaningRaw = item.meaning.replace(/<[^>]+>/g, '');

    const { headword, dialects } = extractDialectsAndHeadword(cleanWord);
    const pos = classifyPOS(cleanMeaningRaw);
    const gender = classifyNounGender(cleanMeaningRaw, pos);
    const greek = extractGreek(cleanMeaningRaw);
    
    // Simple basic string cleanup
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
      english_meanings: cleanMeaningLines, // Keep all lines perfectly intact (including sub-meanings starting with ―)
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
