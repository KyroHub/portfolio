import { cx } from "@/lib/classes";

type SubmissionStatusBadgeProps = {
  label: string;
  tone: "pending" | "reviewed";
  className?: string;
};

const TONE_CLASSES: Record<SubmissionStatusBadgeProps["tone"], string> = {
  pending:
    "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  reviewed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
};

export function SubmissionStatusBadge({
  label,
  tone,
  className,
}: SubmissionStatusBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
        TONE_CLASSES[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
