import type { SkContourMeasure, SkPath } from '@shopify/react-native-skia';
import { Skia } from '@shopify/react-native-skia';

export const createPathGeometry = (path: SkPath, resScale = 1) => {
  'worklet';
  const it = Skia.ContourMeasureIter(path, false, resScale);
  const contour: SkContourMeasure = it.next()!;
  const totalLength = contour.length();

  const getTotalLength = () => {
    'worklet';
    return totalLength;
  };

  const getPointAtLength = (length: number) => {
    'worklet';
    const [pos] = contour.getPosTan(length);
    return pos;
  };

  return {
    getTotalLength,
    getPointAtLength,
  };
};
