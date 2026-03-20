import fs from "fs";
import path from "path";
import type { LexicalEntry } from "@/features/dictionary/types";

export function getDictionary(): LexicalEntry[] {
  const filePath = path.join(process.cwd(), "public/data/dictionary.json");

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents) as LexicalEntry[];
}
