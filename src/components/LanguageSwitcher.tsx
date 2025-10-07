import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

export const LanguageSwitcher: React.FC<{inline?: boolean}> = ({ inline = false }) => {
  const { language, changeLanguage } = useTranslation();

  if (inline) {
    return (
      <div className="bg-[color:var(--surface)] border border-[color:var(--border)] rounded-md p-1 flex gap-1">
        <button
          onClick={() => changeLanguage('en')}
          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
            language === 'en' 
              ? 'bg-[color:var(--accent)] text-black' 
              : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => changeLanguage('es')}
          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
            language === 'es' 
              ? 'bg-[color:var(--accent)] text-black' 
              : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
          }`}
        >
          ES
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-16 right-4 z-40 bg-[color:var(--surface)] border border-[color:var(--border)] rounded-md p-1 flex gap-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
          language === 'en' 
            ? 'bg-[color:var(--accent)] text-black' 
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('es')}
        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
          language === 'es' 
            ? 'bg-[color:var(--accent)] text-black' 
            : 'text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'
        }`}
      >
        ES
      </button>
    </div>
  );
};
