import { useEffect, useSyncExternalStore } from 'react';

export type Language = 'en' | 'ko';
const STORAGE_KEY = 'icarus-language';
let currentLanguage: Language | undefined;
const listeners = new Set<() => void>();
const normalize = (value: string | null): Language => value === 'ko' ? 'ko' : 'en';

function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  if (currentLanguage === undefined) {
    try {
      currentLanguage = normalize(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      currentLanguage = 'en';
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

/** English is the initial default; a visitor's explicit selection persists across page loads. */
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, getLanguage, () => 'en' as const);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return { language, setLanguage };
}
