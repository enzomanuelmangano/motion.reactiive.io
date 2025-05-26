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
    maxWidth: 380,
    marginVertical: 12,
    padding: 12,
    backgroundColor: 'rgba(17, 17, 17, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
  controlsWrapper: {
    width: '100%',
  },
  controlItem: {
    marginVertical: 1,
  },
});
