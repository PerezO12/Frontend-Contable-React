import { useState, useCallback } from 'react';
import { PaymentTermsService } from '../../payment-terms/services/paymentTermsService';
import type {
  PaymentCalculationRequest,
  PaymentCalculationResult,
  PaymentCalculationItem
} from '../../payment-terms/types';

// ==========================================
// HOOK PARA INTEGRACIÓN PAYMENT TERMS CON JOURNAL ENTRIES
// ==========================================

export interface UseJournalEntryPaymentTermsResult {
  calculating: boolean;
  error: string | null;
  calculateLinePaymentSchedule: (
    paymentTermsId: string,
    invoiceDate: string,
    amount: number
  ) => Promise<PaymentCalculationItem[]>;
  calculateDueDate: (
    paymentTermsId: string,
    invoiceDate: string
  ) => Promise<string>;
  calculatePaymentSchedule: (request: PaymentCalculationRequest) => Promise<PaymentCalculationResult>;
  clearError: () => void;
}

export function useJournalEntryPaymentTerms(): UseJournalEntryPaymentTermsResult {
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateLinePaymentSchedule = useCallback(async (
    paymentTermsId: string,
    invoiceDate: string,
    amount: number
  ): Promise<PaymentCalculationItem[]> => {
    try {
      setCalculating(true);
      setError(null);
      
      const request: PaymentCalculationRequest = {
        payment_terms_id: paymentTermsId,
        invoice_date: invoiceDate,
        amount
      };
      
      const response = await PaymentTermsService.calculatePaymentSchedule(request);
      return response.schedule;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al calcular cronograma de pagos para la línea';
      setError(errorMessage);
      throw err;
    } finally {
      setCalculating(false);
    }
  }, []);

  const calculateDueDate = useCallback(async (
    paymentTermsId: string,
    invoiceDate: string
  ): Promise<string> => {
    try {
      setCalculating(true);
      setError(null);
      
      const request: PaymentCalculationRequest = {
        payment_terms_id: paymentTermsId,
        invoice_date: invoiceDate,
        amount: 1 // Amount doesn't matter for due date calculation
      };
      
      const response = await PaymentTermsService.calculatePaymentSchedule(request);
      return response.final_due_date;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al calcular fecha de vencimiento';
      setError(errorMessage);
      throw err;
    } finally {
      setCalculating(false);
    }
  }, []);

  const calculatePaymentSchedule = useCallback(async (request: PaymentCalculationRequest): Promise<PaymentCalculationResult> => {
    try {
      setCalculating(true);
      setError(null);
      
      const response = await PaymentTermsService.calculatePaymentSchedule(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al calcular cronograma de pagos';
      setError(errorMessage);
      throw err;
    } finally {
      setCalculating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    calculating,
    error,
    calculateLinePaymentSchedule,
    calculateDueDate,
    calculatePaymentSchedule,
    clearError
  };
}

// ==========================================
// UTILIDADES PARA VALIDACIÓN DE PAYMENT TERMS EN JOURNAL ENTRIES
// ==========================================

export interface PaymentTermsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateJournalEntryLinePaymentTerms(
  paymentTermsId?: string,
  invoiceDate?: string,
  dueDate?: string
): PaymentTermsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar que si hay payment_terms_id también hay invoice_date
  if (paymentTermsId && !invoiceDate) {
    errors.push('Si especifica condiciones de pago, debe incluir fecha de factura');
  }

  // Validar que la fecha de vencimiento no sea anterior a la fecha de factura
  if (invoiceDate && dueDate) {
    const invoiceDateObj = new Date(invoiceDate);
    const dueDateObj = new Date(dueDate);
    
    if (dueDateObj < invoiceDateObj) {
      errors.push('La fecha de vencimiento no puede ser anterior a la fecha de factura');
    }
  }

  // Warning si hay due_date manual con payment_terms (prioridad a manual)
  if (paymentTermsId && dueDate) {
    warnings.push('La fecha de vencimiento manual tiene prioridad sobre las condiciones de pago');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ==========================================
// UTILIDADES PARA FORMATEO Y VISUALIZACIÓN
// ==========================================

export function formatPaymentScheduleForDisplay(schedule: PaymentCalculationItem[]): string {
  if (!schedule || schedule.length === 0) {
    return 'Sin cronograma';
  }

  if (schedule.length === 1) {
    const item = schedule[0];
    if (item.days === 0) {
      return 'Contado';
    }
    return `${item.days} días (${item.percentage}%)`;
  }

  return schedule
    .map(item => `${item.days}d (${item.percentage}%)`)
    .join(', ');
}

export function formatPaymentScheduleTooltip(schedule: PaymentCalculationItem[]): string {
  if (!schedule || schedule.length === 0) {
    return 'Sin cronograma de pagos';
  }

  return schedule
    .map(item => 
      `Pago ${item.sequence}: ${item.payment_date} - $${item.amount.toLocaleString()} (${item.percentage}%)`
    )
    .join('\n');
}

export function calculateEffectiveDueDate(
  invoiceDate: string,
  manualDueDate?: string,
  paymentSchedule?: PaymentCalculationItem[]
): string {
  // Prioridad 1: Fecha manual de vencimiento
  if (manualDueDate) {
    return manualDueDate;
  }

  // Prioridad 2: Fecha más tardía del cronograma de pagos
  if (paymentSchedule && paymentSchedule.length > 0) {
    const latestPayment = paymentSchedule
      .sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0];
    return latestPayment.payment_date;
  }

  // Fallback: Fecha de factura
  return invoiceDate;
}

export function calculateEffectiveInvoiceDate(
  entryDate: string,
  manualInvoiceDate?: string
): string {
  // Prioridad 1: Fecha manual de factura
  if (manualInvoiceDate) {
    return manualInvoiceDate;
  }

  // Fallback: Fecha del asiento
  return entryDate;
}
