import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

// Initialize unistyles
import './theme/unistyles';

import { CurveCanvas } from './components/curve-canvas';
import { UnifiedControls } from './components/unified-controls';
import { CurveLegend } from './components/curve-legend';
import { ThemeToggle } from './components/theme-toggle';

const App = () => {
  const { styles, breakpoint } = useStyles(stylesheet);
  const isWideScreen =
    breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === 'superLarge';

  const springParams = {
    mass: useSharedValue(2),
    damping: useSharedValue(20),
    stiffness: useSharedValue(150),
  };

  const bezierParams = {
    x1: useSharedValue(0.5),
    y1: useSharedValue(0),
    x2: useSharedValue(0.5),
    y2: useSharedValue(1),
    duration: useSharedValue(1000),
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemeToggle />
          </View>
          <View
            style={[styles.mainContent, !isWideScreen && styles.stackedLayout]}>
            <View style={styles.canvasSection}>
              <CurveCanvas
                springParams={springParams}
                bezierParams={bezierParams}
              />
              <CurveLegend />
            </View>

            <View>
              <View style={styles.controlsSection}>
                <UnifiedControls
                  springParams={springParams}
                  bezierParams={bezierParams}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    paddingTop: {
      xs: theme.spacing.xxxl,
      md: theme.spacing.xxxl,
    },
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: {
      xs: 'column',
      lg: 'row',
    },
    alignItems: {
      xs: 'center',
      lg: 'flex-start',
    },
    justifyContent: {
      xs: 'flex-start',
      lg: 'center',
    },
    gap: theme.spacing.sm,
    maxWidth: theme.dimensions.container.maxWidth.main,
    alignSelf: 'center',
    width: '100%',
    paddingTop: {
      xs: theme.spacing.xl,
      lg: theme.spacing.xxxxl,
    },
  },
  stackedLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.xl,
  },
  canvasSection: {
    width: theme.dimensions.canvas.maxWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsSection: {
    width: theme.dimensions.container.maxWidth.controls,
    flexShrink: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: theme.spacing.md,
  },
}));

// eslint-disable-next-line import/no-default-export
export default App;
