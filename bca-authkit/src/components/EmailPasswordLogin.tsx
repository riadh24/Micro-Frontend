import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../context';

export interface EmailPasswordLoginProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  enableBiometrics?: boolean;
  customStyles?: {
    container?: object;
    title?: object;
    inputContainer?: object;
    input?: object;
    button?: object;
    buttonText?: object;
    linkText?: object;
    errorText?: object;
  };
  placeholders?: {
    email?: string;
    password?: string;
  };
  labels?: {
    title?: string;
    loginButton?: string;
    forgotPassword?: string;
    createAccount?: string;
    enableBiometrics?: string;
  };
}

export const EmailPasswordLogin: React.FC<EmailPasswordLoginProps> = ({
  onSuccess,
  onForgotPassword,
  onCreateAccount,
  enableBiometrics = true,
  customStyles = {},
  placeholders = {},
  labels = {},
}) => {
  const { login, enableBiometrics: enableBiometricsAuth, isLoading, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await login({ email: email.trim(), password });
      
      // Ask user if they want to enable biometrics after successful login
      if (enableBiometrics) {
        Alert.alert(
          'Enable Biometric Authentication',
          'Would you like to enable biometric authentication for faster login?',
          [
            { text: 'Not Now', style: 'cancel' },
            {
              text: 'Enable',
              onPress: async () => {
                try {
                  await enableBiometricsAuth();
                  Alert.alert('Success', 'Biometric authentication enabled!');
                } catch (error) {
                  console.error('Failed to enable biometrics:', error);
                }
              },
            },
          ]
        );
      }
      
      onSuccess?.();
    } catch (error) {
      console.error('Login failed:', error);
      // Error is already handled by the auth context
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const defaultStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#374151',
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: '#f9fafb',
    },
    inputFocused: {
      borderColor: '#3b82f6',
      backgroundColor: '#ffffff',
    },
    button: {
      backgroundColor: '#3b82f6',
      paddingVertical: 16,
      borderRadius: 8,
      marginTop: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: '600',
    },
    linkContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    linkText: {
      color: '#3b82f6',
      fontSize: 16,
      textDecorationLine: 'underline',
    },
    errorContainer: {
      marginTop: 16,
      padding: 12,
      backgroundColor: '#fef2f2',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#fecaca',
    },
    errorText: {
      color: '#dc2626',
      fontSize: 16,
      textAlign: 'center',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    passwordInput: {
      flex: 1,
    },
    showPasswordButton: {
      position: 'absolute',
      right: 12,
      padding: 8,
    },
    showPasswordText: {
      color: '#3b82f6',
      fontSize: 14,
    },
  });

  const styles = {
    container: [defaultStyles.container, customStyles.container],
    title: [defaultStyles.title, customStyles.title],
    inputContainer: [defaultStyles.inputContainer, customStyles.inputContainer],
    input: [defaultStyles.input, customStyles.input],
    button: [
      defaultStyles.button,
      customStyles.button,
      isLoading && defaultStyles.buttonDisabled,
    ],
    buttonText: [defaultStyles.buttonText, customStyles.buttonText],
    linkText: [defaultStyles.linkText, customStyles.linkText],
    errorText: [defaultStyles.errorText, customStyles.errorText],
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {labels.title || 'Welcome Back'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={defaultStyles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholders.email || 'Enter your email'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={defaultStyles.label}>Password</Text>
            <View style={defaultStyles.passwordContainer}>
              <TextInput
                style={[styles.input, defaultStyles.passwordInput]}
                placeholder={placeholders.password || 'Enter your password'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={defaultStyles.showPasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={defaultStyles.showPasswordText}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <View style={defaultStyles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading || !email.trim() || !password.trim()}
          >
            <Text style={styles.buttonText}>
              {isLoading 
                ? 'Signing In...' 
                : (labels.loginButton || 'Sign In')
              }
            </Text>
          </TouchableOpacity>

          <View style={defaultStyles.linkContainer}>
            {onForgotPassword && (
              <TouchableOpacity onPress={onForgotPassword}>
                <Text style={styles.linkText}>
                  {labels.forgotPassword || 'Forgot Password?'}
                </Text>
              </TouchableOpacity>
            )}
            
            {onCreateAccount && (
              <TouchableOpacity onPress={onCreateAccount}>
                <Text style={styles.linkText}>
                  {labels.createAccount || 'Create Account'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};