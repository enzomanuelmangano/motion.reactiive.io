import { Circle, Group, Path, Skia } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { useAnimateThroughPath } from '../hooks/use-animate-through-path';

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
  strokeWidth?: number;
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
  strokeWidth = 4,
}: SpringCurveProps) => {
  const path = useDerivedValue(() => {
    const springPath = Skia.Path.Make();

    // Calculate spring motion curve
    const steps = 100; // Number of points to plot

    // Add padding
    const drawableWidth = width - horizontalPadding * 2;
    const drawableHeight = height - verticalPadding * 2;

    // We'll work with normalized time from 0 to 1
    const dt = 1 / steps;

    // Start path at the left edge
    const startX = horizontalPadding;
    const startY = height / 2 + verticalPadding; // Middle of the canvas

    springPath.moveTo(startX, startY);

    let prevDisplacement = 0;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt; // Normalized time from 0 to 1

      // Calculate spring displacement at time t
      // For an underdamped system: x(t) = Ae^(-ζωt) cos(ωdt + φ)
      // where ω = sqrt(k/m) and ζ = c/(2√(km))

      const omega = Math.sqrt(stiffness.value / mass.value); // Natural frequency
      const zeta =
        damping.value / (2 * Math.sqrt(stiffness.value * mass.value)); // Damping ratio

      let displacement = 0;

      if (zeta < 1) {
        // Underdamped case (oscillation)
        const omegaD = omega * Math.sqrt(1 - zeta * zeta); // Damped frequency
        displacement = Math.exp(-zeta * omega * t) * Math.cos(omegaD * t);
      } else if (zeta === 1) {
        // Critically damped
        displacement = Math.exp(-omega * t) * (1 + omega * t);
      } else {
        // Overdamped
        const s1 = -zeta * omega + omega * Math.sqrt(zeta * zeta - 1);
        const s2 = -zeta * omega - omega * Math.sqrt(zeta * zeta - 1);
        displacement = (Math.exp(s1 * t) - Math.exp(s2 * t)) / (s1 - s2);
      }

      // Scale displacement to fit canvas
      const scaledDisplacement = displacement * (drawableHeight / 3);

      // Map to canvas coordinates
      const xPos = startX + (i / steps) * drawableWidth;
      const yPos = startY + scaledDisplacement;

      // Ensure the curve doesn't jump abruptly at the beginning
      if (i === 0) {
        springPath.moveTo(xPos, yPos);
        prevDisplacement = scaledDisplacement;
      } else {
        // Limit the change in displacement to prevent extreme jumps
        const maxDelta = drawableHeight / 10;
        const delta = scaledDisplacement - prevDisplacement;
        const clampedDelta = Math.max(-maxDelta, Math.min(maxDelta, delta));
        const clampedDisplacement = prevDisplacement + clampedDelta;

        springPath.lineTo(xPos, startY + clampedDisplacement);
        prevDisplacement = clampedDisplacement;
      }
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

  const point = useAnimateThroughPath({ path, progress });

  return (
    <Group>
      <Circle cx={point.cx} cy={point.cy} r={strokeWidth * 2} color={color} />
      <Path
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap={'round'}
        start={0}
        end={progress}
      />
      <Path
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap={'round'}
        start={0}
        end={1}
        opacity={0.5}
      />
    </Group>
  );
};
