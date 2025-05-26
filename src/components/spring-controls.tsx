import React, { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { Controls } from './controls';
import { createSliderControls, type SliderConfig } from './control-utils';

type SpringControlsProps = {
  mass: SharedValue<number>;
  damping: SharedValue<number>;
  stiffness: SharedValue<number>;
  title?: string;
  color?: string;
};

export const SpringControls: React.FC<SpringControlsProps> = ({
  mass,
  damping,
  stiffness,
  color = '#ffc558',
}) => {
  const sliderConfigs: SliderConfig[] = useMemo(
    () => [
      {
        id: 'mass',
        label: 'Mass',
        value: mass,
        min: 0.5,
        max: 50,
        color,
      },
      {
        id: 'stiffness',
        label: 'Stiffness',
        value: stiffness,
        min: 1,
        max: 1000,
        color,
      },
      {
        id: 'damping',
        label: 'Damping',
        value: damping,
        min: 1,
        max: 100,
        color,
      },
    ],
    [mass, damping, stiffness, color],
  );

  const controlItems = useMemo(
    () => createSliderControls(sliderConfigs),
    [sliderConfigs],
  );

  return <Controls items={controlItems} />;
};
