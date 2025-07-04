import React, { useState, useEffect } from 'react';
import { chatAPIService } from '../../services/chatAPI';
import type { ChatHealthResponse } from '../../services/chatAPI';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon
} from '../../shared/components/icons';

interface ChatStatusProps {
  className?: string;
}

const ChatStatus: React.FC<ChatStatusProps> = ({ className = '' }) => {
  const [healthStatus, setHealthStatus] = useState<ChatHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await chatAPIService.checkHealth();
      setHealthStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error checking health');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Verificar cada 30 segundos
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (available: boolean) => {
    if (available) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    }
    return <XCircleIcon className="w-5 h-5 text-red-500" />;
  };

  const getOverallStatus = () => {
    if (!healthStatus) return 'unknown';
    
    if (healthStatus.openai_available && healthStatus.api_key_configured) {
      return 'optimal';
    } else if (healthStatus.fallback_available) {
      return 'degraded';
    } else {
      return 'error';
    }
  };

  const getOverallStatusDisplay = () => {
    const status = getOverallStatus();
    
    switch (status) {
      case 'optimal':
        return {
          icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
          text: 'OpenAI Disponible',
          className: 'bg-green-50 border-green-200'
        };
      case 'degraded':
        return {
          icon: <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />,
          text: 'Modo Fallback',
          className: 'bg-yellow-50 border-yellow-200'
        };
      case 'error':
        return {
          icon: <XCircleIcon className="w-5 h-5 text-red-500" />,
          text: 'No Disponible',
          className: 'bg-red-50 border-red-200'
        };
      default:
        return {
          icon: <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />,
          text: 'Verificando...',
          className: 'bg-gray-50 border-gray-200'
        };
    }
  };

  if (error) {
    return (
      <div className={`p-3 border rounded-lg bg-red-50 border-red-200 ${className}`}>
        <div className="flex items-center space-x-2">
          <XCircleIcon className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">Error: {error}</span>
          <button
            onClick={checkHealth}
            className="ml-auto text-xs text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const statusDisplay = getOverallStatusDisplay();

  return (
    <div className={`p-3 border rounded-lg ${statusDisplay.className} ${className}`}>
      <div className="space-y-2">
        {/* Estado general */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {statusDisplay.icon}
            <span className="text-sm font-medium">{statusDisplay.text}</span>
          </div>
          <button
            onClick={checkHealth}
            disabled={isLoading}
            className="text-xs text-gray-600 hover:text-gray-800 underline disabled:opacity-50"
          >
            {isLoading ? 'Verificando...' : 'Actualizar'}
          </button>
        </div>

        {/* Detalles del estado */}
        {healthStatus && (
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span>OpenAI:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(healthStatus.openai_available)}
                <span className={healthStatus.openai_available ? 'text-green-700' : 'text-red-700'}>
                  {healthStatus.openai_available ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>API Key:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(healthStatus.api_key_configured)}
                <span className={healthStatus.api_key_configured ? 'text-green-700' : 'text-red-700'}>
                  {healthStatus.api_key_configured ? 'Configurada' : 'Falta'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Fallback:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(healthStatus.fallback_available)}
                <span className={healthStatus.fallback_available ? 'text-green-700' : 'text-red-700'}>
                  {healthStatus.fallback_available ? 'Disponible' : 'No disponible'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-1 border-t border-gray-200">
              <span>Modelo:</span>
              <span className="font-mono text-xs">{healthStatus.current_model}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatStatus;
