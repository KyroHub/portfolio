import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { applyDerivedDictionaryEntries } from '../src/features/dictionary/lib/derivedEntries.ts';
import type { LexicalEntry } from '../src/features/dictionary/types.ts';
import {
  buildLexicalEntryFromSourceRow,
  type DictionarySourceRow,
} from '../src/features/dictionary/build/rawEntry.ts';

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

  const rawData: DictionarySourceRow[] = [];
  let foundAnySource = false;

  for (const p of excelPaths) {
    if (fs.existsSync(p)) {
      foundAnySource = true;
      console.log(`Reading ${p}...`);
      const wb = XLSX.readFile(p);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<DictionarySourceRow>(sheet, {
        header: ["word", "meaning"],
        defval: "",
      });
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
    const entry = buildLexicalEntryFromSourceRow(item, `cd_${idCounter++}`);

    if (entry) {
      dictionary.push(entry);
    }
  }

  const outDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'dictionary.json');
  const dictionaryWithDerivedEntries = applyDerivedDictionaryEntries(dictionary, 'en');

  fs.writeFileSync(outPath, JSON.stringify(dictionaryWithDerivedEntries, null, 2));

  console.log(`Successfully generated dictionary JSON with ${dictionaryWithDerivedEntries.length} entries at ${outPath}`);
}

main();
