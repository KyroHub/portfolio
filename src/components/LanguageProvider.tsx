"use client";

import React, { createContext, startTransition, useContext, useEffect, useState } from "react";

type Language = "en" | "nl";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // A helper function to get translations
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// A simple dictionary for UI strings
const translations = {
  en: {
    "nav.home": "Home",
    "nav.publications": "Publications",
    "nav.dictionary": "Dictionary",
    "nav.grammar": "Grammar",
    "nav.contact": "Contact",
    "nav.analytics": "Analytics Dashboard",
    "footer.rights": "All rights reserved.",

    "home.title": "Wannes Portfolio",
    "home.subtitle": "Explore my publications and interactive scholarly applications.",
    "home.publications": "My Publications",
    "home.publications.desc": "A curated collection of my academic works and ongoing research.",
    "home.comingSoon": "Coming Soon",
    "home.app.title": "Coptic Learner",
    "home.app.desc": "Learn Coptic grammar and vocabulary on the go with interactive, Duolingo-style bite-sized lessons, intelligent search, and native integration for iPhone and iPad.",
    "home.copticDict": "Coptic Dictionary",
    "home.copticDict.desc": "A lightning-fast digital lexicon explicitly designed for beginner students and linguists alike.",

    "dict.title": "Coptic Dictionary",
    "dict.subtitle": "A lightning-fast digital lexicon explicitly designed for beginner students and linguists alike.",
    "dict.searchPlaceholder": "Search in Coptic, English, or Greek...",
    "dict.pos": "Part of Speech:",
    "dict.dialect": "Dialect:",
    "dict.any": "Any",
    "dict.verb": "Verb",
    "dict.noun": "Noun",
    "dict.adj": "Adjective",
    "dict.adv": "Adverb",
    "dict.prep": "Preposition",
    "dict.showing": "Showing",
    "dict.outOf": "out of",
    "dict.entries": "entries...",
    "dict.found": "Found",
    "dict.results": "result(s)",
    "dict.noMatch": "No distinct forms match your query.",
    "dict.tryFuzzy": "Try adjusting the fuzzy search or removing filters.",

    "grammar.title": "Coptic Grammar",
    "grammar.subtitle": "Interactive lessons and exercises to master the Coptic language.",
    "grammar.lesson1.title": "Lesson 01",
    "grammar.lesson1.desc": "Master the basics of Coptic nouns, determiners, and independent personal pronouns.",
    "grammar.lesson2.title": "Lesson 02",
    "grammar.lesson2.desc": "Dive into verbal prefixes, adjectives, and constructing complex nominal sentences.",

    "contact.title": "Get in Touch",
    "contact.subtitle":
      "Academic inquiries, dictionary feedback, grammar questions, or just to say hello. I'd love to hear from you.",
    "contact.name": "Full Name",
    "contact.email": "Email Address",
    "contact.inquiry": "Type of Inquiry",
    "contact.select": "Select one...",
    "contact.message": "Message",
    "contact.namePlaceholder": "Kyrillos Wannes",
    "contact.emailPlaceholder": "you@email.com",
    "contact.messagePlaceholder":
      "Hi Kyrillos, I really enjoyed your Coptic dictionary and had a question about...",
    "contact.send": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Message sent successfully. I'll reply soon!",
    "contact.option.dictionary": "Dictionary Feedback",
    "contact.option.grammar": "Grammar / Linguistics Question",
    "contact.option.research": "Research Collaboration",
    "contact.option.publication": "Publication / Book Inquiry",
    "contact.option.general": "General Message",
  },
  nl: {
    "nav.home": "Thuis",
    "nav.publications": "Publicaties",
    "nav.dictionary": "Woordenboek",
    "nav.grammar": "Grammatica",
    "nav.contact": "Contact",
    "nav.analytics": "Analytics-dashboard",
    "footer.rights": "Alle rechten voorbehouden.",

    "home.title": "Wannes Portfolio",
    "home.subtitle": "Verken mijn publicaties en interactieve academische toepassingen.",
    "home.publications": "Mijn Publicaties",
    "home.publications.desc": "Een zorgvuldig samengestelde verzameling van mijn academische werken en lopend onderzoek.",
    "home.comingSoon": "Binnenkort Beschikbaar",
    "home.app.title": "Coptic Learner",
    "home.app.desc": "Leer Koptische grammatica en woordenschat onderweg met interactieve, Duolingo-achtige stapsgewijze lessen, intelligente zoekfuncties en native integratie voor iPhone en iPad.",
    "home.copticDict": "Koptisch Woordenboek",
    "home.copticDict.desc": "Een bliksemsnel digitaal lexicon expliciet ontworpen voor zowel beginnende studenten als taalkundigen.",

    "dict.title": "Koptisch Woordenboek",
    "dict.subtitle": "Een bliksemsnel digitaal lexicon expliciet ontworpen voor zowel beginnende studenten als taalkundigen.",
    "dict.searchPlaceholder": "Zoek in het Koptisch, Engels of Grieks...",
    "dict.pos": "Woordsoort:",
    "dict.dialect": "Dialect:",
    "dict.any": "Alles",
    "dict.verb": "Werkwoord",
    "dict.noun": "Zelfstandig Naamwoord",
    "dict.adj": "Bijvoeglijk Naamwoord",
    "dict.adv": "Bijwoord",
    "dict.prep": "Voorzetsel",
    "dict.showing": "Toont",
    "dict.outOf": "van de",
    "dict.entries": "lemma's...",
    "dict.found": "Gevonden:",
    "dict.results": "resulta(a)t(en)",
    "dict.noMatch": "Geen unieke vormen komen overeen met uw zoekopdracht.",
    "dict.tryFuzzy": "Probeer de fuzzy search aan te passen of filters te verwijderen.",

    "grammar.title": "Koptische Grammatica",
    "grammar.subtitle": "Interactieve lessen en oefeningen om de Koptische taal te beheersen.",
    "grammar.lesson1.title": "Les 01",
    "grammar.lesson1.desc": "Beheers de basis van Koptische zelfstandige naamwoorden, determinatoren en onafhankelijke persoonlijke voornaamwoorden.",
    "grammar.lesson2.title": "Les 02",
    "grammar.lesson2.desc": "Duik in werkwoordelijke voorvoegsels, bijvoeglijke naamwoorden en het construeren van complexe nominale zinnen.",

    "contact.title": "Neem Contact Op",
    "contact.subtitle":
      "Academische vragen, feedback over het woordenboek, grammaticale kwesties, of gewoon een vriendelijk bericht. Ik hoor graag van je.",
    "contact.name": "Volledige Naam",
    "contact.email": "E-mailadres",
    "contact.inquiry": "Type Vraag",
    "contact.select": "Selecteer een optie...",
    "contact.message": "Bericht",
    "contact.namePlaceholder": "Kyrillos Wannes",
    "contact.emailPlaceholder": "jij@email.com",
    "contact.messagePlaceholder":
      "Dag Kyrillos, ik vond je Koptische woordenboek erg waardevol en had een vraag over...",
    "contact.send": "Verstuur Bericht",
    "contact.sending": "Verzenden...",
    "contact.success": "Bericht succesvol verzonden. Ik antwoord binnenkort!",
    "contact.option.dictionary": "Feedback over het woordenboek",
    "contact.option.grammar": "Vraag over grammatica / linguistiek",
    "contact.option.research": "Onderzoekssamenwerking",
    "contact.option.publication": "Vraag over publicatie / boek",
    "contact.option.general": "Algemeen bericht",
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Determine initial language from localStorage or User's OS setting
    const storedLang = localStorage.getItem("app-language") as Language | null;
    if (storedLang === "en" || storedLang === "nl") {
      startTransition(() => {
        setLanguageState(storedLang);
      });
    } else {
      const userLang = navigator.language.toLowerCase();
      if (userLang.startsWith("nl")) {
        startTransition(() => {
          setLanguageState("nl");
        });
        localStorage.setItem("app-language", "nl");
      } else {
        startTransition(() => {
          setLanguageState("en");
        });
        localStorage.setItem("app-language", "en");
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string): string => {
    const langDict = translations[language] as Record<string, string>;
    const fallbackDict = translations["en"] as Record<string, string>;

    return langDict[key] || fallbackDict[key] || key;
  };

  // Prevent hydration errors by not rendering children immediately if they rely on text,
  // but for SEO and context, we can just return children anyway and let client re-hydrate text.
  // Actually, standard context rendering is fine since we default to "en" for SSR.

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
