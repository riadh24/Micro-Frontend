// Core types for the authentication system
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export interface AuthConfig {
  apiBaseUrl: string;
  sessionTimeout: number; // in minutes
  enableBiometrics: boolean;
  biometricPrompt?: string;
  enableAutoRefresh: boolean;
  oauth?: {
    google?: {
      clientId: string;
      scopes?: string[];
    };
    microsoft?: {
      clientId: string;
      tenantId?: string;
      scopes?: string[];
    };
  };
}

export interface AuthContextType {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  // Methods
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  enableBiometrics: () => Promise<boolean>;
  disableBiometrics: () => Promise<void>;
}

export interface BiometricCapabilities {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: string[];
}

export interface OAuthResult {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  userInfo?: any;
}