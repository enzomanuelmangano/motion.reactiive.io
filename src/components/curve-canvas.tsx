import { Canvas } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SpringCurve } from './spring-curve';
import { BezierCurve } from './bezier-curve';

type CurveCanvasProps = {
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

export const CurveCanvas = ({
  springParams,
  bezierParams,
}: CurveCanvasProps) => {
  const { width } = useWindowDimensions();
  const canvasWidth = width * 0.9;
  const canvasHeight = (canvasWidth / 4) * 3;

  const bezierProgress = useSharedValue(0);

  useAnimatedReaction(
    () => bezierParams.duration.value,
    duration => {
      cancelAnimation(bezierProgress);
      bezierProgress.value = withTiming(1, {
        duration,
        easing: Easing.bezier(
          bezierParams.x1.value,
          bezierParams.y1.value,
          bezierParams.x2.value,
          bezierParams.y2.value,
        ),
      });
    },
  );

  const springProgress = useSharedValue(0);
  useAnimatedReaction(
    () => springParams.mass.value,
    () => {
      cancelAnimation(springProgress);
      springProgress.value = withSpring(1, {
        mass: springParams.mass.value,
        damping: springParams.damping.value,
        stiffness: springParams.stiffness.value,
      });
    },
  );

  return (
    <Canvas
      style={{
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#0c0c0c',
        borderRadius: 10,
      }}>
      <BezierCurve
        progress={bezierProgress}
        width={canvasWidth}
        height={canvasHeight}
        x1={bezierParams.x1}
        y1={bezierParams.y1}
        x2={bezierParams.x2}
        y2={bezierParams.y2}
        color="#14adff"
        strokeWidth={4}
        horizontalPadding={30}
        verticalPadding={30}
      />
      <SpringCurve
        progress={springProgress}
        width={canvasWidth}
        height={canvasHeight}
        mass={springParams.mass}
        damping={springParams.damping}
        stiffness={springParams.stiffness}
        horizontalPadding={30}
        verticalPadding={30}
        color="#ffc558"
      />
    </Canvas>
  );
};
