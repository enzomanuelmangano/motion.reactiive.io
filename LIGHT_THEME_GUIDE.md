# Light Theme Support Guide

Your app now supports both light and dark themes with automatic system theme detection and manual theme switching.

## ✅ What's Been Added

### 1. Light Theme Configuration
- **Light theme colors**: Complete color palette optimized for light backgrounds
- **Light theme shadows**: Softer shadows appropriate for light mode
- **Adaptive themes**: Automatically follows system theme preference
- **Manual theme switching**: Users can manually toggle between themes

### 2. Theme Structure

#### Dark Theme (Original)
```typescript
colors: {
  background: {
    primary: '#080808',    // Main app background
    secondary: '#0a0a0a',  // Canvas background
    overlay: 'rgba(17, 17, 17, 0.7)',
    surface: 'rgba(255, 255, 255, 0.05)',
  },
  text: {
    primary: '#fff',
    secondary: '#fff',
  },
  // ... other colors
}
```

#### Light Theme (New)
```typescript
colors: {
  background: {
    primary: '#ffffff',    // Main app background
    secondary: '#f8f9fa',  // Canvas background
    overlay: 'rgba(0, 0, 0, 0.05)',
    surface: 'rgba(0, 0, 0, 0.03)',
  },
  text: {
    primary: '#1a1a1a',
    secondary: '#4a4a4a',
  },
  // ... other colors
}
```

### 3. New Components

#### ThemeToggle Component
- **Location**: `src/components/theme-toggle.tsx`
- **Features**: 
  - Visual toggle button with sun/moon icons
  - Shows current theme state
  - One-tap theme switching

#### Enhanced useUnistyles Hook
- **New utilities**:
  - `isDark`: Boolean indicating if dark theme is active
  - `isLight`: Boolean indicating if light theme is active
  - `themeName`: Current theme name ('light' or 'dark')
  - `toggleTheme()`: Function to toggle between themes
  - `setTheme(name)`: Function to set specific theme

## 🎨 Theme Features

### Automatic System Theme Detection
The app automatically detects and follows the system theme preference:
- When user's device is in dark mode → app uses dark theme
- When user's device is in light mode → app uses light theme
- Changes automatically when system theme changes

### Manual Theme Override
Users can manually override the system theme:
- Theme toggle button in the top-right corner
- Persists user preference across app sessions
- Overrides system theme until manually changed again

### Optimized Color Schemes

#### Primary Colors (Consistent)
- Spring: `#ffc558` (vibrant yellow-orange)
- Bezier: `#14adff` (bright blue)
- Decay: `#ff5858` (coral red)
- Timing: `#58c4ff` (light blue)

#### Background Adaptations
- **Dark**: Deep blacks and grays for OLED-friendly display
- **Light**: Clean whites and light grays for readability

#### Text Adaptations
- **Dark**: White text for contrast on dark backgrounds
- **Light**: Dark text for contrast on light backgrounds

#### Shadow Adaptations
- **Dark**: Stronger shadows for depth on dark surfaces
- **Light**: Softer shadows to avoid harsh contrasts

## 🔧 Usage Examples

### Using the Enhanced Hook
```typescript
import { useUnistyles } from '../hooks/use-unistyles';

const MyComponent = () => {
  const { 
    theme, 
    isDark, 
    isLight, 
    toggleTheme, 
    setTheme 
  } = useUnistyles();

  return (
    <View style={{
      backgroundColor: theme.colors.background.primary,
      // Conditional styling based on theme
      borderColor: isDark ? '#333' : '#ddd',
    }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Current theme: {isDark ? 'Dark' : 'Light'}
      </Text>
      
      <TouchableOpacity onPress={toggleTheme}>
        <Text>Toggle Theme</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setTheme('light')}>
        <Text>Force Light Theme</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Creating Theme-Aware Components
```typescript
const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background.primary,
    // Colors automatically adapt to current theme
  },
  text: {
    color: theme.colors.text.primary,
    // Text color adapts automatically
  },
  card: {
    backgroundColor: theme.colors.background.surface,
    borderColor: theme.colors.border.secondary,
    ...theme.shadows.medium, // Shadows adapt to theme
  },
}));
```

## 📱 User Experience

### Theme Toggle Button
- **Location**: Top-right corner of the app
- **Visual**: Sun icon (☀️) in dark mode, Moon icon (🌙) in light mode
- **Label**: "Light Mode" in dark mode, "Dark Mode" in light mode
- **Behavior**: Instant theme switching with smooth transitions

### Status Bar
- **Adaptive**: Uses `style="auto"` to automatically adapt to theme
- **Dark theme**: Light status bar content
- **Light theme**: Dark status bar content

## 🚀 Benefits

1. **Accessibility**: Better readability in different lighting conditions
2. **User Preference**: Respects system theme and allows manual override
3. **Battery Life**: Dark theme can save battery on OLED displays
4. **Modern UX**: Follows current design trends and user expectations
5. **Consistency**: All components automatically adapt to theme changes

## 🔄 Migration Notes

### Existing Components
All migrated components automatically support both themes:
- ✅ Main App (`src/index.tsx`)
- ✅ Unified Controls (`src/components/unified-controls.tsx`)
- ✅ Curve Canvas (`src/components/curve-canvas.tsx`)
- ✅ Curve Legend (`src/components/curve-legend.tsx`)
- ✅ Controls (`src/components/controls.tsx`)

### Components Still Using Hardcoded Colors
These components will work but won't adapt to light theme until migrated:
- Spring Controls (`src/components/spring-controls.tsx`)
- Spring Slider (`src/components/spring-slider.tsx`)
- Decay Controls (`src/components/decay-controls.tsx`)
- Bezier Controls (`src/components/bezier-controls.tsx`)

## 🎯 Next Steps

1. **Test Both Themes**: Verify all components look good in both light and dark modes
2. **Complete Migration**: Update remaining components to use theme system
3. **User Testing**: Get feedback on theme switching and color choices
4. **Refinement**: Adjust colors based on user feedback and accessibility testing
5. **Documentation**: Update component documentation to mention theme support

## 🎨 Customization

### Adding New Theme Colors
To add new colors to both themes:

1. Update `src/theme/index.ts` (dark theme):
```typescript
colors: {
  // Add new color
  accent: '#your-dark-color',
}
```

2. Update `src/theme/unistyles.ts` (light theme):
```typescript
const lightColors = {
  // Add corresponding light color
  accent: '#your-light-color',
}
```

### Creating Additional Themes
You can add more themes (e.g., high contrast, sepia) by:
1. Adding new theme objects to the `themes` constant
2. Updating the TypeScript declarations
3. Adding theme selection logic

The foundation is now in place for comprehensive theme support! 🎉 