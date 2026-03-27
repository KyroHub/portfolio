import { cx } from "@/lib/classes";
import {
  formatEntryReportStatus,
  type EntryReportStatus,
} from "../lib/entryActions";

type EntryReportStatusBadgeProps = {
  className?: string;
  status: EntryReportStatus;
};

const STATUS_CLASSES: Record<EntryReportStatus, string> = {
  open: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300",
  reviewed:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-300",
  resolved:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300",
  dismissed:
    "border-stone-200 bg-stone-100 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

export function EntryReportStatusBadge({
  className,
  status,
}: EntryReportStatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        STATUS_CLASSES[status],
        className,
      )}
    >
      {formatEntryReportStatus(status)}
    </span>
  );
}
