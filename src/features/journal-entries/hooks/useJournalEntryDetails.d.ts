import type { JournalEntry } from '../types';
/**
 * Hook para manejar un asiento contable individual con datos enriquecidos
 * Proporciona utilidades para trabajar con productos, terceros, términos de pago, etc.
 */
export declare const useJournalEntryDetails: (entryId: string | null) => {
    entry: JournalEntry;
    loading: boolean;
    error: string;
    refresh: () => void;
    products: any[];
    thirdParties: any[];
    paymentTerms: any[];
    enrichedPaymentTerms: Map<string, any>;
    calculationSummary: {
        total_discount: string;
        total_taxes: string;
        total_net: string;
        total_gross: string;
        lines_with_products: number;
        total_lines: number;
    };
    validation: {
        is_valid: boolean;
        issues: any[];
        can_be_posted: boolean;
        can_be_edited: boolean;
    };
    aggregatedInfo: {
        productSummary: {
            count: number;
            totalQuantity: any;
            hasProducts: boolean;
        };
        thirdPartySummary: {
            count: number;
            customers: number;
            suppliers: number;
            hasThirdParties: boolean;
        };
        paymentTermsSummary: {
            count: number;
            uniqueTerms: number;
            hasPaymentTerms: boolean;
        };
        statusInfo: {
            canEdit: boolean;
            canPost: boolean;
            isBalanced: boolean;
            status: import("..").JournalEntryStatus;
            hasDiscounts: boolean;
            hasTaxes: boolean;
        };
    };
    hasEnrichedPaymentTerms: boolean;
};
/**
 * Hook simplificado para obtener solo los datos básicos de un asiento contable
 */
export declare const useJournalEntryBasic: (entryId: string | null) => {
    entry: JournalEntry;
    loading: boolean;
    error: string;
    refresh: () => void;
    isBalanced: boolean;
    canEdit: boolean;
    canPost: boolean;
    linesCount: number;
    hasProducts: boolean;
    hasThirdParties: boolean;
};
