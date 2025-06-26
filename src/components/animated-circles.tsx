import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type AnimatedCirclesProps = {
  bezierProgress: SharedValue<number>;
  springProgress: SharedValue<number>;
  springActive: SharedValue<boolean>;
  bezierActive: SharedValue<boolean>;
};

export const AnimatedCircles = ({
  bezierProgress,
  springProgress,
  springActive,
  bezierActive,
}: AnimatedCirclesProps) => {
  const { styles, theme } = useStyles(styleSheet);

  const containerWidth = useSharedValue(0);
  const CIRCLE_WIDTH = 32;
  const TRACK_PADDING = 4; // left padding for the circle

  const springOpacity = useDerivedValue(() => (springActive.value ? 1 : 0.3));
  const bezierOpacity = useDerivedValue(() => (bezierActive.value ? 1 : 0.3));

  const maxTranslateX = useDerivedValue(() =>
    Math.max(0, containerWidth.value - CIRCLE_WIDTH - TRACK_PADDING * 2),
  );

  const bezierAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      bezierProgress.value,
      [0, 1],
      [theme.spacing.sm, maxTranslateX.value - theme.spacing.sm],
    );

    return {
      transform: [{ translateX }],
      opacity: bezierOpacity.value,
    };
  });

  const springAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      springProgress.value,
      [0, 1],
      [theme.spacing.sm, maxTranslateX.value - theme.spacing.sm],
    );

    return {
      transform: [{ translateX }],
      opacity: springOpacity.value,
    };
  });

  const handleLayout = (event: {
    nativeEvent: { layout: { width: number } };
  }) => {
    containerWidth.value = event.nativeEvent.layout.width;
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: theme.colors.primary.bezier },
            bezierAnimatedStyle,
          ]}
        />
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: theme.colors.primary.spring },
            springAnimatedStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styleSheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.primary,
    width: '100%',
  },
  track: {
    width: '100%',
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    left: 4,
  },
}));
