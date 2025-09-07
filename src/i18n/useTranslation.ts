import { useState, useEffect } from 'react';
import { translations, Language } from './translations';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'es')) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  };

  return { t, language, changeLanguage };
};