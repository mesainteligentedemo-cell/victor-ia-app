/**
 * Biometric Authentication for Mobile
 * Face ID, Touch ID, and Fingerprint support
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BiometricAuthStatus {
  isAvailable: boolean;
  isFaceIDAvailable: boolean;
  isTouchIDAvailable: boolean;
  isBiometricEnabled: boolean;
  lastAuthTime: number;
}

export interface BiometricCredentials {
  userId: string;
  email: string;
  token: string;
  refreshToken: string;
}

class BiometricAuthManager {
  private credentials: BiometricCredentials | null = null;
  private status: BiometricAuthStatus = {
    isAvailable: false,
    isFaceIDAvailable: false,
    isTouchIDAvailable: false,
    isBiometricEnabled: false,
    lastAuthTime: 0,
  };

  private readonly CREDENTIALS_KEY = 'biometric_credentials';
  private readonly STATUS_KEY = 'biometric_status';
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  /**
   * Initialize biometric auth
   */
  async initialize(): Promise<BiometricAuthStatus> {
    try {
      // Check if biometric is available
      const hasSecureStore = SecureStore.isAvailableAsync();

      // Load saved credentials if they exist
      const saved = await SecureStore.getItemAsync(this.CREDENTIALS_KEY);
      if (saved) {
        this.credentials = JSON.parse(saved);
      }

      // Check if biometric auth was previously enabled
      const statusStr = await AsyncStorage.getItem(this.STATUS_KEY);
      if (statusStr) {
        this.status = JSON.parse(statusStr);
      }

      return this.status;
    } catch (error) {
      console.error('Failed to initialize biometric auth:', error);
      return this.status;
    }
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometric(credentials: BiometricCredentials): Promise<boolean> {
    try {
      // Store credentials securely
      await SecureStore.setItemAsync(
        this.CREDENTIALS_KEY,
        JSON.stringify(credentials)
      );

      this.credentials = credentials;
      this.status.isBiometricEnabled = true;
      this.status.lastAuthTime = Date.now();

      await AsyncStorage.setItem(this.STATUS_KEY, JSON.stringify(this.status));

      return true;
    } catch (error) {
      console.error('Failed to enable biometric auth:', error);
      return false;
    }
  }

  /**
   * Authenticate with biometric
   */
  async authenticate(reason: string = 'Authenticate to access Victor IA'): Promise<BiometricCredentials | null> {
    try {
      if (!this.credentials) {
        return null;
      }

      // In a real app, you would use react-native-biometrics or similar
      // For now, we'll simulate the authentication
      // Real implementation would show FaceID/TouchID prompt

      // Simulate biometric prompt delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if token is still valid
      const expiryStr = await AsyncStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (expiryStr) {
        const expiry = parseInt(expiryStr);
        if (Date.now() > expiry) {
          // Token expired, need to refresh
          return null;
        }
      }

      this.status.lastAuthTime = Date.now();
      await AsyncStorage.setItem(this.STATUS_KEY, JSON.stringify(this.status));

      return this.credentials;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      return null;
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.CREDENTIALS_KEY);
      this.credentials = null;
      this.status.isBiometricEnabled = false;

      await AsyncStorage.setItem(this.STATUS_KEY, JSON.stringify(this.status));
    } catch (error) {
      console.error('Failed to disable biometric auth:', error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      // Call API to refresh token
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        return null;
      }

      const { token, expiresIn } = await response.json();

      if (this.credentials) {
        this.credentials.token = token;

        // Update stored credentials
        await SecureStore.setItemAsync(
          this.CREDENTIALS_KEY,
          JSON.stringify(this.credentials)
        );

        // Store token expiry
        const expiry = Date.now() + expiresIn * 1000;
        await AsyncStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toString());
      }

      return token;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  /**
   * Clear all stored credentials (logout)
   */
  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.CREDENTIALS_KEY);
      await AsyncStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      await AsyncStorage.removeItem(this.STATUS_KEY);

      this.credentials = null;
      this.status = {
        isAvailable: false,
        isFaceIDAvailable: false,
        isTouchIDAvailable: false,
        isBiometricEnabled: false,
        lastAuthTime: 0,
      };
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  /**
   * Get current authentication status
   */
  getStatus(): BiometricAuthStatus {
    return { ...this.status };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.credentials !== null && this.status.isBiometricEnabled;
  }

  /**
   * Get stored credentials
   */
  getCredentials(): BiometricCredentials | null {
    return this.credentials ? { ...this.credentials } : null;
  }
}

export default new BiometricAuthManager();