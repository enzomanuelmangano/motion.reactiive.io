import type { SkPath } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { interpolate, useDerivedValue } from 'react-native-reanimated';

import { createPathGeometry } from './geometry';

type Point = {
  x: number;
  y: number;
};

const getPathPoints = (path: SkPath): Point[] => {
  'worklet';
  const points: Point[] = [];

  const geometry = createPathGeometry(path);
  const totalLength = geometry.getTotalLength();

  // If path has no length, return a default point to prevent crashes
  if (totalLength <= 0) {
    return [{ x: 0, y: 0 }];
  }

  for (let i = 0; i < totalLength; i++) {
    const point = geometry.getPointAtLength(i);
    points.push({ x: point.x, y: point.y });
  }
  return points;
};

export const useAnimateThroughPath = ({
  path,
  progress,
}: {
  path: SharedValue<SkPath>;
  progress: SharedValue<number>;
}) => {
  const points = useDerivedValue(() => {
    'worklet';
    return getPathPoints(path.value);
  }, [path]);

  const cx = useDerivedValue(() => {
    if (points.value.length <= 1) return 0;
    const inputRange = points.value.map(
      (_, index) => index / points.value.length,
    );
    const pointsX = points.value.map(point => point.x);
    return interpolate(progress.value, inputRange, pointsX);
  }, [points]);

  const cy = useDerivedValue(() => {
    if (points.value.length <= 1) return 0;
    const inputRange = points.value.map(
      (_, index) => index / points.value.length,
    );
    const pointsY = points.value.map(point => point.y);
    return interpolate(progress.value, inputRange, pointsY);
  }, [points]);

  return { cx, cy };
};
