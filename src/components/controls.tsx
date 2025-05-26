import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

export type ControlItem = {
  id: string;
  component: React.ReactElement;
};

type ControlsProps = {
  items: ControlItem[];
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};

export const Controls: React.FC<ControlsProps> = ({
  items,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.controlsWrapper, style]}>
        {items.map(item => (
          <View key={item.id} style={styles.controlItem}>
            {item.component}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
    padding: 14,
    backgroundColor: 'rgba(17, 17, 17, 0.7)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlsWrapper: {
    width: '100%',
  },
  controlItem: {
    marginVertical: 1,
  },
});
