import { Path, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';

type SpringCurveProps = {
  width: number;
  height: number;
  mass: number;
  damping: number;
  stiffness: number;
  color?: string;
  horizontalPadding?: number;
  verticalPadding?: number;
};

export const SpringCurve = ({
  width,
  height,
  mass,
  damping,
  stiffness,
  color = 'white',
  horizontalPadding = 30,
  verticalPadding = 30,
}: SpringCurveProps) => {
  const path = useMemo(() => {
    const springPath = Skia.Path.Make();

    // Calculate spring motion curve
    const steps = 100;
    const dt = 0.1;

    // Add padding
    const drawableWidth = width - horizontalPadding * 2;
    const drawableHeight = height - verticalPadding * 2;

    // Initial conditions
    let x = 1.0; // Initial displacement
    let v = 0.0; // Initial velocity

    // Start path at the left edge with padding

    for (let i = 0; i < steps; i++) {
      // Spring physics: F = -kx - cv
      const force = -stiffness * x - damping * v;
      const acceleration = force / mass;

      // Update velocity and position using simple Euler integration
      v += acceleration * dt;
      x += v * dt;

      // Map to canvas coordinates with padding
      const xPos = horizontalPadding + (i / steps) * drawableWidth;
      const yPos = height / 2 + x * (drawableHeight / 3);

      if (i === 0) {
        springPath.moveTo(xPos, yPos);
      }
      springPath.lineTo(xPos, yPos);
    }

    return springPath;
  }, [
    width,
    horizontalPadding,
    height,
    verticalPadding,
    stiffness,
    damping,
    mass,
  ]);

  return path ? (
    <Path
      path={path}
      style="stroke"
      strokeWidth={4}
      color={color}
      strokeCap={'round'}
    />
  ) : null;
};
