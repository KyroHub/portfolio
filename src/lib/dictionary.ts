import fs from "fs";
import path from "path";
import { LexicalEntry } from "../../scripts/parseExcel";

export function getDictionary(): LexicalEntry[] {
  const filePath = path.join(process.cwd(), "public/data/dictionary.json");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as LexicalEntry[];
}
