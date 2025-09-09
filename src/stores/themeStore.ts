import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Theme {
  name: string;
  colors: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    muted: string;
    accent: string;
    accentMuted: string;
    danger: string;
  };
}

export const themes: Record<string, Theme> = {
  default: {
    name: 'DJ Elite Green',
    colors: {
      bg: '#0B0D10',
      surface: '#1A1D23',
      surfaceAlt: '#151821',
      border: '#2A2D35',
      textPrimary: '#FFFFFF',
      textSecondary: '#B8BCC8',
      muted: '#6B7280',
      accent: '#00F57A',
      accentMuted: '#00C766',
      danger: '#EF4444'
    }
  },
  purple: {
    name: 'Purple Vibes',
    colors: {
      bg: '#0F0B14',
      surface: '#1E1A2E',
      surfaceAlt: '#181526',
      border: '#2D2A3A',
      textPrimary: '#FFFFFF',
      textSecondary: '#B8BCC8',
      muted: '#6B7280',
      accent: '#8B5CF6',
      accentMuted: '#7C3AED',
      danger: '#EF4444'
    }
  },
  blue: {
    name: 'Ocean Blue',
    colors: {
      bg: '#0A0E1A',
      surface: '#1A1E2E',
      surfaceAlt: '#151926',
      border: '#2A2E3A',
      textPrimary: '#FFFFFF',
      textSecondary: '#B8BCC8',
      muted: '#6B7280',
      accent: '#3B82F6',
      accentMuted: '#2563EB',
      danger: '#EF4444'
    }
  }
};

interface ThemeStore {
  currentTheme: string;
  setTheme: (themeName: string) => void;
  applyTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'default',
      
      setTheme: (themeName: string) => {
        const theme = themes[themeName];
        if (theme) {
          set({ currentTheme: themeName });
          get().applyTheme(theme);
        }
      },
      
      applyTheme: (theme: Theme) => {
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
          const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
          root.style.setProperty(`--${cssVar}`, value);
        });
      }
    }),
    {
      name: 'dj-elite-theme'
    }
  )
);