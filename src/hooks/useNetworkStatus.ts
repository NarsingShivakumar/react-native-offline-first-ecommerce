// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook to monitor network connectivity
 * Interview Question: Explain useEffect cleanup function importance
 * Answer: Prevents memory leaks, cancels subscriptions
 */
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    // Cleanup function - Critical for preventing memory leaks
    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array = runs once on mount

  return { isConnected, isInternetReachable };
};
