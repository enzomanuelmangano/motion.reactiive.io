import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { SpringSlider } from './spring-slider';
import type { ControlItem } from './controls';

export type SliderConfig = {
  id: string;
  label: string;
  value: SharedValue<number>;
  min: number;
  max: number;
  color?: string;
};

export const createSliderControl = (config: SliderConfig): ControlItem => ({
  id: config.id,
  component: (
    <SpringSlider
      label={config.label}
      value={config.value}
      min={config.min}
      max={config.max}
      color={config.color}
    />
  ),
});

export const createSliderControls = (configs: SliderConfig[]): ControlItem[] =>
  configs.map(createSliderControl);
