"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import DialectSiglum from "./DialectSiglum";
import DictionaryEntryCard from "./DictionaryEntry";
import { useLanguage } from "@/components/LanguageProvider";
import {
  getPartOfSpeechFilterLabel,
  type DialectFilter,
  type DictionaryPartOfSpeechFilter,
} from "@/features/dictionary/config";
import type { LexicalEntry } from "@/features/dictionary/types";

const PAGE_SIZE = 50;

type DictionaryResultsSectionProps = {
  dictionaryLength: number;
  filteredResults: LexicalEntry[];
  loading: boolean;
  query: string;
  selectedDialect: DialectFilter;
  selectedPartOfSpeech: DictionaryPartOfSpeechFilter;
};

export function DictionaryResultsSection({
  dictionaryLength,
  filteredResults,
  loading,
  query,
  selectedDialect,
  selectedPartOfSpeech,
}: DictionaryResultsSectionProps) {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((previousCount) => previousCount + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredResults.length]);

  const visibleResults = filteredResults.slice(0, visibleCount);

  return (
    <>
      {!loading && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Badge tone="surface" size="md" className="font-medium">
            {query.trim().length === 0 &&
            selectedPartOfSpeech === "ALL" &&
            selectedDialect === "ALL"
              ? `${t("dict.showing")} ${visibleResults.length} ${t("dict.outOf")} ${dictionaryLength} ${t("dict.entries")}`
              : `${t("dict.found")} ${filteredResults.length} ${t("dict.results")}`}
          </Badge>

          {(selectedPartOfSpeech !== "ALL" || selectedDialect !== "ALL") && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {selectedPartOfSpeech !== "ALL" && (
                <Badge tone="neutral" size="xs">
                  {t("dict.pos")} {getPartOfSpeechFilterLabel(selectedPartOfSpeech, t)}
                </Badge>
              )}
              {selectedDialect !== "ALL" && (
                <Badge tone="accent" size="sm" className="min-h-8">
                  {t("dict.dialect")}{" "}
                  <span className="ml-1">
                    <DialectSiglum siglum={selectedDialect} />
                  </span>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-700 border-t-sky-500"></div>
        </div>
      )}

      {!loading && filteredResults.length === 0 && (
        <EmptyState
          title={t("dict.noMatch")}
          description={t("dict.tryFuzzy")}
          className="dark:border-stone-800/60 dark:bg-stone-900/40 dark:shadow-lg"
          titleClassName="font-medium text-stone-700 dark:text-stone-300"
          descriptionClassName="mt-2 text-stone-500 dark:text-stone-500"
        />
      )}

      <div className="grid gap-6">
        {visibleResults.map((entry) => (
          <DictionaryEntryCard
            key={entry.id}
            entry={entry}
            query={query}
            selectedDialect={selectedDialect}
          />
        ))}
      </div>

      {visibleCount < filteredResults.length && (
        <div ref={observerTarget} className="mt-10 flex h-20 w-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-700 border-t-sky-500"></div>
        </div>
      )}
    </>
  );
}
