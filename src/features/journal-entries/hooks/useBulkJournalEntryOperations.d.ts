import type { JournalEntryApproveValidation, JournalEntryPostValidation, JournalEntryCancelValidation, JournalEntryReverseValidation, JournalEntryResetToDraftValidation, BulkJournalEntryApproveResult, BulkJournalEntryPostResult, BulkJournalEntryCancelResult, BulkJournalEntryReverseResult, BulkJournalEntryResetResult } from '../types';
/**
 * Hook especializado para operaciones masivas de asientos contables
 * Implementa las 5 operaciones principales documentadas en el backend
 */
export declare const useBulkJournalEntryOperations: () => {
    loading: boolean;
    error: string;
    clearError: () => void;
    validateBulkApprove: (entryIds: string[]) => Promise<JournalEntryApproveValidation[]>;
    bulkApprove: (entryIds: string[], reason: string, force?: boolean) => Promise<BulkJournalEntryApproveResult>;
    validateBulkPost: (entryIds: string[]) => Promise<JournalEntryPostValidation[]>;
    bulkPost: (entryIds: string[], reason: string, force?: boolean) => Promise<BulkJournalEntryPostResult>;
    validateBulkCancel: (entryIds: string[]) => Promise<JournalEntryCancelValidation[]>;
    bulkCancel: (entryIds: string[], reason: string, force?: boolean) => Promise<BulkJournalEntryCancelResult>;
    validateBulkReverse: (entryIds: string[], reversalDate: string) => Promise<JournalEntryReverseValidation[]>;
    bulkReverse: (entryIds: string[], reason: string, reversalDate: string, force?: boolean) => Promise<BulkJournalEntryReverseResult>;
    validateBulkResetToDraft: (entryIds: string[]) => Promise<JournalEntryResetToDraftValidation[]>;
    bulkResetToDraft: (entryIds: string[], reason: string, force?: boolean) => Promise<BulkJournalEntryResetResult>;
    getValidationSummary: (validations: (JournalEntryApproveValidation | JournalEntryPostValidation | JournalEntryCancelValidation | JournalEntryReverseValidation | JournalEntryResetToDraftValidation)[]) => {
        total: number;
        valid: number;
        invalid: number;
        canProceed: boolean;
        totalErrors: number;
        totalWarnings: number;
    };
};
export type BulkOperationType = 'approve' | 'post' | 'cancel' | 'reverse' | 'reset-to-draft';
export interface BulkOperationConfig {
    type: BulkOperationType;
    label: string;
    description: string;
    icon: string;
    confirmMessage: string;
    requiresReason: boolean;
    requiresDate?: boolean;
    buttonColor: 'primary' | 'success' | 'warning' | 'danger';
}
export declare const BULK_OPERATION_CONFIGS: Record<BulkOperationType, BulkOperationConfig>;
