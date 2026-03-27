import type { LexicalEntry } from "@/features/dictionary/types";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

export const ENTRY_REPORT_REASONS = [
  "typo",
  "translation",
  "grammar",
  "relation",
  "other",
] as const;

export type EntryReportReason = (typeof ENTRY_REPORT_REASONS)[number];
export const ENTRY_REPORT_STATUSES = [
  "open",
  "reviewed",
  "resolved",
  "dismissed",
] as const;
export type EntryReportStatus = (typeof ENTRY_REPORT_STATUSES)[number];

export const ENTRY_REPORT_MIN_COMMENTARY_LENGTH = 10;
export const ENTRY_REPORT_MAX_COMMENTARY_LENGTH = 5000;

export const ENTRY_FAVORITE_ERROR_CODES = [
  "load-failed",
  "not-configured",
  "unavailable",
  "update-failed",
] as const;

export type EntryFavoriteErrorCode = (typeof ENTRY_FAVORITE_ERROR_CODES)[number];

export function isEntryReportReason(value: string): value is EntryReportReason {
  return ENTRY_REPORT_REASONS.includes(value as EntryReportReason);
}

export function isEntryReportStatus(value: string): value is EntryReportStatus {
  return ENTRY_REPORT_STATUSES.includes(value as EntryReportStatus);
}

export type EntryFavoriteRow = Tables<"entry_favorites">;
export type EntryFavoriteInsert = TablesInsert<"entry_favorites">;
export type EntryFavoriteUpdate = TablesUpdate<"entry_favorites">;
export type EntryFavoriteWithEntry = {
  entry: LexicalEntry | null;
  favorite: EntryFavoriteRow;
};

export type EntryReportRow = Tables<"entry_reports">;
export type EntryReportInsert = TablesInsert<"entry_reports">;
export type EntryReportUpdate = TablesUpdate<"entry_reports">;
export type AdminEntryReport = EntryReportRow & {
  reporterEmail: string | null;
  reporterName: string | null;
};
export type EntryReportWithEntry = {
  entry: LexicalEntry | null;
  report: AdminEntryReport;
};

const ENTRY_REPORT_REASON_LABELS: Record<EntryReportReason, string> = {
  typo: "Typo or spelling issue",
  translation: "Translation issue",
  grammar: "Grammar issue",
  relation: "Wrong relation or grouping",
  other: "Other",
};

const ENTRY_REPORT_STATUS_LABELS: Record<EntryReportStatus, string> = {
  open: "Open",
  reviewed: "Reviewed",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

export function formatEntryReportReason(reason: EntryReportReason) {
  return ENTRY_REPORT_REASON_LABELS[reason];
}

export function formatEntryReportStatus(status: EntryReportStatus) {
  return ENTRY_REPORT_STATUS_LABELS[status];
}

const ENTRY_REPORT_STATUS_PRIORITY: Record<EntryReportStatus, number> = {
  open: 0,
  reviewed: 1,
  resolved: 2,
  dismissed: 3,
};

export function compareEntryReportPriority(
  left: { created_at: string; status: EntryReportStatus },
  right: { created_at: string; status: EntryReportStatus },
) {
  return (
    ENTRY_REPORT_STATUS_PRIORITY[left.status] -
      ENTRY_REPORT_STATUS_PRIORITY[right.status] ||
    right.created_at.localeCompare(left.created_at)
  );
}
