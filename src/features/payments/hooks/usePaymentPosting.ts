/**
 * Hook especializado para contabilización de pagos con validación completa
 * Maneja la validación previa y muestra detalles de errores al usuario
 */
import { useState } from 'react';
import { usePaymentStore } from '../stores/paymentStore';
import { usePaymentValidation } from './usePaymentValidation';
import { useToast } from '@/shared/contexts/ToastContext';
import { PaymentStatus } from '../types';

export function usePaymentPosting() {
  const [isPosting, setIsPosting] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  
  const { 
    bulkConfirmPaymentsWithValidation, // Usar el método consolidado
    selectedPayments, 
    clearPaymentSelection,
    payments 
  } = usePaymentStore();
  
  const { 
    validateSelectedPayments, 
    validationResult,
    hasValidationErrors,
    hasValidationWarnings,
    canProceedWithOperation 
  } = usePaymentValidation({ showDetailedErrors: true });
  
  const { showToast } = useToast();

  const selectedPaymentData = payments.filter(p => selectedPayments.includes(p.id));

  /**
   * Validar y contabilizar pagos seleccionados
   * Muestra detalles de validación si hay errores
   */
  const validateAndPostPayments = async (postingNotes?: string) => {
    if (selectedPayments.length === 0) {
      showToast('Debe seleccionar al menos un pago para contabilizar', 'warning');
      return;
    }

    console.log('📝 Iniciando validación para contabilización de pagos:', selectedPayments);

    // Filtrar solo pagos en borrador
    const draftPayments = selectedPaymentData.filter(p => p.status === PaymentStatus.DRAFT);
    if (draftPayments.length === 0) {
      showToast('No hay pagos en estado BORRADOR para contabilizar', 'warning');
      return;
    }

    if (draftPayments.length !== selectedPayments.length) {
      showToast(
        `Solo ${draftPayments.length} de ${selectedPayments.length} pagos están en estado BORRADOR y se pueden contabilizar`,
        'warning'
      );
    }

    const draftPaymentIds = draftPayments.map(p => p.id);

    try {
      // Validar pagos antes de contabilizar
      console.log('📝 Validando pagos en borrador:', draftPaymentIds);
      const validation = await validateSelectedPayments(draftPaymentIds);
      
      if (!validation) {
        showToast('Error al validar los pagos', 'error');
        return;
      }

      console.log('📝 Resultado de validación:', validation);

      // Si hay errores de bloqueo, mostrar modal de validación
      if (validation.blocked_count > 0) {
        console.log('📝 Hay pagos bloqueados, mostrando detalles...');
        setShowValidationModal(true);
        return;
      }

      // Si hay advertencias pero se puede proceder
      if (validation.warnings_count > 0) {
        console.log('📝 Hay advertencias, pero se puede proceder...');
        const proceed = window.confirm(
          `Hay ${validation.warnings_count} advertencias. ¿Desea continuar con la contabilización?`
        );
        
        if (!proceed) {
          setShowValidationModal(true);
          return;
        }
      }

      // Proceder con la contabilización
      await postValidatedPayments(draftPaymentIds, postingNotes);

    } catch (error: any) {
      console.error('📝 Error en validación:', error);
      showToast(`Error al validar pagos: ${error.message}`, 'error');
    }
  };

  /**
   * Contabilizar pagos que ya han sido validados
   */
  const postValidatedPayments = async (paymentIds: string[], postingNotes?: string) => {
    setIsPosting(true);
    
    try {
      console.log('📝 Contabilizando pagos validados:', paymentIds);
      // Usar el método consolidado que maneja ambos casos (DRAFT → POSTED y CONFIRMED → POSTED)
      const result = await bulkConfirmPaymentsWithValidation(paymentIds, postingNotes, false);
      
      const successCount = result.successful;
      const errorCount = result.failed;
      
      console.log('📝 Resultado de contabilización:', { successCount, errorCount });

      if (errorCount === 0) {
        showToast(`Se contabilizaron exitosamente ${successCount} pago(s)`, 'success');
      } else {
        showToast(`Se contabilizaron ${successCount} pago(s). ${errorCount} fallaron.`, 'warning');
      }
      
      clearPaymentSelection();
      return result;
      
    } catch (error: any) {
      console.error('📝 Error en contabilización:', error);
      showToast(`Error al contabilizar pagos: ${error.message}`, 'error');
      throw error;
    } finally {
      setIsPosting(false);
    }
  };

  /**
   * Continuar con advertencias después de revisar el modal
   */
  const proceedWithWarnings = async (postingNotes?: string) => {
    if (!validationResult || !canProceedWithOperation) {
      showToast('No se puede proceder con la operación', 'error');
      return;
    }

    const validPaymentIds = validationResult.validation_results
      .filter(r => r.can_confirm)
      .map(r => r.payment_id);

    setShowValidationModal(false);
    await postValidatedPayments(validPaymentIds, postingNotes);
  };

  /**
   * Cerrar modal de validación
   */
  const closeValidationModal = () => {
    setShowValidationModal(false);
  };

  return {
    // Estado
    isPosting,
    showValidationModal,
    validationResult,
    hasValidationErrors,
    hasValidationWarnings,
    canProceedWithOperation,
    
    // Acciones principales
    validateAndPostPayments,
    proceedWithWarnings,
    closeValidationModal,
    
    // Estado computado
    draftPaymentCount: selectedPaymentData.filter(p => p.status === PaymentStatus.DRAFT).length,
    totalSelectedCount: selectedPayments.length
  };
}
