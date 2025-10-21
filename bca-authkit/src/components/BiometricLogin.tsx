import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context';
import { BiometricAuth } from '../biometric';

export interface BiometricLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  customStyles?: {
    container?: object;
    button?: object;
    buttonText?: object;
    icon?: object;
    description?: object;
  };
  labels?: {
    title?: string;
    description?: string;
    buttonText?: string;
    unavailableText?: string;
  };
  showIcon?: boolean;
  autoPrompt?: boolean;
}

export const BiometricLogin: React.FC<BiometricLoginProps> = ({
  onSuccess,
  onError,
  customStyles = {},
  labels = {},
  showIcon = true,
  autoPrompt = false,
}) => {
  const { loginWithBiometrics, isLoading } = useAuth();
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricTypes, setBiometricTypes] = useState<string[]>([]);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  useEffect(() => {
    if (autoPrompt && isAvailable) {
      handleBiometricLogin();
    }
  }, [autoPrompt, isAvailable]);

  const checkBiometricAvailability = async () => {
    try {
      const capabilities = await BiometricAuth.checkCapabilities();
      setIsAvailable(capabilities.isAvailable);
      setBiometricTypes(capabilities.supportedTypes);
    } catch (error) {
      console.error('Failed to check biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      await loginWithBiometrics();
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Biometric authentication failed';
      onError?.(errorMessage);
      Alert.alert('Authentication Failed', errorMessage);
    }
  };

  const getBiometricIcon = (): string => {
    if (biometricTypes.includes('face-id')) {
      return '👤'; // Face ID icon
    } else if (biometricTypes.includes('fingerprint')) {
      return '👆'; // Fingerprint icon
    } else if (biometricTypes.includes('iris')) {
      return '👁️'; // Iris icon
    }
    return '🔐'; // Generic security icon
  };

  const getBiometricDescription = (): string => {
    if (biometricTypes.includes('face-id')) {
      return 'Use Face ID to sign in quickly and securely';
    } else if (biometricTypes.includes('fingerprint')) {
      return 'Use your fingerprint to sign in quickly and securely';
    } else if (biometricTypes.includes('iris')) {
      return 'Use iris recognition to sign in quickly and securely';
    }
    return 'Use biometric authentication to sign in quickly and securely';
  };

  const defaultStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      backgroundColor: '#ffffff',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      margin: 16,
    },
    unavailableContainer: {
      opacity: 0.5,
    },
    icon: {
      fontSize: 48,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
    },
    button: {
      backgroundColor: '#3b82f6',
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      minWidth: 200,
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
      fontSize: 16,
      fontWeight: '600',
    },
    unavailableText: {
      color: '#ef4444',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 12,
      fontStyle: 'italic',
    },
  });

  const styles = {
    container: [
      defaultStyles.container,
      customStyles.container,
      !isAvailable && defaultStyles.unavailableContainer,
    ],
    button: [
      defaultStyles.button,
      customStyles.button,
      (!isAvailable || isLoading) && defaultStyles.buttonDisabled,
    ],
    buttonText: [defaultStyles.buttonText, customStyles.buttonText],
    icon: [defaultStyles.icon, customStyles.icon],
    description: [defaultStyles.description, customStyles.description],
  };

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        {showIcon && <Text style={styles.icon}>🚫</Text>}
        <Text style={defaultStyles.title}>
          {labels.title || 'Biometric Authentication'}
        </Text>
        <Text style={styles.description}>
          {labels.unavailableText || 
           'Biometric authentication is not available on this device or not set up.'
          }
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showIcon && <Text style={styles.icon}>{getBiometricIcon()}</Text>}
      
      <Text style={defaultStyles.title}>
        {labels.title || 'Biometric Sign In'}
      </Text>
      
      <Text style={styles.description}>
        {labels.description || getBiometricDescription()}
      </Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleBiometricLogin}
        disabled={!isAvailable || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading 
            ? 'Authenticating...' 
            : (labels.buttonText || 'Sign In with Biometrics')
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};