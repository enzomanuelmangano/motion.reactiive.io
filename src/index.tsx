import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { useState } from 'react';

import { CurveCanvas } from './components/curve-canvas';
import { UnifiedControls } from './components/unified-controls';
import { CurveLegend } from './components/curve-legend';
import { GitHubRepo, ThemeToggle } from './components/theme-toggle';

const App = () => {
  const { styles, breakpoint } = useStyles(stylesheet);

  const springParams = {
    mass: useSharedValue(1.5),
    damping: useSharedValue(17),
    stiffness: useSharedValue(46),
  };

  const bezierParams = {
    x1: useSharedValue(0.25),
    y1: useSharedValue(0.46),
    x2: useSharedValue(0.45),
    y2: useSharedValue(0.94),
    duration: useSharedValue(1000),
  };

  const showLegend = breakpoint !== 'xs';

  const [springActive, setSpringActive] = useState(true);
  const [bezierActive, setBezierActive] = useState(true);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.mainContent}>
              <View style={styles.canvasSection}>
                <CurveCanvas
                  springActive={springActive}
                  bezierActive={bezierActive}
                  springParams={springParams}
                  bezierParams={bezierParams}
                />
                {showLegend && (
                  <CurveLegend
                    springActive={springActive}
                    bezierActive={bezierActive}
                    onToggleSpring={() => setSpringActive(prev => !prev)}
                    onToggleBezier={() => setBezierActive(prev => !prev)}
                  />
                )}
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
        </ScrollView>

        {/* Theme toggle positioned at bottom right */}
        <View style={styles.themeToggleContainer}>
          <GitHubRepo />
          <ThemeToggle />
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
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  content: {
    flex: 1,
    paddingTop: {
      xs: theme.spacing.xxxl,
      md: theme.spacing.xxxl,
    },
    paddingBottom: theme.spacing.xxxl,
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
  canvasSection: {
    width: {
      xs: '100%',
      sm: theme.dimensions.canvas.maxWidth,
    },
    maxWidth: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsSection: {
    width: theme.dimensions.container.maxWidth.controls,
    flexShrink: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  themeToggleContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 1000,
    gap: theme.spacing.sm,
    flexDirection: 'row',
  },
}));

// eslint-disable-next-line import/no-default-export
export default App;
