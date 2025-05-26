import React, { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { Controls } from './controls';
import { createSliderControls, type SliderConfig } from './control-utils';

type TimingControlsProps = {
  duration: SharedValue<number>;
  title?: string;
  color?: string;
};

export const TimingControls: React.FC<TimingControlsProps> = ({
  duration,
  title = 'Timing Configuration',
  color = '#58c4ff',
}) => {
  const sliderConfigs: SliderConfig[] = useMemo(
    () => [
      {
        id: 'duration',
        label: 'Duration',
        value: duration,
        min: 100,
        max: 3000,
        step: 50,
        unit: 'ms',
        color,
      },
    ],
    [duration, color],
  );

  const controlItems = useMemo(
    () => createSliderControls(sliderConfigs),
    [sliderConfigs],
  );

  return <Controls title={title} items={controlItems} />;
};
