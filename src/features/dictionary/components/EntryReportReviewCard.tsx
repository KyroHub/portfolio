import Link from "next/link";
import { Badge } from "@/components/Badge";
import { SurfacePanel } from "@/components/SurfacePanel";
import { formatSubmissionDate } from "@/features/submissions/utils";
import { antinoou } from "@/lib/fonts";
import { getEntryPath } from "@/lib/locale";
import {
  formatEntryReportReason,
  type EntryReportWithEntry,
} from "../lib/entryActions";
import { EntryReportReviewForm } from "./EntryReportReviewForm";
import { EntryReportStatusBadge } from "./EntryReportStatusBadge";

type EntryReportReviewCardProps = {
  reportWithEntry: EntryReportWithEntry;
};

export function EntryReportReviewCard({
  reportWithEntry,
}: EntryReportReviewCardProps) {
  const { entry, report } = reportWithEntry;
  const meaningPreview = entry?.english_meanings.slice(0, 2).join("; ") ?? null;

  return (
    <SurfacePanel
      as="article"
      rounded="3xl"
      variant="elevated"
      className="p-6 md:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <EntryReportStatusBadge status={report.status} />
            <Badge tone="surface" size="xs">
              {formatEntryReportReason(report.reason)}
            </Badge>
          </div>

          <h2
            className={`${antinoou.className} text-3xl tracking-wide text-sky-700 dark:text-sky-300`}
          >
            {report.entry_headword}
          </h2>

          <div className="mt-3 space-y-2 text-sm text-stone-600 dark:text-stone-400">
            <p>
              Reporter:{" "}
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {report.reporterName ?? report.reporterEmail ?? "Unknown user"}
              </span>
              {report.reporterEmail && report.reporterName ? ` (${report.reporterEmail})` : ""}
            </p>
            <p>Submitted on {formatSubmissionDate(report.created_at, "en")}</p>
            <p>Entry ID: {report.entry_id}</p>
          </div>

          {meaningPreview ? (
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-700 dark:text-stone-300">
              Current meaning: {meaningPreview}
            </p>
          ) : (
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 dark:text-stone-400">
              This entry is no longer present in the current published dictionary data.
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
          <Link href={getEntryPath(report.entry_id, "en")} className="btn-secondary px-5">
            Open entry
          </Link>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-stone-100 bg-stone-50 p-5 text-base leading-7 text-stone-700 dark:border-stone-800/50 dark:bg-stone-950 dark:text-stone-300">
        {report.commentary}
      </div>

      <EntryReportReviewForm reportId={report.id} status={report.status} />
    </SurfacePanel>
  );
}
