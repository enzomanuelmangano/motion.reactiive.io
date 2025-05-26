import React, { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { Controls } from './controls';
import { createSliderControls, type SliderConfig } from './control-utils';

type BezierControlsProps = {
  x1: SharedValue<number>;
  y1: SharedValue<number>;
  x2: SharedValue<number>;
  y2: SharedValue<number>;
  duration: SharedValue<number>;
  title?: string;
  color?: string;
};

export const BezierControls: React.FC<BezierControlsProps> = ({
  x1,
  y1,
  x2,
  y2,
  duration,
  title = 'Bezier Curve Configuration',
  color = '#14adff',
}) => {
  const sliderConfigs: SliderConfig[] = useMemo(
    () => [
      {
        id: 'x1',
        label: 'Control Point 1 X',
        value: x1,
        min: 0,
        max: 1,
        step: 0.01,
        color,
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'y1',
        label: 'Control Point 1 Y',
        value: y1,
        min: 0,
        max: 1,
        step: 0.01,
        color,
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'x2',
        label: 'Control Point 2 X',
        value: x2,
        min: 0,
        max: 1,
        step: 0.01,
        color,
        formatValue: (value: number) => value.toFixed(2),
      },
      {
        id: 'y2',
        label: 'Control Point 2 Y',
        value: y2,
        min: 0,
        max: 1,
        step: 0.01,
        color,
        formatValue: (value: number) => value.toFixed(2),
      },
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
    [x1, y1, x2, y2, duration, color],
  );

  const controlItems = useMemo(
    () => createSliderControls(sliderConfigs),
    [sliderConfigs],
  );

  return <Controls title={title} items={controlItems} />;
};
