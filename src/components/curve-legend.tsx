import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

export const CurveLegend = () => {
  const { styles, theme } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <View style={styles.legendItem}>
        <View
          style={[
            styles.colorDot,
            { backgroundColor: theme.colors.primary.spring },
          ]}
        />
        <Text style={styles.legendText}>Spring Animation</Text>
      </View>
      <View style={styles.legendItem}>
        <View
          style={[
            styles.colorDot,
            { backgroundColor: theme.colors.primary.bezier },
          ]}
        />
        <Text style={styles.legendText}>Bezier Curve</Text>
      </View>
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
