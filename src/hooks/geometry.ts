import type { SkContourMeasure, SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export const createPathGeometry = (path: SkPath, resScale = 1) => {
  'worklet';
  const it = Skia.ContourMeasureIter(path, false, resScale);
  const contour: SkContourMeasure | null = it.next();
  const totalLength = contour?.length?.() ?? 0;

  const getTotalLength = () => {
    'worklet';
    return totalLength;
  };

  const getPointAtLength = (length: number) => {
    'worklet';
    if (!contour) {
      return { x: 0, y: 0 };
    }
    const [pos] = contour.getPosTan(length);
    return pos;
  };

  return {
    getTotalLength,
    getPointAtLength,
  };
};
