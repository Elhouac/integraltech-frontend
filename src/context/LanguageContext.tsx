import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fr } from "../i18n/fr";
import { en } from "../i18n/en";
import { ar } from "../i18n/ar";
import type { Language } from "../i18n";

// Translations type that accepts fr, en, and ar
type Translations = typeof fr | typeof en | typeof ar;

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "integraltech-language";
const DEFAULT_LANGUAGE: Language = "fr";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    return stored || DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent("language-change", { detail: { language: lang } }));
  }, []);

  // Update HTML dir and lang attributes dynamically
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const translations: Translations = language === "ar" ? ar : language === "en" ? en : fr;

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
