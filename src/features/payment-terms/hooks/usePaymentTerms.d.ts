import type { PaymentTerms, PaymentTermsFilters, PaymentTermsActiveResponse, PaymentTermsCreate, PaymentTermsUpdate, PaymentCalculationRequest, PaymentCalculationResult, PaymentTermsValidationResult } from '../types';
export interface UsePaymentTermsListOptions {
    initialFilters?: PaymentTermsFilters;
    autoLoad?: boolean;
}
export interface UsePaymentTermsListResult {
    paymentTerms: PaymentTerms[];
    loading: boolean;
    error: string | null;
    total: number;
    filters: PaymentTermsFilters;
    loadPaymentTerms: (newFilters?: PaymentTermsFilters) => Promise<void>;
    refreshPaymentTerms: () => Promise<void>;
    setFilters: (filters: PaymentTermsFilters) => void;
    clearError: () => void;
    removePaymentTermsLocal: (id: string) => void;
    updatePaymentTermsLocal: (updatedPaymentTerms: PaymentTerms) => void;
    addPaymentTermsLocal: (newPaymentTerms: PaymentTerms) => void;
}
export declare function usePaymentTermsList(options?: UsePaymentTermsListOptions): UsePaymentTermsListResult;
export interface UseActivePaymentTermsResult {
    activePaymentTerms: PaymentTermsActiveResponse;
    loading: boolean;
    error: string | null;
    refreshActivePaymentTerms: () => Promise<void>;
    clearError: () => void;
}
export declare function useActivePaymentTerms(): UseActivePaymentTermsResult;
export interface UsePaymentTermOptions {
    id?: string;
    code?: string;
    autoLoad?: boolean;
}
export interface UsePaymentTermResult {
    paymentTerm: PaymentTerms | null;
    loading: boolean;
    error: string | null;
    loadPaymentTerm: (idOrCode: string, byCode?: boolean) => Promise<void>;
    clearError: () => void;
}
export declare function usePaymentTerm(options?: UsePaymentTermOptions): UsePaymentTermResult;
export interface UsePaymentTermByIdResult {
    paymentTerm: PaymentTerms | null;
    loading: boolean;
    error: string | null;
    getPaymentTermById: (id: string) => Promise<PaymentTerms>;
    clearError: () => void;
    clearPaymentTerm: () => void;
}
export declare function usePaymentTermById(): UsePaymentTermByIdResult;
export interface UsePaymentTermsMutationsResult {
    creating: boolean;
    updating: boolean;
    deleting: boolean;
    toggling: boolean;
    error: string | null;
    createPaymentTerms: (data: PaymentTermsCreate) => Promise<PaymentTerms>;
    updatePaymentTerms: (id: string, data: PaymentTermsUpdate) => Promise<PaymentTerms>;
    deletePaymentTerms: (id: string) => Promise<void>;
    toggleActiveStatus: (id: string) => Promise<PaymentTerms>;
    clearError: () => void;
}
export declare function usePaymentTermsMutations(): UsePaymentTermsMutationsResult;
export interface UsePaymentCalculationResult {
    calculating: boolean;
    error: string | null;
    calculatePaymentSchedule: (request: PaymentCalculationRequest) => Promise<PaymentCalculationResult>;
    clearError: () => void;
}
export declare function usePaymentCalculation(): UsePaymentCalculationResult;
export interface UsePaymentTermsValidationResult {
    validating: boolean;
    error: string | null;
    validatePaymentTerms: (id: string) => Promise<PaymentTermsValidationResult>;
    clearError: () => void;
}
export declare function usePaymentTermsValidation(): UsePaymentTermsValidationResult;
