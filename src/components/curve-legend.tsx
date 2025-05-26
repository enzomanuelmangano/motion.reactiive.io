import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const CurveLegend = () => {
  return (
    <View style={styles.container}>
      <View style={styles.legendItem}>
        <View style={[styles.colorDot, { backgroundColor: '#ffc558' }]} />
        <Text style={styles.legendText}>Spring Animation</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.colorDot, { backgroundColor: '#14adff' }]} />
        <Text style={styles.legendText}>Bezier Curve</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
});
