import { Path, Skia, Group, Circle, Line } from '@shopify/react-native-skia';
import React, { useCallback, useMemo } from 'react';
import {
  clamp,
  useDerivedValue,
  type SharedValue,
} from 'react-native-reanimated';
import Touchable from 'react-native-skia-gesture';

import { useAnimateThroughPath } from '../hooks/use-animate-through-path';
import { useConstCallback } from '../hooks/use-const-callback';

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
  onControlPointChange?: (
    controlPoint: 'first' | 'second',
    x: number,
    y: number,
  ) => void;
};

type TouchableControlPointProps = {
  cx: SharedValue<number>;
  cy: SharedValue<number>;
  r: number;
  color: string;
  controlPoint: 'first' | 'second';
  onUpdateControlPoint: (
    controlPoint: 'first' | 'second',
    x: number,
    y: number,
  ) => void;
};

const TouchableControlPoint = React.memo<TouchableControlPointProps>(
  ({ cx, cy, r, color, controlPoint, onUpdateControlPoint }) => {
    return (
      <Touchable.Circle
        cx={cx}
        cy={cy}
        r={r}
        color={color}
        opacity={0}
        onStart={touchInfo => {
          'worklet';
          onUpdateControlPoint(controlPoint, touchInfo.x, touchInfo.y);
        }}
        onActive={touchInfo => {
          'worklet';
          onUpdateControlPoint(controlPoint, touchInfo.x, touchInfo.y);
        }}
      />
    );
  },
);

TouchableControlPoint.displayName = 'TouchableControlPoint';

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
  onControlPointChange,
}: BezierCurveProps) => {
  const { drawableWidth, drawableHeight, startX, startY, endX, endY } =
    useMemo(() => {
      const _drawableWidth = width - horizontalPadding * 2;
      const _drawableHeight = height - verticalPadding * 2;

      // Define anchor points
      const _startX = horizontalPadding;
      const _startY = verticalPadding + _drawableHeight;
      const _endX = width - horizontalPadding;
      const _endY = verticalPadding;

      const _maxControlDistance = _drawableWidth * 0.5;

      return {
        drawableWidth: _drawableWidth,
        drawableHeight: _drawableHeight,
        startX: _startX,
        startY: _startY,
        endX: _endX,
        endY: _endY,
        maxControlDistance: _maxControlDistance,
      };
    }, [width, height, horizontalPadding, verticalPadding]);

  const cp1x = useDerivedValue(() => {
    return startX + x1.value * drawableWidth;
  }, [startX, x1, drawableWidth]);

  const cp1y = useDerivedValue(() => {
    return startY - y1.value * drawableHeight;
  }, [startY, y1, drawableHeight]);

  const cp2x = useDerivedValue(() => {
    return endX - (1 - x2.value) * drawableWidth;
  }, [endX, x2, drawableWidth]);

  const cp2y = useDerivedValue(() => {
    return endY + (1 - y2.value) * drawableHeight;
  }, [endY, y2, drawableHeight]);

  const firstControlPoint = useDerivedValue(() => {
    return {
      x: cp1x.value,
      y: cp1y.value,
    };
  }, [cp1x, cp1y]);

  const secondControlPoint = useDerivedValue(() => {
    return {
      x: cp2x.value,
      y: cp2y.value,
    };
  }, [cp2x, cp2y]);

  const path = useDerivedValue(() => {
    const bezierPath = Skia.Path.Make();

    // Safety checks for invalid dimensions
    if (width <= 0 || height <= 0) {
      const y = height > 0 ? height / 2 : 0;
      bezierPath.moveTo(0, y);
      bezierPath.lineTo(width > 0 ? width : 100, y);
      return bezierPath;
    }

    // Safety check for invalid coordinates
    const coords = [
      startX,
      startY,
      cp1x.value,
      cp1y.value,
      cp2x.value,
      cp2y.value,
      endX,
      endY,
    ];

    if (coords.some(coord => !isFinite(coord))) {
      const y = height / 2;
      bezierPath.moveTo(horizontalPadding, y);
      bezierPath.lineTo(width - horizontalPadding, y);
      return bezierPath;
    }

    // Create cubic Bezier curve with constrained control points
    bezierPath.moveTo(startX, startY);
    bezierPath.cubicTo(
      cp1x.value,
      cp1y.value,
      cp2x.value,
      cp2y.value,
      endX,
      endY,
    );

    return bezierPath;
  }, [width, height, x1, y1, x2, y2, horizontalPadding, verticalPadding]);

  const animateThroughPathParams = useMemo(() => {
    return {
      path,
      progress,
    };
  }, [path, progress]);

  const point = useAnimateThroughPath(animateThroughPathParams);

  const onUpdateControlPoint = useCallback(
    (controlPoint: 'first' | 'second', x: number, y: number) => {
      'worklet';
      // Remap from absolute coordinates to normalized 0-1 range
      const _x = clamp((x - horizontalPadding) / drawableWidth, 0, 1);
      const _y = clamp((startY - y) / drawableHeight, 0, 1);

      // Update the original SharedValues, not the derived ones
      if (controlPoint === 'first') {
        x1.value = _x;
        y1.value = _y;
      } else {
        x2.value = _x;
        y2.value = _y;
      }

      // Also call the callback if provided
      onControlPointChange?.(controlPoint, _x, _y);
    },
    [
      drawableWidth,
      drawableHeight,
      horizontalPadding,
      startY,
      x1,
      y1,
      x2,
      y2,
      onControlPointChange,
    ],
  );

  const onUpdateControlPointConst = useConstCallback(onUpdateControlPoint);

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
      <Line
        p1={{ x: startX, y: startY }}
        p2={firstControlPoint}
        color={color}
        strokeWidth={strokeWidth}
        style="stroke"
        opacity={0.2}
      />
      <Line
        p1={{ x: endX, y: endY }}
        p2={secondControlPoint}
        color={color}
        strokeWidth={strokeWidth}
        style="stroke"
        opacity={0.2}
      />
      <Circle
        cx={cp1x}
        cy={cp1y}
        r={strokeWidth * 2}
        color={color}
        opacity={0.35}
      />
      <Circle
        cx={cp2x}
        cy={cp2y}
        r={strokeWidth * 2}
        color={color}
        opacity={0.35}
      />
      {/*
       * The Touchable Circles are invisible (opacity 0) but remain interactive,
       * providing larger hit areas for dragging the control points
       */}
      <TouchableControlPoint
        cx={cp1x}
        cy={cp1y}
        r={strokeWidth * 6}
        color={color}
        controlPoint="first"
        onUpdateControlPoint={onUpdateControlPointConst}
      />
      <TouchableControlPoint
        cx={cp2x}
        cy={cp2y}
        r={strokeWidth * 6}
        color={color}
        controlPoint="second"
        onUpdateControlPoint={onUpdateControlPointConst}
      />
    </Group>
  );
};
