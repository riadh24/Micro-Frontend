import { AuthTokens, User, LoginCredentials, OAuthResult, AuthConfig } from './types';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface GoogleOAuthConfig {
  clientId: string;
  scopes?: string[];
}

export interface MicrosoftOAuthConfig {
  clientId: string;
  tenantId?: string;
  scopes?: string[];
}

export class AuthAPI {
  private static config: AuthConfig;

  static initialize(config: AuthConfig) {
    this.config = config;
  }

  /**
   * Login with email and password
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      return {
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + (data.expiresIn * 1000), // Convert seconds to milliseconds
        },
      };
    } catch (error: any) {
      console.error('Login API error:', error);
      throw error;
    }
  }

  /**
   * Login with hashed password (for biometric authentication)
   */
  static async loginWithHash(credentials: {
    email: string;
    hashedPassword: string;
  }): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/auth/login-hash`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Hash login failed');
      }

      const data = await response.json();
      
      return {
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + (data.expiresIn * 1000),
        },
      };
    } catch (error: any) {
      console.error('Hash login API error:', error);
      throw error;
    }
  }

  /**
   * Login with Google OAuth
   */
  static async loginWithGoogle(config: GoogleOAuthConfig): Promise<LoginResponse> {
    try {
      // Configure OAuth request
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'com.bca.authkit',
        path: '/oauth/google/callback',
      });

      const request = new AuthSession.AuthRequest({
        clientId: config.clientId,
        scopes: config.scopes || ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
      });

      // Open OAuth flow
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      if (result.type !== 'success') {
        throw new Error('Google OAuth cancelled or failed');
      }

      // Exchange code for tokens
      const response = await fetch(`${this.config.apiBaseUrl}/auth/oauth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: result.params.code,
          redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Google OAuth login failed');
      }

      const data = await response.json();
      
      return {
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + (data.expiresIn * 1000),
        },
      };
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      throw error;
    }
  }

  /**
   * Login with Microsoft OAuth
   */
  static async loginWithMicrosoft(config: MicrosoftOAuthConfig): Promise<LoginResponse> {
    try {
      const tenantId = config.tenantId || 'common';
      
      // Configure OAuth request
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'com.bca.authkit',
        path: '/oauth/microsoft/callback',
      });

      const request = new AuthSession.AuthRequest({
        clientId: config.clientId,
        scopes: config.scopes || ['openid', 'profile', 'User.Read'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
      });

      // Open OAuth flow
      const result = await request.promptAsync({
        authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
      });

      if (result.type !== 'success') {
        throw new Error('Microsoft OAuth cancelled or failed');
      }

      // Exchange code for tokens
      const response = await fetch(`${this.config.apiBaseUrl}/auth/oauth/microsoft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: result.params.code,
          redirectUri,
          tenantId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Microsoft OAuth login failed');
      }

      const data = await response.json();
      
      return {
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + (data.expiresIn * 1000),
        },
      };
    } catch (error: any) {
      console.error('Microsoft OAuth error:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Token refresh failed');
      }

      const data = await response.json();
      
      return {
        user: data.user,
        tokens: {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || refreshToken,
          expiresAt: Date.now() + (data.expiresIn * 1000),
        },
      };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Logout (invalidate tokens)
   */
  static async logout(accessToken: string): Promise<void> {
    try {
      await fetch(`${this.config.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // Don't throw error for logout - local cleanup is more important
      console.error('Logout API error:', error);
    }
  }

  /**
   * Hash password for secure storage
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      return hash;
    } catch (error) {
      console.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(accessToken: string): Promise<User> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get profile');
      }

      const user = await response.json();
      return user;
    } catch (error: any) {
      console.error('Get profile error:', error);
      throw error;
    }
  }
}