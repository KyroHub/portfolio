"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { useLanguage } from "@/components/LanguageProvider";
import { DEFAULT_DICTIONARY_DIALECT_FILTER } from "@/features/dictionary/config";
import type {
  DialectFilter,
  DictionaryDialectCode,
} from "@/features/dictionary/config";
import type { LexicalEntry } from "@/features/dictionary/types";
import { antinoou } from "@/lib/fonts";
import { getEntryPath } from "@/lib/locale";
import DialectSiglum from "./DialectSiglum";
import HighlightText from "./HighlightText";

type DictionaryEntryCardProps = {
  entry: LexicalEntry;
  query?: string;
  selectedDialect?: DialectFilter;
  headingLevel?: "h1" | "h2";
  linkHeadword?: boolean;
  actions?: ReactNode;
};

type DialectEntryTuple = [
  DictionaryDialectCode,
  NonNullable<LexicalEntry["dialects"][DictionaryDialectCode]>,
];

function formatDialectForms(forms: DialectEntryTuple[1], headwordFallback: string) {
  const parts: string[] = [];
  const absoluteWithVariants = forms.absolute
    ? [forms.absolute, ...(forms.absoluteVariants ?? [])].join(", ")
    : headwordFallback;

  parts.push(absoluteWithVariants);

  const bound: string[] = [];
  if (forms.nominal) bound.push(forms.nominal);
  if (forms.pronominal) bound.push(forms.pronominal);

  if (bound.length > 0) parts.push(bound.join("/"));
  if (forms.stative) parts.push(forms.stative);

  return parts.join(" ");
}

export default function DictionaryEntryCard({
  actions,
  entry,
  query = "",
  selectedDialect = DEFAULT_DICTIONARY_DIALECT_FILTER,
  headingLevel = "h2",
  linkHeadword = true,
}: DictionaryEntryCardProps) {
  const { language, t } = useLanguage();
  const isDetailView = headingLevel === "h1";
  const dialectKeys = Object.keys(entry.dialects) as DictionaryDialectCode[];
  let primaryDialectKey: DictionaryDialectCode | undefined = "S";

  // Cards honor the active dialect filter when that form exists; otherwise they
  // fall back to the first available spelling for the entry.
  if (selectedDialect !== "ALL" && entry.dialects[selectedDialect]) {
    primaryDialectKey = selectedDialect;
  } else if (!entry.dialects.S) {
    primaryDialectKey = dialectKeys[0];
  }

  let headerSpelling = entry.headword;
  const primaryForms = primaryDialectKey
    ? entry.dialects[primaryDialectKey]
    : undefined;

  if (primaryForms) {
    // The heading compresses the absolute, variant, bound, and stative
    // spellings into the compact notation used throughout the dictionary UI.
    headerSpelling = formatDialectForms(primaryForms, entry.headword);
  }

  const remainingDialects = Object.entries(entry.dialects).filter(
    (dialectEntry): dialectEntry is DialectEntryTuple =>
      dialectEntry[0] !== primaryDialectKey && Boolean(dialectEntry[1])
  );
  const HeadingTag = headingLevel;
  const headingClassName = `${antinoou.className} ${
    isDetailView ? "text-5xl md:text-6xl" : "text-4xl"
  } text-sky-600 dark:text-sky-400 tracking-wider drop-shadow-sm transition-colors ${
    linkHeadword
      ? "hover:text-sky-500 dark:hover:text-sky-300 cursor-pointer"
      : ""
  }`;
  const headingContent = (
    <HeadingTag className={headingClassName}>
      <HighlightText text={headerSpelling} query={query} />
    </HeadingTag>
  );

  return (
    <article className={`group relative overflow-hidden rounded-3xl bg-white/70 dark:bg-stone-900/50 backdrop-blur-md border border-stone-200 dark:border-stone-800 shadow-md dark:shadow-lg dark:shadow-black/20 transition-all duration-300 ${
      linkHeadword
        ? "hover:border-stone-300 dark:hover:border-stone-700 hover:bg-white dark:hover:bg-stone-800/50"
        : ""
    } ${isDetailView ? "p-8 md:p-10" : "p-6 md:p-7"}`}>
      <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-sky-500/10 dark:bg-sky-500/10 rounded-full blur-3xl opacity-70" />

      <div className="relative flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
        <div>
          {linkHeadword ? (
            <Link
              href={getEntryPath(entry.id, language)}
              prefetch={false}
              className="inline-block"
            >
              {headingContent}
            </Link>
          ) : (
            headingContent
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex h-8 items-center px-3 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full text-stone-600 dark:text-stone-300">
            {entry.pos}
          </span>
          {entry.gender && (
            <span className={`inline-flex h-8 items-center px-3 rounded-full border ${
              entry.gender === "F"
                ? "bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/50 text-pink-600 dark:text-pink-300"
                : "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/50 text-sky-600 dark:text-sky-300"
            }`}>
              {t("entry.gender")}: {entry.gender}
            </span>
          )}
          {primaryDialectKey && (
            <Badge tone="coptic" size="sm" className="h-8 min-h-8">
              <DialectSiglum siglum={primaryDialectKey} />
            </Badge>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-stone-200 dark:from-stone-800 via-stone-300 dark:via-stone-700 to-stone-200 dark:to-stone-800 mb-6" />

      <div className="mb-6 space-y-3">
        <h3 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-semibold">{t("entry.translation")}</h3>
        <ul className={`space-y-2 text-stone-800 dark:text-stone-200 list-disc ml-5 marker:text-sky-500 ${
          isDetailView ? "text-lg md:text-xl" : "text-lg"
        }`}>
          {(language === "nl" && entry.dutch_meanings ? entry.dutch_meanings : entry.english_meanings).map((meaning, idx) => (
            <li key={idx} className="leading-relaxed pl-1">
              <HighlightText text={meaning} query={query} emphasizeLeadingLabel />
            </li>
          ))}
        </ul>
        {entry.greek_equivalents.length > 0 && (
          <div className="mt-5 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold">{t("entry.greekEquivalents")}</span>
            <div className="flex flex-wrap gap-2">
              {entry.greek_equivalents.map((gr, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-medium">
                  <HighlightText text={gr} query={query} />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {actions ? (
        <div className="mt-7 border-t border-stone-200 pt-5 dark:border-stone-800/50">
          {actions}
        </div>
      ) : null}

      {remainingDialects.length > 0 && (
        <div className="mt-7 pt-5 border-t border-stone-200 dark:border-stone-800/50">
          <h4 className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-widest font-semibold mb-3">{t("entry.dialectForms")}</h4>
          <div className="flex flex-wrap gap-3">
            {remainingDialects.map(([dialect, forms], index) => {
              const spelling = formatDialectForms(forms, entry.headword);

              return (
                <div key={index} className="flex items-center space-x-3 bg-stone-50/90 dark:bg-stone-950/50 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800/60">
                  <span className="inline-flex min-h-7 items-center text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 px-2.5 py-2 rounded-md font-bold">
                    <DialectSiglum siglum={dialect} />
                  </span>
                  <span className={`${antinoou.className} text-stone-800 dark:text-stone-300 text-lg`}>
                    <HighlightText text={spelling} query={query} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
