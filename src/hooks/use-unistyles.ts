import { useStyles, UnistylesRuntime } from 'react-native-unistyles';

/**
 * Custom hook that provides access to unistyles theme and utilities
 * This hook gives you access to:
 * - theme: Current theme object with all design tokens
 * - breakpoint: Current breakpoint information
 * - themeName: Current theme name ('light' or 'dark')
 * - toggleTheme: Function to toggle between themes
 * - setTheme: Function to set a specific theme
 */
export const useUnistyles = () => {
  const { theme, breakpoint } = useStyles();

  const toggleTheme = () => {
    const currentTheme = UnistylesRuntime.themeName;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    UnistylesRuntime.setTheme(newTheme);
  };

  const setTheme = (themeName: 'light' | 'dark') => {
    UnistylesRuntime.setTheme(themeName);
  };

  return {
    theme,
    breakpoint,
    themeName: UnistylesRuntime.themeName,
    // Helper functions based on breakpoint
    isWideScreen:
      breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'superLarge',
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    // Theme utilities
    isDark: UnistylesRuntime.themeName === 'dark',
    isLight: UnistylesRuntime.themeName === 'light',
    toggleTheme,
    setTheme,
  };
};
