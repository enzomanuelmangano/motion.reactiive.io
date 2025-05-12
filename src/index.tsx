import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { CurveCanvas } from './components/curve-canvas';
import { SpringControls } from './components/spring-controls';

const App = () => {
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
          <CurveCanvas
            springParams={springParams}
            bezierParams={bezierParams}
          />
          <SpringControls
            mass={springParams.mass}
            damping={springParams.damping}
            stiffness={springParams.stiffness}
          />
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
    paddingBottom: 50,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

// eslint-disable-next-line import/no-default-export
export default App;
