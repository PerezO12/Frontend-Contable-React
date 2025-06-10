import React, { useState, useEffect } from 'react';
import { AuthService } from '@/features/auth/services/authService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/shared/hooks/useToast';
import type { UserSession } from '@/features/auth/types';

export const SessionManagement: React.FC = () => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [terminatingSession, setTerminatingSession] = useState<string | null>(null);

  const { success, error: showError } = useToast();

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const userSessions = await AuthService.getUserSessions();
      setSessions(userSessions);
    } catch (error) {
      showError('Error', 'No se pudieron cargar las sesiones activas');
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    if (terminatingSession) return;

    try {
      setTerminatingSession(sessionId);
      await AuthService.terminateSession(sessionId);
      success('Sesión terminada', 'La sesión ha sido cerrada exitosamente');
      
      // Recargar sesiones
      await loadSessions();
    } catch (error) {
      showError('Error', 'No se pudo terminar la sesión');
      console.error('Error terminating session:', error);
    } finally {
      setTerminatingSession(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (deviceInfo: string) => {
    const device = deviceInfo.toLowerCase();
    if (device.includes('mobile') || device.includes('android') || device.includes('iphone')) {
      return '📱';
    } else if (device.includes('tablet') || device.includes('ipad')) {
      return '📟';
    } else {
      return '💻';
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
        <span className="ml-3 text-gray-600">Cargando sesiones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sesiones Activas</h2>
        <Button
          variant="secondary"
          onClick={loadSessions}
          disabled={isLoading}
        >
          Actualizar
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No hay sesiones activas</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">
                    {getDeviceIcon(session.device_info)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {session.device_info}
                      </h3>
                      {session.is_current && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Sesión actual
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 space-y-1 text-sm text-gray-500">
                      <p>
                        <span className="font-medium">IP:</span> {session.ip_address}
                      </p>
                      <p>
                        <span className="font-medium">Iniciada:</span> {formatDate(session.created_at)}
                      </p>
                      <p>
                        <span className="font-medium">Última actividad:</span> {formatDate(session.last_activity)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {!session.is_current && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => terminateSession(session.id)}
                      isLoading={terminatingSession === session.id}
                      disabled={terminatingSession !== null}
                    >
                      {terminatingSession === session.id ? 'Terminando...' : 'Terminar'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-900">Información sobre sesiones</h4>
            <div className="mt-2 text-sm text-blue-700 space-y-1">
              <p>• Las sesiones se mantienen activas por 30 minutos de inactividad</p>
              <p>• Puedes tener máximo 5 sesiones activas simultáneamente</p>
              <p>• Cerrar una sesión remota no afecta tu sesión actual</p>
              <p>• La sesión actual se actualiza automáticamente con cada acción</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
