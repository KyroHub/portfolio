import { StatusNotice } from "@/components/StatusNotice";
import type { SubmissionRow } from "@/features/submissions/types";

type SubmissionFeedbackPanelProps = {
  submission: SubmissionRow;
};

export function SubmissionFeedbackPanel({
  submission,
}: SubmissionFeedbackPanelProps) {
  if (submission.status === "reviewed") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 dark:border-emerald-800/30 dark:bg-emerald-900/10 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            Score: {submission.rating ?? "—"} / 5
          </span>
        </div>
        <h4 className="mb-2 font-bold text-stone-800 dark:text-stone-200">
          Instructor Feedback
        </h4>
        <p className="font-medium leading-relaxed text-stone-700 dark:text-stone-300">
          &ldquo;{submission.feedback_text}&rdquo;
        </p>
      </div>
    );
  }

  return (
    <StatusNotice tone="default" size="comfortable" dashed className="mt-2">
      <p className="italic">
        Waiting for instructor review. Check back later!
      </p>
    </StatusNotice>
  );
}
