// Core control components
export { Controls, type ControlItem } from './controls';
export { Slider } from './slider';

// Animation-specific controls
export { SpringControls } from './spring-controls';
export { BezierControls } from './bezier-controls';
export { UnifiedControls } from './unified-controls';

// Backward compatibility
export { SpringSlider } from './spring-slider';

// Control utilities
export {
  createSliderControl,
  createSliderControls,
  type SliderConfig,
} from './control-utils';
