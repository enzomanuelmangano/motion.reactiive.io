import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useStyles } from 'react-native-unistyles';

// eslint-disable-next-line import/no-default-export
export default function Layout() {
  const { theme } = useStyles();
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <Slot />
    </GestureHandlerRootView>
  );
}
