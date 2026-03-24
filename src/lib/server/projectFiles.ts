import fs from "fs";
import path from "path";
import { assertServerOnly } from "./assertServerOnly.ts";

assertServerOnly("src/lib/server/projectFiles.ts");

function normalizeProjectPath(relativePath: string) {
  return relativePath.replace(/^\/+/, "");
}

export function getProjectFilePath(relativePath: string) {
  return path.join(process.cwd(), normalizeProjectPath(relativePath));
}

export function readProjectJsonFile<T>(relativePath: string): T | null {
  const filePath = getProjectFilePath(relativePath);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function getLatestProjectFileMtime(relativePaths: readonly string[]) {
  const modifiedTimestamps = relativePaths
    .map(getProjectFilePath)
    .filter((absolutePath) => fs.existsSync(absolutePath))
    .map((absolutePath) => fs.statSync(absolutePath).mtime.getTime());

  if (modifiedTimestamps.length === 0) {
    return undefined;
  }

  return new Date(Math.max(...modifiedTimestamps));
}
