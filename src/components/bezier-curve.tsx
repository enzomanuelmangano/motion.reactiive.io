import { Path, Skia, Circle, Line, Group } from '@shopify/react-native-skia';
import { useMemo } from 'react';

type BezierCurveProps = {
  width: number;
  height: number;
  x1: number; // First control point x (normalized 0-1)
  y1: number; // First control point y (normalized 0-1)
  x2: number; // Second control point x (normalized 0-1)
  y2: number; // Second control point y (normalized 0-1)
  color?: string;
  strokeWidth?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
  showControlPoints?: boolean;
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
  showControlPoints = false,
}: BezierCurveProps) => {
  const { path, startPoint, endPoint, controlPoint1, controlPoint2 } =
    useMemo(() => {
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
      const cp1x = x1 * drawableWidth;
      const cp1y = verticalPadding + y1 * drawableHeight;

      const cp2x = horizontalPadding + x2 * drawableWidth;
      const cp2y = verticalPadding + y2 * drawableHeight;

      // Create cubic Bezier curve
      bezierPath.moveTo(startX, startY);
      bezierPath.cubicTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

      return {
        path: bezierPath,
        startPoint: { x: startX, y: startY },
        endPoint: { x: endX, y: endY },
        controlPoint1: { x: cp1x, y: cp1y },
        controlPoint2: { x: cp2x, y: cp2y },
      };
    }, [width, height, x1, y1, x2, y2, horizontalPadding, verticalPadding]);

  if (!path) return null;

  return (
    <Group>
      <Path
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap="round"
      />

      {showControlPoints && (
        <>
          {/* Control point 1 */}
          <Circle cx={controlPoint1.x} cy={controlPoint1.y} r={6} color="red" />
          <Line
            p1={{ x: startPoint.x, y: startPoint.y }}
            p2={{ x: controlPoint1.x, y: controlPoint1.y }}
            color="rgba(255,0,0,0.5)"
            style="stroke"
            strokeWidth={1}
          />

          {/* Control point 2 */}
          <Circle
            cx={controlPoint2.x}
            cy={controlPoint2.y}
            r={6}
            color="green"
          />
          <Line
            p1={{ x: endPoint.x, y: endPoint.y }}
            p2={{ x: controlPoint2.x, y: controlPoint2.y }}
            color="rgba(0,255,0,0.5)"
            style="stroke"
            strokeWidth={1}
          />

          {/* Start and end points */}
          <Circle cx={startPoint.x} cy={startPoint.y} r={4} color="white" />
          <Circle cx={endPoint.x} cy={endPoint.y} r={4} color="white" />
        </>
      )}
    </Group>
  );
};
