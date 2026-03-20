import type { ReactNode } from "react";
import { cx } from "@/lib/classes";

type StatusNoticeTone = "default" | "error" | "info" | "success";
type StatusNoticeSize = "compact" | "comfortable";
type StatusNoticeAlign = "left" | "center";

type StatusNoticeProps = {
  actions?: ReactNode;
  align?: StatusNoticeAlign;
  children?: ReactNode;
  className?: string;
  dashed?: boolean;
  size?: StatusNoticeSize;
  title?: ReactNode;
  tone?: StatusNoticeTone;
};

const TONE_CLASSES: Record<StatusNoticeTone, string> = {
  default:
    "border-stone-200 bg-white/60 text-stone-600 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-400",
  error:
    "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400",
  info:
    "border-sky-200 bg-sky-50/80 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/20 dark:text-sky-400",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-400",
};

const SIZE_CLASSES: Record<StatusNoticeSize, string> = {
  compact: "px-4 py-3 text-sm",
  comfortable: "p-6",
};

export function StatusNotice({
  actions,
  align = "center",
  children,
  className,
  dashed = false,
  size = "compact",
  title,
  tone = "default",
}: StatusNoticeProps) {
  const hasBody = Boolean(children);

  return (
    <div
      className={cx(
        "rounded-2xl border font-medium",
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        dashed && "border-dashed",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {title && (
        <h3 className={cx("font-bold", hasBody ? "mb-2 text-xl" : "text-base")}>
          {title}
        </h3>
      )}

      {hasBody && <div className="leading-relaxed">{children}</div>}

      {actions && <div className={cx(hasBody || title ? "mt-4" : undefined)}>{actions}</div>}
    </div>
  );
}
