import { useState, useEffect, useCallback } from 'react';
import { translations, Language } from './translations';

// Global state for language
let globalLanguage: Language = 'en';
const listeners = new Set<() => void>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(globalLanguage);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      globalLanguage = savedLang;
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const listener = () => setLanguage(globalLanguage);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const changeLanguage = useCallback((lang: Language) => {
    globalLanguage = lang;
    setLanguage(lang);
    localStorage.setItem('language', lang);
    notifyListeners();
  }, []);

  const t = useCallback((key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  }, [language]);

  return { t, language, changeLanguage };
};