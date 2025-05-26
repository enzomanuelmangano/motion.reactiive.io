import { useStyles } from 'react-native-unistyles';

/**
 * Custom hook that provides access to unistyles theme and utilities
 * This hook gives you access to:
 * - theme: Current theme object with all design tokens
 * - breakpoint: Current breakpoint information
 */
export const useUnistyles = () => {
  const { theme, breakpoint } = useStyles();

  return {
    theme,
    breakpoint,
    // Helper functions based on breakpoint
    isWideScreen:
      breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'superLarge',
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
  };
};
