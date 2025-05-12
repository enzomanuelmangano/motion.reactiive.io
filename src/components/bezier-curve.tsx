import { Path, Skia, Group, Circle } from '@shopify/react-native-skia';
import React from 'react';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { useAnimateThroughPath } from '../hooks/use-animate-through-path';

type BezierCurveProps = {
  width: number;
  height: number;
  x1: SharedValue<number>; // First control point x (normalized 0-1)
  y1: SharedValue<number>; // First control point y (normalized 0-1)
  x2: SharedValue<number>; // Second control point x (normalized 0-1)
  y2: SharedValue<number>; // Second control point y (normalized 0-1)
  color?: string;
  strokeWidth?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
  progress: SharedValue<number>;
};

export const BezierCurve = ({
  width,
  height,
  x1,
  y1,
  x2,
  y2,
  color = 'white',
  strokeWidth = 4,
  horizontalPadding = 30,
  verticalPadding = 30,
  progress,
}: BezierCurveProps) => {
  const path = useDerivedValue(() => {
    const bezierPath = Skia.Path.Make();

    // Add padding
    const drawableWidth = width - horizontalPadding * 2;
    const drawableHeight = height - verticalPadding * 2;

    // Start point (left edge with padding)
    const startX = horizontalPadding;
    const startY = verticalPadding + drawableHeight;

    // End point (right edge with padding)
    const endX = width - horizontalPadding;
    const endY = verticalPadding;

    // Control points (normalized coordinates to actual canvas coordinates)
    const cp1x = x1.value * drawableWidth;
    const cp1y = verticalPadding + y1.value * drawableHeight;

    const cp2x = horizontalPadding + x2.value * drawableWidth;
    const cp2y = verticalPadding + y2.value * drawableHeight;

    // Create cubic Bezier curve
    bezierPath.moveTo(startX, startY);
    bezierPath.cubicTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

    return bezierPath!;
  }, [width, height, x1, y1, x2, y2, horizontalPadding, verticalPadding]);

  const point = useAnimateThroughPath({ path, progress });

  return (
    <Group>
      <Circle cx={point.cx} cy={point.cy} r={strokeWidth * 2} color={color} />
      <Path
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap="round"
        start={0}
        end={progress}
      />
      <Path
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap="round"
        opacity={0.5}
      />
    </Group>
  );
};
