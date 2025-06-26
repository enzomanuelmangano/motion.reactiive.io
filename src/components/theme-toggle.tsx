import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { View } from 'react-native';

import { useUnistyles } from '../hooks/use-unistyles';

import { PressableHighlight } from './pressable';

export const ThemeToggle: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { isDark, toggleTheme, theme } = useUnistyles();

  return (
    <PressableHighlight
      style={styles.container}
      activeBackgroundColor={theme.colors.background.surface}
      inactiveBackgroundColor={theme.colors.background.primary}
      minScale={0.92}
      maxScale={1.08}
      contentStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={toggleTheme}>
      <Ionicons
        name={isDark ? 'moon' : 'sunny'}
        size={18}
        color={theme.colors.text.primary}
      />
    </PressableHighlight>
  );
};

export const GitHubRepo = () => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center' },
      ]}>
      <Link
        href="https://github.com/enzomanuelmangano/motion.reactiive.io"
        target="_blank">
        <Ionicons
          name="logo-github"
          size={18}
          color={theme.colors.text.secondary}
        />
      </Link>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.primary,
    // Add subtle shadow for better visual hierarchy
    ...theme.shadows.small,
  },
}));
