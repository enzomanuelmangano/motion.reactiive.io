import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { SpringSlider } from './spring-slider';

type SpringControlsProps = {
  mass: SharedValue<number>;
  damping: SharedValue<number>;
  stiffness: SharedValue<number>;
};

export const SpringControls = ({
  mass,
  damping,
  stiffness,
}: SpringControlsProps) => {
  return (
    <View style={styles.container}>
      <SpringSlider
        label="Mass"
        value={mass}
        min={0.5}
        max={5}
        color="#ffc558"
      />
      <SpringSlider
        label="Damping"
        value={damping}
        min={5}
        max={50}
        color="#ffc558"
      />
      <SpringSlider
        label="Stiffness"
        value={stiffness}
        min={50}
        max={500}
        color="#ffc558"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
});
