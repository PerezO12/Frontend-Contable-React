import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { useDataImport } from '../hooks';
import type { ImportStatus } from '../types';
import { formatDuration } from '../utils';

interface ImportProgressProps {
  importId: string;
  onComplete: (result: any) => void;
  onCancel: () => void;
  className?: string;
}

export function ImportProgress({
  importId,
  onComplete,
  onCancel,
  className = ''
}: ImportProgressProps) {
  const { getImportStatus, cancelImport } = useDataImport();
  const [status, setStatus] = useState<ImportStatus | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const currentStatus = await getImportStatus(importId);
        setStatus(currentStatus);

        if (currentStatus.status === 'completed' || 
            currentStatus.status === 'failed' || 
            currentStatus.status === 'cancelled') {
          setIsPolling(false);
          onComplete(currentStatus);
        }
      } catch (error) {
        console.error('Error polling import status:', error);
        setIsPolling(false);
      }
    };

    if (isPolling) {
      // Poll immediately
      pollStatus();
      
      // Then poll every 2 seconds
      intervalId = setInterval(pollStatus, 2000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [importId, getImportStatus, onComplete, isPolling]);

  const handleCancel = async () => {
    try {
      await cancelImport(importId);
      setIsPolling(false);
      onCancel();
    } catch (error) {
      console.error('Error canceling import:', error);
    }  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'completed':
        return 'Completado';
      case 'failed':
        return 'Fallido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  if (!status) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Iniciando importación...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Progreso de Importación
            </h3>
            <p className="text-sm text-gray-600">
              ID: {importId}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status.status === 'completed' ? 'bg-green-100 text-green-800' :
              status.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              status.status === 'failed' ? 'bg-red-100 text-red-800' :
              status.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {getStatusLabel(status.status)}
            </span>
            
            {status.status === 'processing' && (
              <button
                onClick={handleCancel}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{status.progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                status.status === 'completed' ? 'bg-green-500' :
                status.status === 'failed' ? 'bg-red-500' :
                status.status === 'cancelled' ? 'bg-gray-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${status.progress}%` }}
            >
              {status.status === 'processing' && (
                <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">
              {status.processed_rows.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Procesadas</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {status.total_rows.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">
              {status.errors.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Errores</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-yellow-600">
              {status.warnings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Advertencias</p>
          </div>
        </div>

        {/* Batch Progress */}
        {status.total_batches > 1 && (
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Lotes procesados</span>
              <span>{status.current_batch} de {status.total_batches}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(status.current_batch / status.total_batches) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Time Information */}
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Iniciado:</span>{' '}
            {new Date(status.started_at).toLocaleTimeString()}
          </div>
          
          {status.estimated_remaining_time && status.status === 'processing' && (
            <div>
              <span className="font-medium">Tiempo estimado restante:</span>{' '}
              {formatDuration(status.estimated_remaining_time)}
            </div>
          )}
        </div>

        {/* Status Messages */}
        {status.status === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 text-sm">
                Procesando datos... Se están validando e importando los registros.
              </p>
            </div>
          </div>
        )}

        {status.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 text-sm">
                ¡Importación completada exitosamente! Todos los datos han sido procesados.
              </p>
            </div>
          </div>
        )}

        {status.status === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 text-sm">
                La importación ha fallado. Revise los errores y vuelva a intentar.
              </p>
            </div>
          </div>
        )}

        {status.status === 'cancelled' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700 text-sm">
                La importación ha sido cancelada por el usuario.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
