/**
 * Componente de detalle de pago
 * Muestra información completa de un pago en una página dedicada
 */
import { useState } from 'react';
import { PaymentFlowAPI } from '../api/paymentFlowAPI';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { PAYMENT_STATUS_LABELS, PAYMENT_TYPE_LABELS, PaymentStatus } from '../types';
import type { Payment } from '../types';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon
} from '@/shared/components/icons';

interface PaymentDetailProps {
  payment: Payment;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
}

export function PaymentDetail({ payment, onEdit, onDelete, loading = false }: PaymentDetailProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!payment) return;
    
    try {
      setIsProcessing(true);
      await PaymentFlowAPI.confirmPayment(payment.id);
      // En una página, el refetch se maneja desde el hook de la página padre
      window.location.reload(); // Temporal hasta implementar mejor manejo de estado
    } catch (err) {
      console.error('Error al confirmar pago:', err);
      alert('Error al confirmar el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!payment) return;
    
    if (confirm(`¿Estás seguro de que deseas cancelar el pago "${payment.reference}"?`)) {
      try {
        setIsProcessing(true);
        await PaymentFlowAPI.cancelPayment(payment.id);
        // En una página, el refetch se maneja desde el hook de la página padre
        window.location.reload(); // Temporal hasta implementar mejor manejo de estado
      } catch (err) {
        console.error('Error al cancelar pago:', err);
        alert('Error al cancelar el pago');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const renderStatusBadge = (status: string) => {
    const config = {
      DRAFT: { color: 'yellow' as const, icon: ExclamationCircleIcon },
      POSTED: { color: 'green' as const, icon: CheckCircleIcon },
      CANCELLED: { color: 'red' as const, icon: XCircleIcon }
    };

    const { color, icon: Icon } = config[status as keyof typeof config] || { color: 'gray' as const, icon: ExclamationCircleIcon };
    
    return (
      <Badge color={color} variant="subtle">
        <Icon className="h-3 w-3 mr-1" />
        {PAYMENT_STATUS_LABELS[status as keyof typeof PAYMENT_STATUS_LABELS] || 'Estado desconocido'}
      </Badge>
    );
  };

  return (
    <Card>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Detalle del Pago
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {payment.reference || 'Sin referencia'}
            </p>
          </div>
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                disabled={loading}
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Eliminar
              </Button>
            )}
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              {renderStatusBadge(payment.status)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pago
              </label>
              <p className="text-sm text-gray-900">
                {PAYMENT_TYPE_LABELS[payment.payment_type as keyof typeof PAYMENT_TYPE_LABELS] || 'Tipo no especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Pago
              </label>
              <p className="text-sm text-gray-900">
                {formatDate(payment.payment_date)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tercero
              </label>
              <p className="text-sm text-gray-900">
                {payment.partner_name || 'No especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diario
              </label>
              <p className="text-sm text-gray-900">
                {payment.journal_name || 'No especificado'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia
              </label>
              <p className="text-sm text-gray-900">
                {payment.reference || 'Sin referencia'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <p className="text-sm text-gray-900">
                {payment.description || 'Sin descripción'}
              </p>
            </div>
          </div>
        </div>

        {/* Acciones de estado */}
        {payment.status === PaymentStatus.DRAFT && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isProcessing}
              className="text-red-600 hover:text-red-700"
            >
              {isProcessing ? 'Procesando...' : 'Cancelar Pago'}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
