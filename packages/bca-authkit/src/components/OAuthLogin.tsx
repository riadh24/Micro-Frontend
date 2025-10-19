import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context';

export interface GoogleLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  customStyles?: {
    container?: object;
    button?: object;
    buttonText?: object;
    icon?: object;
  };
  labels?: {
    buttonText?: string;
  };
  showIcon?: boolean;
}

export const GoogleLogin: React.FC<GoogleLoginProps> = ({
  onSuccess,
  onError,
  customStyles = {},
  labels = {},
  showIcon = true,
}) => {
  const { loginWithGoogle, isLoading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Google login failed';
      onError?.(errorMessage);
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const defaultStyles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    button: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#dadce0',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    icon: {
      fontSize: 20,
      marginRight: 12,
    },
    buttonText: {
      color: '#3c4043',
      fontSize: 16,
      fontWeight: '500',
    },
  });

  const styles = {
    container: [defaultStyles.container, customStyles.container],
    button: [
      defaultStyles.button,
      customStyles.button,
      isLoading && defaultStyles.buttonDisabled,
    ],
    buttonText: [defaultStyles.buttonText, customStyles.buttonText],
    icon: [defaultStyles.icon, customStyles.icon],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleLogin}
        disabled={isLoading}
      >
        {showIcon && <Text style={styles.icon}>🇬</Text>}
        <Text style={styles.buttonText}>
          {isLoading 
            ? 'Signing in with Google...' 
            : (labels.buttonText || 'Continue with Google')
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export interface MicrosoftLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  customStyles?: {
    container?: object;
    button?: object;
    buttonText?: object;
    icon?: object;
  };
  labels?: {
    buttonText?: string;
  };
  showIcon?: boolean;
}

export const MicrosoftLogin: React.FC<MicrosoftLoginProps> = ({
  onSuccess,
  onError,
  customStyles = {},
  labels = {},
  showIcon = true,
}) => {
  const { loginWithMicrosoft, isLoading } = useAuth();

  const handleMicrosoftLogin = async () => {
    try {
      await loginWithMicrosoft();
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Microsoft login failed';
      onError?.(errorMessage);
      Alert.alert('Login Failed', errorMessage);
    }
  };

  const defaultStyles = StyleSheet.create({
    container: {
      marginVertical: 8,
    },
    button: {
      backgroundColor: '#0078d4',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
      opacity: 0.6,
    },
    icon: {
      fontSize: 20,
      marginRight: 12,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500',
    },
  });

  const styles = {
    container: [defaultStyles.container, customStyles.container],
    button: [
      defaultStyles.button,
      customStyles.button,
      isLoading && defaultStyles.buttonDisabled,
    ],
    buttonText: [defaultStyles.buttonText, customStyles.buttonText],
    icon: [defaultStyles.icon, customStyles.icon],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleMicrosoftLogin}
        disabled={isLoading}
      >
        {showIcon && <Text style={styles.icon}>Ⓜ️</Text>}
        <Text style={styles.buttonText}>
          {isLoading 
            ? 'Signing in with Microsoft...' 
            : (labels.buttonText || 'Continue with Microsoft')
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Combined OAuth component for easy use
export interface OAuthLoginProps {
  enableGoogle?: boolean;
  enableMicrosoft?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  customStyles?: {
    container?: object;
    separator?: object;
    separatorText?: object;
    google?: {
      container?: object;
      button?: object;
      buttonText?: object;
      icon?: object;
    };
    microsoft?: {
      container?: object;
      button?: object;
      buttonText?: object;
      icon?: object;
    };
  };
  labels?: {
    separator?: string;
    google?: {
      buttonText?: string;
    };
    microsoft?: {
      buttonText?: string;
    };
  };
}

export const OAuthLogin: React.FC<OAuthLoginProps> = ({
  enableGoogle = true,
  enableMicrosoft = true,
  onSuccess,
  onError,
  customStyles = {},
  labels = {},
}) => {
  const defaultStyles = StyleSheet.create({
    container: {
      marginVertical: 16,
    },
    separator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    separatorLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#e5e7eb',
    },
    separatorText: {
      marginHorizontal: 16,
      color: '#6b7280',
      fontSize: 14,
      fontWeight: '500',
    },
  });

  const styles = {
    container: [defaultStyles.container, customStyles.container],
    separator: [defaultStyles.separator, customStyles.separator],
    separatorText: [defaultStyles.separatorText, customStyles.separatorText],
  };

  const showSeparator = enableGoogle || enableMicrosoft;

  return (
    <View style={styles.container}>
      {showSeparator && (
        <View style={styles.separator}>
          <View style={defaultStyles.separatorLine} />
          <Text style={styles.separatorText}>
            {labels.separator || 'Or continue with'}
          </Text>
          <View style={defaultStyles.separatorLine} />
        </View>
      )}

      {enableGoogle && (
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          customStyles={customStyles.google}
          labels={labels.google}
        />
      )}

      {enableMicrosoft && (
        <MicrosoftLogin
          onSuccess={onSuccess}
          onError={onError}
          customStyles={customStyles.microsoft}
          labels={labels.microsoft}
        />
      )}
    </View>
  );
};