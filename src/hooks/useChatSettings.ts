/**
 * Hook para verificar si el chat debe estar disponible para el usuario actual
 */
import { useState, useEffect } from 'react';
import { chatAPIService } from '../services/chatAPI';

export interface ChatPermissions {
  canUseChat: boolean;
  canCreateInvoices: boolean;
  canAccessAI: boolean;
}

export interface ChatSettings {
  isEnabled: boolean;
  isHealthy: boolean;
  permissions: ChatPermissions;
  healthStatus?: {
    status: string;
    translation_models_loaded: boolean;
    hf_client_configured: boolean;
    message: string;
  };
}

export const useChatSettings = () => {
  const [settings, setSettings] = useState<ChatSettings>({
    isEnabled: true, // Por defecto habilitado
    isHealthy: false,
    permissions: {
      canUseChat: true,
      canCreateInvoices: true,
      canAccessAI: true,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkChatHealth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const healthStatus = await chatAPIService.checkHealth();
      
      setSettings(prev => ({
        ...prev,
        isHealthy: healthStatus.openai_available || healthStatus.fallback_available,
        healthStatus: {
          status: healthStatus.openai_available ? 'healthy' : 'limited',
          translation_models_loaded: healthStatus.fallback_available,
          hf_client_configured: healthStatus.api_key_configured,
          message: healthStatus.current_model,
        },
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error checking chat health';
      setError(errorMessage);
      
      setSettings(prev => ({
        ...prev,
        isHealthy: false,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatEnabled = () => {
    setSettings(prev => ({
      ...prev,
      isEnabled: !prev.isEnabled,
    }));
  };

  // Verificar salud del chat al inicializar
  useEffect(() => {
    checkChatHealth();
  }, []);

  return {
    settings,
    isLoading,
    error,
    checkChatHealth,
    toggleChatEnabled,
  };
};
