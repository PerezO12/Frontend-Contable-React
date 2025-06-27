/**
 * Hook personalizado para operaciones bulk en facturas
 * Implementa la lógica completa de selección múltiple y operaciones masivas
 */
import { useState, useCallback, useMemo } from 'react';
import { InvoiceAPI } from '../api/invoiceAPI';
import { useToast } from '@/shared/contexts/ToastContext';
import type { 
  Invoice,
  BulkOperationValidation,
  BulkPostRequest,
  BulkCancelRequest,
  BulkResetToDraftRequest,
  BulkDeleteRequest,
  BulkSelectionState
} from '../types';

/**
 * Formatea errores de API para mostrar como string
 */
const formatApiError = (error: any, fallbackMessage: string): string => {
  if (!error.response?.data) {
    return fallbackMessage;
  }

  const { detail } = error.response.data;
  
  // Si detail es un string, usarlo directamente
  if (typeof detail === 'string') {
    return detail;
  }
  
  // Si detail es un array de errores de validación (como en FastAPI)
  if (Array.isArray(detail)) {
    const errorMessages = detail.map((err: any) => {
      if (typeof err === 'string') return err;
      if (err.msg) return err.msg;
      if (err.message) return err.message;
      return JSON.stringify(err);
    });
    return errorMessages.join(', ');
  }
  
  // Si detail es un objeto
  if (typeof detail === 'object') {
    if (detail.message) return detail.message;
    if (detail.msg) return detail.msg;
    // Intentar stringify como último recurso
    try {
      return JSON.stringify(detail);
    } catch {
      return fallbackMessage;
    }
  }
  
  return fallbackMessage;
};

export interface UseBulkInvoiceOperationsProps {
  invoices: Invoice[];
  onOperationComplete?: () => void;
}

