"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/classes";

type GrammarAbbreviationProps = {
  children: ReactNode;
  href?: string;
  className?: string;
};

const GRAMMAR_ABBREVIATION_BASE_CLASS_NAME = "whitespace-nowrap";

export function GrammarAbbreviation({
  children,
  href,
  className,
}: GrammarAbbreviationProps) {
  const resolvedClassName = cx(
    GRAMMAR_ABBREVIATION_BASE_CLASS_NAME,
    href &&
      "no-underline transition-colors hover:text-sky-700 dark:hover:text-sky-200",
    className,
  );

  if (!href) {
    return <span className={resolvedClassName}>{children}</span>;
  }

  return (
    <a href={href} className={resolvedClassName}>
      {children}
    </a>
  );
}
