import { Text, View } from 'react-native';
import { useRef, useCallback, useState, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type SliderProps = {
  label: string;
  value: SharedValue<number>;
  min: number;
  max: number;
  color?: string;
  step?: number;
  formatValue?: (value: number) => string;
  unit?: string;
};

type GestureContext = {
  startX: number;
};

export const Slider = ({
  label,
  value,
  min,
  max,
  color,
  step,
  formatValue,
  unit,
}: SliderProps) => {
  const { styles, theme } = useStyles(stylesheet);
  const trackWidthRef = useRef(0);
  const [localValue, setLocalValue] = useState(value.value);

  // Use theme color as default if no color is provided
  const sliderColor = color || theme.colors.primary.spring;

  useEffect(() => {
    // Update shared value when local value changes
    value.value = localValue;
  }, [localValue, value]);

  useEffect(() => {
    // Update local value when shared value changes externally
    if (value.value !== localValue) {
      setLocalValue(value.value);
    }
  }, [value.value, localValue]);

  const getPercentage = (val: number) => ((val - min) / (max - min)) * 100;

  const snapToStep = useCallback(
    (val: number) => {
      if (!step) return val;
      return Math.round(val / step) * step;
    },
    [step],
  );

  const updateValue = useCallback(
    (x: number) => {
      if (trackWidthRef.current === 0) return;
      // Ensure x is within the track bounds
      x = Math.max(0, Math.min(x, trackWidthRef.current));
      const rawValue = min + (x / trackWidthRef.current) * (max - min);
      const clampedValue = Math.max(min, Math.min(max, rawValue));
      const finalValue = snapToStep(clampedValue);
      setLocalValue(finalValue);
    },
    [min, max, snapToStep],
  );

  const formatDisplayValue = useCallback(
    (val: number) => {
      if (formatValue) {
        return formatValue(val);
      }
      const formattedNumber =
        step && step < 1 ? val.toFixed(2) : val.toFixed(1);
      return unit ? `${formattedNumber}${unit}` : formattedNumber;
    },
    [formatValue, step, unit],
  );

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${getPercentage(localValue)}%`,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      left: `${getPercentage(localValue)}%`,
      transform: [{ translateX: -7 }], // Half the thumb width to center it
    };
  });

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (event, context) => {
      context.startX = event.x;
      runOnJS(updateValue)(event.x);
    },
    onActive: event => {
      runOnJS(updateValue)(event.x);
    },
    onEnd: () => {},
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{formatDisplayValue(localValue)}</Text>
      </View>

      <PanGestureHandler
        onGestureEvent={gestureHandler}
        hitSlop={theme.componentSpacing.hitSlop}>
        <Animated.View style={styles.gestureContainer}>
          <View
            style={styles.track}
            onLayout={({ nativeEvent }) => {
              trackWidthRef.current = nativeEvent.layout.width;
            }}>
            <Animated.View
              style={[
                styles.progress,
                { backgroundColor: sliderColor },
                progressStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.thumb,
                { backgroundColor: sliderColor },
                thumbStyle,
              ]}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    marginVertical: theme.componentSpacing.margin.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.componentSpacing.margin.sm,
  },
  label: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontWeight: '500',
  },
  value: {
    color: theme.colors.text.primary,
    fontSize: 13,
    opacity: theme.opacity.disabled,
    fontFamily: 'monospace',
  },
  gestureContainer: {
    paddingVertical: theme.componentSpacing.padding.md,
  },
  track: {
    height: theme.dimensions.slider.trackHeight,
    backgroundColor: theme.colors.background.track,
    borderRadius: theme.borderRadius.xs,
    overflow: 'visible',
    position: 'relative',
  },
  progress: {
    height: '100%',
    borderRadius: theme.borderRadius.xs,
  },
  thumb: {
    position: 'absolute',
    width: theme.dimensions.slider.thumbSize,
    height: theme.dimensions.slider.thumbSize,
    borderRadius: theme.borderRadius.lg,
    top: theme.dimensions.slider.thumbOffset,
    ...theme.shadows.small,
  },
}));
