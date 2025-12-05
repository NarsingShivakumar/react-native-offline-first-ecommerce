// // src/hooks/useBiometric.ts
// import { useState, useEffect } from 'react';
// import BiometricService from '../services/native/BiometricService';

// /**
//  * Biometric Authentication Hook
//  * Interview: Why custom hooks for native features?
//  * Answer: Encapsulate logic, reusable, testable, follows React patterns
//  */

// export const useBiometric = () => {
//   const [isAvailable, setIsAvailable] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     checkAvailability();
//   }, []);

//   const checkAvailability = async () => {
//     setIsChecking(true);
//     try {
//       const available = await BiometricService.isAvailable();
//       setIsAvailable(available);
//     } catch (error) {
//       console.error('Biometric check error:', error);
//       setIsAvailable(false);
//     } finally {
//       setIsChecking(false);
//     }
//   };

//   const authenticate = async (
//     title: string = 'Authenticate',
//     subtitle: string = 'Verify your identity'
//   ): Promise<boolean> => {
//     try {
//       return await BiometricService.authenticate(title, subtitle);
//     } catch (error) {
//       console.error('Biometric auth error:', error);
//       throw error;
//     }
//   };

//   return {
//     isAvailable,
//     isChecking,
//     authenticate,
//   };
// };

// src/hooks/useBiometric.ts
import { useState, useEffect } from 'react';
import { NativeModules, Platform } from 'react-native';

/**
 * Biometric Authentication Hook
 * Works with your BiometricModule.java & BiometricModule.m
 */

interface BiometricModule {
  isAvailable(): Promise<boolean>;
  authenticate(title: string, subtitle: string): Promise<boolean>;
}

// Type the NativeModule properly
declare module 'react-native' {
  interface NativeModules {
    BiometricModule?: BiometricModule;
  }
}

const { BiometricModule } = NativeModules;

interface BiometricHook {
  isAvailable: boolean;
  isChecking: boolean;
  authenticate: (title?: string, subtitle?: string) => Promise<boolean>;
}

export const useBiometric = (): BiometricHook => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async (): Promise<void> => {
    setIsChecking(true);
    try {
      if (Platform.OS === 'web' || !BiometricModule) {
        setIsAvailable(false);
        return;
      }

      const available = await BiometricModule.isAvailable();
      setIsAvailable(available);
    } catch (error: any) {
      console.error('Biometric availability check failed:', error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const authenticate = async (
    title: string = 'Authenticate',
    subtitle: string = 'Verify your identity'
  ): Promise<boolean> => {
    try {
      if (!BiometricModule) {
        throw new Error('Biometric module not available');
      }

      return await BiometricModule.authenticate(title, subtitle);
    } catch (error: any) {
      // Handle specific native errors
      switch (error.code) {
        case 'AUTH_FAILED':
          throw new Error('Authentication failed. Please try again.');
        case 'NOT_AVAILABLE':
          throw new Error('Biometric authentication is not available on this device.');
        case 'NO_HARDWARE':
          throw new Error('No biometric hardware available.');
        case 'NONE_ENROLLED':
          throw new Error('No biometric credentials enrolled.');
        default:
          throw new Error(error.message || 'Authentication failed');
      }
    }
  };

  return {
    isAvailable,
    isChecking,
    authenticate,
  };
};

