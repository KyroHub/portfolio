"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_DICTIONARY_DIALECT_FILTER,
  DEFAULT_PART_OF_SPEECH_FILTER,
  type DialectFilter,
  type DictionaryPartOfSpeechFilter,
} from "@/features/dictionary/config";
import {
  prepareDictionaryForSearch,
  searchPreparedDictionary,
  type PreparedLexicalEntry,
} from "@/features/dictionary/search";
import type { LexicalEntry } from "@/features/dictionary/types";

type UseDictionarySearchOptions = {
  dictionaryPath: string;
};

export function useDictionarySearch({ dictionaryPath }: UseDictionarySearchOptions) {
  const [dictionary, setDictionary] = useState<LexicalEntry[]>([]);
  const [preparedDictionary, setPreparedDictionary] = useState<PreparedLexicalEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef({ start: 0, end: 0 });
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] =
    useState<DictionaryPartOfSpeechFilter>(DEFAULT_PART_OF_SPEECH_FILTER);
  const [selectedDialect, setSelectedDialect] =
    useState<DialectFilter>(DEFAULT_DICTIONARY_DIALECT_FILTER);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    // Deep-linked searches hydrate from ?q=... so shared dictionary URLs open
    // with the intended query already applied.
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

        const data = (await response.json()) as LexicalEntry[];
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
          // Localized dictionary files are optional; the English dataset is the
          // safe fallback so search never hard-fails for missing translations.
          const response = await fetch("/data/dictionary.json");
          const data = (await response.json()) as LexicalEntry[];

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

  const handleSelectionChange = useCallback((start: number | null, end: number | null) => {
    const fallback = end ?? start ?? query.length;

    selectionRef.current = {
      start: start ?? fallback,
      end: end ?? fallback,
    };
  }, [query.length]);

  const restoreInputSelection = useCallback((cursorPosition: number) => {
    requestAnimationFrame(() => {
      const input = searchInputRef.current;
      if (!input) return;

      input.focus();
      input.setSelectionRange(cursorPosition, cursorPosition);
      selectionRef.current = { start: cursorPosition, end: cursorPosition };
    });
  }, []);

  const filteredResults = useMemo(() => {
    let results =
      deferredQuery.trim().length > 0
        ? searchPreparedDictionary(deferredQuery, preparedDictionary)
        : dictionary;

    if (selectedPartOfSpeech !== "ALL") {
      results = results.filter((result) => result.pos === selectedPartOfSpeech);
    }

    if (selectedDialect !== "ALL") {
      results = results.filter((result) => result.dialects[selectedDialect] !== undefined);
    }

    return results;
  }, [deferredQuery, dictionary, preparedDictionary, selectedPartOfSpeech, selectedDialect]);

  const handleKeyboardAppend = useCallback((char: string) => {
    setQuery((prev) => {
      const start = Math.min(selectionRef.current.start, prev.length);
      const end = Math.min(selectionRef.current.end, prev.length);
      const nextQuery = prev.slice(0, start) + char + prev.slice(end);
      const nextCursor = start + char.length;

      selectionRef.current = { start: nextCursor, end: nextCursor };
      restoreInputSelection(nextCursor);

      return nextQuery;
    });
  }, [restoreInputSelection]);

  const handleKeyboardBackspace = useCallback(() => {
    setQuery((prev) => {
      const start = Math.min(selectionRef.current.start, prev.length);
      const end = Math.min(selectionRef.current.end, prev.length);

      if (start !== end) {
        const nextQuery = prev.slice(0, start) + prev.slice(end);
        selectionRef.current = { start, end: start };
        restoreInputSelection(start);
        return nextQuery;
      }

      if (start === 0) {
        restoreInputSelection(0);
        return prev;
      }

      const nextCursor = start - 1;
      const nextQuery = prev.slice(0, nextCursor) + prev.slice(end);
      selectionRef.current = { start: nextCursor, end: nextCursor };
      restoreInputSelection(nextCursor);
      return nextQuery;
    });
  }, [restoreInputSelection]);

  // Infinite-scroll rendering resets when query or filters change, so the list
  // gets a stable key derived from the effective search state.
  const resultsKey = `${deferredQuery}\u0000${selectedPartOfSpeech}\u0000${selectedDialect}`;

  return {
    dictionaryLength: dictionary.length,
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
    visibleQuery: deferredQuery,
  };
}
