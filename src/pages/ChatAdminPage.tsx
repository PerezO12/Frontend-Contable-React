import React, { useState, useEffect } from 'react';
import { useChatSettings } from '../hooks/useChatSettings';
import { chatAPIService } from '../services/chatAPI';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '../shared/components/icons';

const ChatAdminPage: React.FC = () => {
  const { settings, isLoading, error, checkChatHealth, toggleChatEnabled } = useChatSettings();
  const [testMessage, setTestMessage] = useState('Hola, ¿cómo estás?');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [aiHealthStatus, setAiHealthStatus] = useState<any>(null);
  const [chatCapabilities, setChatCapabilities] = useState<any>(null);

  // Cargar información adicional al inicializar
  useEffect(() => {
    loadAdditionalInfo();
  }, []);

  const loadAdditionalInfo = async () => {
    try {
      // Solo cargar información de salud básica que existe
      const aiHealth = await chatAPIService.checkHealth();
      setAiHealthStatus(aiHealth);
      setChatCapabilities(null); // No disponible por ahora
    } catch (err) {
      console.error('Error loading additional info:', err);
    }
  };

  const handleTestTranslation = async () => {
    try {
      setTestLoading(true);
      // Usar el test básico disponible
      const result = await chatAPIService.testChat();
      setTestResult({ translationTest: result });
    } catch (err) {
      setTestResult({ error: err instanceof Error ? err.message : 'Error en prueba de traducción' });
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestChat = async () => {
    try {
      setTestLoading(true);
      const result = await chatAPIService.sendMessage({
        message: testMessage
      });
      setTestResult({ chatResponse: result });
    } catch (err) {
      setTestResult({ error: err instanceof Error ? err.message : 'Error en chat' });
    } finally {
      setTestLoading(false);
    }
  };

  const handleTestAI = async () => {
    try {
      setTestLoading(true);
      // Usar el test básico disponible
      const result = await chatAPIService.testChat();
      setTestResult({ aiTest: result });
    } catch (err) {
      setTestResult({ error: err instanceof Error ? err.message : 'Error en test de IA' });
    } finally {
      setTestLoading(false);
    }
  };

  const getStatusIcon = (status: string, isLoaded?: boolean) => {
    if (status === 'healthy' && isLoaded) {
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    } else if (status === 'degraded') {
      return <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            Administración de Chat IA
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Configuración y monitoreo del servicio de chat con inteligencia artificial
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado del Servicio */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Estado del Servicio</h2>
            
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-500">Verificando estado...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex items-center">
                  <XCircleIcon className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Estado General</span>
                    {getStatusIcon(settings.healthStatus?.status || 'unknown')}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {settings.healthStatus?.message || 'Estado desconocido'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Modelos de Traducción</span>
                    {getStatusIcon('healthy', settings.healthStatus?.translation_models_loaded)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {settings.healthStatus?.translation_models_loaded ? 'Cargados' : 'No disponibles'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Hugging Face API</span>
                    {getStatusIcon('healthy', settings.healthStatus?.hf_client_configured)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {settings.healthStatus?.hf_client_configured ? 'Configurado' : 'No configurado'}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">OpenAI Disponible</span>
                    {aiHealthStatus?.openai_available ? 
                      <CheckCircleIcon className="w-5 h-5 text-green-500" /> : 
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    }
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {aiHealthStatus?.using_fallback ? 
                      `Usando fallback: ${aiHealthStatus.fallback_reason}` : 
                      'OpenAI operativo'
                    }
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Chat Habilitado</span>
                    {settings.isEnabled ? 
                      <CheckCircleIcon className="w-5 h-5 text-green-500" /> : 
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    }
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {settings.isEnabled ? 'Activo' : 'Deshabilitado'}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-4 flex space-x-3">
              <button
                onClick={checkChatHealth}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
              >
                Verificar Estado
              </button>
              
              <button
                onClick={toggleChatEnabled}
                className={`px-4 py-2 rounded-md text-sm ${
                  settings.isEnabled 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {settings.isEnabled ? 'Deshabilitar Chat' : 'Habilitar Chat'}
              </button>
            </div>
          </div>

          {/* Pruebas del Sistema */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pruebas del Sistema</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje de Prueba
                </label>
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingresa un mensaje para probar..."
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleTestTranslation}
                  disabled={testLoading || !testMessage.trim()}
                  className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 text-sm"
                >
                  Probar Traducción
                </button>
                
                <button
                  onClick={handleTestChat}
                  disabled={testLoading || !testMessage.trim() || !settings.isHealthy}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 text-sm"
                >
                  Probar Chat Completo
                </button>

                <button
                  onClick={handleTestAI}
                  disabled={testLoading || !testMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm"
                >
                  Probar IA OpenAI
                </button>
              </div>

              {testLoading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-500">Ejecutando prueba...</span>
                </div>
              )}

              {testResult && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Resultado de la Prueba</h3>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Capacidades del Chat */}
          {chatCapabilities && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Capacidades del Sistema</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Idiomas Soportados</h3>
                  <div className="space-y-1">
                    {chatCapabilities.supported_languages?.map((lang: any) => (
                      <div key={lang.code} className="text-xs text-gray-600">
                        {lang.name} ({lang.code})
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Contextos Disponibles</h3>
                  <div className="space-y-1">
                    {chatCapabilities.context_types?.map((context: any) => (
                      <div key={context.code} className="text-xs text-gray-600">
                        {context.name} - {context.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Funcionalidades</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {chatCapabilities.capabilities?.map((capability: string, index: number) => (
                      <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {capability}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configuración de Permisos */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Permisos del Chat</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Usar Chat General</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  settings.permissions.canUseChat ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {settings.permissions.canUseChat ? 'Permitido' : 'Denegado'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Crear Facturas por IA</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  settings.permissions.canCreateInvoices ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {settings.permissions.canCreateInvoices ? 'Permitido' : 'Denegado'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Acceso a Servicios IA</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  settings.permissions.canAccessAI ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {settings.permissions.canAccessAI ? 'Permitido' : 'Denegado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAdminPage;
