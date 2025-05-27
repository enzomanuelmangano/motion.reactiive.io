import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

type CurveLegendProps = {
  onToggleSpring?: () => void;
  onToggleBezier?: () => void;
  springActive: SharedValue<boolean>;
  bezierActive: SharedValue<boolean>;
};

export const CurveLegend = ({
  onToggleSpring,
  onToggleBezier,
  springActive,
  bezierActive,
}: CurveLegendProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const rSpringStyle = useAnimatedStyle(() => ({
    opacity: springActive.value ? 1 : 0.5,
  }));

  const rBezierStyle = useAnimatedStyle(() => ({
    opacity: bezierActive.value ? 1 : 0.5,
  }));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.legendItem}
        onPress={onToggleSpring}
        activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.colorDot,
            {
              backgroundColor: theme.colors.primary.spring,
            },
            rSpringStyle,
          ]}
        />
        <Text style={styles.legendText}>Spring Animation</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.legendItem}
        onPress={onToggleBezier}
        activeOpacity={0.8}>
        <Animated.View
          style={[
            styles.colorDot,
            {
              backgroundColor: theme.colors.primary.bezier,
            },
            rBezierStyle,
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
