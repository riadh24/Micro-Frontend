// Main entry point for BCA AuthKit
export * from './types';
export * from './context';
export * from './storage';
export * from './biometric';
export * from './api';

// Components
export * from './components/EmailPasswordLogin';
export * from './components/BiometricLogin';
export * from './components/OAuthLogin';

// Default export for convenience
import { AuthProvider, useAuth } from './context';
import { AuthStorage } from './storage';
import { BiometricAuth } from './biometric';
import { AuthAPI } from './api';
import { EmailPasswordLogin } from './components/EmailPasswordLogin';
import { BiometricLogin } from './components/BiometricLogin';
import { GoogleLogin, MicrosoftLogin, OAuthLogin } from './components/OAuthLogin';

export default {
  // Context
  AuthProvider,
  useAuth,
  
  // Core services
  AuthStorage,
  BiometricAuth,
  AuthAPI,
  
  // Components
  EmailPasswordLogin,
  BiometricLogin,
  GoogleLogin,
  MicrosoftLogin,
  OAuthLogin,
};