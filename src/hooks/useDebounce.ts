// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

/**
 * Debounce Hook
 * Interview: Why debounce search inputs?
 * Answer: Reduces API calls, improves performance, better UX
 */

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
