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

// Interceptor de request: agregar token y logging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = TokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Logging detallado para requests de importación
    if (config.url?.includes('/import/')) {
      console.log('🌐 === INTERCEPTOR REQUEST ===');
      console.log('📍 URL:', config.url);
      console.log('🔧 Method:', config.method?.toUpperCase());
      console.log('📋 Headers:', config.headers);
      
      if (config.data instanceof FormData) {
        console.log('📦 FormData detected:');
        for (let [key, value] of config.data.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }
      } else {
        console.log('📄 Data:', config.data);
      }
      console.log('⏱️ Timeout:', config.timeout);
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response: manejar token expirado y logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Logging detallado para responses de importación
    if (response.config.url?.includes('/import/')) {
      console.log('📥 === INTERCEPTOR RESPONSE ===');
      console.log('📍 URL:', response.config.url);
      console.log('✅ Status:', response.status);
      console.log('📋 Headers:', response.headers);
      console.log('📄 Data:', response.data);
    }
    return response;
  },
  async (error: AxiosError) => {
    // Logging de errores para importación
    if (error.config?.url?.includes('/import/')) {
      console.log('❌ === INTERCEPTOR ERROR ===');
      console.log('📍 URL:', error.config.url);
      console.log('🔥 Error:', error.message);
      if (error.response) {
        console.log('📊 Status:', error.response.status);
        console.log('📋 Headers:', error.response.headers);
        console.log('📄 Data:', error.response.data);
      }
    }

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
