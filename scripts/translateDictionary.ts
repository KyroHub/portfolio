import fs from 'fs';
import path from 'path';
import { translate } from 'google-translate-api-x';

const DICT_PATH = path.join(process.cwd(), 'public/data/dictionary.json');
const WOORDENBOEK_PATH = path.join(process.cwd(), 'public/data/woordenboek.json');

// BATCH_SIZE is the number of entries to translate before writing to disk
const BATCH_SIZE = 50;
// DELAY is milliseconds between translations to avoid rate limits
const DELAY = 500;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log("Loading dictionary...");
  const rawData = fs.readFileSync(DICT_PATH, 'utf-8');
  const dictionary = JSON.parse(rawData);

  let woordenboek = [];
  if (fs.existsSync(WOORDENBOEK_PATH)) {
    const existingData = fs.readFileSync(WOORDENBOEK_PATH, 'utf-8');
    woordenboek = JSON.parse(existingData);
    console.log(`Found existing woordenboek.json with ${woordenboek.length} entries. Resuming...`);
  }

  const entriesToProcess = dictionary.slice(woordenboek.length);
  console.log(`${entriesToProcess.length} entries remaining to translate.`);

  if (entriesToProcess.length === 0) {
    console.log("Everything is already translated!");
    return;
  }

  let batchCount = 0;

  for (let i = 0; i < entriesToProcess.length; i++) {
    const entry = entriesToProcess[i];
    const newEntry = JSON.parse(JSON.stringify(entry)); // deep clone

    try {
      // Translate english_meanings array
      if (newEntry.english_meanings && newEntry.english_meanings.length > 0) {
        // Join with newlines to translate array in one API call
        const textToTranslate: string = newEntry.english_meanings.join('\n');
        const res: any = await translate(textToTranslate, { 
          to: 'nl',
          rejectOnPartialFail: false,
          forceBatch: false
        });
        
        if (res && res.text) {
          newEntry.english_meanings = res.text.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
        } else {
          console.warn(`\n[!] Translation failed for ID: ${newEntry.id}. Bypassing safely.`);
          newEntry.english_meanings = newEntry.english_meanings; // Keep original english strings if fail
        }
      }
      
      woordenboek.push(newEntry);
      process.stdout.write(`\r[${woordenboek.length}/${dictionary.length}] Translated ID: ${entry.id}`);
      
      batchCount++;
      if (batchCount >= BATCH_SIZE) {
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

  // Final save
  fs.writeFileSync(WOORDENBOEK_PATH, JSON.stringify(woordenboek, null, 2));
  console.log("\nTranslation complete!");
}

main();
