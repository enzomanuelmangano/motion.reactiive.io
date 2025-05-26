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
  amplitude?: number; // New prop
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
  amplitude = 1, // Default to 1x amplitude
}: SpringCurveProps) => {
  const path = useDerivedValue(() => {
    const springPath = Skia.Path.Make();
    const steps = 100;

    const m = mass.value;
    const c = damping.value;
    const k = stiffness.value;

    // Safety checks for invalid parameters
    if (m <= 0 || k <= 0 || c < 0 || width <= 0 || height <= 0) {
      // Create a simple horizontal line as fallback
      const y = height / 2;
      springPath.moveTo(horizontalPadding, y);
      springPath.lineTo(width - horizontalPadding, y);
      return springPath;
    }

    const drawableWidth = width - horizontalPadding * 2;
    const drawableHeight = height - verticalPadding * 2;

    const centerY = height / 2;

    const omega = Math.sqrt(k / m);
    const zeta = c / (2 * Math.sqrt(k * m));
    const dt = 1 / steps;

    let s1 = 0;
    let s2 = 0;

    if (zeta > 1) {
      const sqrtTerm = Math.sqrt(zeta * zeta - 1);
      s1 = -omega * (zeta - sqrtTerm);
      s2 = -omega * (zeta + sqrtTerm);
    }

    // Get initial displacement for normalization
    const initialDisplacement = (() => {
      if (zeta < 1) return 1;
      if (zeta === 1) return 1;
      // For overdamped case, the initial displacement should be 1 (starting from rest)
      // The formula (Math.exp(s1 * 0) - Math.exp(s2 * 0)) / (s1 - s2) = 0/something = 0
      // which causes division by zero later. We need the coefficient for the initial condition.
      // For overdamped: x(t) = A*exp(s1*t) + B*exp(s2*t)
      // With initial conditions x(0) = 1, x'(0) = 0:
      // A + B = 1 and A*s1 + B*s2 = 0
      // Solving: A = -s2/(s1-s2), B = s1/(s1-s2)
      // So x(0) = A + B = (-s2 + s1)/(s1-s2) = 1
      return 1;
    })();

    let prevY = 0;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;

      let displacement = 0;

      if (zeta < 1) {
        const omegaD = omega * Math.sqrt(1 - zeta * zeta);
        displacement = Math.exp(-zeta * omega * t) * Math.cos(omegaD * t);
      } else if (zeta === 1) {
        displacement = Math.exp(-omega * t) * (1 + omega * t);
      } else {
        // Overdamped case: x(t) = A*exp(s1*t) + B*exp(s2*t)
        // With initial conditions x(0) = 1, x'(0) = 0:
        // A = -s2/(s1-s2), B = s1/(s1-s2)
        const A = -s2 / (s1 - s2);
        const B = s1 / (s1 - s2);
        displacement = A * Math.exp(s1 * t) + B * Math.exp(s2 * t);
      }

      // Safety check for invalid displacement values
      if (!isFinite(displacement)) {
        displacement = 0;
      }

      const normalized = displacement / initialDisplacement;
      const scaledDisplacement = normalized * (drawableHeight / 2) * amplitude;

      const x = horizontalPadding + (i / steps) * drawableWidth;
      const y = centerY + scaledDisplacement;

      // Safety check for invalid coordinates
      if (!isFinite(x) || !isFinite(y)) {
        continue;
      }

      if (i === 0) {
        springPath.moveTo(x, y);
        prevY = y;
      } else {
        const maxDelta = drawableHeight / 5;
        const delta = y - prevY;
        const clampedY = prevY + Math.max(-maxDelta, Math.min(maxDelta, delta));

        springPath.lineTo(x, clampedY);
        prevY = clampedY;
      }
    }

    return springPath;
  }, [
    width,
    height,
    mass,
    damping,
    stiffness,
    horizontalPadding,
    verticalPadding,
    amplitude,
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
        start={0}
        end={1}
        opacity={0.5}
      />
    </Group>
  );
};
