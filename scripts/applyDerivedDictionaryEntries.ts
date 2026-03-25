import fs from "fs";
import path from "path";
import { applyDerivedDictionaryEntries, type DerivedDictionaryLocale } from "../src/features/dictionary/lib/derivedEntries.ts";
import type { LexicalEntry } from "../src/features/dictionary/types.ts";

const dictionaryTargets = [
  {
    path: path.join(process.cwd(), "public/data/dictionary.json"),
    locale: "en",
  },
  {
    path: path.join(process.cwd(), "public/data/woordenboek.json"),
    locale: "nl",
  },
] as const satisfies readonly {
  path: string;
  locale: DerivedDictionaryLocale;
}[];

for (const target of dictionaryTargets) {
  if (!fs.existsSync(target.path)) {
    continue;
  }

  const dictionary = JSON.parse(fs.readFileSync(target.path, "utf8")) as LexicalEntry[];
  const dictionaryWithDerivedEntries = applyDerivedDictionaryEntries(
    dictionary,
    target.locale,
  );

  fs.writeFileSync(target.path, JSON.stringify(dictionaryWithDerivedEntries, null, 2));
  console.log(`Wrote ${target.path} with ${dictionaryWithDerivedEntries.length} entries.`);
}
