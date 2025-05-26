import React from 'react';
import type { ViewStyle } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';

export type ControlItem = {
  id: string;
  component: React.ReactElement;
};

type ControlsProps = {
  title?: string;
  items: ControlItem[];
  style?: ViewStyle;
  containerStyle?: ViewStyle;
};

export const Controls: React.FC<ControlsProps> = ({
  title,
  items,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={styles.title}>{title}</Text>}
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
    maxWidth: 400,
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  controlsWrapper: {
    width: '100%',
  },
  controlItem: {
    marginVertical: 2,
  },
});
