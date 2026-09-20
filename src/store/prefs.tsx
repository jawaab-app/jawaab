import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type SchoolKey = 'hanafi' | 'maliki' | 'shafii' | 'hanbali' | 'unsure';
export type LanguageKey = 'en' | 'ar' | 'ur' | 'tr' | 'id' | 'fr';
export type SkyOverride = 'morning' | 'afternoon' | 'evening' | 'night' | null;
export type Appearance = 'system' | 'light' | 'dark';

export interface Prefs {
  onboarded: boolean;
  school: SchoolKey | null;
  language: LanguageKey;
  topics: string[];
  publishers: string[];
  /** Developer: force a time of day for the home sky. null follows the clock. */
  skyOverride: SkyOverride;
  appearance: Appearance;
}

const DEFAULTS: Prefs = {
  onboarded: false,
  school: null,
  language: 'en',
  topics: [],
  publishers: [],
  skyOverride: null,
  appearance: 'system',
};

const KEY = 'jawab.prefs.v1';

interface PrefsContextValue {
  prefs: Prefs;
  ready: boolean;
  update: (patch: Partial<Prefs>) => void;
  reset: () => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (cancelled) return;
        if (raw) setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: Prefs) => {
    setPrefs(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const update = useCallback((patch: Partial<Prefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const reset = useCallback(() => persist(DEFAULTS), [persist]);

  const value = useMemo(() => ({ prefs, ready, update, reset }), [prefs, ready, update, reset]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefsOptional(): PrefsContextValue | null {
  return useContext(PrefsContext);
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used inside PrefsProvider');
  return ctx;
}
