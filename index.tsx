import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';

// Initialize unistyles
import './src/theme/unistyles';

renderRootComponent(App);
