import { Canvas } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Color from 'color';

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
  const { theme } = useStyles();
  const { width } = useWindowDimensions();
  const canvasWidth = Math.min(width * 0.95, theme.dimensions.canvas.maxWidth);
  const canvasHeight = Math.min(
    (canvasWidth / 4) * 3,
    theme.dimensions.canvas.maxHeight,
  );

  const bezierProgress = useSharedValue(0);
  const springProgress = useSharedValue(0);
  const isHovered = useSharedValue(0);

  const startAnimation = () => {
    cancelAnimation(bezierProgress);
    bezierProgress.value = 0;
    bezierProgress.value = withTiming(1, {
      duration: bezierParams.duration.value,
      easing: Easing.bezier(
        bezierParams.x1.value,
        bezierParams.y1.value,
        bezierParams.x2.value,
        bezierParams.y2.value,
      ),
    });

    cancelAnimation(springProgress);
    springProgress.value = 0;
    springProgress.value = withSpring(1, {
      mass: springParams.mass.value,
      damping: springParams.damping.value,
      stiffness: springParams.stiffness.value,
    });
  };

  useAnimatedReaction(
    () => {
      return {
        bezier: bezierParams,
        spring: springParams,
      };
    },
    () => {
      startAnimation();
    },
  );

  const tapGesture = Gesture.Tap().onEnd(() => {
    startAnimation();
  });

  const hoverGesture = Gesture.Hover()
    .onBegin(() => {
      isHovered.value = withSpring(1, {
        mass: 0.5,
      });
    })
    .onEnd(() => {
      isHovered.value = withSpring(0);
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, hoverGesture);

  const basePrimary = 'rgba(255,255,255,0.0)';
  const baseSecondary = 'rgba(255,255,255,0.03)';

  const baseBorder = theme.colors.border.primary;
  const baseBorderSecondary = Color(baseBorder).lighten(1).toString();

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isHovered.value,
      [0, 1],
      [basePrimary, baseSecondary],
    );

    return {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor,
      borderRadius: 12,
      borderWidth: theme.strokeWidths.thin,
      borderColor: interpolateColor(
        isHovered.value,
        [0, 1],
        [baseBorder, baseBorderSecondary],
      ),
    };
  });

  const rCanvasStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [{ scale: interpolate(isHovered.value, [0, 1], [1, 0.98]) }],
    };
  });
  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={animatedStyle}>
        <Animated.View style={rCanvasStyle}>
          <Canvas style={{ flex: 1 }}>
            <BezierCurve
              progress={bezierProgress}
              width={canvasWidth}
              height={canvasHeight}
              x1={bezierParams.x1}
              y1={bezierParams.y1}
              x2={bezierParams.x2}
              y2={bezierParams.y2}
              color={theme.colors.primary.bezier}
              strokeWidth={theme.strokeWidths.medium}
              horizontalPadding={theme.spacing.xxl}
              verticalPadding={theme.spacing.xxl}
            />
            <SpringCurve
              progress={springProgress}
              width={canvasWidth}
              height={canvasHeight}
              mass={springParams.mass}
              damping={springParams.damping}
              stiffness={springParams.stiffness}
              horizontalPadding={theme.spacing.xxl}
              verticalPadding={theme.spacing.xxl}
              color={theme.colors.primary.spring}
              strokeWidth={theme.strokeWidths.medium}
            />
          </Canvas>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};
