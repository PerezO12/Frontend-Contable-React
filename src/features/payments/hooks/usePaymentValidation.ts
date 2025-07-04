/**
 * Hook para validar pagos antes de operaciones bulk con UI mejorada
 * Proporciona validación automática y manejo de errores detallado
 */
import { useState, useCallback } from 'react';
import { usePaymentStore } from '../stores/paymentStore';
import { useToast } from '@/shared/contexts/ToastContext';
import type { BulkPaymentValidationResponse } from '../types';

interface UsePaymentValidationOptions {
  autoValidateOnSelection?: boolean;
  showDetailedErrors?: boolean;
}

export function usePaymentValidation(options: UsePaymentValidationOptions = {}) {
  const [validationResult, setValidationResult] = useState<BulkPaymentValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showValidationDetails, setShowValidationDetails] = useState(false);
  
  const { validateBulkConfirmation, selectedPayments } = usePaymentStore();
  const { showToast } = useToast();

  /**
   * Validar pagos seleccionados y mostrar detalles si hay errores
   */
  const validateSelectedPayments = useCallback(async (paymentIds?: string[]): Promise<BulkPaymentValidationResponse | null> => {
    const ids = paymentIds || selectedPayments;
    
    if (ids.length === 0) {
      showToast('Debe seleccionar al menos un pago para validar', 'warning');
      return null;
    }

    setIsValidating(true);
    
    try {
      console.log('🔍 Validando pagos seleccionados:', ids);
      const result = await validateBulkConfirmation(ids);
      console.log('🔍 Resultado de validación:', result);
      
      setValidationResult(result);

      // Mostrar resumen en toast
      const { total_payments, can_confirm_count, blocked_count, warnings_count } = result;
      
      if (blocked_count > 0) {
        showToast(
          `${blocked_count} de ${total_payments} pagos están bloqueados y no se pueden contabilizar. Revise los detalles.`,
          'error'
        );
        
        if (options.showDetailedErrors !== false) {
          setShowValidationDetails(true);
        }
      } else if (warnings_count > 0) {
        showToast(
          `${warnings_count} pagos tienen advertencias. Puede continuar con precaución.`,
          'warning'
        );
        
        if (options.showDetailedErrors !== false) {
          setShowValidationDetails(true);
        }
      } else {
        showToast(
          `Todos los ${can_confirm_count} pagos están listos para contabilizar.`,
          'success'
        );
      }

      return result;
    } catch (error: any) {
      console.error('🔍 Error en validación:', error);
      showToast(
        `Error al validar pagos: ${error.message}`,
        'error'
      );
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [selectedPayments, validateBulkConfirmation, showToast, options.showDetailedErrors]);

  /**
   * Validar antes de una operación específica
   */
  const validateBeforeOperation = useCallback(async (
    operation: 'confirm' | 'post' | 'cancel' | 'delete',
    paymentIds?: string[]
  ): Promise<boolean> => {
    const result = await validateSelectedPayments(paymentIds);
    
    if (!result) return false;

    // Para operaciones destructivas, ser más estricto
    if (['cancel', 'delete'].includes(operation)) {
      return result.total_payments > 0;
    }

    // Para operaciones de confirmación/contabilización, verificar que no haya bloqueados
    return result.blocked_count === 0;
  }, [validateSelectedPayments]);

  /**
   * Obtener errores de validación específicos para mostrar al usuario
   */
  const getValidationErrorSummary = useCallback((): string[] => {
    if (!validationResult || validationResult.blocked_count === 0) {
      return [];
    }

    const errors: string[] = [];
    const blockedPayments = validationResult.validation_results.filter(r => !r.can_confirm);
    
    // Agrupar errores similares
    const errorGroups: Record<string, string[]> = {};
    
    blockedPayments.forEach(payment => {
      payment.blocking_reasons.forEach(reason => {
        if (!errorGroups[reason]) {
          errorGroups[reason] = [];
        }
        errorGroups[reason].push(payment.payment_number || payment.payment_id.slice(0, 8));
      });
    });

    Object.entries(errorGroups).forEach(([reason, paymentNumbers]) => {
      errors.push(`${reason}: ${paymentNumbers.join(', ')}`);
    });

    return errors;
  }, [validationResult]);

  /**
   * Obtener advertencias de validación
   */
  const getValidationWarningSummary = useCallback((): string[] => {
    if (!validationResult || validationResult.warnings_count === 0) {
      return [];
    }

    const warnings: string[] = [];
    const warningPayments = validationResult.validation_results.filter(r => r.warnings.length > 0);
    
    // Agrupar advertencias similares
    const warningGroups: Record<string, string[]> = {};
    
    warningPayments.forEach(payment => {
      payment.warnings.forEach(warning => {
        if (!warningGroups[warning]) {
          warningGroups[warning] = [];
        }
        warningGroups[warning].push(payment.payment_number || payment.payment_id.slice(0, 8));
      });
    });

    Object.entries(warningGroups).forEach(([warning, paymentNumbers]) => {
      warnings.push(`${warning}: ${paymentNumbers.join(', ')}`);
    });

    return warnings;
  }, [validationResult]);

  /**
   * Limpiar estado de validación
   */
  const clearValidation = useCallback(() => {
    setValidationResult(null);
    setShowValidationDetails(false);
  }, []);

  return {
    // Estado
    validationResult,
    isValidating,
    showValidationDetails,
    setShowValidationDetails,
    
    // Acciones
    validateSelectedPayments,
    validateBeforeOperation,
    clearValidation,
    
    // Utilidades
    getValidationErrorSummary,
    getValidationWarningSummary,
    
    // Estado computado
    hasValidationErrors: (validationResult?.blocked_count || 0) > 0,
    hasValidationWarnings: (validationResult?.warnings_count || 0) > 0,
    canProceedWithOperation: validationResult ? (validationResult.blocked_count || 0) === 0 : false,
    validPaymentCount: validationResult?.can_confirm_count || 0,
    blockedPaymentCount: validationResult?.blocked_count || 0,
    warningPaymentCount: validationResult?.warnings_count || 0
  };
}
