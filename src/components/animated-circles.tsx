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
  const TRACK_PADDING = 8; // left padding for the circle

  const springOpacity = useDerivedValue(() => (springActive.value ? 1 : 0.3));
  const bezierOpacity = useDerivedValue(() => (bezierActive.value ? 1 : 0.3));

  const maxTranslateX = useDerivedValue(() =>
    Math.max(0, containerWidth.value - CIRCLE_WIDTH - TRACK_PADDING * 2),
  );

  const bezierAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      bezierProgress.value,
      [0, 1],
      [theme.spacing.lg, maxTranslateX.value - theme.spacing.lg],
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
      [theme.spacing.lg, maxTranslateX.value - theme.spacing.lg],
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
        <View style={styles.groundLine} />
        <Animated.View
          style={[
            styles.circle,
            { backgroundColor: theme.colors.primary.bezier },
            bezierAnimatedStyle,
          ]}
        />
      </View>
      <View style={styles.track}>
        <View style={styles.groundLine} />
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
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.primary,
    backgroundColor: theme.colors.background.secondary,
    width: '100%',
  },
  track: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    position: 'relative',
  },
  groundLine: {
    position: 'absolute',
    bottom: 7,
    left: theme.spacing.md,
    right: theme.spacing.md,
    height: 1,
    backgroundColor: theme.colors.border.primary,
    borderRadius: 0.5,
    ...theme.shadows.small,
    shadowOpacity: 0.1,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    left: 8,
    bottom: 8, // Position circle just above the ground line
    ...theme.shadows.small,
    shadowOpacity: 0.2,
  },
}));
