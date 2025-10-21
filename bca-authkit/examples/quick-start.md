# 🚀 Quick Start Guide - BCA AuthKit

Get up and running with BCA AuthKit in 5 minutes! This guide will help you integrate authentication into your React Native Expo app quickly.

## ⚡ 1-Minute Setup

### Step 1: Install the Package

```bash
# Configure npm for GitHub Packages
echo "@riadhazzabi:registry=https://npm.pkg.github.com" >> .npmrc

# Install BCA AuthKit
npm install @riadhazzabi/bca-authkit

# Install Expo dependencies
npx expo install expo-secure-store expo-local-authentication expo-auth-session expo-crypto
```

### Step 2: Configure Your App

Add to your `app.json`:

```json
{
  "expo": {
    "scheme": "com.yourapp.authkit",
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "Use Face ID for secure login"
      }
    },
    "android": {
      "permissions": ["USE_FINGERPRINT", "USE_BIOMETRIC"]
    }
  }
}
```

### Step 3: Wrap Your App

```jsx
// App.js
import React from 'react';
import { AuthProvider } from '@riadhazzabi/bca-authkit';
import { NavigationContainer } from '@react-navigation/native';
import MainApp from './MainApp';

export default function App() {
  return (
    <AuthProvider config={{ 
      apiBaseUrl: 'https://your-api.com/v1' 
    }}>
      <NavigationContainer>
        <MainApp />
      </NavigationContainer>
    </AuthProvider>
  );
}
```

### Step 4: Create Login Screen

```jsx
// LoginScreen.js
import React from 'react';
import { View } from 'react-native';
import { 
  EmailPasswordLogin, 
  BiometricLogin, 
  OAuthLogin 
} from '@riadhazzabi/bca-authkit';

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Email/Password Login */}
      <EmailPasswordLogin
        onSuccess={() => console.log('Login success!')}
        onForgotPassword={() => console.log('Forgot password')}
      />
      
      {/* Biometric Login */}
      <BiometricLogin
        onSuccess={() => console.log('Biometric success!')}
      />
      
      {/* OAuth Login */}
      <OAuthLogin
        enableGoogle={true}
        enableMicrosoft={true}
        onSuccess={() => console.log('OAuth success!')}
      />
    </View>
  );
}
```

### Step 5: Use Authentication State

```jsx
// MainApp.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '@riadhazzabi/bca-authkit';
import LoginScreen from './LoginScreen';

export default function MainApp() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user?.name}!</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

## 🎯 That's It!

You now have a complete authentication system with:
- ✅ Email/password login
- ✅ Biometric authentication  
- ✅ OAuth login (Google & Microsoft)
- ✅ Secure token storage
- ✅ Session management

## 🛠️ Customization Examples

### Custom Styling

```jsx
<EmailPasswordLogin
  customStyles={{
    container: { backgroundColor: '#f0f9ff' },
    button: { backgroundColor: '#3b82f6' },
    input: { borderColor: '#e2e8f0' },
  }}
  labels={{
    title: 'Welcome Back',
    loginButton: 'Sign In',
  }}
/>
```

### OAuth Configuration

```jsx
<AuthProvider
  config={{
    apiBaseUrl: 'https://your-api.com/v1',
    oauth: {
      google: {
        clientId: 'your-google-client-id',
        scopes: ['openid', 'profile', 'email'],
      },
      microsoft: {
        clientId: 'your-microsoft-client-id',
        scopes: ['openid', 'profile', 'User.Read'],
      },
    },
  }}
>
```

### Protected Routes

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <LoginScreen />;
  
  return children;
}
```

## 🔧 Advanced Features

### Manual Authentication

```jsx
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login({
      email: 'user@example.com',
      password: 'password123',
    });
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Biometric Setup

```jsx
const { enableBiometrics } = useAuth();

const setupBiometrics = async () => {
  const success = await enableBiometrics();
  if (success) {
    Alert.alert('Success', 'Biometrics enabled!');
  }
};
```

### API Calls with Tokens

```jsx
const { tokens } = useAuth();

const fetchUserData = async () => {
  const response = await fetch('https://api.example.com/user', {
    headers: {
      'Authorization': `Bearer ${tokens.accessToken}`,
    },
  });
  return response.json();
};
```

## 🎉 Next Steps

1. **Customize the UI** to match your app's design
2. **Configure OAuth** providers for social login
3. **Set up your API** endpoints for authentication
4. **Add error handling** and user feedback
5. **Test biometric authentication** on real devices
6. **Deploy to production** with confidence!

## 📚 Full Documentation

- [Complete README](../README.md) - Comprehensive guide
- [API Reference](../README.md#api-reference) - All components and props
- [Examples](./complete-example.md) - Full app example
- [Troubleshooting](../README.md#troubleshooting) - Common issues

## 💬 Need Help?

- 🐛 [GitHub Issues](https://github.com/riadhazzabi/bca-authkit/issues)
- 📧 Email: riadhazzabi@example.com
- 💬 Discussions: GitHub Discussions

---

**🚀 You're ready to build secure authentication flows with BCA AuthKit!**