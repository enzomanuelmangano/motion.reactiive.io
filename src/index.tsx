import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSharedValue } from 'react-native-reanimated';

import { CurveCanvas } from './components/curve-canvas';

const App = () => {
  const springParams = {
    mass: useSharedValue(1),
    damping: useSharedValue(1),
    stiffness: useSharedValue(1),
  };

  const bezierParams = {
    x1: useSharedValue(0.5),
    y1: useSharedValue(0),
    x2: useSharedValue(0.5),
    y2: useSharedValue(1),
    duration: useSharedValue(1000),
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CurveCanvas springParams={springParams} bezierParams={bezierParams} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// eslint-disable-next-line import/no-default-export
export default App;
