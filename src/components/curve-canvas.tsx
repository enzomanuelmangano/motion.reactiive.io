import { Canvas } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';

import { SpringCurve } from './spring-curve';
import { BezierCurve } from './bezier-curve';

export const CurveCanvas = () => {
  const { width } = useWindowDimensions();
  const canvasWidth = width * 0.9;
  const canvasHeight = (canvasWidth / 4) * 3;

  return (
    <Canvas
      style={{
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: 'black',
      }}>
      <SpringCurve
        width={canvasWidth}
        height={canvasHeight}
        mass={1}
        damping={1}
        stiffness={1}
        horizontalPadding={30}
        verticalPadding={30}
        color="#ffc558"
      />
      <BezierCurve
        width={canvasWidth}
        height={canvasHeight}
        x1={0.5}
        y1={0}
        x2={0.5}
        y2={1}
        color="#58c4ff"
        strokeWidth={4}
        showControlPoints={false}
      />
    </Canvas>
  );
};
