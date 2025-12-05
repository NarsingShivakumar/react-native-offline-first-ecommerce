// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { getTheme, Theme } from '../theme';

/**
 * Custom Theme Hook
 * Interview: How to handle theme changes?
 * Answer: Listen to Appearance changes, update state
 */
export const useTheme = (): Theme => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  return getTheme(colorScheme === 'dark');
};
