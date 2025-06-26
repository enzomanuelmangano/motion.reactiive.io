import Touchable from 'react-native-skia-gesture';
import { StyleSheet } from 'react-native';
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
  useDerivedValue,
} from 'react-native-reanimated';
import { useStyles } from 'react-native-unistyles';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Color from 'color';
import { memo, useCallback } from 'react';
import { Group } from '@shopify/react-native-skia';

import { useUnistyles } from '../theme';
import { useCanvasDimensions } from '../hooks/use-canvas-dimensions';

import { SpringCurve } from './spring-curve';
import { BezierCurve } from './bezier-curve';

type CurveCanvasProps = {
  springActive: SharedValue<boolean>;
  bezierActive: SharedValue<boolean>;
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
  bezierProgress: SharedValue<number>;
  springProgress: SharedValue<number>;
};

const TimingConfig = {
  duration: 150,
  easing: Easing.linear,
};

const SpringConfig = {
  mass: 0.1,
  stiffness: 30,
  damping: 5,
};

// Colors will be dynamically set based on theme

export const CurveCanvas = memo(
  ({
    springParams,
    bezierParams,
    springActive,
    bezierActive,
    bezierProgress,
    springProgress,
  }: CurveCanvasProps) => {
    const { theme } = useStyles();
    const { isDark } = useUnistyles();

    // Calculate responsive dimensions
    const { canvasWidth, canvasHeight } = useCanvasDimensions();

    const isHovered = useSharedValue(0);
    const isHoveredTiming = useSharedValue(0);

    const startAnimation = useCallback(() => {
      'worklet';
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
    }, [bezierParams, springParams, bezierProgress, springProgress]);

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

    const basePrimary = theme.colors.background.secondary;
    const baseSecondary = Color(theme.colors.background.secondary)
      .lighten(0.1)
      .toString();

    const baseBorder = theme.colors.border.primary;
    const baseBorderSecondary = Color(baseBorder)
      [isDark ? 'lighten' : 'darken'](isDark ? 0.5 : 0.05)
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
        borderRadius: theme.borderRadius.xl,
        borderWidth: theme.strokeWidths.thin,
        borderColor: interpolateColor(
          isHoveredTiming.value,
          [0, 1],
          [baseBorder, baseBorderSecondary],
        ),
      };
    });

    const rSpringShow = useDerivedValue(
      () => withTiming(springActive.get() ? 1 : 0, TimingConfig),
      [springActive],
    );

    const rBezierShow = useDerivedValue(
      () => withTiming(bezierActive.get() ? 1 : 0, TimingConfig),
      [bezierActive],
    );

    return (
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[
            animatedStyle,
            {
              cursor: 'pointer',
            },
          ]}>
          <Animated.View style={styles.fill}>
            <Touchable.Canvas style={styles.fill}>
              <Group opacity={rBezierShow}>
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
                  onControlPointChange={(controlPoint, x, y) => {
                    'worklet';
                    // Convert pixel coordinates back to normalized values (0-1)
                    if (controlPoint === 'first') {
                      bezierParams.x1.value = x;
                      bezierParams.y1.value = y;
                    } else {
                      bezierParams.x2.value = x;
                      bezierParams.y2.value = y;
                    }
                  }}
                />
              </Group>

              <Group opacity={rSpringShow}>
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
              </Group>
            </Touchable.Canvas>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
