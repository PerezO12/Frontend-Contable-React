import type { AuthTokens } from '../types';
import { STORAGE_KEYS } from '@/shared/constants';

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = STORAGE_KEYS.ACCESS_TOKEN;
  private static readonly REFRESH_TOKEN_KEY = STORAGE_KEYS.REFRESH_TOKEN;
  private static readonly TOKEN_EXPIRY_KEY = STORAGE_KEYS.TOKEN_EXPIRY;

  static setTokens(tokens: AuthTokens): void {
    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access_token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token);
      
      const expiryTime = Date.now() + (tokens.expires_in * 1000);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  static getTokens(): AuthTokens | null {
    try {
      const access_token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const refresh_token = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

      if (!access_token || !refresh_token || !expiry) {
        return null;
      }

      return {
        access_token,
        refresh_token,
        token_type: 'bearer',
        expires_in: Math.max(0, Math.floor((parseInt(expiry) - Date.now()) / 1000))
      };
    } catch (error) {
      console.error('Error retrieving tokens:', error);
      return null;
    }
  }

  static getAccessToken(): string | null {
    try {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving access token:', error);
      return null;
    }
  }

  static getRefreshToken(): string | null {
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving refresh token:', error);
      return null;
    }
  }

  static clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  static shouldRefreshToken(): boolean {
    try {
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (!expiry) return false;
      
      // Renovar si expira en menos de 5 minutos
      const expiryTime = parseInt(expiry);
      const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
      
      return expiryTime <= fiveMinutesFromNow;
    } catch (error) {
      console.error('Error checking if token should refresh:', error);
      return false;
    }
  }

  static getTokenExpirationTime(): Date | null {
    try {
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      return expiry ? new Date(parseInt(expiry)) : null;
    } catch (error) {
      console.error('Error getting token expiration time:', error);
      return null;
    }
  }
}
