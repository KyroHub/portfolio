"use client";

import { createContext, startTransition, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  getTranslation,
  isLanguage,
  type TranslationKey,
} from "@/lib/i18n";
import type { Language } from "@/types/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && isLanguage(storedLanguage)) {
      startTransition(() => {
        setLanguageState(storedLanguage);
      });
    } else {
      const preferredLanguage = navigator.language.toLowerCase().startsWith("nl")
        ? "nl"
        : DEFAULT_LANGUAGE;

      startTransition(() => {
        setLanguageState(preferredLanguage);
      });
      localStorage.setItem(LANGUAGE_STORAGE_KEY, preferredLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    startTransition(() => {
      setLanguageState(lang);
    });
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
