import fs from 'fs';
import path from 'path';
import { translate } from 'google-translate-api-x';
import type { LexicalEntry } from '../src/lib/dictionaryTypes.ts';

const DICT_PATH = path.join(process.cwd(), 'public/data/dictionary.json');
const WOORDENBOEK_PATH = path.join(process.cwd(), 'public/data/woordenboek.json');

const BATCH_SIZE = 50;
const DELAY = 500;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log("Loading dictionary...");
  const rawData = fs.readFileSync(DICT_PATH, 'utf-8');
  const dictionary: LexicalEntry[] = JSON.parse(rawData);

  let woordenboek: LexicalEntry[] = [];
  if (fs.existsSync(WOORDENBOEK_PATH)) {
    const existingData = fs.readFileSync(WOORDENBOEK_PATH, 'utf-8');
    woordenboek = JSON.parse(existingData) as LexicalEntry[];
    console.log(`Found existing woordenboek.json with ${woordenboek.length} entries. Resuming...`);
  }

  const entriesToProcess = dictionary.slice(woordenboek.length);
  console.log(`${entriesToProcess.length} entries remaining to translate.`);

  if (entriesToProcess.length === 0) {
    console.log("Everything is already translated!");
    return;
  }

  // The script is resumable: translated entries are appended to the Dutch file,
  // and the next run continues from the current output length.
  let batchCount = 0;

  for (let i = 0; i < entriesToProcess.length; i++) {
    const entry = entriesToProcess[i];
    const newEntry = JSON.parse(JSON.stringify(entry));

    try {
      if (newEntry.english_meanings && newEntry.english_meanings.length > 0) {
        const textToTranslate: string = newEntry.english_meanings.join('\n');
        const res = await translate(textToTranslate, {
          to: 'nl',
          rejectOnPartialFail: false,
          forceBatch: false
        });
        
        if (res && res.text) {
          newEntry.english_meanings = res.text.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        } else {
          console.warn(`\n[!] Translation failed for ID: ${newEntry.id}. Bypassing safely.`);
        }
      }
      
      woordenboek.push(newEntry);
      process.stdout.write(`\r[${woordenboek.length}/${dictionary.length}] Translated ID: ${entry.id}`);
      
      batchCount++;
      if (batchCount >= BATCH_SIZE) {
        // Flush progress in batches so an interrupted run can resume without
        // retranslating the full dictionary.
        fs.writeFileSync(WOORDENBOEK_PATH, JSON.stringify(woordenboek, null, 2));
        batchCount = 0;
      }

      await delay(DELAY);

    } catch (error) {
      console.error(`\n\nError translating entry ${entry.id}. Saving progress and exiting.`);
      if (error instanceof Error) console.error(error.message);
      fs.writeFileSync(WOORDENBOEK_PATH, JSON.stringify(woordenboek, null, 2));
      console.log("Run the script again to resume from where it left off.");
      process.exit(1);
    }
  }

  fs.writeFileSync(WOORDENBOEK_PATH, JSON.stringify(woordenboek, null, 2));
  console.log("\nTranslation complete!");
}

main();
