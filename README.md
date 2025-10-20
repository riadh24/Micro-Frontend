# 🔐 BCA AuthKit - Complete Authentication Solution for React Native Expo

A comprehensive, production-ready authentication kit specifically designed for **React Native Expo** applications. Provides secure authentication, biometric login, and OAuth integration with zero native configuration required.

## ✨ Features

- 🔐 **Email/Password Authentication** - Secure credential-based login with validation
- 👆 **Biometric Authentication** - Face ID, Touch ID, and Fingerprint via Expo LocalAuthentication
- 🌐 **OAuth Integration** - Google and Microsoft authentication out of the box
- 💾 **Expo SecureStore** - Hardware-backed secure token storage
- 🎨 **Customizable Components** - Pre-built UI components with full styling control
- 📱 **Cross-Platform** - Works seamlessly on iOS, Android, and Web
- 🚀 **Zero Native Setup** - Perfect for Expo managed workflow
- 🔧 **TypeScript Support** - Complete type safety and IntelliSense
- 🛡️ **Security First** - Industry-standard security practices
- 📦 **Modular Design** - Use only what you need

## 📦 Installation

### For Expo Applications

```bash
# Configure npm for GitHub Packages (one-time setup)
echo "@riadhazzabi:registry=https://npm.pkg.github.com" >> .npmrc

# Install BCA AuthKit
npm install @riadhazzabi/bca-authkit

# Install required Expo dependencies
npx expo install expo-secure-store expo-local-authentication expo-auth-session expo-crypto expo-linking
npx expo install @react-native-async-storage/async-storage
```

### Required Expo Configuration

Add the following to your `app.json`:

```json
{
  "expo": {
    "scheme": "com.yourapp.authkit",
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "This app uses Face ID for secure authentication."
      }
    },
    "android": {
      "permissions": [
        "USE_FINGERPRINT",
        "USE_BIOMETRIC"
      ]
    }
  }
}
```

## 🚀 Quick Start

### 1. Setup AuthProvider

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from '@riadhazzabi/bca-authkit';
import YourApp from './YourApp';

export default function App() {
  return (
    <AuthProvider
      config={{
        apiBaseUrl: 'https://your-api.com/v1',
        sessionTimeout: 60, // minutes
        enableBiometrics: true,
        oauth: {
          google: {
            clientId: 'your-google-client-id',
            scopes: ['openid', 'profile', 'email'],
          },
          microsoft: {
            clientId: 'your-microsoft-client-id',
            tenantId: 'your-tenant-id', // optional
            scopes: ['openid', 'profile', 'User.Read'],
          },
        },
      }}
    >
      <NavigationContainer>
        <YourApp />
      </NavigationContainer>
    </AuthProvider>
  );
}
```

### 2. Complete Login Screen Example

```jsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import {
  useAuth,
  EmailPasswordLogin,
  BiometricLogin,
  OAuthLogin,
} from '@riadhazzabi/bca-authkit';

function LoginScreen() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <YourMainApp />;
  }

  const handleLoginSuccess = () => {
    console.log('Login successful!');
    // Navigation will happen automatically via auth state
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
  };

  const handleCreateAccount = () => {
    console.log('Navigate to create account');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Email/Password Login */}
        <EmailPasswordLogin
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
          onCreateAccount={handleCreateAccount}
          customStyles={{
            container: { backgroundColor: '#f8fafc' },
            button: { backgroundColor: '#3b82f6' },
          }}
          labels={{
            title: 'Welcome to BCA',
            loginButton: 'Sign In',
            forgotPassword: 'Forgot Password?',
            createAccount: 'Create Account',
          }}
        />

        {/* Biometric Login */}
        <BiometricLogin
          onSuccess={handleLoginSuccess}
          autoPrompt={false}
          customStyles={{
            container: { marginVertical: 20 },
            button: { backgroundColor: '#10b981' },
          }}
        />

        {/* OAuth Login */}
        <OAuthLogin
          enableGoogle={true}
          enableMicrosoft={true}
          onSuccess={handleLoginSuccess}
          customStyles={{
            container: { marginTop: 20 },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
});
```

## 📚 Components API

### AuthProvider

The main provider that wraps your app:

```jsx
<AuthProvider config={authConfig}>
  {children}
