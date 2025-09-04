# 🎨 Theme Change Guide

## Quick Theme Change

To change the entire app theme, edit **ONE FILE ONLY**:

### `src/theme/colors.ts`

```typescript
export const THEME_COLORS = {
  // 🎨 Change these two lines to change ENTIRE app theme:
  PRIMARY: '#40E0D0',        // Main theme color
  PRIMARY_MUTED: '#20B2AA',  // Darker version for hovers
  
  // Don't change these:
  SUCCESS: '#10B981',
  WARNING: '#F59E0B', 
  DANGER: '#EF4444',
}
```

## Popular Theme Colors

### Turquoise (Current)
```typescript
PRIMARY: '#40E0D0',
PRIMARY_MUTED: '#20B2AA',
```

### Green (Original)
```typescript
PRIMARY: '#00F57A',
PRIMARY_MUTED: '#00D96A',
```

### Blue
```typescript
PRIMARY: '#3B82F6',
PRIMARY_MUTED: '#2563EB',
```

### Purple
```typescript
PRIMARY: '#8B5CF6',
PRIMARY_MUTED: '#7C3AED',
```

### Pink
```typescript
PRIMARY: '#EC4899',
PRIMARY_MUTED: '#DB2777',
```

### Orange
```typescript
PRIMARY: '#F97316',
PRIMARY_MUTED: '#EA580C',
```

## What Changes

When you update `PRIMARY` and `PRIMARY_MUTED`, these elements automatically change:

- ✅ All buttons (primary, CTA, purchase)
- ✅ All progress bars and indicators
- ✅ All accent text and highlights
- ✅ All hover effects and shadows
- ✅ All interactive elements
- ✅ All status badges
- ✅ All icons and logos
- ✅ All focus states

## Files That Use Theme

The theme system automatically updates:
- `src/index.css` - CSS variables
- All component files using `var(--accent)`
- All Tailwind classes using `[color:var(--accent)]`

## No Manual Changes Needed

You don't need to edit any other files. The theme system handles everything automatically.

Just change the two colors in `colors.ts` and the entire app updates! 🚀