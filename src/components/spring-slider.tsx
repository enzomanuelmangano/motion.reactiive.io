import React from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { Slider } from './slider';

type SpringSliderProps = {
  label: string;
  value: SharedValue<number>;
  min: number;
  max: number;
  color?: string;
};

/**
 * @deprecated Use the generic Slider component instead.
 * This component is kept for backward compatibility.
 */
export const SpringSlider: React.FC<SpringSliderProps> = ({
  label,
  value,
  min,
  max,
  color = '#ffc558',
}) => {
  return (
    <Slider label={label} value={value} min={min} max={max} color={color} />
  );
};
