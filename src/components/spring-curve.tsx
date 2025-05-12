import { Group, Path, Skia } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

type SpringCurveProps = {
  width: number;
  height: number;
  mass: SharedValue<number>;
  damping: SharedValue<number>;
  stiffness: SharedValue<number>;
  color?: string;
  horizontalPadding?: number;
  verticalPadding?: number;
  progress: SharedValue<number>;
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
  progress,
}: SpringCurveProps) => {
  const path = useDerivedValue(() => {
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
      const force = -stiffness.value * x - damping.value * v;
      const acceleration = force / mass.value;

      // Update velocity and position using simple Euler integration
      v += acceleration * dt;
      x += v * dt;

      // Map to canvas coordinates with padding
      const xPos = horizontalPadding + (i / steps) * drawableWidth;
      const yPos = height / 2 + x * (drawableHeight / 2);

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

  if (!path) return null;

  return (
    <Group>
      <Path
        path={path}
        style="stroke"
        strokeWidth={4}
        color={color}
        strokeCap={'round'}
        start={0}
        end={progress}
      />
      <Path
        path={path}
        style="stroke"
        strokeWidth={4}
        color={color}
        strokeCap={'round'}
        start={0}
        end={1}
        opacity={0.5}
      />
    </Group>
  );
};
