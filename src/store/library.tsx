import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { QuestionSummary } from '@/api/types';

// Saved answers and reading history, kept on this device.

export interface LibraryEntry {
  question: QuestionSummary;
  at: number;
}

export interface Library {
  saved: LibraryEntry[];
  history: LibraryEntry[];
  /** Recent search queries, newest first. */
  searches: string[];
}

const EMPTY: Library = { saved: [], history: [], searches: [] };
const KEY = 'jawab.library.v1';
const HISTORY_LIMIT = 50;
const SEARCH_LIMIT = 10;

export function summaryOf(q: QuestionSummary): QuestionSummary {
  return { id: q.id, slug: q.slug, title: q.title, madhab: q.madhab, source_slug: q.source_slug, scholar: q.scholar };
}

export function withRead(lib: Library, q: QuestionSummary, at = Date.now()): Library {
  const history = [{ question: summaryOf(q), at }, ...lib.history.filter((e) => e.question.id !== q.id)].slice(0, HISTORY_LIMIT);
  return { ...lib, history };
}

export function withSaved(lib: Library, q: QuestionSummary, on: boolean, at = Date.now()): Library {
  const rest = lib.saved.filter((e) => e.question.id !== q.id);
  return { ...lib, saved: on ? [{ question: summaryOf(q), at }, ...rest] : rest };
}

export function withSearch(lib: Library, query: string): Library {
  const q = query.trim();
  if (!q) return lib;
  const rest = lib.searches.filter((s) => s.toLowerCase() !== q.toLowerCase());
  return { ...lib, searches: [q, ...rest].slice(0, SEARCH_LIMIT) };
}

interface LibraryContextValue extends Library {
  isSaved: (id: number) => boolean;
  toggleSaved: (q: QuestionSummary) => void;
  markRead: (q: QuestionSummary) => void;
  clearHistory: () => void;
  addSearch: (query: string) => void;
  clearSearches: () => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [lib, setLib] = useState<Library>(EMPTY);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!cancelled && raw) setLib((cur) => mergeLoaded(cur, JSON.parse(raw) as Partial<Library>));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const apply = useCallback((fn: (l: Library) => Library) => {
    setLib((prev) => {
      const next = fn(prev);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<LibraryContextValue>(
    () => ({
      ...lib,
      isSaved: (id) => lib.saved.some((e) => e.question.id === id),
      toggleSaved: (q) => apply((l) => withSaved(l, q, !l.saved.some((e) => e.question.id === q.id))),
      markRead: (q) => apply((l) => withRead(l, q)),
      clearHistory: () => apply((l) => ({ ...l, history: [] })),
      addSearch: (query) => apply((l) => withSearch(l, query)),
      clearSearches: () => apply((l) => ({ ...l, searches: [] })),
    }),
    [lib, apply],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

// Anything recorded before storage finished loading wins over the stored copy.
function mergeLoaded(cur: Library, stored: Partial<Library>): Library {
  const merge = (a: LibraryEntry[], b: LibraryEntry[] = []) => {
    const seen = new Set(a.map((e) => e.question.id));
    return [...a, ...b.filter((e) => e?.question && !seen.has(e.question.id))];
  };
  const searches = [...cur.searches, ...(stored.searches ?? []).filter((q) => typeof q === 'string' && !cur.searches.includes(q))].slice(0, SEARCH_LIMIT);
  return { saved: merge(cur.saved, stored.saved), history: merge(cur.history, stored.history).slice(0, HISTORY_LIMIT), searches };
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider');
  return ctx;
}
