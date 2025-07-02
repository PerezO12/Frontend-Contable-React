/**
 * Hook para operaciones bulk de pagos
 * Implementa confirmación, cancelación y eliminación en lote
 */
import { useState } from 'react';
import { usePaymentStore } from '../stores/paymentStore';
import { useToast } from '@/shared/contexts/ToastContext';
import { PaymentStatus } from '../types';
import type { PaymentBatchConfirmation } from '../types';

export function useBulkPaymentOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const {
    batchConfirmPayments,
    bulkCancelPayments,
    bulkDeletePayments,
    selectedPayments,
    clearPaymentSelection,
    payments
  } = usePaymentStore();

  const selectedPaymentCount = selectedPayments.length;
  const selectedPaymentData = payments.filter(p => selectedPayments.includes(p.id));

  /**
   * Confirmar múltiples pagos en lote (DRAFT → POSTED)
   */
  const confirmSelectedPayments = async () => {
    if (selectedPaymentCount === 0) {
      showToast('Debe seleccionar al menos un pago para confirmar', 'warning');
      return;
    }

    // Validar que todos los pagos estén en estado DRAFT
    const draftPayments = selectedPaymentData.filter(p => p.status === PaymentStatus.DRAFT);
    if (draftPayments.length !== selectedPaymentCount) {
      showToast('Solo se pueden confirmar pagos en estado BORRADOR', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result: PaymentBatchConfirmation = await batchConfirmPayments(selectedPayments);
      
      const successCount = result.successful_confirmations;
      const failCount = result.failed_confirmations;
      
      if (failCount === 0) {
        showToast(`Se confirmaron exitosamente ${successCount} pago(s)`, 'success');
      } else {
        showToast(`Se confirmaron ${successCount} pago(s). ${failCount} fallaron.`, 'warning');
      }
      
      clearPaymentSelection();
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error inesperado al confirmar pagos', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cancelar múltiples pagos en lote
   */
  const cancelSelectedPayments = async () => {
    if (selectedPaymentCount === 0) {
      showToast('Debe seleccionar al menos un pago para cancelar', 'warning');
      return;
    }

    // Validar que los pagos no estén ya cancelados
    const cancellablePayments = selectedPaymentData.filter(p => p.status !== PaymentStatus.CANCELLED);
    if (cancellablePayments.length === 0) {
      showToast('Los pagos seleccionados ya están cancelados', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkCancelPayments(selectedPayments);
      
      const successCount = result.cancelled;
      const errorCount = result.errors.length;
      
      if (errorCount === 0) {
        showToast(`Se cancelaron exitosamente ${successCount} pago(s)`, 'success');
      } else {
        showToast(`Se cancelaron ${successCount} pago(s). ${errorCount} fallaron.`, 'warning');
      }
      
      clearPaymentSelection();
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error inesperado al cancelar pagos', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Eliminar múltiples pagos en lote (solo DRAFT)
   */
  const deleteSelectedPayments = async () => {
    if (selectedPaymentCount === 0) {
      showToast('Debe seleccionar al menos un pago para eliminar', 'warning');
      return;
    }

    // Validar que todos los pagos estén en estado DRAFT
    const draftPayments = selectedPaymentData.filter(p => p.status === PaymentStatus.DRAFT);
    if (draftPayments.length !== selectedPaymentCount) {
      showToast('Solo se pueden eliminar pagos en estado BORRADOR', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkDeletePayments(selectedPayments);
      
      const successCount = result.deleted;
      const errorCount = result.errors.length;
      
      if (errorCount === 0) {
        showToast(`Se eliminaron exitosamente ${successCount} pago(s)`, 'success');
      } else {
        showToast(`Se eliminaron ${successCount} pago(s). ${errorCount} fallaron.`, 'warning');
      }
      
      clearPaymentSelection();
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error inesperado al eliminar pagos', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtener estadísticas de la selección actual
   */
  const getSelectionStats = () => {
    const stats = {
      total: selectedPaymentCount,
      byStatus: {} as Record<string, number>,
      totalAmount: 0,
      byCurrency: {} as Record<string, number>
    };

    selectedPaymentData.forEach(payment => {
      // Por estado
      stats.byStatus[payment.status] = (stats.byStatus[payment.status] || 0) + 1;
      
      // Por moneda
      const currency = payment.currency_code;
      stats.byCurrency[currency] = (stats.byCurrency[currency] || 0) + payment.amount;
      
      // Total (asumiendo conversión a moneda base, simplificado)
      stats.totalAmount += payment.amount;
    });

    return stats;
  };

  /**
   * Verificar si la operación es válida para la selección actual
   */
  const canConfirm = selectedPaymentData.every(p => p.status === PaymentStatus.DRAFT);
  const canCancel = selectedPaymentData.some(p => p.status !== PaymentStatus.CANCELLED);
  const canDelete = selectedPaymentData.every(p => p.status === PaymentStatus.DRAFT);

  return {
    // Estado
    isLoading,
    selectedPaymentCount,
    selectedPaymentData,
    
    // Operaciones
    confirmSelectedPayments,
    cancelSelectedPayments,
    deleteSelectedPayments,
    
    // Utilidades
    getSelectionStats,
    
    // Validaciones
    canConfirm,
    canCancel,
    canDelete
  };
}
