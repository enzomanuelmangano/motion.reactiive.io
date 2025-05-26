import { Text, View, TextInput, Pressable } from 'react-native';
import { useRef, useCallback, useState, useEffect } from 'react';
import Animated, { useAnimatedStyle, runOnJS } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

import { useUnistyles } from '../theme';

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
  const { isMobile } = useUnistyles();
  const [localValue, setLocalValue] = useState(value.value);
  const [isEditing, setIsEditing] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const inputRef = useRef<TextInput>(null);

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

  const panGesture = Gesture.Pan()
    [isMobile ? 'onStart' : 'onBegin'](event => {
      runOnJS(updateValue)(event.x);
    })
    .onUpdate(event => {
      runOnJS(updateValue)(event.x);
    })
    .hitSlop({
      top: 20,
      bottom: 20,
      left: 10,
      right: 10,
    });

  const handleValuePress = () => {
    setIsEditing(true);
    setTextInputValue(localValue.toString());
    // Focus the input after a short delay to ensure it's mounted
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleInputSubmit = () => {
    const newValue = parseFloat(textInputValue);
    if (!isNaN(newValue)) {
      const clampedValue = Math.max(min, Math.min(max, newValue));
      const finalValue = snapToStep(clampedValue);
      setLocalValue(finalValue);
    }
    setIsEditing(false);
  };

  const handleInputBlur = () => {
    handleInputSubmit();
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={textInputValue}
            onChangeText={setTextInputValue}
            keyboardType="numeric"
            onBlur={handleInputBlur}
            onSubmitEditing={handleInputSubmit}
            selectTextOnFocus
            autoFocus
          />
        ) : (
          <Pressable onPress={handleValuePress}>
            <Text style={styles.value}>{formatDisplayValue(localValue)}</Text>
          </Pressable>
        )}
      </View>

      <GestureDetector gesture={panGesture}>
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
      </GestureDetector>
    </View>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    marginVertical: theme.spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
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
    minWidth: 50,
    textAlign: 'right',
  },
  gestureContainer: {
    paddingVertical: theme.spacing.md,
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
  input: {
    color: theme.colors.text.primary,
    fontSize: 13,
    fontFamily: 'monospace',
    minWidth: 50,
    maxWidth: 80,
    textAlign: 'right',
    padding: 0,
    margin: 0,
    height: 16,
    lineHeight: 16,
    outline: 'none',
  },
}));
