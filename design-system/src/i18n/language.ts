import { useEffect, useSyncExternalStore } from 'react';

export type Language = 'en' | 'ko';
const STORAGE_KEY = 'icarus-language';
const DEFAULT_LANGUAGE: Language = 'ko';
let currentLanguage: Language | undefined;
const listeners = new Set<() => void>();
const normalize = (value: string | null): Language => value === 'en' ? 'en' : DEFAULT_LANGUAGE;

function getLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  if (currentLanguage === undefined) {
    try {
      currentLanguage = normalize(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      currentLanguage = DEFAULT_LANGUAGE;
    }
  }
  return currentLanguage;
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  currentLanguage = normalize(event.newValue);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

/** Switch all mounted ICARUS sections together without reloading or resetting their animations. */
export function setLanguage(language: Language) {
  currentLanguage = language;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Language switching still works when browser storage is unavailable.
    }
    document.documentElement.lang = language;
  }
  listeners.forEach((listener) => listener());
}

/** Korean is the initial default; a visitor's explicit selection persists across page loads. */
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, getLanguage, () => DEFAULT_LANGUAGE);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return { language, setLanguage };
}
