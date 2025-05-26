import React from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useUnistyles } from '../hooks/use-unistyles';

import { PressableHighlight } from './pressable';

export const ThemeToggle: React.FC = () => {
  const { styles } = useStyles(stylesheet);
  const { isDark, toggleTheme, theme } = useUnistyles();

  return (
    <PressableHighlight
      style={styles.container}
      minScale={0.9}
      maxScale={1.05}
      contentStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={toggleTheme}>
      <Ionicons
        name={isDark ? 'sunny-outline' : 'moon-outline'}
        size={18}
        color={theme.colors.text.secondary}
      />
    </PressableHighlight>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.primary,
  },
}));
