import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { TokenManager } from '@/features/auth/utils/tokenManager';
import { APP_CONFIG } from '@/shared/constants';

// Configuración base
export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar bucles infinitos en refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor de request: agregar token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: manejar token expirado
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, poner en cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;      try {
        const refreshToken = TokenManager.getRefreshToken();
        if (refreshToken) {
          // Make a direct refresh request to avoid circular dependency
          const refreshResponse = await axios.post(
            `${APP_CONFIG.API_URL}/api/v1/auth/refresh`,
            { refresh_token: refreshToken },
            { timeout: 10000 }
          );
          
          const newTokens = refreshResponse.data;
          TokenManager.setTokens(newTokens);
          processQueue(null, newTokens.access_token);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`;
          }
          
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        TokenManager.clearTokens();
        
        // Redirigir al login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Utilidades para manejo de errores
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data) {
    const data = error.response.data as any;
    return data.detail || data.message || 'Error en el servidor';
  }
  
  if (error.request) {
    return 'Error de conexión. Verifique su conexión a internet.';
  }
  
  return error.message || 'Error desconocido';
};

export const isNetworkError = (error: AxiosError): boolean => {
  return !error.response && !!error.request;
};

export default apiClient;
