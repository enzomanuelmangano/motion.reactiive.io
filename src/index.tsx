import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { CurveCanvas } from './components/curve-canvas';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <CurveCanvas />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { App };
