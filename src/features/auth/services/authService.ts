import { apiClient, handleApiError } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants';
import type { LoginCredentials, AuthTokens, User, ChangePasswordData } from '../types';

export class AuthService {
  private static readonly BASE_URL = API_ENDPOINTS.AUTH;
  private static readonly USERS_URL = API_ENDPOINTS.USERS;

  static async login(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const response = await apiClient.post<AuthTokens>(
        this.BASE_URL.LOGIN,
        credentials
      );
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  static async loginForm(credentials: LoginCredentials): Promise<AuthTokens> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await apiClient.post<AuthTokens>(
        this.BASE_URL.LOGIN_FORM,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  static async refreshToken(refresh_token: string): Promise<AuthTokens> {
    try {
      const response = await apiClient.post<AuthTokens>(
        this.BASE_URL.REFRESH,
        { refresh_token }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  static async logout(): Promise<void> {
    try {
      await apiClient.post(this.BASE_URL.LOGOUT);
    } catch (error: any) {
      // No lanzar error en logout para permitir limpieza local
      console.error('Logout error:', handleApiError(error));
    }
  }

  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>(this.USERS_URL.ME);
      
      // Convertir el rol a mayúsculas si existe
      if (response.data && response.data.role) {
        response.data.role = response.data.role.toUpperCase() as any;
      }
      
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(
        this.USERS_URL.UPDATE_PROFILE,
        userData
      );
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  static async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      await apiClient.put(this.USERS_URL.CHANGE_PASSWORD, passwordData);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  static async getUserSessions(): Promise<any[]> {
    try {
      const response = await apiClient.get(this.USERS_URL.SESSIONS);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }

  static async terminateSession(sessionId: string): Promise<void> {
    try {
      await apiClient.delete(`${this.USERS_URL.SESSIONS}/${sessionId}`);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }
}
