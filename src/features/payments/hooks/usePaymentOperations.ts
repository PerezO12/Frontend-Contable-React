/**
 * Hook para operaciones individuales de pagos
 * Implementa confirmación, cancelación, reseteo y eliminación individual
 */
import { useState } from 'react';
import { usePaymentStore } from '../stores/paymentStore';
import { useToast } from '@/shared/contexts/ToastContext';
import { PaymentStatus } from '../types';
import type { Payment } from '../types';

export function usePaymentOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const {
    confirmPayment,
    cancelPayment,
    resetPayment,
    deletePayment,
    fetchPayments
  } = usePaymentStore();

  /**
   * Confirmar pago individual (DRAFT → POSTED)
   */
  const confirmPaymentAction = async (paymentId: string) => {
    setIsLoading(true);
    try {
      const result = await confirmPayment(paymentId);
      showToast(`Pago ${result.number} confirmado exitosamente`, 'success');
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error al confirmar pago', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancelar pago individual
   */
  const cancelPaymentAction = async (paymentId: string) => {
    setIsLoading(true);
    try {
      await cancelPayment(paymentId);
      showToast('Pago cancelado exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al cancelar pago', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resetear pago individual (POSTED/CANCELLED → DRAFT)
   */
  const resetPaymentAction = async (paymentId: string) => {
    setIsLoading(true);
    try {
      await resetPayment(paymentId);
      showToast('Pago reseteado a borrador exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al resetear pago', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Eliminar pago individual (solo DRAFT)
   */
  const deletePaymentAction = async (paymentId: string) => {
    setIsLoading(true);
    try {
      await deletePayment(paymentId);
      showToast('Pago eliminado exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar pago', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar qué operaciones están disponibles para un pago
   */
  const getAvailableOperations = (payment: Payment) => {
    const operations = {
      canConfirm: payment.status === PaymentStatus.DRAFT,
      canCancel: payment.status !== PaymentStatus.CANCELLED,
      canReset: payment.status === PaymentStatus.POSTED || payment.status === PaymentStatus.CANCELLED,
      canDelete: payment.status === PaymentStatus.DRAFT,
      canEdit: payment.status === PaymentStatus.DRAFT,
      canView: true
    };

    return operations;
  };

  /**
   * Obtener estado descriptivo de un pago
   */
  const getPaymentStatusInfo = (status: PaymentStatus) => {
    const statusInfo = {
      [PaymentStatus.DRAFT]: {
        label: 'Borrador',
        color: 'yellow',
        description: 'Pago en borrador, completamente editable',
        availableActions: ['Confirmar', 'Editar', 'Cancelar', 'Eliminar']
      },
      [PaymentStatus.POSTED]: {
        label: 'Posteado',
        color: 'green',
        description: 'Pago contabilizado con asiento creado',
        availableActions: ['Ver', 'Resetear', 'Cancelar']
      },
      [PaymentStatus.CANCELLED]: {
        label: 'Cancelado',
        color: 'red',
        description: 'Pago cancelado, estado final',
        availableActions: ['Ver', 'Resetear']
      }
    };

    return statusInfo[status] || {
      label: 'Desconocido',
      color: 'gray',
      description: 'Estado desconocido',
      availableActions: []
    };
  };

  /**
   * Refrescar lista de pagos después de operaciones
   */
  const refreshPayments = async () => {
    try {
      await fetchPayments();
    } catch (error: any) {
      showToast('Error al actualizar lista de pagos', 'error');
    }
  };

  return {
    // Estado
    isLoading,
    
    // Operaciones individuales
    confirmPaymentAction,
    cancelPaymentAction,
    resetPaymentAction,
    deletePaymentAction,
    
    // Utilidades
    getAvailableOperations,
    getPaymentStatusInfo,
    refreshPayments
  };
}
