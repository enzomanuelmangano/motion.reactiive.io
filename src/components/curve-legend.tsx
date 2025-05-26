import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type CurveLegendProps = {
  onToggleSpring?: () => void;
  onToggleBezier?: () => void;
  springActive?: boolean;
  bezierActive?: boolean;
};

export const CurveLegend = ({
  onToggleSpring,
  onToggleBezier,
  springActive,
  bezierActive,
}: CurveLegendProps) => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.legendItem}
        onPress={onToggleSpring}
        activeOpacity={0.8}>
        <View
          style={[
            styles.colorDot,
            {
              backgroundColor: theme.colors.primary.spring,
              opacity: springActive ? 1 : 0.5,
            },
          ]}
        />
        <Text style={styles.legendText}>Spring Animation</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.legendItem}
        onPress={onToggleBezier}
        activeOpacity={0.8}>
        <View
          style={[
            styles.colorDot,
            {
              backgroundColor: theme.colors.primary.bezier,
              opacity: bezierActive ? 1 : 0.5,
            },
          ]}
        />
        <Text style={styles.legendText}>Bezier Curve</Text>
      </TouchableOpacity>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  colorDot: {
    width: theme.dimensions.colorDot.size,
    height: theme.dimensions.colorDot.size,
    borderRadius: theme.dimensions.colorDot.size / 2,
  },
  legendText: {
    color: theme.colors.text.primary,
    fontSize: 12,
    opacity: 0.7,
  },
}));
