import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fr } from "../i18n/fr";
import { en } from "../i18n/en";
import type { Language } from "../i18n";

// Translations type that accepts both fr and en
type Translations = typeof fr | typeof en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "integraltech-language";
const DEFAULT_LANGUAGE: Language = "fr";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    const lang = stored || DEFAULT_LANGUAGE;
    setLanguageState(lang);
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // Dispatch custom event for potential external listeners
    window.dispatchEvent(new CustomEvent("language-change", { detail: { language: lang } }));
  }, []);

  const translations: Translations = language === "en" ? en : fr;

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: DEFAULT_LANGUAGE, setLanguage, t: fr }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useTranslation() {
  const { t } = useLanguage();
  return t;
}
