/**
 * Hook personalizado para manejar el flujo de facturas estilo Odoo
 * Encapsula la lógica de estados, transiciones y validaciones
 */
import { useState, useCallback } from 'react';
import { InvoiceAPI } from '../api/invoiceAPI';
import { 
  type InvoiceResponse, 
  type InvoiceWithLines,
  type PaymentSchedulePreview,
  type InvoiceStatus
} from '../types';
import { useToast } from '@/shared/contexts/ToastContext';

interface UseInvoiceWorkflowOptions {
  onStatusChange?: (newStatus: InvoiceStatus) => void;
}

export function useInvoiceWorkflow(options: UseInvoiceWorkflowOptions = {}) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Cargar factura con líneas
  const loadInvoice = useCallback(async (id: string): Promise<InvoiceWithLines | null> => {
    try {
      setLoading(true);
      const invoice = await InvoiceAPI.getInvoiceWithLines(id);
      return invoice;
    } catch (error: any) {
      showToast(error.message || 'Error al cargar la factura', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Cargar vista previa de payment schedule
  const loadPaymentSchedule = useCallback(async (invoiceId: string): Promise<PaymentSchedulePreview[]> => {
    try {
      const schedule = await InvoiceAPI.getPaymentSchedulePreview(invoiceId);
      return schedule;
    } catch (error: any) {
      showToast(error.message || 'Error al cargar vencimientos', 'error');
      return [];
    }
  }, [showToast]);

  // Validar payment terms
  const validatePaymentTerms = useCallback(async (paymentTermsId: string): Promise<boolean> => {
    try {
      const validation = await InvoiceAPI.validatePaymentTerms(paymentTermsId);
      if (!validation.is_valid) {
        showToast(
          `Términos de pago inválidos: ${validation.errors.join(', ')}`,
          'warning'
        );
      }
      return validation.is_valid;
    } catch (error: any) {
      showToast(error.message || 'Error al validar términos de pago', 'error');
      return false;
    }
  }, [showToast]);
  // Contabilizar factura (DRAFT → POSTED)
  const postInvoice = useCallback(async (
    id: string, 
    postOptions?: { notes?: string; posting_date?: string; force_post?: boolean }
  ): Promise<InvoiceResponse | null> => {
    try {
      setActionLoading(true);
      const updatedInvoice = await InvoiceAPI.postInvoice(id, postOptions);
      showToast('Factura contabilizada exitosamente', 'success');
      options?.onStatusChange?.(updatedInvoice.status);
      return updatedInvoice;
    } catch (error: any) {
      showToast(error.message || 'Error al contabilizar la factura', 'error');
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [showToast, options]);

  // Cancelar factura (POSTED → CANCELLED)
  const cancelInvoice = useCallback(async (
    id: string,
    reason?: string
  ): Promise<InvoiceResponse | null> => {
    try {
      setActionLoading(true);
      const updatedInvoice = await InvoiceAPI.cancelInvoice(id, { reason });
      showToast('Factura cancelada exitosamente', 'success');
      options?.onStatusChange?.(updatedInvoice.status);
      return updatedInvoice;
    } catch (error: any) {
      showToast(error.message || 'Error al cancelar la factura', 'error');
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [showToast, options]);

  // Restablecer a borrador (ANY → DRAFT)
  const resetToDraft = useCallback(async (
    id: string,
    reason?: string
  ): Promise<InvoiceResponse | null> => {
    try {
      setActionLoading(true);
      const updatedInvoice = await InvoiceAPI.resetToDraft(id, { reason });
      showToast('Factura restablecida a borrador', 'success');
      options?.onStatusChange?.(updatedInvoice.status);
      return updatedInvoice;
    } catch (error: any) {
      showToast(error.message || 'Error al restablecer la factura', 'error');
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [showToast, options]);

  // Duplicar factura
  const duplicateInvoice = useCallback(async (id: string): Promise<InvoiceResponse | null> => {
    try {
      setActionLoading(true);
      const duplicatedInvoice = await InvoiceAPI.duplicateInvoice(id);
      showToast('Factura duplicada exitosamente', 'success');
      return duplicatedInvoice;
    } catch (error: any) {
      showToast(error.message || 'Error al duplicar la factura', 'error');
      return null;
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);
  // Operaciones masivas
  const bulkPostInvoices = useCallback(async (invoiceIds: string[]) => {
    try {
      setActionLoading(true);
      const result = await InvoiceAPI.bulkPostInvoices({
        invoice_ids: invoiceIds
      });
      
      showToast(
        `${result.successful} factura${result.successful !== 1 ? 's' : ''} contabilizada${result.successful !== 1 ? 's' : ''}`,
        'success'
      );
      
      if (result.failed > 0) {
        showToast(
          `${result.failed} factura${result.failed !== 1 ? 's' : ''} fallaron`,
          'warning'
        );
      }
      
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error en la operación masiva', 'error');
      return { successful: [], failed: [] };
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);
  const bulkCancelInvoices = useCallback(async (invoiceIds: string[]) => {
    try {
      setActionLoading(true);
      const result = await InvoiceAPI.bulkCancelInvoices({
        invoice_ids: invoiceIds
      });
      
      showToast(
        `${result.successful} factura${result.successful !== 1 ? 's' : ''} cancelada${result.successful !== 1 ? 's' : ''}`,
        'success'
      );
      
      if (result.failed > 0) {
        showToast(
          `${result.failed} factura${result.failed !== 1 ? 's' : ''} fallaron`,
          'warning'
        );
      }
      
      return result;
    } catch (error: any) {
      showToast(error.message || 'Error en la operación masiva', 'error');
      return { successful: 0, failed: 0, failed_items: [], successful_ids: [] };
    } finally {
      setActionLoading(false);
    }
  }, [showToast]);

  // Helpers para validar transiciones de estado
  const canPost = useCallback((status: InvoiceStatus): boolean => {
    return status === 'DRAFT';
  }, []);

  const canCancel = useCallback((status: InvoiceStatus): boolean => {
    return status === 'POSTED';
  }, []);

  const canEdit = useCallback((status: InvoiceStatus): boolean => {
    return status === 'DRAFT';
  }, []);

  const canResetToDraft = useCallback((status: InvoiceStatus): boolean => {
    return status === 'POSTED' || status === 'CANCELLED';
  }, []);

  return {
    // Estado
    loading,
    actionLoading,
    
    // Operaciones básicas
    loadInvoice,
    loadPaymentSchedule,
    validatePaymentTerms,
    
    // Transiciones de estado
    postInvoice,
    cancelInvoice,
    resetToDraft,
    
    // Otras operaciones
    duplicateInvoice,
    
    // Operaciones masivas
    bulkPostInvoices,
    bulkCancelInvoices,
    
    // Helpers de validación
    canPost,
    canCancel,
    canEdit,
    canResetToDraft
  };
}

export default useInvoiceWorkflow;
