"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import DictionaryEntryCard from "@/components/DictionaryEntry";
import { LexicalEntry } from "../../../scripts/parseExcel";
import { searchDictionary } from "../../../lib/searchEngine";
import CopticKeyboard from "@/components/CopticKeyboard";
import { useLanguage } from "@/components/LanguageProvider";

const PAGE_SIZE = 50;

export default function Home() {
  const { t, language } = useLanguage();
  const [dictionary, setDictionary] = useState<LexicalEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Filters State
  const [selectedPOS, setSelectedPOS] = useState<string>("ALL");
  const [selectedDialect, setSelectedDialect] = useState<string>("B");

  useEffect(() => {
    setLoading(true);
    // Fetch the specific language payload, fallback to english if missing
    fetch(language === "nl" ? '/data/woordenboek.json' : '/data/dictionary.json')
      .then(res => {
        if (!res.ok) throw new Error("JSON not found");
        return res.json();
      })
      .then(data => {
        setDictionary(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Target language dictionary missing, falling back to English...");
        fetch('/data/dictionary.json')
          .then(res => res.json())
          .then(data => {
            setDictionary(data);
            setLoading(false);
          });
      });
  }, [language]);

  // Compute Search + Filters Results
  const filteredResults = useMemo(() => {
    let results = query.trim().length > 0 
      ? searchDictionary(query, dictionary)
      : dictionary;

    if (selectedPOS !== "ALL") {
      results = results.filter(r => r.pos === selectedPOS);
    }

    if (selectedDialect !== "ALL") {
      results = results.filter(r => r.dialects[selectedDialect] !== undefined);
    }

    return results;
  }, [query, dictionary, selectedPOS, selectedDialect]);

  // Reset pagination when filters or query change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, selectedPOS, selectedDialect]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setVisibleCount(prev => prev + PAGE_SIZE);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [observerTarget, filteredResults]);

  // Keyboard Handlers
  const handleKeyboardAppend = useCallback((char: string) => {
    setQuery(prev => {
      if (!searchInputRef.current) return prev + char;
      const start = searchInputRef.current.selectionStart || prev.length;
      const end = searchInputRef.current.selectionEnd || prev.length;
      return prev.slice(0, start) + char + prev.slice(end);
    });
    // Optional: Return focus to input seamlessly
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, []);

  const handleKeyboardBackspace = useCallback(() => {
    setQuery(prev => prev.slice(0, -1));
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, []);

  // Final array to render
  const visibleResults = filteredResults.slice(0, visibleCount);

  return (
    <main className="min-h-screen relative overflow-hidden pb-20">
      
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-sky-500/10 dark:bg-sky-900/10 rounded-b-full blur-[120px] -z-10 pointer-events-none transition-colors duration-500"></div>
      <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 pointer-events-none transition-colors duration-500"></div>

      <div className="max-w-5xl mx-auto px-6 pt-20">
        
        {/* Top Navigation */}
        <div className="flex justify-end mb-4 items-center">
          <a href="/analytics" className="text-sm font-semibold tracking-widest uppercase text-stone-600 dark:text-stone-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors bg-white/50 dark:bg-stone-900/50 px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t("nav.analytics")}
          </a>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-tr from-sky-600 to-emerald-500 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent drop-shadow-sm pb-2">
            {t("dict.title")}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 font-medium max-w-2xl mx-auto">
            {t("dict.subtitle")}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative sticky top-6 z-20 mb-12 flex flex-col gap-4">
          <div className="relative w-full group flex items-center">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-stone-500 group-focus-within:text-sky-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder={t("dict.searchPlaceholder")} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200 dark:border-stone-700/80 text-stone-900 dark:text-stone-100 text-lg md:text-2xl rounded-2xl p-6 pl-16 pr-24 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-xl dark:shadow-2xl transition-all font-coptic placeholder:font-sans placeholder:text-stone-400 dark:placeholder:text-stone-500"
            />
            
            <div className="absolute inset-y-0 right-4 flex items-center gap-2">
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="p-2 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 transition-colors bg-stone-100 dark:bg-stone-800/50 rounded-full"
                  aria-label="Clear Search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button 
                onClick={() => setKeyboardOpen(!isKeyboardOpen)}
                className={`p-2 transition-colors rounded-full ${isKeyboardOpen ? 'bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400' : 'text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 bg-stone-100 dark:bg-stone-800/50'}`}
                aria-label="Toggle Virtual Keyboard"
                title="Open Coptic Keyboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18V6zM6 9h.008v.008H6V9zm3 0h.008v.008H9V9zm3 0h.008v.008H12V9zm3 0h.008v.008H15V9zm3 0h.008v.008H18V9zm-9 3h.008v.008H9V12zm3 0h.008v.008H12V12zm3 0h.008v.008H15V12zm-3 3h.008v.008H12V15z" />
                </svg>
              </button>
            </div>
            
            <CopticKeyboard 
               isOpen={isKeyboardOpen} 
               onClose={() => setKeyboardOpen(false)} 
               onAppend={handleKeyboardAppend} 
               onBackspace={handleKeyboardBackspace} 
            />
          </div>
          
          {/* Filters Suite */}
          <div className="flex flex-wrap gap-4 items-center justify-center p-4 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-xl relative z-10 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{t("dict.pos")}</span>
              <select className="bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-md text-sm p-1.5 focus:ring-sky-500 text-stone-700 dark:text-stone-300 outline-none cursor-pointer" value={selectedPOS} onChange={e => setSelectedPOS(e.target.value)}>
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
              <span className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-widest">{t("dict.dialect")}</span>
              <select className="bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-md text-sm p-1.5 focus:ring-sky-500 text-stone-700 dark:text-stone-300 outline-none cursor-pointer" value={selectedDialect} onChange={e => setSelectedDialect(e.target.value)}>
                <option value="ALL">{t("dict.any")}</option>
                <option value="S">Sahidic (S)</option>
                <option value="B">Bohairic (B)</option>
                <option value="A">Akhmimic (A)</option>
                <option value="sA">Sub-Sahidic (sA)</option>
                <option value="F">Fayyumic (F)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        {!loading && (
          <div className="flex justify-between items-center mb-6 text-stone-500 dark:text-stone-400">
            <span className="text-sm font-medium">
              {query.trim().length === 0 && selectedPOS === "ALL" && selectedDialect === "ALL" 
                ? `${t("dict.showing")} ${visibleResults.length} ${t("dict.outOf")} ${dictionary.length} ${t("dict.entries")}` 
                : `${t("dict.found")} ${filteredResults.length} ${t("dict.results")}`
              }
            </span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-stone-700 border-t-sky-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && filteredResults.length === 0 && (
          <div className="text-center py-20 bg-stone-50/80 dark:bg-stone-900/30 rounded-2xl border border-stone-200 dark:border-stone-800/50 backdrop-blur-sm">
            <p className="text-2xl text-stone-600 dark:text-stone-500 font-medium">{t("dict.noMatch")}</p>
            <p className="text-stone-500 dark:text-stone-600 mt-2">{t("dict.tryFuzzy")}</p>
          </div>
        )}

        <div className="grid gap-6">
          {visibleResults.map(entry => (
            <DictionaryEntryCard key={entry.id} entry={entry} query={query} selectedDialect={selectedDialect} />
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        {visibleCount < filteredResults.length && (
          <div ref={observerTarget} className="h-20 w-full mt-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-stone-700 border-t-sky-500 rounded-full animate-spin"></div>
          </div>
        )}

      </div>
    </main>
  );
}
