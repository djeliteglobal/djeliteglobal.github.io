import React, { useEffect } from 'react';
import { THEME_COLORS } from './colors';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: 'turquoise' | 'green' | 'blue' | 'purple' | 'pink' | 'orange';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme = 'turquoise' 
}) => {
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme-specific colors to CSS variables
    const themeColors = {
      turquoise: { primary: '#00F5FF', primaryMuted: '#00D4E6' },
      green: { primary: '#00F57A', primaryMuted: '#00D966' },
      blue: { primary: '#0080FF', primaryMuted: '#0066CC' },
      purple: { primary: '#8B5CF6', primaryMuted: '#7C3AED' },
      pink: { primary: '#EC4899', primaryMuted: '#DB2777' },
      orange: { primary: '#F97316', primaryMuted: '#EA580C' }
    };
    
    const selectedTheme = themeColors[theme] || themeColors.turquoise;
    
    root.style.setProperty('--theme-primary', selectedTheme.primary);
    root.style.setProperty('--theme-primary-muted', selectedTheme.primaryMuted);
    root.style.setProperty('--theme-success', THEME_COLORS.SUCCESS);
    root.style.setProperty('--theme-warning', THEME_COLORS.WARNING);
    root.style.setProperty('--theme-danger', THEME_COLORS.DANGER);
  }, [theme]);

  return <>{children}</>;
};