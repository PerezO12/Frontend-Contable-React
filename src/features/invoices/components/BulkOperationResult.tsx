/**
 * Componente para mostrar resultados de operaciones bulk
 * Muestra estadísticas detalladas y logs de lo que ocurrió
 */
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationCircleIcon 
} from '@/shared/components/icons';
import type { BulkOperationResult } from '../types';

interface BulkOperationResultDisplayProps {
  result: BulkOperationResult;
  operation: string;
  onClose: () => void;
}

export function BulkOperationResultDisplay({
  result,
  operation,
  onClose
}: BulkOperationResultDisplayProps) {
  const getOperationLabel = (op: string) => {
    switch (op) {
      case 'post': return 'Contabilización';
      case 'cancel': return 'Cancelación';
      case 'reset': return 'Reset a Borrador';
      case 'delete': return 'Eliminación';
      default: return 'Operación';
    }
  };

  const successRate = result.total_requested > 0 
    ? Math.round((result.successful / result.total_requested) * 100) 
    : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Resultado de {getOperationLabel(operation)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Operación completada en {result.execution_time_seconds.toFixed(2)} segundos
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {result.total_requested}
            </div>
            <div className="text-sm text-blue-600">
              Total solicitadas
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {result.successful}
            </div>
            <div className="text-sm text-green-600">
              Exitosas ({successRate}%)
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {result.failed}
            </div>
            <div className="text-sm text-red-600">
              Fallidas
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {result.skipped}
            </div>
            <div className="text-sm text-yellow-600">
              Omitidas
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${successRate}%` }}
          ></div>
        </div>

        {/* Facturas exitosas */}
        {result.successful > 0 && (
          <div>
            <h4 className="font-medium text-green-600 mb-3 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Facturas procesadas exitosamente ({result.successful})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {result.successful_ids.map(id => (
                <Badge key={id} color="green" variant="subtle" className="mr-2">
                  {id}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Facturas fallidas */}
        {result.failed > 0 && (
          <div>
            <h4 className="font-medium text-red-600 mb-3 flex items-center">
              <XCircleIcon className="h-5 w-5 mr-2" />
              Facturas que fallaron ({result.failed})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {result.failed_items.map(item => (
                <div key={item.id} className="p-3 bg-red-50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-red-800">
                      {item.invoice_number || item.id}
                    </span>
                    <Badge color="red" variant="subtle">
                      Error
                    </Badge>
                  </div>
                  <div className="text-sm text-red-600">
                    {item.error}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facturas omitidas */}
        {result.skipped > 0 && (
          <div>
            <h4 className="font-medium text-yellow-600 mb-3 flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              Facturas omitidas ({result.skipped})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {result.skipped_items.map(item => (
                <div key={item.id} className="p-3 bg-yellow-50 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-yellow-800">
                      {item.id}
                    </span>
                    <Badge color="yellow" variant="subtle">
                      {item.current_status}
                    </Badge>
                  </div>
                  <div className="text-sm text-yellow-600">
                    {item.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen final */}
        <div className="border-t pt-4">
          <div className="text-sm text-gray-600">
            {result.successful > 0 && (
              <div className="text-green-600 font-medium mb-1">
                ✓ {result.successful} facturas procesadas correctamente
              </div>
            )}
            {result.failed > 0 && (
              <div className="text-red-600 font-medium mb-1">
                ✗ {result.failed} facturas fallaron en el procesamiento
              </div>
            )}
            {result.skipped > 0 && (
              <div className="text-yellow-600 font-medium mb-1">
                ⚠ {result.skipped} facturas fueron omitidas
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
