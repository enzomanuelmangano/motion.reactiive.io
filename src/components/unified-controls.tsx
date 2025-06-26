import React, { useState, useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import Color from 'color';

import { Controls } from './controls';
import { createSliderControls, type SliderConfig } from './control-utils';
import { PressableHighlight } from './pressable';

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
  const { styles, theme } = useStyles(stylesheet);
  const [activeTab, setActiveTab] = useState<'spring' | 'bezier'>('spring');

  const inactiveSpringBackgroundColor = Color(theme.colors.state.springActive)
    .alpha(0.0)
    .toString();
  const inactiveBezierBackgroundColor = Color(theme.colors.state.bezierActive)
    .alpha(0.0)
    .toString();

  const springSliderConfigs: SliderConfig[] = useMemo(
    () => [
      {
        id: 'mass',
        label: 'Mass',
        value: springParams.mass,
        min: 0.1,
        max: 50,
        step: 0.1,
        color: theme.colors.primary.spring,
        formatValue: (value: number) => value.toFixed(1),
      },
      {
        id: 'damping',
        label: 'Damping',
        value: springParams.damping,
        min: 1,
        max: 100,
        step: 1,
        color: theme.colors.primary.spring,
      },
      {
        id: 'stiffness',
        label: 'Stiffness',
        value: springParams.stiffness,
        min: 1,
        max: 1000,
        step: 1,
        color: theme.colors.primary.spring,
      },
    ],
    [springParams, theme.colors.primary.spring],
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
        color: theme.colors.primary.bezier,
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'y1',
        label: 'Control Point 1 Y',
        value: bezierParams.y1,
        min: 0,
        max: 1,
        step: 0.01,
        color: theme.colors.primary.bezier,
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'x2',
        label: 'Control Point 2 X',
        value: bezierParams.x2,
        min: 0,
        max: 1,
        step: 0.01,
        color: theme.colors.primary.bezier,
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'y2',
        label: 'Control Point 2 Y',
        value: bezierParams.y2,
        min: 0,
        max: 1,
        step: 0.01,
        color: theme.colors.primary.bezier,
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
        color: theme.colors.primary.bezier,
      },
    ],
    [bezierParams, theme.colors.primary.bezier],
  );

  const activeConfigs =
    activeTab === 'spring' ? springSliderConfigs : bezierSliderConfigs;

  const controlItems = useMemo(
    () => createSliderControls(activeConfigs),
    [activeConfigs],
  );

  const handleTabSwitch = useCallback(
    (tab: 'spring' | 'bezier') => {
      if (tab === activeTab) return;
      setActiveTab(tab);
    },
    [activeTab],
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <PressableHighlight
          activeBackgroundColor={theme.colors.state.springActive}
          inactiveBackgroundColor={inactiveSpringBackgroundColor}
          isActive={activeTab === 'spring'}
          style={styles.tab}
          contentStyle={styles.tabContent}
          onPress={() => handleTabSwitch('spring')}>
          <View style={[styles.tabDot, styles.springDot]} />
          <Text
            style={[
              styles.tabText,
              activeTab === 'spring' && styles.tabTextActive,
            ]}>
            Spring
          </Text>
        </PressableHighlight>

        <PressableHighlight
          activeBackgroundColor={theme.colors.state.bezierActive}
          inactiveBackgroundColor={inactiveBezierBackgroundColor}
          isActive={activeTab === 'bezier'}
          style={styles.tab}
          contentStyle={styles.tabContent}
          onPress={() => handleTabSwitch('bezier')}>
          <View style={[styles.tabDot, styles.bezierDot]} />
          <Text
            style={[
              styles.tabText,
              activeTab === 'bezier' && styles.tabTextActive,
            ]}>
            Bezier
          </Text>
        </PressableHighlight>
      </View>

      <Controls items={controlItems} />
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    maxWidth: theme.dimensions.container.maxWidth.controls,
    minHeight: theme.dimensions.container.minHeight.controls,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xs,
    borderWidth: theme.strokeWidths.thin,
    gap: theme.spacing.xs,
    borderColor: theme.colors.border.primary,
  },
  tab: {
    flex: 1,
    borderRadius: theme.borderRadius.xl - theme.spacing.xs,
  },
  tabContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  tabDot: {
    width: theme.dimensions.tabDot.size,
    height: theme.dimensions.tabDot.size,
    borderRadius: theme.dimensions.tabDot.borderRadius,
  },
  springDot: {
    backgroundColor: theme.colors.primary.spring,
  },
  bezierDot: {
    backgroundColor: theme.colors.primary.bezier,
  },
  tabText: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '500',
    opacity: theme.opacity.disabled,
  },
  tabTextActive: {
    opacity: 1,
  },
}));
