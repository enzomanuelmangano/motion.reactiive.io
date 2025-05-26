# Unistyles Setup Guide

This project has been configured with `react-native-unistyles` for responsive styling and theme management.

## What's Configured

### 1. Theme Integration
- Your existing theme from `src/theme/index.ts` has been integrated with unistyles
- All design tokens (colors, spacing, dimensions, etc.) are available through unistyles

### 2. Breakpoints
The following responsive breakpoints are configured:
- `xs`: 0px (mobile)
- `sm`: 576px (large mobile)
- `md`: 768px (tablet)
- `lg`: 992px (desktop)
- `xl`: 1200px (large desktop)
- `superLarge`: 2000px
- `tvLike`: 4000px

### 3. Files Added/Modified
- `src/theme/unistyles.ts` - Unistyles configuration
- `src/hooks/use-unistyles.ts` - Custom hook for unistyles
- `src/components/example-unistyles-component.tsx` - Example usage
- `src/index.tsx` - Unistyles initialization
- `src/theme/index.ts` - Added unistyles exports

## How to Use Unistyles

### Basic Usage with createStyleSheet

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

const MyComponent = () => {
  const { styles } = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
    </View>
  );
};

const stylesheet = createStyleSheet((theme) => ({
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontSize: {
      xs: 18,
      md: 24,
      lg: 32,
    },
    color: theme.colors.text.primary,
    fontWeight: 'bold',
  },
}));
```

### Using the Custom Hook

```typescript
import { useUnistyles } from '../hooks/use-unistyles';

const MyComponent = () => {
  const { theme, breakpoint, isWideScreen, isMobile } = useUnistyles();

  return (
    <View style={{
      padding: isWideScreen ? theme.spacing.xl : theme.spacing.md,
      backgroundColor: theme.colors.background.primary,
    }}>
      <Text>Current breakpoint: {breakpoint}</Text>
    </View>
  );
};
```

### Responsive Values

You can define different values for different breakpoints:

```typescript
const stylesheet = createStyleSheet((theme) => ({
  container: {
    padding: {
      xs: theme.spacing.sm,
      md: theme.spacing.lg,
      lg: theme.spacing.xl,
    },
    flexDirection: {
      xs: 'column',
      lg: 'row',
    },
  },
}));
```

### Accessing Theme Values

All your existing theme values are available:

```typescript
const stylesheet = createStyleSheet((theme) => ({
  button: {
    backgroundColor: theme.colors.primary.spring,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.medium,
  },
}));
```

## Migration from StyleSheet

To migrate existing components:

1. Replace `StyleSheet.create()` with `createStyleSheet()`
2. Add theme parameter: `createStyleSheet((theme) => ({...}))`
3. Replace hardcoded values with theme values
4. Add responsive breakpoints where needed
5. Use `useStyles(stylesheet)` instead of direct style access

### Before (StyleSheet):
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#080808',
    padding: 20,
  },
});

<View style={styles.container} />
```

### After (Unistyles):
```typescript
const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.background.primary,
    padding: {
      xs: theme.spacing.md,
      lg: theme.spacing.lg,
    },
  },
}));

const { styles } = useStyles(stylesheet);
<View style={styles.container} />
```

## Benefits

1. **Responsive Design**: Automatic responsive behavior based on screen size
2. **Theme Integration**: Seamless access to your design system
3. **Type Safety**: Full TypeScript support with autocomplete
4. **Performance**: Optimized re-renders only when breakpoints change
5. **Consistency**: Centralized theme management

## Next Steps

1. Start migrating components one by one to use unistyles
2. Take advantage of responsive breakpoints for better mobile/desktop experiences
3. Consider adding a light theme variant in the future
4. Use the example component as a reference for best practices 