import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens, User } from './types';

// Storage keys
const STORAGE_KEYS = {
  TOKENS: 'bca_auth_tokens',
  USER: 'bca_auth_user',
  BIOMETRIC_ENABLED: 'bca_biometric_enabled',
  REFRESH_TOKEN: 'bca_refresh_token',
} as const;

export class AuthStorage {
  /**
   * Store authentication tokens securely using Expo SecureStore
   */
  static async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        STORAGE_KEYS.TOKENS,
        JSON.stringify(tokens)
      );
      
      // Store refresh token separately for additional security
      if (tokens.refreshToken) {
        await SecureStore.setItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN,
          tokens.refreshToken
        );
      }
    } catch (error) {
      console.error('Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Retrieve authentication tokens from secure storage
   */
  static async getTokens(): Promise<AuthTokens | null> {
    try {
      const tokensJson = await SecureStore.getItemAsync(STORAGE_KEYS.TOKENS);
      if (!tokensJson) return null;

      const tokens: AuthTokens = JSON.parse(tokensJson);
      
      // Get refresh token separately
      const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      if (refreshToken) {
        tokens.refreshToken = refreshToken;
      }

      return tokens;
    } catch (error) {
      console.error('Failed to retrieve tokens:', error);
      return null;
    }
  }

  /**
   * Clear all stored tokens
   */
  static async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.TOKENS),
        SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
    } catch (error) {
      console.error('Failed to clear tokens:', error);
    }
  }

  /**
   * Store user information (non-sensitive data)
   */
  static async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
      );
    } catch (error) {
      console.error('Failed to store user:', error);
      throw new Error('Failed to store user information');
    }
  }

  /**
   * Retrieve user information
   */
  static async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  }

  /**
   * Clear stored user information
   */
  static async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error('Failed to clear user:', error);
    }
  }

  /**
   * Check if biometric authentication is enabled
   */
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
      return enabled === 'true';
    } catch (error) {
      console.error('Failed to check biometric status:', error);
      return false;
    }
  }

  /**
   * Set biometric authentication preference
   */
  static async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.BIOMETRIC_ENABLED,
        enabled ? 'true' : 'false'
      );
    } catch (error) {
      console.error('Failed to set biometric status:', error);
      throw new Error('Failed to update biometric preference');
    }
  }

  /**
   * Store credentials for biometric authentication
   */
  static async storeBiometricCredentials(credentials: {
    email: string;
    hashedPassword: string;
  }): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        'bca_biometric_credentials',
        JSON.stringify(credentials)
      );
    } catch (error) {
      console.error('Failed to store biometric credentials:', error);
      throw new Error('Failed to store biometric credentials');
    }
  }

  /**
   * Retrieve credentials for biometric authentication
   */
  static async getBiometricCredentials(): Promise<{
    email: string;
    hashedPassword: string;
  } | null> {
    try {
      const credentialsJson = await SecureStore.getItemAsync('bca_biometric_credentials');
      return credentialsJson ? JSON.parse(credentialsJson) : null;
    } catch (error) {
      console.error('Failed to retrieve biometric credentials:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  static async clearAll(): Promise<void> {
    try {
      await Promise.all([
        this.clearTokens(),
        this.clearUser(),
        AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_ENABLED),
        SecureStore.deleteItemAsync('bca_biometric_credentials'),
      ]);
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  }

  /**
   * Check if tokens are expired
   */
  static isTokenExpired(tokens: AuthTokens): boolean {
    return Date.now() >= tokens.expiresAt;
  }

  /**
   * Check if tokens will expire soon (within 5 minutes)
   */
  static isTokenExpiringSoon(tokens: AuthTokens): boolean {
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Date.now() >= (tokens.expiresAt - fiveMinutes);
  }
}