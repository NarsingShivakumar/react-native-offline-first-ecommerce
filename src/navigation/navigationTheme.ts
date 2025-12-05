// src/navigation/navigationTheme.ts
import {
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { Theme as AppTheme } from '../theme';

/**
 * Map your app theme to React Navigation theme
 */
export const createNavigationTheme = (appTheme: AppTheme): NavigationTheme => {
  const base = appTheme.isDark ? DarkTheme : DefaultTheme;

  return {
    ...base,
    colors: {
      ...base.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.card,
      text: appTheme.colors.text,
      border: appTheme.colors.border,
      notification: appTheme.colors.error,
    },
  };
};
