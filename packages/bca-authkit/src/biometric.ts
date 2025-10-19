import * as LocalAuthentication from 'expo-local-authentication';
import { BiometricCapabilities } from './types';

export class BiometricAuth {
  /**
   * Check biometric authentication capabilities
   */
  static async checkCapabilities(): Promise<BiometricCapabilities> {
    try {
      const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      const isAvailable = hasHardware && isEnrolled;
      
      const typeNames = supportedTypes.map(type => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            return 'fingerprint';
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            return 'face-id';
          case LocalAuthentication.AuthenticationType.IRIS:
            return 'iris';
          default:
            return 'unknown';
        }
      });

      return {
        isAvailable,
        hasHardware,
        isEnrolled,
        supportedTypes: typeNames,
      };
    } catch (error) {
      console.error('Failed to check biometric capabilities:', error);
      return {
        isAvailable: false,
        hasHardware: false,
        isEnrolled: false,
        supportedTypes: [],
      };
    }
  }

  /**
   * Authenticate using biometrics
   */
  static async authenticate(promptMessage?: string): Promise<void> {
    try {
      const capabilities = await this.checkCapabilities();
      
      if (!capabilities.isAvailable) {
        throw new Error('Biometric authentication is not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Authenticate with biometrics',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Password',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        if (result.error === 'user_cancel') {
          throw new Error('Authentication was cancelled');
        } else if (result.error === 'not_enrolled') {
          throw new Error('No biometric authentication is enrolled');
        } else if (result.error === 'not_available') {
          throw new Error('Biometric authentication is not available');
        } else {
          throw new Error(`Authentication failed: ${result.error}`);
        }
      }
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      throw error;
    }
  }

  /**
   * Get human-readable biometric type names
   */
  static async getSupportedBiometricTypes(): Promise<string[]> {
    const capabilities = await this.checkCapabilities();
    return capabilities.supportedTypes;
  }

  /**
   * Check if device has any biometric capabilities
   */
  static async isSupported(): Promise<boolean> {
    const capabilities = await this.checkCapabilities();
    return capabilities.hasHardware;
  }

  /**
   * Check if user has enrolled any biometrics
   */
  static async isEnrolled(): Promise<boolean> {
    const capabilities = await this.checkCapabilities();
    return capabilities.isEnrolled;
  }
}