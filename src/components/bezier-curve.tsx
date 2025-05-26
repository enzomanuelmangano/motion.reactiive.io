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

// Helper function to clamp a value between min and max
const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

// Helper function to ensure control points are within reasonable bounds
const constrainControlPoint = (
  value: number,
  anchor: number,
  maxDistance: number,
) => {
  return clamp(value, anchor - maxDistance, anchor + maxDistance);
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

    // Safety checks for invalid dimensions
    if (width <= 0 || height <= 0) {
      const y = height > 0 ? height / 2 : 0;
      bezierPath.moveTo(0, y);
      bezierPath.lineTo(width > 0 ? width : 100, y);
      return bezierPath;
    }

    // Calculate drawable area
    const drawableWidth = width - horizontalPadding * 2;
    const drawableHeight = height - verticalPadding * 2;

    // Define anchor points
    const startX = horizontalPadding;
    const startY = verticalPadding + drawableHeight;
    const endX = width - horizontalPadding;
    const endY = verticalPadding;

    // Calculate maximum allowed distance for control points
    // This ensures the curve stays within reasonable bounds
    const maxControlDistance = drawableWidth * 0.5;

    // Map normalized control points to actual coordinates
    // First control point is relative to start point
    const cp1x = constrainControlPoint(
      startX + x1.value * drawableWidth,
      startX,
      maxControlDistance,
    );
    const cp1y = constrainControlPoint(
      startY - y1.value * drawableHeight,
      startY,
      maxControlDistance,
    );

    // Second control point is relative to end point
    const cp2x = constrainControlPoint(
      endX - (1 - x2.value) * drawableWidth,
      endX,
      maxControlDistance,
    );
    const cp2y = constrainControlPoint(
      endY + (1 - y2.value) * drawableHeight,
      endY,
      maxControlDistance,
    );

    // Safety check for invalid coordinates
    const coords = [startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY];
    if (coords.some(coord => !isFinite(coord))) {
      const y = height / 2;
      bezierPath.moveTo(horizontalPadding, y);
      bezierPath.lineTo(width - horizontalPadding, y);
      return bezierPath;
    }

    // Create cubic Bezier curve with constrained control points
    bezierPath.moveTo(startX, startY);
    bezierPath.cubicTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

    return bezierPath;
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
