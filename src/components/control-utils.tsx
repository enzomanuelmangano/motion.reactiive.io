import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { Slider } from './slider';
import type { ControlItem } from './controls';

export type SliderConfig = {
  id: string;
  label: string;
  value: SharedValue<number>;
  min: number;
  max: number;
  color?: string;
  step?: number;
  formatValue?: (value: number) => string;
  unit?: string;
};

export const createSliderControl = (config: SliderConfig): ControlItem => ({
  id: config.id,
  component: (
    <Slider
      label={config.label}
      value={config.value}
      min={config.min}
      max={config.max}
      color={config.color}
      step={config.step}
      formatValue={config.formatValue}
      unit={config.unit}
    />
  ),
});

export const createSliderControls = (configs: SliderConfig[]): ControlItem[] =>
  configs.map(createSliderControl);
