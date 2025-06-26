import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Platform } from 'react-native';
import { useStyles, UnistylesRuntime } from 'react-native-unistyles';
import { useEffect } from 'react';

// Detect system theme preference on web
const getSystemTheme = (): 'dark' | 'light' => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Get initial theme: stored preference or system preference
const getInitialTheme = (): 'dark' | 'light' => {
  if (Platform.OS !== 'web') {
    return 'dark';
  }
  const stored = localStorage.getItem('theme');
  return stored ? (stored as 'dark' | 'light') : getSystemTheme();
};

const ThemeAtom = atomWithStorage<'dark' | 'light'>(
  'theme',
  getInitialTheme(),
  {
    getItem: key => {
      if (Platform.OS !== 'web') {
        return 'dark';
      }
      const stored = localStorage.getItem(key);
      return stored ? (stored as 'dark' | 'light') : getSystemTheme();
    },
    setItem: (key, value) => {
      if (Platform.OS !== 'web') {
        return;
      }
      localStorage.setItem(key, value);
    },
    removeItem: key => {
      if (Platform.OS !== 'web') {
        return;
      }
      localStorage.removeItem(key);
    },
  },
  {
    getOnInit: true,
  },
);

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
  const [themeAtom, setThemeAtom] = useAtom(ThemeAtom);

  // Listen for system theme changes on web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      const hasStoredPreference = localStorage.getItem('theme');
      if (!hasStoredPreference) {
        const systemTheme = e.matches ? 'dark' : 'light';
        setThemeAtom(systemTheme);
        UnistylesRuntime.setTheme(systemTheme);
      }
    };

    // Use modern addEventListener if available, fallback to deprecated addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange);
      return () => mediaQuery.removeListener(handleSystemThemeChange);
    }
  }, [setThemeAtom]);

  // Sync atom with runtime on mount and ensure proper initialization
  useEffect(() => {
    // Force theme synchronization
    UnistylesRuntime.setTheme(themeAtom);
    
    // Additional sync for web to ensure proper theme application
    if (Platform.OS === 'web') {
      setTimeout(() => {
        UnistylesRuntime.setTheme(themeAtom);
      }, 50);
    }
  }, [themeAtom]);

  const toggleTheme = () => {
    const currentTheme = UnistylesRuntime.themeName;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setThemeAtom(newTheme);
    UnistylesRuntime.setTheme(newTheme);
  };

  const setTheme = (themeName: 'light' | 'dark') => {
    setThemeAtom(themeName);
    UnistylesRuntime.setTheme(themeName);
  };

  return {
    theme,
    breakpoint,
    themeName: themeAtom,
    // Helper functions based on breakpoint
    isWideScreen:
      breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'superLarge',
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    // Theme utilities
    isDark: themeAtom === 'dark',
    isLight: themeAtom === 'light',
    toggleTheme,
    setTheme,
  };
};
