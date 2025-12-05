import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

/**
 * Offline Indicator Component
 * Shows banner when device is offline
 */

const OfflineIndicator: React.FC = () => {
  const { isConnected } = useNetworkStatus();
  const translateY = useSharedValue(-50);

  useEffect(() => {
    translateY.value = withTiming(isConnected ? -50 : 0, { duration: 300 });
  }, [isConnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Icon name="cloud-offline-outline" size={16} color="#FFFFFF" />
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 9999,
  },
  text: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default OfflineIndicator;
