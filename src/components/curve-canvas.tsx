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

import { useUnistyles } from '../theme';

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

const TimingConfig = {
  duration: 200,
  easing: Easing.linear,
};

const SpringConfig = {
  mass: 0.1,
  stiffness: 17,
  damping: 5,
};

const useCanvasDimensions = () => {
  const { theme } = useStyles();
  const { width: windowWidth } = useWindowDimensions();

  const canvasWidth = Math.min(
    windowWidth - theme.spacing.lg * 2,
    theme.dimensions.canvas.maxWidth,
  );

  return {
    canvasWidth,
    canvasHeight: canvasWidth / theme.dimensions.canvas.aspectRatio,
  };
};

export const CurveCanvas = ({
  springParams,
  bezierParams,
}: CurveCanvasProps) => {
  const { theme } = useStyles();
  const { isDark } = useUnistyles();

  // Calculate responsive dimensions
  const { canvasWidth, canvasHeight } = useCanvasDimensions();

  const bezierProgress = useSharedValue(0);
  const springProgress = useSharedValue(0);
  const isHovered = useSharedValue(0);
  const isHoveredTiming = useSharedValue(0);

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
      isHoveredTiming.value = withTiming(1, TimingConfig);
      isHovered.value = withSpring(1, SpringConfig);
    })
    .onEnd(() => {
      isHoveredTiming.value = withTiming(0, TimingConfig);
      isHovered.value = withSpring(0, SpringConfig);
    });

  const composedGesture = Gesture.Simultaneous(tapGesture, hoverGesture);

  const basePrimary = 'rgba(255,255,255,0.0)';
  const baseSecondary = 'rgba(255,255,255,0.03)';

  const baseBorder = theme.colors.border.primary;
  const baseBorderSecondary = Color(baseBorder)
    [isDark ? 'lighten' : 'darken'](0.5)
    .toString();

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isHoveredTiming.value,
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
        isHoveredTiming.value,
        [0, 1],
        [baseBorder, baseBorderSecondary],
      ),
    };
  });

  const rCanvasStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [{ scale: interpolate(isHovered.value, [0, 1], [1, 0.95]) }],
    };
  });
  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[
          animatedStyle,
          {
            cursor: 'pointer',
          },
        ]}>
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
