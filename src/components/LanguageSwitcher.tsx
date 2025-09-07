import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="fixed top-4 right-4 z-50 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-lg p-2 flex gap-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          language === 'en' 
            ? 'bg-[color:var(--accent)] text-black' 
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
        }`}
      >
        ENG
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded text-sm font-medium transition-all ${
          language === 'es' 
            ? 'bg-[color:var(--accent)] text-black' 
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
        }`}
      >
        ESP
      </button>
    </div>
  );
};