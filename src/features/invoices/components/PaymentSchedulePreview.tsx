/**
 * Componente para mostrar la vista previa de payment schedule
 * Implementa el flujo Odoo de múltiples vencimientos
 */
import { useState, useEffect } from 'react';
import { InvoiceAPI } from '../api/invoiceAPI';
import { type PaymentSchedulePreview } from '../types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DocumentTextIcon } from '@/shared/components/icons';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';

interface PaymentSchedulePreviewProps {
  invoiceId?: string;
  invoiceAmount?: number;
  paymentTermsId?: string;
  invoiceDate?: string;
  onRefresh?: () => void;
  className?: string;
}

export function PaymentSchedulePreview({ 
  invoiceId,
  invoiceAmount,
  paymentTermsId,
  invoiceDate: _invoiceDate, // Marked as unused with underscore prefix
  onRefresh,
  className = ''
}: PaymentSchedulePreviewProps) {
  const [schedule, setSchedule] = useState<PaymentSchedulePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invoiceId) {
      loadPaymentSchedule();
    }
  }, [invoiceId, paymentTermsId]);

  const loadPaymentSchedule = async () => {
    if (!invoiceId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await InvoiceAPI.getPaymentSchedulePreview(invoiceId);
      setSchedule(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la vista previa de pagos');
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadPaymentSchedule();
    onRefresh?.();
  };

  const totalAmount = schedule.reduce((sum, item) => sum + item.amount, 0);

  if (!invoiceId && !paymentTermsId) {
    return (
      <Card className={`p-4 ${className}`}>        <div className="text-center text-gray-500">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>Selecciona condiciones de pago para ver la vista previa</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          📅 Vista Previa de Vencimientos
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : 'Actualizar'}
        </Button>
      </div>

      {loading && schedule.length === 0 ? (
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-2 text-gray-500">Calculando vencimientos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">
            ⚠️ Error al cargar vencimientos
          </div>
          <p className="text-gray-500 text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="mt-2"
          >
            Reintentar
          </Button>
        </div>
      ) : schedule.length === 0 ? (        <div className="text-center py-8 text-gray-500">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No hay vencimientos configurados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Resumen */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                Total: {schedule.length} vencimiento{schedule.length !== 1 ? 's' : ''}
              </span>
              <span className="text-lg font-bold text-blue-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          {/* Lista de vencimientos */}
          <div className="space-y-2">
            {schedule.map((item) => (
              <div
                key={item.sequence}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {item.sequence}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.percentage}% del total
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {formatCurrency(item.amount)}
                    </div>                    <div className="text-sm text-gray-500 flex items-center">
                      📅 {formatDate(item.due_date)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Validación de totales */}
          {invoiceAmount && Math.abs(totalAmount - invoiceAmount) > 0.01 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-600">⚠️</span>
                <div className="ml-2 text-sm">
                  <p className="font-medium text-yellow-800">
                    Advertencia: Los vencimientos no coinciden con el total
                  </p>
                  <p className="text-yellow-700">
                    Total factura: {formatCurrency(invoiceAmount)} | 
                    Total vencimientos: {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
