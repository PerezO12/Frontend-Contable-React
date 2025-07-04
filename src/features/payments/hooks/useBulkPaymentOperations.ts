/**
 * Hook para operaciones bulk de pagos
 * Implementa confirmación, cancelación y eliminación en lote con validación
 */
import { useState } from 'react';
import { usePaymentStore } from '../stores/paymentStore';
import { useToast } from '@/shared/contexts/ToastContext';
import { PaymentStatus } from '../types';
import type { PaymentBatchConfirmation, BulkPaymentValidationResponse } from '../types';

export function useBulkPaymentOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const {
    batchConfirmPayments,
    bulkConfirmPaymentsWithValidation,
    validateBulkConfirmation,
    bulkCancelPayments,
    bulkDeletePayments,
    bulkPostPayments,
    bulkResetPayments,
    bulkDraftPayments,
    resetPayment,
    getBulkOperationsStatus,
    getOperationsSummary,
    selectedPayments,
    clearPaymentSelection,
    payments
  } = usePaymentStore();

  const selectedPaymentCount = selectedPayments.length;
  const selectedPaymentData = payments.filter(p => selectedPayments.includes(p.id));

  /**
   * Validar confirmación masiva antes de proceder
   */
  const validateConfirmation = async (paymentIds?: string[]): Promise<BulkPaymentValidationResponse> => {
    const ids = paymentIds || selectedPayments;
    if (ids.length === 0) {
      throw new Error('Debe seleccionar al menos un pago para validar');
    }

    return await validateBulkConfirmation(ids);
  };

  /**
   * Confirmar múltiples pagos con validación y opciones avanzadas
   */
  const confirmSelectedPaymentsWithValidation = async (
    confirmationNotes?: string, 
    force?: boolean
  ) => {
    if (selectedPaymentCount === 0) {
      showToast('Debe seleccionar al menos un pago para confirmar', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkConfirmPaymentsWithValidation(
        selectedPayments, 
        confirmationNotes, 
        force
      );
      
      const successCount = result.successful;
      const failCount = result.failed;
      
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

    // Solo log en desarrollo si hay problemas
    if (process.env.NODE_ENV === 'development' && selectedPaymentData.length > 10) {
      console.log('📊 Stats calculadas para', selectedPaymentData.length, 'pagos:', stats);
    }

    return stats;
  };

  /**
   * Verificar si la operación es válida para la selección actual
   */
  const canConfirm = selectedPaymentData.every(p => p.status === PaymentStatus.DRAFT);
  const canCancel = selectedPaymentData.some(p => p.status === PaymentStatus.POSTED);
  const canDelete = selectedPaymentData.every(p => p.status === PaymentStatus.DRAFT);
  const canPost = selectedPaymentData.every(p => p.status === PaymentStatus.DRAFT);
  const canReset = selectedPaymentData.some(p => p.status === PaymentStatus.POSTED || p.status === PaymentStatus.CANCELLED);
  const canDraft = selectedPaymentData.some(p => p.status === PaymentStatus.POSTED || p.status === PaymentStatus.CANCELLED);

  // Debug solo en desarrollo y cuando hay problemas
  if (process.env.NODE_ENV === 'development' && selectedPaymentData.length > 0) {
    console.log('🔍 Validaciones bulk:', {
      canConfirm,
      canCancel, 
      canDelete,
      canPost,
      canReset,
      canDraft,
      selectedCount: selectedPaymentData.length
    });
  }

  /**
   * Resetear pago individual (POSTED/CANCELLED → DRAFT)
   */
  const resetPaymentIndividual = async (paymentId: string) => {
    setIsLoading(true);
    try {
      await resetPayment(paymentId);
      showToast('Pago reseteado exitosamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al resetear pago', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Postear múltiples pagos en lote (DRAFT → POSTED)
   */
  const postSelectedPayments = async (postingNotes?: string) => {
    if (selectedPaymentCount === 0) {
      showToast('Debe seleccionar al menos un pago para postear', 'warning');
      return;
    }

    if (!canPost) {
      showToast('Solo se pueden postear pagos en estado BORRADOR', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkPostPayments(selectedPayments, postingNotes);
      
      const successCount = result.successful;
      const errorCount = result.failed;
      
      if (errorCount === 0) {
        showToast(`Se postearon exitosamente ${successCount} pago(s)`, 'success');
      } else {
        showToast(`Se postearon ${successCount} pago(s). ${errorCount} fallaron.`, 'warning');
      }
      
      clearPaymentSelection();
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error inesperado al postear pagos', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resetear múltiples pagos en lote (POSTED/CANCELLED → DRAFT)
   */
  const resetSelectedPayments = async (resetReason?: string) => {
    if (selectedPaymentCount === 0) {
      showToast('Debe seleccionar al menos un pago para resetear', 'warning');
      return;
    }

    if (!canReset) {
      showToast('Solo se pueden resetear pagos en estado POSTEADO o CANCELADO', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkResetPayments(selectedPayments, resetReason);
      
      const successCount = result.successful;
      const errorCount = result.failed;
      
      if (errorCount === 0) {
        showToast(`Se resetearon exitosamente ${successCount} pago(s)`, 'success');
      } else {
        showToast(`Se resetearon ${successCount} pago(s). ${errorCount} fallaron.`, 'warning');
      }
      
      clearPaymentSelection();
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error inesperado al resetear pagos', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cambiar múltiples pagos a borrador (POSTED/CANCELLED → DRAFT)
   */
  const draftSelectedPayments = async (draftReason?: string) => {
    if (selectedPaymentCount === 0) {
      showToast('Debe seleccionar al menos un pago para cambiar a borrador', 'warning');
      return;
    }

    if (!canDraft) {
      showToast('Solo se pueden cambiar a borrador pagos en estado POSTEADO o CANCELADO', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await bulkDraftPayments(selectedPayments, draftReason);
      
      const successCount = result.successful;
      const errorCount = result.failed;
      
      if (errorCount === 0) {
        showToast(`Se cambiaron a borrador exitosamente ${successCount} pago(s)`, 'success');
      } else {
        showToast(`Se cambiaron a borrador ${successCount} pago(s). ${errorCount} fallaron.`, 'warning');
      }
      
      clearPaymentSelection();
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error inesperado al cambiar pagos a borrador', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtener estado de operaciones en lote disponibles
   */
  const fetchBulkOperationsStatus = async () => {
    try {
      return await getBulkOperationsStatus();
    } catch (error: any) {
      showToast(error.message || 'Error al obtener estado de operaciones en lote', 'error');
      throw error;
    }
  };

  /**
   * Obtener resumen de operaciones para la selección actual
   */
  const fetchOperationsSummary = async (paymentIds?: string[]) => {
    try {
      const ids = paymentIds || selectedPayments;
      return await getOperationsSummary(ids);
    } catch (error: any) {
      showToast(error.message || 'Error al obtener resumen de operaciones', 'error');
      throw error;
    }
  };

  return {
    // Estado
    isLoading,
    selectedPaymentCount,
    selectedPaymentData,
    
    // Operaciones básicas
    confirmSelectedPayments,
    cancelSelectedPayments,
    deleteSelectedPayments,
    
    // Nuevas operaciones individuales
    resetPaymentIndividual,
    
    // Nuevas operaciones bulk
    postSelectedPayments,
    resetSelectedPayments,
    draftSelectedPayments,
    
    // Operaciones avanzadas con validación
    validateConfirmation,
    confirmSelectedPaymentsWithValidation,
    
    // Información y estado
    fetchBulkOperationsStatus,
    fetchOperationsSummary,
    
    // Utilidades
    getSelectionStats,
    
    // Validaciones actualizadas
    canConfirm,
    canCancel,
    canDelete,
    canPost,
    canReset,
    canDraft
  };
}
