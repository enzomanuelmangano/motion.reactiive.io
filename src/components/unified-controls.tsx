import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { Controls } from './controls';
import { createSliderControls, type SliderConfig } from './control-utils';

type UnifiedControlsProps = {
  springParams: {
    mass: SharedValue<number>;
    damping: SharedValue<number>;
    stiffness: SharedValue<number>;
  };
  bezierParams: {
    x1: SharedValue<number>;
    y1: SharedValue<number>;
    x2: SharedValue<number>;
    y2: SharedValue<number>;
    duration: SharedValue<number>;
  };
};

export const UnifiedControls: React.FC<UnifiedControlsProps> = ({
  springParams,
  bezierParams,
}) => {
  const [activeTab, setActiveTab] = useState<'spring' | 'bezier'>('spring');

  const springSliderConfigs: SliderConfig[] = useMemo(
    () => [
      {
        id: 'mass',
        label: 'Mass',
        value: springParams.mass,
        min: 0.1,
        max: 10,
        step: 0.1,
        color: '#ffc558',
        formatValue: (value: number) => value.toFixed(1),
      },
      {
        id: 'damping',
        label: 'Damping',
        value: springParams.damping,
        min: 1,
        max: 100,
        step: 1,
        color: '#ffc558',
      },
      {
        id: 'stiffness',
        label: 'Stiffness',
        value: springParams.stiffness,
        min: 1,
        max: 1000,
        step: 1,
        color: '#ffc558',
      },
    ],
    [springParams],
  );

  const bezierSliderConfigs: SliderConfig[] = useMemo(
    () => [
      {
        id: 'x1',
        label: 'Control Point 1 X',
        value: bezierParams.x1,
        min: 0,
        max: 1,
        step: 0.01,
        color: '#14adff',
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'y1',
        label: 'Control Point 1 Y',
        value: bezierParams.y1,
        min: 0,
        max: 1,
        step: 0.01,
        color: '#14adff',
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'x2',
        label: 'Control Point 2 X',
        value: bezierParams.x2,
        min: 0,
        max: 1,
        step: 0.01,
        color: '#14adff',
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'y2',
        label: 'Control Point 2 Y',
        value: bezierParams.y2,
        min: 0,
        max: 1,
        step: 0.01,
        color: '#14adff',
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'duration',
        label: 'Duration',
        value: bezierParams.duration,
        min: 100,
        max: 3000,
        step: 50,
        unit: 'ms',
        color: '#14adff',
      },
    ],
    [bezierParams],
  );

  const activeConfigs =
    activeTab === 'spring' ? springSliderConfigs : bezierSliderConfigs;
  const controlItems = useMemo(
    () => createSliderControls(activeConfigs),
    [activeConfigs],
  );

  const handleTabSwitch = (tab: 'spring' | 'bezier') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'spring' && {
              backgroundColor: 'rgba(255, 197, 88, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(255, 197, 88, 0.3)',
            },
          ]}
          onPress={() => handleTabSwitch('spring')}>
          <View style={[styles.tabDot, { backgroundColor: '#ffc558' }]} />
          <Text
            style={[styles.tabText, activeTab === 'spring' && { opacity: 1 }]}>
            Spring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'bezier' && {
              backgroundColor: 'rgba(20, 173, 255, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(20, 173, 255, 0.3)',
            },
          ]}
          onPress={() => handleTabSwitch('bezier')}>
          <View style={[styles.tabDot, { backgroundColor: '#14adff' }]} />
          <Text
            style={[styles.tabText, activeTab === 'bezier' && { opacity: 1 }]}>
            Bezier
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        key={activeTab}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        layout={Layout.duration(300).dampingRatio(0.8)}>
        <Controls items={controlItems} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 380,
    minHeight: 300,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },

  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tabText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.6,
  },
});
