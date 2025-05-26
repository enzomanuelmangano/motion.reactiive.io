import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Initialize unistyles
import './theme/unistyles';

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
    justifyContent: 'center',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 60,
  },
  stackedLayout: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
    paddingTop: 40,
  },
  canvasSection: {
    width: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsSection: {
    width: 380,
    flexShrink: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

// eslint-disable-next-line import/no-default-export
export default App;
