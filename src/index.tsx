import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CurveCanvas } from './components/curve-canvas';
import { UnifiedControls } from './components/unified-controls';
import { CurveLegend } from './components/curve-legend';

const App = () => {
  const { width } = useWindowDimensions();
  const isWideScreen = width > 900;

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
        <StatusBar style="light" />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Animation Curve Visualizer</Text>
            <Text style={styles.subtitle}>
              Compare Spring vs Bezier easing curves
            </Text>
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

            <View style={styles.controlsSection}>
              <UnifiedControls
                springParams={springParams}
                bezierParams={bezierParams}
              />
            </View>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080808',
  },
  content: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 32,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  stackedLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  canvasSection: {
    flex: 1,
    alignItems: 'center',
    minWidth: 300,
  },
  controlsSection: {
    width: 380,
    flexShrink: 0,
  },
});

// eslint-disable-next-line import/no-default-export
export default App;
