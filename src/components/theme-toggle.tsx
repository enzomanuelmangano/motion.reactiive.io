import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useUnistyles } from '../hooks/use-unistyles';

export const ThemeToggle: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { isDark, toggleTheme } = useUnistyles();

  return (
    <TouchableOpacity style={styles.container} onPress={toggleTheme}>
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
      <Text style={styles.label}>{isDark ? 'Light Mode' : 'Dark Mode'}</Text>
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.secondary,
    gap: theme.componentSpacing.gap.xs,
    ...theme.shadows.small,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
}));
