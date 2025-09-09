import React from 'react';
import { useThemeStore, themes } from '../stores/themeStore';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme } = useThemeStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[color:var(--text-secondary)]">Theme:</span>
      <select
        value={currentTheme}
        onChange={(e) => {
          const value = e.target.value;
          if (value in themes) {
            setTheme(value);
          }
        }}
        className="px-3 py-1 bg-[color:var(--surface)] border border-[color:var(--border)] rounded text-sm text-[color:var(--text-primary)] focus:ring-2 focus:ring-[color:var(--accent)] outline-none"
      >
        {Object.entries(themes).map(([key, theme]) => (
          <option key={key} value={key}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};