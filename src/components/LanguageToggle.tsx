"use client";

import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "nl" : "en")}
      className="p-2 ml-2 rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shadow-sm font-semibold text-xs flex items-center justify-center min-w-[40px] h-[40px]"
      aria-label="Toggle Language"
      title={`Switch to ${language === 'en' ? 'Dutch' : 'English'}`}
    >
      {language.toUpperCase()}
    </button>
  );
}
