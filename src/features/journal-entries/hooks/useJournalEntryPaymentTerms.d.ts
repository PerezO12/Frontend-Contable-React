import type { PaymentCalculationRequest, PaymentCalculationResult, PaymentCalculationItem } from '../../payment-terms/types';
export interface UseJournalEntryPaymentTermsResult {
    calculating: boolean;
    error: string | null;
    calculateLinePaymentSchedule: (paymentTermsId: string, invoiceDate: string, amount: number) => Promise<PaymentCalculationItem[]>;
    calculateDueDate: (paymentTermsId: string, invoiceDate: string) => Promise<string>;
    calculatePaymentSchedule: (request: PaymentCalculationRequest) => Promise<PaymentCalculationResult>;
    clearError: () => void;
}
export declare function useJournalEntryPaymentTerms(): UseJournalEntryPaymentTermsResult;
export interface PaymentTermsValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
export declare function validateJournalEntryLinePaymentTerms(paymentTermsId?: string, invoiceDate?: string, dueDate?: string): PaymentTermsValidationResult;
export declare function formatPaymentScheduleForDisplay(schedule: PaymentCalculationItem[]): string;
export declare function formatPaymentScheduleTooltip(schedule: PaymentCalculationItem[]): string;
export declare function calculateEffectiveDueDate(invoiceDate: string, manualDueDate?: string, paymentSchedule?: PaymentCalculationItem[]): string;
export declare function calculateEffectiveInvoiceDate(entryDate: string, manualInvoiceDate?: string): string;
