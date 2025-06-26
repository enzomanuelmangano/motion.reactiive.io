import { View, Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
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

  const springOpacity = useDerivedValue(() => (springActive.value ? 1 : 0.3));
  const bezierOpacity = useDerivedValue(() => (bezierActive.value ? 1 : 0.3));

  const bezierAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      bezierProgress.value,
      [0, 1],
      [0, 200 - 32], // track width - circle width
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
      [0, 200 - 32], // track width - circle width
    );

    return {
      transform: [{ translateX }],
      opacity: springOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Timing</Text>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.circle,
              { backgroundColor: theme.colors.primary.bezier },
              bezierAnimatedStyle,
            ]}
          />
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Spring</Text>
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
    </View>
  );
};

const styleSheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.xl,
    borderWidth: theme.strokeWidths.thin,
    borderColor: theme.colors.border.primary,
    alignSelf: 'center',
    width: '100%',
    maxWidth: theme.dimensions.canvas.maxWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    width: 60,
  },
  track: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.background.track,
    borderRadius: 20,
    justifyContent: 'center',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    left: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
}));
