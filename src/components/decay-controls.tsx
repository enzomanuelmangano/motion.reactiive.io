import React, { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { Controls } from './controls';
import { createSliderControls, type SliderConfig } from './control-utils';

type DecayControlsProps = {
  deceleration: SharedValue<number>;
  velocity?: SharedValue<number>;
  title?: string;
  color?: string;
};

export const DecayControls: React.FC<DecayControlsProps> = ({
  deceleration,
  velocity,
  title = 'Decay Configuration',
  color = '#ff5858',
}) => {
  const sliderConfigs: SliderConfig[] = useMemo(() => {
    const configs: SliderConfig[] = [
      {
        id: 'deceleration',
        label: 'Deceleration',
        value: deceleration,
        min: 0.9,
        max: 0.999,
        step: 0.001,
        color,
        formatValue: (value: number) => value.toFixed(3),
      },
    ];

    if (velocity) {
      configs.push({
        id: 'velocity',
        label: 'Initial Velocity',
        value: velocity,
        min: -2000,
        max: 2000,
        step: 50,
        color,
        unit: 'px/s',
      });
    }

    return configs;
  }, [deceleration, velocity, color]);

  const controlItems = useMemo(
    () => createSliderControls(sliderConfigs),
    [sliderConfigs],
  );

  return <Controls title={title} items={controlItems} />;
};
