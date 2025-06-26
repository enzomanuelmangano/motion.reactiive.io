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
    const steps = 50; // Reduced from 100 to 50 for better performance

    const m = mass.value;
    const c = damping.value;
    const k = stiffness.value;

    // Safety checks for invalid parameters
    if (m <= 0 || k <= 0 || c < 0 || width <= 0 || height <= 0) {
      const y = verticalPadding + (height - verticalPadding * 2);
      springPath.moveTo(horizontalPadding, y);
      springPath.lineTo(width - horizontalPadding, y);
      return springPath;
    }

    const drawableWidth = width - horizontalPadding * 2;
    const drawableHeight = height - verticalPadding * 2;

    // Define anchor points to match Bezier curve
    const startX = horizontalPadding;
    const startY = verticalPadding;

    const omega = Math.sqrt(k / m);
    const zeta = c / (2 * Math.sqrt(k * m));
    const dt = 1 / steps;

    // Precompute constants to avoid repeated calculations
    const zetaOmega = zeta * omega;
    const oneMinusZetaSquared = 1 - zeta * zeta;

    let s1 = 0;
    let s2 = 0;
    let omegaD = 0;
    let sinTermCoefficient = 0;

    if (zeta < 1) {
      omegaD = omega * Math.sqrt(oneMinusZetaSquared);
      if (omegaD > 0) {
        sinTermCoefficient = zetaOmega / omegaD;
      }
    } else if (zeta > 1) {
      const sqrtTerm = Math.sqrt(zeta * zeta - 1);
      s1 = -omega * (zeta - sqrtTerm);
      s2 = -omega * (zeta + sqrtTerm);
    }

    // Get initial displacement for normalization
    const initialDisplacement = (() => {
      if (zeta < 1) return 1;
      if (zeta === 1) return 1;
      return 1;
    })();

    let prevY = startY;

    for (let i = 0; i <= steps; i++) {
      const t = i * dt;

      let displacement = 0;

      if (zeta < 1) {
        // Use precomputed values to avoid repeated calculations
        if (omegaD > 0) {
          const expTerm = Math.exp(-zetaOmega * t);
          displacement =
            expTerm *
            (Math.cos(omegaD * t) + sinTermCoefficient * Math.sin(omegaD * t));
        } else {
          // Fallback for extremely rare case where omegaD might be non-positive due to precision with zeta very near 1.
          // Treat as critically damped if omegaD is not positive.
          displacement = Math.exp(-omega * t) * (1 + omega * t);
        }
      } else if (zeta === 1) {
        displacement = Math.exp(-omega * t) * (1 + omega * t);
      } else {
        const A = -s2 / (s1 - s2);
        const B = s1 / (s1 - s2);
        displacement = A * Math.exp(s1 * t) + B * Math.exp(s2 * t);
      }

      // Safety check for invalid displacement values
      if (!isFinite(displacement)) {
        displacement = 0;
      }

      const normalized = displacement / initialDisplacement;
      // Scale displacement to match Bezier curve's height
      const scaledDisplacement = normalized * drawableHeight;

      const x = startX + (i / steps) * drawableWidth;
      // Map displacement to match Bezier curve's coordinate system
      const y = startY + scaledDisplacement;

      // Safety check for invalid coordinates
      if (!isFinite(x) || !isFinite(y)) {
        continue;
      }

      if (i === 0) {
        springPath.moveTo(x, y);
        prevY = y;
      } else {
        // Limit the maximum change in y to prevent extreme oscillations
        const maxDelta = drawableHeight * 0.2; // 20% of drawable height
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
  ]);

  const point = useAnimateThroughPath({ path, progress });

  return (
    <Group>
      <Circle cx={point.cx} cy={point.cy} r={strokeWidth * 2} color={color} style="fill" />
      {/* Background path with reduced opacity */}
      <Path
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap="round"
        opacity={0.3}
      />
      {/* Animated progress path */}
      <Path
        path={path}
        style="stroke"
        strokeWidth={strokeWidth}
        color={color}
        strokeCap="round"
        start={0}
        end={progress}
      />
    </Group>
  );
};
