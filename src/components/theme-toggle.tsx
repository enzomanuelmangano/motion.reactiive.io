import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useUnistyles } from '../hooks/use-unistyles';

export const ThemeToggle: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { isDark, toggleTheme, theme } = useUnistyles();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={toggleTheme}
      activeOpacity={0.7}>
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={18}
        color={theme.colors.text.secondary}
      />
    </TouchableOpacity>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
