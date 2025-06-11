import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/authService';
import { TokenManager } from '../utils/tokenManager';
import type { AuthState, AuthContextType, LoginCredentials, User, AuthTokens } from '../types';

// Tipos para el reducer
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; tokens: AuthTokens } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_TOKENS'; payload: AuthTokens }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer para manejar el estado de autenticación
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { 
        ...state, 
        isLoading: true, 
        error: null 
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: true
      };
    
    case 'SET_TOKENS':
      return { 
        ...state, 
        tokens: action.payload 
      };
    
    case 'CLEAR_ERROR':
      return { 
        ...state, 
        error: null 
      };
    
    case 'SET_LOADING':
      return { 
        ...state, 
        isLoading: action.payload 
      };
    
    default:
      return state;
  }
};

// Estado inicial
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicialización: verificar tokens existentes al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const tokens = TokenManager.getTokens();
        
        if (tokens && !TokenManager.isTokenExpired(tokens.access_token)) {
          // Intentar obtener el usuario actual
          try {
            const user = await AuthService.getCurrentUser();
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user, tokens } 
            });
          } catch (error) {
            // Si falla la obtención del usuario, limpiar tokens
            TokenManager.clearTokens();
            dispatch({ type: 'LOGOUT' });
          }
        } else {
          // Tokens expirados o no existentes
          TokenManager.clearTokens();
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        TokenManager.clearTokens();
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initAuth();
  }, []);

  // Función de login
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Realizar login
      const tokens = await AuthService.login(credentials);
      
      // Guardar tokens
      TokenManager.setTokens(tokens);
      
      // Obtener información del usuario
      const user = await AuthService.getCurrentUser();
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user, tokens } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de login';
      dispatch({ 
        type: 'LOGIN_ERROR', 
        payload: errorMessage 
      });
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      dispatch({ type: 'LOGOUT' });
    }
  };
  // Función para renovar token
  const refreshToken = useCallback(async () => {
    const tokens = TokenManager.getTokens();
    
    if (!tokens?.refresh_token) {
      dispatch({ type: 'LOGOUT' });
      TokenManager.clearTokens();
      return;
    }

    try {
      const newTokens = await AuthService.refreshToken(tokens.refresh_token);
      TokenManager.setTokens(newTokens);
      dispatch({ type: 'SET_TOKENS', payload: newTokens });
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: 'LOGOUT' });
      TokenManager.clearTokens();
    }
  }, []); // No dependencies - this function should be stable

  // Función para limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);  // Configurar renovación automática de tokens
  useEffect(() => {
    if (!state.isAuthenticated) return;

    const interval = setInterval(() => {
      if (TokenManager.shouldRefreshToken()) {
        refreshToken();
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [state.isAuthenticated, refreshToken]);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
