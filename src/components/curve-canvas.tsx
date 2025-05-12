import { Canvas } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';

import { SpringCurve } from './spring-curve';

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
        damping={0.3}
        stiffness={0.8}
        color="#ffc558"
      />
    </Canvas>
  );
};
