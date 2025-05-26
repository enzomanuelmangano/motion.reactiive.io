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

// Light theme colors
const lightColors = {
  // Primary Colors (keep the same vibrant colors)
  primary: {
    spring: '#ffc558', // Spring/timing controls color
    bezier: '#14adff', // Bezier controls color
  },

  // Background Colors (inverted for light theme)
  background: {
    primary: '#f8f8f8', // Main app background
    secondary: '#f8f9fa', // Canvas background
    overlay: 'rgba(0, 0, 0, 0.05)', // Controls overlay
    surface: 'rgba(0, 0, 0, 0.03)', // Tab container background
    track: 'rgba(0, 0, 0, 0.08)', // Slider track background
  },

  // Border Colors (darker for light theme)
  border: {
    primary: '#e1e5e9', // Canvas border
    secondary: 'rgba(0, 0, 0, 0.1)', // Controls border
  },

  // Text Colors (dark for light theme)
  text: {
    primary: '#1a1a1a', // Primary text color
    secondary: '#4a4a4a', // Secondary text color
  },

  // Shadow Colors (darker for light theme)
  shadow: {
    primary: '#000', // Main shadow color
  },

  // State Colors (adjusted opacity for light theme)
  state: {
    springActive: 'rgba(255, 197, 88, 0.15)', // Spring tab active background
    springBorder: 'rgba(255, 197, 88, 0.4)', // Spring tab active border
    bezierActive: 'rgba(20, 173, 255, 0.15)', // Bezier tab active background
    bezierBorder: 'rgba(20, 173, 255, 0.4)', // Bezier tab active border
  },
};

// Light theme shadows (softer for light backgrounds)
const lightShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 5,
  },
};

// Define themes
const themes = {
  dark: {
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    dimensions: theme.dimensions,
    shadows: theme.shadows,
    strokeWidths: theme.strokeWidths,
    opacity: theme.opacity,
    animations: theme.animations,
  },
  light: {
    colors: lightColors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    dimensions: theme.dimensions,
    shadows: lightShadows,
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
  adaptiveThemes: true,
});

// Type declarations for TypeScript support
type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof themes;

declare module 'react-native-unistyles' {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}
