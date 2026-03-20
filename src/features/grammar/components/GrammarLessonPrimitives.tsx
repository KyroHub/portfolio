import type { ReactNode } from "react";
import { cx } from "@/lib/classes";

type GrammarLessonSectionProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

type GrammarLessonCardProps = {
  children: ReactNode;
  className?: string;
  tone?: "sky" | "stone";
};

type GrammarLessonTableProps = {
  children: ReactNode;
  className?: string;
};

export function GrammarLessonSection({
  title,
  children,
  className,
}: GrammarLessonSectionProps) {
  return (
    <section className={className}>
      <h2 className="border-b border-stone-200 pb-2 text-2xl font-bold text-sky-700 dark:border-stone-800 dark:text-sky-400">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function GrammarLessonCard({
  children,
  className,
  tone = "stone",
}: GrammarLessonCardProps) {
  return (
    <div
      className={cx(
        "rounded-xl border p-4",
        tone === "sky"
          ? "border-sky-100 bg-sky-50 dark:border-sky-800 dark:bg-sky-900/30"
          : "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GrammarLessonTable({
  children,
  className,
}: GrammarLessonTableProps) {
  return (
    <div className={cx("mt-4 rounded-lg border border-stone-200 dark:border-stone-800", className)}>
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}
