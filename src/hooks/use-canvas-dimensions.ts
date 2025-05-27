import { useWindowDimensions } from 'react-native';
import { useStyles } from 'react-native-unistyles';

export const useCanvasDimensions = () => {
  const { theme } = useStyles();
  const { width: windowWidth } = useWindowDimensions();

  const canvasWidth = Math.min(
    windowWidth - theme.spacing.lg * 2,
    theme.dimensions.canvas.maxWidth,
  );

  return {
    canvasWidth,
    canvasHeight: canvasWidth / theme.dimensions.canvas.aspectRatio,
  };
};
