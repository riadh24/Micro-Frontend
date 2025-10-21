import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, User, AuthTokens, LoginCredentials, AuthConfig } from './types';
import { AuthStorage } from './storage';
import { AuthAPI } from './api';
import { BiometricAuth } from './biometric';

// Default configuration
const defaultConfig: AuthConfig = {
  apiBaseUrl: 'https://api.example.com',
  sessionTimeout: 60, // 1 hour
  enableBiometrics: true,
  biometricPrompt: 'Use your biometric to sign in',
  enableAutoRefresh: true,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  config?: Partial<AuthConfig>;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  config: userConfig = {} 
}) => {
  const config = { ...defaultConfig, ...userConfig };
  
  // Initialize API with config
  AuthAPI.initialize(config);
  
  // State
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isAuthenticated = !!user && !!tokens && !AuthStorage.isTokenExpired(tokens);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auto-refresh token when needed
  useEffect(() => {
    if (!tokens || !config.enableAutoRefresh) return;

    const checkTokenExpiry = () => {
      if (AuthStorage.isTokenExpiringSoon(tokens)) {
        refreshToken().catch(console.error);
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [tokens, config.enableAutoRefresh]);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      
      const [storedTokens, storedUser] = await Promise.all([
        AuthStorage.getTokens(),
        AuthStorage.getUser(),
      ]);

      if (storedTokens && storedUser && !AuthStorage.isTokenExpired(storedTokens)) {
        setTokens(storedTokens);
        setUser(storedUser);
      } else if (storedTokens && AuthStorage.isTokenExpired(storedTokens)) {
        // Try to refresh expired token
        try {
          await refreshToken();
        } catch (error) {
          await logout();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setError('Failed to initialize authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await AuthAPI.login(credentials);
      
      // Store tokens and user
      await Promise.all([
        AuthStorage.storeTokens(response.tokens),
        AuthStorage.storeUser(response.user),
      ]);

      setTokens(response.tokens);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithBiometrics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if biometric is enabled
      const isBiometricEnabled = await AuthStorage.isBiometricEnabled();
      if (!isBiometricEnabled) {
        throw new Error('Biometric authentication is not enabled');
      }

      // Get stored credentials
      const storedCredentials = await AuthStorage.getBiometricCredentials();
      if (!storedCredentials) {
        throw new Error('No biometric credentials found');
      }

      // Authenticate with biometrics
      await BiometricAuth.authenticate(config.biometricPrompt);

      // Login with stored credentials
      const response = await AuthAPI.loginWithHash({
        email: storedCredentials.email,
        hashedPassword: storedCredentials.hashedPassword,
      });

      // Store tokens and user
      await Promise.all([
        AuthStorage.storeTokens(response.tokens),
        AuthStorage.storeUser(response.user),
      ]);

      setTokens(response.tokens);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error.message || 'Biometric login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!config.oauth?.google?.clientId) {
        throw new Error('Google OAuth is not configured');
      }

      const response = await AuthAPI.loginWithGoogle(config.oauth.google);

      // Store tokens and user
      await Promise.all([
        AuthStorage.storeTokens(response.tokens),
        AuthStorage.storeUser(response.user),
      ]);

      setTokens(response.tokens);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error.message || 'Google login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!config.oauth?.microsoft?.clientId) {
        throw new Error('Microsoft OAuth is not configured');
      }

      const response = await AuthAPI.loginWithMicrosoft(config.oauth.microsoft);

      // Store tokens and user
      await Promise.all([
        AuthStorage.storeTokens(response.tokens),
        AuthStorage.storeUser(response.user),
      ]);

      setTokens(response.tokens);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error.message || 'Microsoft login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Call logout API if tokens exist
      if (tokens) {
        try {
          await AuthAPI.logout(tokens.accessToken);
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API call failed:', error);
        }
      }

      // Clear all stored data
      await AuthStorage.clearAll();
      
      // Reset state
      setUser(null);
      setTokens(null);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await AuthAPI.refreshToken(tokens.refreshToken);
      
      // Store new tokens
      await AuthStorage.storeTokens(response.tokens);
      setTokens(response.tokens);
      
      if (response.user) {
        await AuthStorage.storeUser(response.user);
        setUser(response.user);
      }
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  };

  const enableBiometrics = async (): Promise<boolean> => {
    try {
      // Check biometric capabilities
      const capabilities = await BiometricAuth.checkCapabilities();
      if (!capabilities.isAvailable) {
        throw new Error('Biometric authentication is not available');
      }

      // Authenticate to confirm user consent
      await BiometricAuth.authenticate('Enable biometric authentication');

      // Hash current password (if available)
      if (!user?.email) {
        throw new Error('User email not available');
      }

      // Note: In a real app, you'd need the user to enter their password here
      // For now, we'll assume it's passed or retrieved securely
      const credentials = {
        email: user.email,
        hashedPassword: 'hashed_password_placeholder', // This should be properly hashed
      };

      await AuthStorage.storeBiometricCredentials(credentials);
      await AuthStorage.setBiometricEnabled(true);

      return true;
    } catch (error: any) {
      setError(error.message || 'Failed to enable biometrics');
      return false;
    }
  };

  const disableBiometrics = async () => {
    try {
      await AuthStorage.setBiometricEnabled(false);
    } catch (error: any) {
      setError(error.message || 'Failed to disable biometrics');
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    // State
    user,
    tokens,
    isLoading,
    isAuthenticated,
    error,
    
    // Methods
    login,
    loginWithBiometrics,
    loginWithGoogle,
    loginWithMicrosoft,
    logout,
    refreshToken,
    clearError,
    enableBiometrics,
    disableBiometrics,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};