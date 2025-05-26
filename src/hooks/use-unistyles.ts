import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useStyles, UnistylesRuntime } from 'react-native-unistyles';

const ThemeAtom = atomWithStorage<'dark' | 'light'>(
  'theme',
  'dark',
  {
    getItem: key => {
      return (localStorage.getItem(key) ?? 'dark') as 'dark' | 'light';
    },
    setItem: (key, value) => {
      localStorage.setItem(key, value);
    },
    removeItem: key => {
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
