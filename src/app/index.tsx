import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { ActivityIndicator, View } from 'react-native';

// eslint-disable-next-line import/no-default-export
export default function Index() {
  return (
    <WithSkiaWeb
      getComponent={async () => {
        return require('../index');
      }}
      fallback={
        <View>
          <ActivityIndicator size="large" color="white" />
        </View>
      }
    />
  );
}