export function useBulkInvoiceOperations({ 
  invoices, 
  onOperationComplete 
}: UseBulkInvoiceOperationsProps) {
  const { showToast } = useToast();
  
  // Estado de selección
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationData, setValidationData] = useState<BulkOperationValidation | null>(null);

  // Estado calculado de selección
  const selectionState: BulkSelectionState = useMemo(() => {
    const totalInvoices = invoices.length;
    const selectedCount = selectedIds.size;
    
    return {
      selectedIds,
      isAllSelected: totalInvoices > 0 && selectedCount === totalInvoices,
      isIndeterminate: selectedCount > 0 && selectedCount < totalInvoices
    };
  }, [invoices.length, selectedIds]);

  // Manejar selección individual
  const toggleSelection = useCallback((invoiceId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(invoiceId)) {
        newSet.delete(invoiceId);
      } else {
        newSet.add(invoiceId);
      }
      return newSet;
    });
  }, []);

  // Manejar selección múltiple (todos/ninguno)
  const toggleSelectAll = useCallback(() => {
    if (selectionState.isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(invoices.map(inv => inv.id)));
    }
  }, [invoices, selectionState.isAllSelected]);

  // Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setValidationData(null);
  }, []);

  // Validar operación antes de ejecutar
  const validateOperation = useCallback(async (
    operation: 'post' | 'cancel' | 'reset' | 'delete'
  ): Promise<BulkOperationValidation | null> => {
    if (selectedIds.size === 0) {
      showToast('Debe seleccionar al menos una factura', 'warning');
      return null;
    }

    setIsProcessing(true);
    try {
      const validation = await InvoiceAPI.validateBulkOperation(
        operation, 
        Array.from(selectedIds)
      );
      
      setValidationData(validation);
      
      // Mostrar advertencias si hay facturas inválidas
      if (validation.invalid_count > 0) {
        showToast(
          `${validation.invalid_count} facturas no pueden procesarse. Revise los detalles.`,
          'warning'
        );
      }
        return validation;
    } catch (error: any) {
      showToast(
        formatApiError(error, 'Error al validar la operación'),
        'error'
      );
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast]);

  // Ejecutar contabilización masiva
  const bulkPostInvoices = useCallback(async (options: Omit<BulkPostRequest, 'invoice_ids'>) => {
    if (selectedIds.size === 0) {
      showToast('Debe seleccionar al menos una factura', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await InvoiceAPI.bulkPostInvoices({
        ...options,
        invoice_ids: Array.from(selectedIds)
      });

      // Mostrar resultado
      if (result.successful > 0) {
        showToast(
          `${result.successful} facturas contabilizadas exitosamente`,
          'success'
        );
      }
      
      if (result.failed > 0) {
        showToast(
          `${result.failed} facturas fallaron en la contabilización`,
          'error'
        );
      }

      if (result.skipped > 0) {
        showToast(
          `${result.skipped} facturas fueron omitidas`,
          'warning'
        );
      }

      // Limpiar selección y actualizar datos
      clearSelection();
      onOperationComplete?.();
        return result;
    } catch (error: any) {
      showToast(
        formatApiError(error, 'Error en la contabilización masiva'),
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast, clearSelection, onOperationComplete]);

  // Ejecutar cancelación masiva
  const bulkCancelInvoices = useCallback(async (options: Omit<BulkCancelRequest, 'invoice_ids'>) => {
    if (selectedIds.size === 0) {
      showToast('Debe seleccionar al menos una factura', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await InvoiceAPI.bulkCancelInvoices({
        ...options,
        invoice_ids: Array.from(selectedIds)
      });

      if (result.successful > 0) {
        showToast(
          `${result.successful} facturas canceladas exitosamente`,
          'success'
        );
      }

      if (result.failed > 0) {
        showToast(
          `${result.failed} facturas fallaron en la cancelación`,
          'error'
        );
      }

      clearSelection();
      onOperationComplete?.();
        return result;
    } catch (error: any) {
      showToast(
        formatApiError(error, 'Error en la cancelación masiva'),
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast, clearSelection, onOperationComplete]);
  // Ejecutar reset masivo a borrador
  const bulkResetToDraftInvoices = useCallback(async (options: Omit<BulkResetToDraftRequest, 'invoice_ids'>) => {
    if (selectedIds.size === 0) {
      showToast('Debe seleccionar al menos una factura', 'warning');
      return;
    }

    console.log('🔄 Iniciando bulk reset to draft con opciones:', options);
    console.log('🔄 IDs seleccionados:', Array.from(selectedIds));    setIsProcessing(true);
    try {
      const requestData = {
        ...options,
        invoice_ids: Array.from(selectedIds)
      };
      console.log('🔄 Datos de request completos:', requestData);
      
      const result = await InvoiceAPI.bulkResetToDraftInvoices(requestData);

      if (result.successful > 0) {
        showToast(
          `${result.successful} facturas restablecidas a borrador`,
          'success'
        );
      }

      if (result.failed > 0) {
        showToast(
          `${result.failed} facturas fallaron en el restablecimiento`,
          'error'
        );
      }

      clearSelection();
      onOperationComplete?.();
        return result;    } catch (error: any) {
      console.error('❌ Error capturado en hook:', error);
      showToast(
        formatApiError(error, 'Error en el restablecimiento masivo'),
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast, clearSelection, onOperationComplete]);

  // Ejecutar eliminación masiva
  const bulkDeleteInvoices = useCallback(async (options: Omit<BulkDeleteRequest, 'invoice_ids'>) => {
    if (selectedIds.size === 0) {
      showToast('Debe seleccionar al menos una factura', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      // Verificar si hay facturas de NFE entre las seleccionadas
      const selectedInvoices = invoices.filter(inv => selectedIds.has(inv.id));
      const nfeInvoices = selectedInvoices.filter(inv => 
        inv.invoice_number?.includes('NFe') || 
        inv.description?.toLowerCase().includes('nfe') ||
        inv.notes?.toLowerCase().includes('nfe')
      );
      
      const result = await InvoiceAPI.bulkDeleteInvoices({
        ...options,
        invoice_ids: Array.from(selectedIds)
      });

      if (result.successful > 0) {
        let successMessage = `${result.successful} facturas eliminadas exitosamente`;
        
        // Si hay facturas NFE, agregar información adicional
        if (nfeInvoices.length > 0) {
          const nfeDeletedCount = nfeInvoices.filter(inv => 
            result.successful_ids.includes(inv.id)
          ).length;
          
          if (nfeDeletedCount > 0) {
            successMessage += ` (incluyendo ${nfeDeletedCount} facturas de NFE que fueron desvinculadas)`;
          }
        }
        
        showToast(successMessage, 'success');
      }

      if (result.failed > 0) {
        let errorMessage = `${result.failed} facturas fallaron en la eliminación`;
        
        // Verificar si hay errores relacionados con NFE
        const nfeErrors = result.failed_items.filter(item => 
          item.error?.toLowerCase().includes('nfe') || 
          item.error?.toLowerCase().includes('nota fiscal')
        );
        
        if (nfeErrors.length > 0) {
          errorMessage += `. ${nfeErrors.length} relacionadas con NFE - verifique las referencias`;
        }
        
        showToast(errorMessage, 'error');
      }

      clearSelection();
      onOperationComplete?.();
        return result;
    } catch (error: any) {
      showToast(
        formatApiError(error, 'Error en la eliminación masiva'),
        'error'
      );
    } finally {
      setIsProcessing(false);
    }
  }, [selectedIds, showToast, clearSelection, onOperationComplete]);

  // Filtrar facturas válidas para una operación específica
  const getValidInvoicesForOperation = useCallback((operation: 'post' | 'cancel' | 'reset' | 'delete') => {
    return invoices.filter(invoice => {
      switch (operation) {
        case 'post':
          return invoice.status === 'DRAFT' && invoice.total_amount > 0;
        case 'cancel':
          return invoice.status === 'POSTED' && invoice.outstanding_amount === invoice.total_amount;
        case 'reset':
          return invoice.status === 'POSTED';
        case 'delete':
          return invoice.status === 'DRAFT';
        default:
          return false;
      }
    });
  }, [invoices]);

  return {
    // Estado de selección
    selectionState,
    selectedIds,
    selectedCount: selectedIds.size,
    totalInvoices: invoices.length,
    
    // Estados de procesamiento
    isProcessing,
    validationData,
    
    // Acciones de selección
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    
    // Operaciones bulk
    validateOperation,
    bulkPostInvoices,
    bulkCancelInvoices,
    bulkResetToDraftInvoices,
    bulkDeleteInvoices,
    
    // Utilidades
    getValidInvoicesForOperation
  };
}
