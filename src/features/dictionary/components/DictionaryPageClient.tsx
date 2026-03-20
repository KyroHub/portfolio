"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { DictionaryFilters } from "./DictionaryFilters";
import { DictionaryResultsSection } from "./DictionaryResultsSection";
import { DictionarySearchBar } from "./DictionarySearchBar";
import { useDictionarySearch } from "@/features/dictionary/hooks/useDictionarySearch";

type DictionaryPageBodyProps = {
  dictionaryPath: string;
};

function DictionaryPageBody({ dictionaryPath }: DictionaryPageBodyProps) {
  const { t } = useLanguage();
  const {
    dictionaryLength,
    filteredResults,
    handleKeyboardAppend,
    handleKeyboardBackspace,
    handleSelectionChange,
    isKeyboardOpen,
    loading,
    query,
    resultsKey,
    searchInputRef,
    selectedDialect,
    selectedPartOfSpeech,
    setKeyboardOpen,
    setQuery,
    setSelectedDialect,
    setSelectedPartOfSpeech,
    visibleQuery,
  } = useDictionarySearch({ dictionaryPath });

  return (
    <PageShell
      className="min-h-screen pb-20"
      contentClassName="mx-auto max-w-5xl px-6 pt-16 md:pt-20"
      accents={[
        pageShellAccents.heroSkyArc,
        pageShellAccents.topRightEmeraldOrbInset,
      ]}
    >
      <div className="mb-5 flex items-center justify-end">
        <Link href="/analytics" className="btn-secondary gap-2 px-4">
          <BarChart3 className="h-4 w-4" />
          <span className="text-sm tracking-wide">{t("nav.analytics")}</span>
        </Link>
      </div>

      <PageHeader
        title={t("dict.title")}
        description={t("dict.subtitle")}
        size="hero"
        tone="brand"
        className="mb-16"
      />

      <div className="relative sticky top-5 z-20 isolate mb-12 flex flex-col gap-4">
        <DictionarySearchBar
          isKeyboardOpen={isKeyboardOpen}
          onAppend={handleKeyboardAppend}
          onBackspace={handleKeyboardBackspace}
          onCloseKeyboard={() => setKeyboardOpen(false)}
          onQueryChange={setQuery}
          onSelectionChange={handleSelectionChange}
          onToggleKeyboard={() => setKeyboardOpen(!isKeyboardOpen)}
          query={query}
          searchInputRef={searchInputRef}
        />

        <DictionaryFilters
          selectedDialect={selectedDialect}
          selectedPartOfSpeech={selectedPartOfSpeech}
          setSelectedDialect={setSelectedDialect}
          setSelectedPartOfSpeech={setSelectedPartOfSpeech}
        />
      </div>

      <DictionaryResultsSection
        key={resultsKey}
        dictionaryLength={dictionaryLength}
        filteredResults={filteredResults}
        loading={loading}
        query={visibleQuery}
        selectedDialect={selectedDialect}
        selectedPartOfSpeech={selectedPartOfSpeech}
      />
    </PageShell>
  );
}

export default function DictionaryPageClient() {
  const { language } = useLanguage();
  const dictionaryPath =
    language === "nl" ? "/data/woordenboek.json" : "/data/dictionary.json";

  return <DictionaryPageBody key={dictionaryPath} dictionaryPath={dictionaryPath} />;
}
