import type { ReactNode } from "react";
import { SurfacePanel } from "@/components/SurfacePanel";
import { cx } from "@/lib/classes";
import type { SubmissionRow } from "@/features/submissions/types";
import {
  formatLessonSlug,
  formatSubmissionDate,
} from "@/features/submissions/utils";

type SubmissionCardProps = {
  submission: SubmissionRow;
  children?: ReactNode;
  contentClassName?: string;
  subtitle?: ReactNode;
  topRight?: ReactNode;
};

export function SubmissionCard({
  submission,
  children,
  contentClassName,
  subtitle,
  topRight,
}: SubmissionCardProps) {
  return (
    <SurfacePanel
      as="article"
      rounded="3xl"
      variant="elevated"
      className="relative overflow-hidden p-6 transition-all hover:shadow-lg md:p-8"
    >
      {topRight}

      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold uppercase tracking-wide text-stone-800 dark:text-stone-200 md:text-2xl">
            {formatLessonSlug(submission.lesson_slug)}
          </h2>
          {subtitle && (
            <div className="mt-1 text-stone-500 dark:text-stone-400">{subtitle}</div>
          )}
        </div>
        <span className="rounded-lg bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-400 dark:bg-stone-800">
          {formatSubmissionDate(submission.created_at)}
        </span>
      </div>

      <div
        className={cx(
          "mb-6 rounded-2xl border border-stone-100 bg-stone-50 p-5 whitespace-pre-wrap font-coptic text-lg text-stone-700 dark:border-stone-800/50 dark:bg-stone-950 dark:text-stone-300 md:text-xl",
          contentClassName
        )}
      >
        {submission.submitted_text}
      </div>

      {children}
    </SurfacePanel>
  );
}
