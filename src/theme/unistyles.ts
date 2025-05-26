import { UnistylesRegistry } from 'react-native-unistyles';

import { theme } from './index';

// Define breakpoints for responsive design
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  superLarge: 2000,
  tvLike: 4000,
} as const;

// Define themes (you can add light theme later if needed)
const themes = {
  dark: {
    colors: theme.colors,
    spacing: theme.spacing,
    componentSpacing: theme.componentSpacing,
    borderRadius: theme.borderRadius,
    dimensions: theme.dimensions,
    shadows: theme.shadows,
    strokeWidths: theme.strokeWidths,
    opacity: theme.opacity,
    animations: theme.animations,
  },
} as const;

// Configure unistyles
UnistylesRegistry.addBreakpoints(breakpoints).addThemes(themes).addConfig({
  // Set initial theme
  initialTheme: 'dark',
  // Adapt to system theme changes
  adaptiveThemes: false,
});

// Type declarations for TypeScript support
type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof themes;

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}
