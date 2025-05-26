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
  const canvasWidth = Math.min(width * 0.95, 400);
  const canvasHeight = Math.min((canvasWidth / 4) * 3, 280);

  const bezierProgress = useSharedValue(0);
  const springProgress = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return {
        bezier: bezierParams,
        spring: springParams,
      };
    },
    ({ bezier, spring }) => {
      cancelAnimation(bezierProgress);
      bezierProgress.value = 0;
      bezierProgress.value = withTiming(1, {
        duration: bezier.duration.value,
        easing: Easing.bezier(
          bezier.x1.value,
          bezier.y1.value,
          bezier.x2.value,
          bezier.y2.value,
        ),
      });

      cancelAnimation(springProgress);
      springProgress.value = 0;
      springProgress.value = withSpring(1, {
        mass: spring.mass.value,
        damping: spring.damping.value,
        stiffness: spring.stiffness.value,
      });
    },
  );

  return (
    <Canvas
      style={{
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: '#0a0a0a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#202020ff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
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
        strokeWidth={2}
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
        strokeWidth={2}
      />
    </Canvas>
  );
};
