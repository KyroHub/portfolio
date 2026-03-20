import type { ReactNode } from "react";
import { cx } from "@/lib/classes";

type BadgeTone = "accent" | "coptic" | "flat" | "neutral" | "surface";
type BadgeSize = "xs" | "sm" | "md";

type BadgeProps = {
  caps?: boolean;
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
  size?: BadgeSize;
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  accent:
    "border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400",
  coptic:
    "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400",
  flat:
    "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300",
  neutral:
    "border border-stone-200 bg-stone-100 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300",
  surface:
    "border border-stone-200 bg-white/70 text-stone-600 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-400",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  xs: "px-3 py-1 text-xs",
  sm: "px-3.5 py-2 text-sm",
  md: "px-4 py-2 text-sm",
};

export function Badge({
  caps = false,
  children,
  className,
  tone = "neutral",
  size = "xs",
}: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full font-semibold",
        TONE_CLASSES[tone],
        SIZE_CLASSES[size],
        caps ? "uppercase tracking-widest" : "tracking-[0.02em]",
        className
      )}
    >
      {children}
    </span>
  );
}
