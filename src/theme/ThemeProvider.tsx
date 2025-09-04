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
    
    // Apply theme colors to CSS variables
    root.style.setProperty('--theme-primary', THEME_COLORS.PRIMARY);
    root.style.setProperty('--theme-primary-muted', THEME_COLORS.PRIMARY_MUTED);
    root.style.setProperty('--theme-success', THEME_COLORS.SUCCESS);
    root.style.setProperty('--theme-warning', THEME_COLORS.WARNING);
    root.style.setProperty('--theme-danger', THEME_COLORS.DANGER);
  }, [theme]);

  return <>{children}</>;
};