</AuthProvider>
```

**Config Options:**
```typescript
interface AuthConfig {
  apiBaseUrl: string;                    // Your API base URL
  sessionTimeout?: number;               // Session timeout in minutes (default: 60)
  enableBiometrics?: boolean;            // Enable biometric auth (default: true)
  biometricPrompt?: string;              // Biometric prompt message
  enableAutoRefresh?: boolean;           // Auto-refresh tokens (default: true)
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
```

### useAuth Hook

Access authentication state and methods:

```jsx
const {
  // State
  user,              // Current user object
  tokens,            // Authentication tokens
  isLoading,         // Loading state
  isAuthenticated,   // Authentication status
  error,             // Error message

  // Methods
  login,             // (credentials) => Promise<void>
  loginWithBiometrics, // () => Promise<void>
  loginWithGoogle,   // () => Promise<void>
  loginWithMicrosoft, // () => Promise<void>
  logout,            // () => Promise<void>
  refreshToken,      // () => Promise<void>
  clearError,        // () => void
  enableBiometrics,  // () => Promise<boolean>
  disableBiometrics, // () => Promise<void>
} = useAuth();
```

### EmailPasswordLogin Component

Customizable email and password login form:

```jsx
<EmailPasswordLogin
  onSuccess={() => console.log('Login success')}
  onForgotPassword={() => console.log('Forgot password')}
  onCreateAccount={() => console.log('Create account')}
  enableBiometrics={true}
  customStyles={{
    container: { backgroundColor: '#f8fafc' },
    title: { color: '#1f2937', fontSize: 28 },
    input: { borderColor: '#d1d5db' },
    button: { backgroundColor: '#3b82f6' },
    buttonText: { color: '#ffffff' },
    linkText: { color: '#3b82f6' },
    errorText: { color: '#dc2626' },
  }}
  placeholders={{
    email: 'Enter your email',
    password: 'Enter your password',
  }}
  labels={{
    title: 'Welcome Back',
    loginButton: 'Sign In',
    forgotPassword: 'Forgot Password?',
    createAccount: 'Create Account',
  }}
/>
```

### BiometricLogin Component

Biometric authentication component:

```jsx
<BiometricLogin
  onSuccess={() => console.log('Biometric success')}
  onError={(error) => console.log('Biometric error:', error)}
  autoPrompt={false}
  showIcon={true}
  customStyles={{
    container: { backgroundColor: '#ffffff' },
    button: { backgroundColor: '#10b981' },
    buttonText: { color: '#ffffff' },
    icon: { fontSize: 48 },
    description: { color: '#6b7280' },
  }}
  labels={{
    title: 'Biometric Sign In',
    description: 'Use your biometric to sign in securely',
    buttonText: 'Sign In with Biometrics',
    unavailableText: 'Biometric authentication is not available',
  }}
/>
```

### OAuthLogin Component

Combined OAuth authentication:

```jsx
<OAuthLogin
  enableGoogle={true}
  enableMicrosoft={true}
  onSuccess={() => console.log('OAuth success')}
  onError={(error) => console.log('OAuth error:', error)}
  customStyles={{
    container: { marginVertical: 16 },
    separator: { marginVertical: 20 },
    google: {
      button: { backgroundColor: '#ffffff' },
      buttonText: { color: '#3c4043' },
    },
    microsoft: {
      button: { backgroundColor: '#0078d4' },
      buttonText: { color: '#ffffff' },
    },
  }}
  labels={{
    separator: 'Or continue with',
    google: {
      buttonText: 'Continue with Google',
    },
    microsoft: {
      buttonText: 'Continue with Microsoft',
    },
  }}
/>
```

### Individual OAuth Components

Use Google or Microsoft login separately:

```jsx
// Google Login
import { GoogleLogin } from '@riadhazzabi/bca-authkit';

<GoogleLogin
  onSuccess={() => console.log('Google login success')}
  onError={(error) => console.log('Google error:', error)}
  showIcon={true}
  customStyles={{
    button: { backgroundColor: '#ffffff' },
    buttonText: { color: '#3c4043' },
  }}
  labels={{
    buttonText: 'Continue with Google',
  }}
/>

// Microsoft Login
import { MicrosoftLogin } from '@riadhazzabi/bca-authkit';

<MicrosoftLogin
  onSuccess={() => console.log('Microsoft login success')}
  onError={(error) => console.log('Microsoft error:', error)}
  showIcon={true}
  customStyles={{
    button: { backgroundColor: '#0078d4' },
    buttonText: { color: '#ffffff' },
  }}
  labels={{
    buttonText: 'Continue with Microsoft',
  }}
/>
```

## 🔐 Advanced Usage

### Manual Authentication

```jsx
import { useAuth, AuthAPI } from '@riadhazzabi/bca-authkit';

function CustomLogin() {
  const { login, isLoading, error } = useAuth();

  const handleCustomLogin = async () => {
    try {
      // Using the hook (recommended)
      await login({
        email: 'user@example.com',
        password: 'password123',
      });
      
      // Or using API directly
      const response = await AuthAPI.login({
        email: 'user@example.com',
        password: 'password123',
      });
      console.log('Login response:', response);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleCustomLogin} disabled={isLoading}>
      <Text>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
    </TouchableOpacity>
  );
}
```

### Biometric Setup Flow

```jsx
import { BiometricAuth, useAuth } from '@riadhazzabi/bca-authkit';

function BiometricSetup() {
  const { enableBiometrics } = useAuth();
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    checkBiometricCapabilities();
  }, []);

  const checkBiometricCapabilities = async () => {
    const caps = await BiometricAuth.checkCapabilities();
    setCapabilities(caps);
  };

  const handleEnableBiometrics = async () => {
    try {
      const success = await enableBiometrics();
      if (success) {
        Alert.alert('Success', 'Biometric authentication enabled!');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (!capabilities?.isAvailable) {
    return (
      <View>
        <Text>Biometric authentication is not available on this device</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Available biometrics: {capabilities.supportedTypes.join(', ')}</Text>
      <TouchableOpacity onPress={handleEnableBiometrics}>
        <Text>Enable Biometric Authentication</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Protected Route Example

```jsx
import { useAuth } from '@riadhazzabi/bca-authkit';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return children;
}

// Usage
function App() {
  return (
    <AuthProvider config={authConfig}>
      <ProtectedRoute>
        <YourMainApp />
      </ProtectedRoute>
    </AuthProvider>
  );
}
```

### API Integration

```jsx
import { useAuth } from '@riadhazzabi/bca-authkit';

function UserProfile() {
  const { tokens, user } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await fetch('https://api.example.com/user/profile', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  return (
    <View>
      <Text>User: {user.name}</Text>
      <Text>Email: {user.email}</Text>
      <TouchableOpacity onPress={fetchUserData}>
        <Text>Refresh Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
```



### Key Benefits:

- ✅ **Zero Native Configuration** - Perfect for Expo managed workflow
- ✅ **Complete Security** - Hardware-backed secure storage and biometrics  
- ✅ **Multiple Auth Methods** - Email/password, biometric, and OAuth
- ✅ **Highly Customizable** - Full control over styling and behavior
- ✅ **TypeScript Ready** - Complete type safety and IntelliSense
- ✅ **Production Tested** - Built for enterprise-grade applications

Start building secure authentication flows today! 🔐