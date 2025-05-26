import { type ViewStyle, type StyleProp, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type PressableHighlightProps = {
  children: React.ReactNode;
  onPress?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  isActive?: boolean;
  minScale?: number;
  maxScale?: number;
};

const ActiveSpringConfig = {
  mass: 1.2,
  damping: 19,
  stiffness: 150,
};

export const PressableHighlight = ({
  children,
  onPress,
  contentStyle,
  style,
  activeBackgroundColor = 'rgba(255,255,255,0.03)',
  inactiveBackgroundColor = 'rgba(255,255,255,0)',
  isActive = false,
  minScale = 1,
  maxScale = 1.05,
}: PressableHighlightProps) => {
  const isHoveredProgress = useSharedValue(0);
  const isHoveredSpringProgress = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    if (isActive) {
      return {
        backgroundColor: activeBackgroundColor,
      };
    }

    return {
      backgroundColor: interpolateColor(
        isHoveredProgress.value,
        [0, 1],
        [inactiveBackgroundColor, activeBackgroundColor],
      ),
    };
  });

  const rContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            isHoveredSpringProgress.value,
            [0, 1],
            [minScale, maxScale],
          ),
        },
      ],
    };
  });

  const hover = Gesture.Hover()
    .onBegin(() => {
      isHoveredProgress.value = withTiming(1, { duration: 100 });
      isHoveredSpringProgress.value = withSpring(1, ActiveSpringConfig);
    })
    .onFinalize(() => {
      isHoveredProgress.value = withTiming(0, { duration: 100 });
      isHoveredSpringProgress.value = withSpring(0, ActiveSpringConfig);
    });

  const gesture = Gesture.Tap().onTouchesUp(() => {
    if (onPress) {
      runOnJS(onPress)();
    }
  });

  const composedGesture = Gesture.Simultaneous(hover, gesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View style={[rStyle, style]}>
        <Animated.View style={[styles.content, rContentStyle, contentStyle]}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
