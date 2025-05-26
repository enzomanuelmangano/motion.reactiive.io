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
    decay: '#ff5858', // Decay controls color
    timing: '#58c4ff', // Timing controls color (alternative blue)
  },

  // Background Colors
  background: {
    primary: '#080808', // Main app background
    secondary: '#0a0a0a', // Canvas background
    overlay: 'rgba(17, 17, 17, 0.7)', // Controls overlay
    surface: 'rgba(255, 255, 255, 0.05)', // Tab container background
    track: 'rgba(255, 255, 255, 0.08)', // Slider track background
  },

  // Border Colors
  border: {
    primary: '#202020ff', // Canvas border
    secondary: 'rgba(255,255,255,0.05)', // Controls border
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

// Component-specific spacing
export const componentSpacing = {
  // Padding values
  padding: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 14,
    xl: 20,
  },

  // Margin values
  margin: {
    xs: 1,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 24,
  },

  // Gap values
  gap: {
    xs: 6,
    sm: 8,
    md: 24,
  },

  // Canvas specific
  canvas: {
    horizontalPadding: 30,
    verticalPadding: 30,
  },

  // Hit slop for touch targets
  hitSlop: {
    top: 20,
    bottom: 20,
    left: 10,
    right: 10,
  },
} as const;

// Border radius values
export const borderRadius = {
  xs: 1.5, // Slider track
  sm: 3, // Thumb border radius (half of 6)
  md: 6, // Tab border radius
  lg: 7, // Thumb border radius (half of 14)
  xl: 8, // Tab container border radius
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
    maxWidth: 400,
    maxHeight: 280,
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
  medium: 2,
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
  componentSpacing,
  borderRadius,
  dimensions,
  shadows,
  strokeWidths,
  opacity,
  animations,
} as const;
