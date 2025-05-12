import { StyleSheet, Text, View } from 'react-native';
import { useRef, useCallback, useState, useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

type SpringSliderProps = {
  label: string;
  value: SharedValue<number>;
  min: number;
  max: number;
  color?: string;
};

type GestureContext = {
  startX: number;
};

export const SpringSlider = ({
  label,
  value,
  min,
  max,
  color = '#ffc558',
}: SpringSliderProps) => {
  const trackWidthRef = useRef(0);
  const [localValue, setLocalValue] = useState(value.value);

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

  const updateValue = useCallback(
    (x: number) => {
      if (trackWidthRef.current === 0) return;
      // Ensure x is within the track bounds
      x = Math.max(0, Math.min(x, trackWidthRef.current));
      const newValue = min + (x / trackWidthRef.current) * (max - min);
      setLocalValue(Math.max(min, Math.min(max, newValue)));
    },
    [min, max],
  );

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${getPercentage(localValue)}%`,
    };
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      left: `${getPercentage(localValue)}%`,
      transform: [{ translateX: -8 }], // Half the thumb width to center it
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
        <Text style={styles.value}>{localValue.toFixed(1)}</Text>
      </View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View>
          <View
            style={styles.track}
            onLayout={({ nativeEvent }) => {
              trackWidthRef.current = nativeEvent.layout.width;
            }}>
            <Animated.View
              style={[
                styles.progress,
                { backgroundColor: color },
                progressStyle,
              ]}
            />
            <Animated.View
              style={[styles.thumb, { backgroundColor: color }, thumbStyle]}
            />
            <View style={styles.touchArea} />
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    fontSize: 14,
  },
  value: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'visible',
    position: 'relative',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    top: -6,
  },
  touchArea: {
    position: 'absolute',
    top: -20,
    bottom: -20,
    left: 0,
    right: 0,
  },
});
