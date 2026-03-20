"use client";

import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Keyboard, Search, SlidersHorizontal, X } from "lucide-react";
import DictionaryEntryCard from "@/components/DictionaryEntry";
import type { LexicalEntry } from "@/lib/dictionaryTypes";
import {
  prepareDictionaryForSearch,
  searchPreparedDictionary,
  type PreparedLexicalEntry,
} from "../../lib/searchEngine";
import CopticKeyboard from "@/components/CopticKeyboard";
import DialectSiglum from "@/components/DialectSiglum";
import { useLanguage } from "@/components/LanguageProvider";
import { antinoou } from "@/lib/fonts";

const PAGE_SIZE = 50;

type Translate = ReturnType<typeof useLanguage>["t"];

type DictionaryPageBodyProps = {
  dictionaryPath: string;
  t: Translate;
};

type DictionaryResultsSectionProps = {
  dictionaryLength: number;
  filteredResults: LexicalEntry[];
  loading: boolean;
  query: string;
  selectedDialect: string;
  selectedPOS: string;
  t: Translate;
};

function DictionaryResultsSection({
  dictionaryLength,
  filteredResults,
  loading,
  query,
  selectedDialect,
  selectedPOS,
  t,
}: DictionaryResultsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + PAGE_SIZE);
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
          <span className="inline-flex items-center rounded-full border border-stone-200 bg-white/70 px-4 py-2 text-sm font-medium text-stone-600 shadow-sm backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-400">
            {query.trim().length === 0 && selectedPOS === "ALL" && selectedDialect === "ALL"
              ? `${t("dict.showing")} ${visibleResults.length} ${t("dict.outOf")} ${dictionaryLength} ${t("dict.entries")}`
              : `${t("dict.found")} ${filteredResults.length} ${t("dict.results")}`}
          </span>

          {(selectedPOS !== "ALL" || selectedDialect !== "ALL") && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              {selectedPOS !== "ALL" && (
                <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {t("dict.pos")} {selectedPOS}
                </span>
              )}
              {selectedDialect !== "ALL" && (
                <span className="inline-flex min-h-8 items-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-2 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                  {t("dict.dialect")} <span className="ml-1"><DialectSiglum siglum={selectedDialect} /></span>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-stone-700 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && filteredResults.length === 0 && (
        <div className="text-center py-20 bg-white/70 dark:bg-stone-900/40 rounded-3xl border border-stone-200 dark:border-stone-800/60 backdrop-blur-md shadow-sm">
          <p className="text-2xl text-stone-700 dark:text-stone-300 font-medium">{t("dict.noMatch")}</p>
          <p className="text-stone-500 dark:text-stone-500 mt-2">{t("dict.tryFuzzy")}</p>
        </div>
      )}

      <div className="grid gap-6">
        {visibleResults.map((entry) => (
          <DictionaryEntryCard key={entry.id} entry={entry} query={query} selectedDialect={selectedDialect} />
        ))}
      </div>

      {visibleCount < filteredResults.length && (
        <div ref={observerTarget} className="h-20 w-full mt-10 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-stone-700 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
}

function DictionaryPageBody({ dictionaryPath, t }: DictionaryPageBodyProps) {
  const [dictionary, setDictionary] = useState<LexicalEntry[]>([]);
  const [preparedDictionary, setPreparedDictionary] = useState<PreparedLexicalEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedPOS, setSelectedPOS] = useState<string>("ALL");
  const [selectedDialect, setSelectedDialect] = useState<string>("B");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let cancelled = false;

    async function loadDictionary() {
      const initialQuery =
        typeof window === "undefined"
          ? ""
          : new URLSearchParams(window.location.search).get("q")?.trim() ?? "";

      try {
        const response = await fetch(dictionaryPath);
        if (!response.ok) {
          throw new Error("JSON not found");
        }

        const data = await response.json();
        if (!cancelled) {
          if (initialQuery) {
            setQuery(initialQuery);
            setSelectedDialect("ALL");
          }
          setDictionary(data);
          setPreparedDictionary(prepareDictionaryForSearch(data));
          setLoading(false);
        }
      } catch {
        console.warn("Target language dictionary missing, falling back to English...");

        try {
          const response = await fetch("/data/dictionary.json");
          const data = await response.json();

          if (!cancelled) {
            if (initialQuery) {
              setQuery(initialQuery);
              setSelectedDialect("ALL");
            }
            setDictionary(data);
            setPreparedDictionary(prepareDictionaryForSearch(data));
            setLoading(false);
          }
        } catch {
          if (!cancelled) {
            setDictionary([]);
            setPreparedDictionary([]);
            setLoading(false);
          }
        }
      }
    }

    void loadDictionary();

    return () => {
      cancelled = true;
    };
  }, [dictionaryPath]);

  const filteredResults = useMemo(() => {
    let results =
      deferredQuery.trim().length > 0
        ? searchPreparedDictionary(deferredQuery, preparedDictionary)
        : dictionary;

    if (selectedPOS !== "ALL") {
      results = results.filter((result) => result.pos === selectedPOS);
    }

    if (selectedDialect !== "ALL") {
      results = results.filter((result) => result.dialects[selectedDialect] !== undefined);
    }

    return results;
  }, [deferredQuery, dictionary, preparedDictionary, selectedPOS, selectedDialect]);

  const handleKeyboardAppend = useCallback((char: string) => {
    setQuery((prev) => {
      if (!searchInputRef.current) return prev + char;
      const start = searchInputRef.current.selectionStart || prev.length;
      const end = searchInputRef.current.selectionEnd || prev.length;
      return prev.slice(0, start) + char + prev.slice(end);
    });
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, []);

  const handleKeyboardBackspace = useCallback(() => {
    setQuery((prev) => prev.slice(0, -1));
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, []);
  const resultsKey = `${deferredQuery}\u0000${selectedPOS}\u0000${selectedDialect}`;

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      <div className="absolute top-0 left-0 w-full h-[520px] bg-sky-500/10 dark:bg-sky-900/10 rounded-b-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500" />
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-500" />

      <div className="max-w-5xl mx-auto px-6 pt-16 md:pt-20">
        <div className="mb-5 flex justify-end items-center">
          <Link href="/analytics" className="btn-secondary gap-2 px-4">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm tracking-wide">{t("nav.analytics")}</span>
          </Link>
        </div>

        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-tr from-sky-600 to-emerald-500 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent drop-shadow-sm pb-2">
            {t("dict.title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 font-medium max-w-2xl mx-auto">
            {t("dict.subtitle")}
          </p>
        </div>

        <div className="relative sticky top-5 z-20 mb-12 flex flex-col gap-4">
          <div className="relative rounded-[1.75rem] bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200 dark:border-stone-700/80 shadow-xl dark:shadow-2xl">
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-stone-500 group-focus-within:text-sky-400 transition-colors">
                <Search className="h-6 w-6" />
              </div>

              <input
                ref={searchInputRef}
                type="text"
                placeholder={t("dict.searchPlaceholder")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${antinoou.className} w-full bg-transparent text-stone-900 dark:text-stone-100 text-lg md:text-2xl rounded-[1.75rem] p-6 pl-16 pr-28 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder:font-sans placeholder:text-stone-400 dark:placeholder:text-stone-500`}
              />

              <div className="absolute inset-y-0 right-4 flex items-center gap-2">
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition-colors hover:text-stone-700 dark:bg-stone-800/70 dark:text-stone-400 dark:hover:text-stone-200"
                    aria-label="Clear Search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setKeyboardOpen(!isKeyboardOpen)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    isKeyboardOpen
                      ? "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400"
                      : "bg-stone-100 text-stone-500 hover:text-stone-700 dark:bg-stone-800/70 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                  aria-label="Toggle Virtual Keyboard"
                  title="Open Coptic Keyboard"
                >
                  <Keyboard className="h-5 w-5" />
                </button>
              </div>

              <CopticKeyboard
                isOpen={isKeyboardOpen}
                onClose={() => setKeyboardOpen(false)}
                onAppend={handleKeyboardAppend}
                onBackspace={handleKeyboardBackspace}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center p-4 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl relative z-10 shadow-sm">
            <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Filters</span>
            </div>

            <div className="h-6 w-px bg-stone-300 dark:bg-stone-700 hidden md:block" />

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{t("dict.pos")}</span>
              <select className="bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-stone-700 dark:text-stone-300 cursor-pointer" value={selectedPOS} onChange={(e) => setSelectedPOS(e.target.value)}>
                <option value="ALL">{t("dict.any")}</option>
                <option value="V">{t("dict.verb")}</option>
                <option value="N">{t("dict.noun")}</option>
                <option value="ADJ">{t("dict.adj")}</option>
                <option value="ADV">{t("dict.adv")}</option>
                <option value="PREP">{t("dict.prep")}</option>
              </select>
            </div>
            <div className="w-px h-6 bg-stone-300 dark:bg-stone-700 hidden sm:block"></div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{t("dict.dialect")}</span>
              <select className="bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-stone-700 dark:text-stone-300 cursor-pointer" value={selectedDialect} onChange={(e) => setSelectedDialect(e.target.value)}>
                <option value="ALL">{t("dialect.ALL")}</option>
                <option value="S">{t("dialect.S")} (S)</option>
                <option value="B">{t("dialect.B")} (B)</option>
                <option value="A">{t("dialect.A")} (A)</option>
                <option value="L">{t("dialect.L")} (L)</option>
                <option value="F">{t("dialect.F")} (F)</option>
              </select>
            </div>
          </div>
        </div>

        <DictionaryResultsSection
          key={resultsKey}
          dictionaryLength={dictionary.length}
          filteredResults={filteredResults}
          loading={loading}
          query={deferredQuery}
          selectedDialect={selectedDialect}
          selectedPOS={selectedPOS}
          t={t}
        />
      </div>
    </main>
  );
}

export default function DictionaryPageClient() {
  const { t, language } = useLanguage();
  const dictionaryPath =
    language === "nl" ? "/data/woordenboek.json" : "/data/dictionary.json";

  return <DictionaryPageBody key={dictionaryPath} dictionaryPath={dictionaryPath} t={t} />;
}
