// Centralized theme colors - Change PRIMARY and PRIMARY_MUTED to update entire app theme
export const THEME_COLORS = {
  // 🎨 MAIN THEME COLOR - Change these two to change entire app theme
  PRIMARY: '#40E0D0',        // Turquoise - buttons, accents, highlights
  PRIMARY_MUTED: '#20B2AA',  // Darker turquoise - hover states
  
  // Status colors (keep these)
  SUCCESS: '#10B981',
  WARNING: '#F59E0B', 
  DANGER: '#EF4444',
} as const;

// Quick theme presets - uncomment one to change theme instantly
export const THEME_PRESETS = {
  TURQUOISE: { PRIMARY: '#40E0D0', PRIMARY_MUTED: '#20B2AA' },
  GREEN: { PRIMARY: '#00F57A', PRIMARY_MUTED: '#00D96A' },
  BLUE: { PRIMARY: '#3B82F6', PRIMARY_MUTED: '#2563EB' },
  PURPLE: { PRIMARY: '#8B5CF6', PRIMARY_MUTED: '#7C3AED' },
  PINK: { PRIMARY: '#EC4899', PRIMARY_MUTED: '#DB2777' },
  ORANGE: { PRIMARY: '#F97316', PRIMARY_MUTED: '#EA580C' },
} as const;
