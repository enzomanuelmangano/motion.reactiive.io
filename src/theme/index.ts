/**
 * Design System Theme
 * Consolidated colors and spacings from the entire codebase
 */

// Color Palette
export const colors = {
  // Primary Colors
  primary: {
    spring: '#ffc558', // Spring/timing controls color
    bezier: '#14adff', // Bezier controls color
  },

  // Background Colors
  background: {
    primary: '#000000', // Main app background
    secondary: '#0a0a0a', // Controls/panel background (slightly lighter than primary)
    overlay: 'rgba(17, 17, 17, 0.7)', // Controls overlay
    surface: 'rgba(255, 255, 255, 0.05)', // Tab container background
    track: 'rgba(255, 255, 255, 0.08)', // Slider track background
  },

  // Border Colors
  border: {
    primary: '#1a1a1a', // Canvas border
    secondary: 'rgba(255,255,255,0.1)', // Controls border
  },

  // Text Colors
  text: {
    primary: '#fff', // Primary text color
    secondary: '#fff', // Secondary text (same as primary in this case)
  },

  // Shadow Colors
  shadow: {
    primary: '#000', // Main shadow color
  },

  // State Colors (with opacity variants)
  state: {
    springActive: 'rgba(255, 197, 88, 0.1)', // Spring tab active background
    springBorder: 'rgba(255, 197, 88, 0.3)', // Spring tab active border
    bezierActive: 'rgba(20, 173, 255, 0.1)', // Bezier tab active background
    bezierBorder: 'rgba(20, 173, 255, 0.3)', // Bezier tab active border
  },
} as const;

// Spacing Scale
export const spacing = {
  xs: 4, // Extra small spacing
  sm: 8, // Small spacing
  md: 12, // Medium spacing
  lg: 20, // Large spacing
  xl: 30, // Extra large spacing
  xxl: 40, // Extra extra large spacing
  xxxl: 50, // Extra extra extra large spacing
  xxxxl: 60, // Extra extra extra extra large spacing
} as const;

// Border radius values
export const borderRadius = {
  xs: 2, // Slider track
  sm: 4, // Thumb border radius (half of 6)
  md: 8, // Tab border radius
  lg: 10, // Thumb border radius (half of 14)
  xl: 12, // Tab container border radius
} as const;

// Dimensions
export const dimensions = {
  // Slider dimensions
  slider: {
    trackHeight: 3,
    thumbSize: 14,
    thumbOffset: -5.5, // (thumbSize - trackHeight) / 2 * -1
  },

  // Tab dot dimensions
  tabDot: {
    size: 6,
    borderRadius: 3, // half of size
  },

  // Color dot dimensions (legend)
  colorDot: {
    size: 8,
  },

  // Canvas constraints
  canvas: {
    maxWidth: 600,
    maxHeight: 480,
    aspectRatio: 4 / 3,
  },

  // Container constraints
  container: {
    maxWidth: {
      controls: 380,
      main: 1200,
    },
    minHeight: {
      controls: 300,
    },
    breakpoint: {
      wideScreen: 900,
    },
  },
} as const;

// Shadow presets
export const shadows = {
  small: {
    shadowColor: colors.shadow.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.shadow.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: colors.shadow.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
} as const;

// Stroke widths
export const strokeWidths = {
  thin: 1,
  medium: 3,
  thick: 4,
} as const;

// Opacity values
export const opacity = {
  disabled: 0.6,
  overlay: 0.7,
} as const;

// Animation durations
export const animations = {
  fast: 150,
  medium: 200,
  slow: 300,
} as const;

// Export everything as a single theme object
export const theme = {
  colors,
  spacing,
  borderRadius,
  dimensions,
  shadows,
  strokeWidths,
  opacity,
  animations,
} as const;

// Re-export unistyles utilities for convenience
export { useUnistyles } from '../hooks/use-unistyles';
export { createStyleSheet } from 'react-native-unistyles';
