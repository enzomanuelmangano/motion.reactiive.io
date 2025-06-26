import '@expo/metro-runtime';
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

// Initialize unistyles
import './src/theme/unistyles';

// Add smooth theme transitions for web
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    /* Smooth theme transitions */
    * {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    /* Prevent transitions during page load */
    .preload * {
      transition: none !important;
    }
    
    /* Disable transitions during React Native animations to prevent conflicts */
    .rn-* {
      transition: none !important;
    }
    
    /* Only apply transitions to stable elements */
    body, html, div:not([style*="opacity"]):not([style*="transform"]) {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
  `;
  document.head.appendChild(style);
  
  // Remove preload class after initial render
  document.documentElement.classList.add('preload');
  setTimeout(() => {
    document.documentElement.classList.remove('preload');
  }, 100);
}

LoadSkiaWeb().then(async () => {
  renderRootComponent(App);
});
