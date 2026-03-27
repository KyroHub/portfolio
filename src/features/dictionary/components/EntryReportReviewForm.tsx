import { updateEntryReportStatus } from "@/actions/admin";
import { FormField } from "@/components/FormField";
import {
  ENTRY_REPORT_STATUSES,
  formatEntryReportStatus,
  type EntryReportStatus,
} from "../lib/entryActions";

type EntryReportReviewFormProps = {
  reportId: string;
  status: EntryReportStatus;
};

export function EntryReportReviewForm({
  reportId,
  status,
}: EntryReportReviewFormProps) {
  return (
    <form
      action={updateEntryReportStatus}
      className="space-y-4 rounded-2xl border border-stone-100 bg-stone-50/60 p-5 dark:border-stone-800 dark:bg-stone-900/20"
    >
      <input type="hidden" name="report_id" value={reportId} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <FormField
          htmlFor={`entry-report-status-${reportId}`}
          label="Review status"
          labelTone="muted"
          className="min-w-[14rem] flex-1"
        >
          <select
            id={`entry-report-status-${reportId}`}
            name="status"
            defaultValue={status}
            className="select-base h-11 rounded-xl text-sm"
          >
            {ENTRY_REPORT_STATUSES.map((nextStatus) => (
              <option key={nextStatus} value={nextStatus}>
                {formatEntryReportStatus(nextStatus)}
              </option>
            ))}
          </select>
        </FormField>

        <button type="submit" className="btn-primary px-5">
          Save status
        </button>
      </div>
    </form>
  );
}
