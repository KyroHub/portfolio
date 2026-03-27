"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  getTranslation,
  isLanguage,
  type TranslationKey,
} from "@/lib/i18n";
import { appendSearchAndHash, switchLocalePath } from "@/lib/locale";
import type { Language } from "@/types/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function persistLanguagePreference(language: Language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.cookie = `${LANGUAGE_STORAGE_KEY}=${language}; path=/; max-age=31536000; samesite=lax`;
}

type LanguageProviderProps = {
  children: ReactNode;
  initialLanguage?: Language;
  localeRouting?: boolean;
};

export function LanguageProvider({
  children,
  initialLanguage = DEFAULT_LANGUAGE,
  localeRouting = false,
}: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    if (localeRouting) {
      startTransition(() => {
        setLanguageState(initialLanguage);
      });
      persistLanguagePreference(initialLanguage);
      return;
    }

    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && isLanguage(storedLanguage)) {
      startTransition(() => {
        setLanguageState(storedLanguage);
      });
      persistLanguagePreference(storedLanguage);
      return;
    }

    startTransition(() => {
      setLanguageState(initialLanguage);
    });
    persistLanguagePreference(initialLanguage);
  }, [initialLanguage, localeRouting]);

  const setLanguage = (lang: Language) => {
    if (lang === language) {
      return;
    }

    startTransition(() => {
      setLanguageState(lang);
    });
    persistLanguagePreference(lang);

    if (localeRouting && pathname) {
      const nextPath = switchLocalePath(pathname, lang);
      const nextSearch = typeof window === "undefined" ? "" : window.location.search;
      const nextHash = typeof window === "undefined" ? "" : window.location.hash;
      router.push(appendSearchAndHash(nextPath, nextSearch, nextHash));
    }
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
