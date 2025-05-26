import React from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

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
  const { styles } = useStyles(stylesheet);

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

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    marginVertical: theme.componentSpacing.margin.sm,
    padding: theme.componentSpacing.padding.lg,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 10,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.primary,
  },
  controlsWrapper: {
    width: '100%',
  },
  controlItem: {
    marginVertical: theme.componentSpacing.margin.xs,
  },
}));
