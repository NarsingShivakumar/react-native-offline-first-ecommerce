// src/services/native/BiometricService.ts
import { NativeModules, Platform } from 'react-native';

/**
 * Biometric Service - Native Module Wrapper
 * Interview: Why wrap native modules?
 * Answer: 
 * - Type safety with TypeScript
 * - Error handling abstraction
 * - Platform-specific logic centralization
 * - Easier testing with mocks
 */

const { BiometricModule } = NativeModules;

export interface BiometricService {
  isAvailable(): Promise<boolean>;
  authenticate(title: string, subtitle: string): Promise<boolean>;
}

class BiometricServiceImpl implements BiometricService {
  async isAvailable(): Promise<boolean> {
    try {
      if (!BiometricModule) {
        console.warn('Biometric module not available');
        return false;
      }
      return await BiometricModule.isAvailable();
    } catch (error) {
      console.error('Biometric availability check failed:', error);
      return false;
    }
  }

  async authenticate(title: string, subtitle: string): Promise<boolean> {
    try {
      if (!BiometricModule) {
        throw new Error('Biometric module not available');
      }
      return await BiometricModule.authenticate(title, subtitle);
    } catch (error: any) {
      // User-friendly error messages
      if (error.code === 'AUTH_FAILED') {
        throw new Error('Authentication failed. Please try again.');
      } else if (error.code === 'NOT_AVAILABLE') {
        throw new Error('Biometric authentication is not available on this device.');
      }
      throw error;
    }
  }
}

export default new BiometricServiceImpl();
