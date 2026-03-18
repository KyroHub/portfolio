"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { Lesson01EN } from "../components/Lesson01EN";
import { Lesson01NL } from "../components/Lesson01NL";

export default function GrammarPage() {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in duration-1000">
      
      {/* Decorative header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-tr from-sky-600 to-stone-500 dark:from-sky-400 dark:to-stone-400 bg-clip-text text-transparent drop-shadow-sm mb-4">
          {t("nav.grammar")} - {language === "nl" ? "Les 01" : "Lesson 01"}
        </h1>
      </div>

      <div className="bg-white dark:bg-stone-900 shadow-sm border border-stone-200 dark:border-stone-800 rounded-2xl p-6 md:p-10 transition-colors duration-300">
        {language === "nl" ? <Lesson01NL /> : <Lesson01EN />}
      </div>
    </div>
  );
}
