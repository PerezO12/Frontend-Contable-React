import type { Invoice, BulkOperationValidation, BulkPostRequest, BulkCancelRequest, BulkResetToDraftRequest, BulkDeleteRequest, BulkSelectionState } from '../types';
export interface UseBulkInvoiceOperationsProps {
    invoices: Invoice[];
    onOperationComplete?: () => void;
}
export declare function useBulkInvoiceOperations({ invoices, onOperationComplete }: UseBulkInvoiceOperationsProps): {
    selectionState: BulkSelectionState;
    selectedIds: Set<string>;
    selectedCount: number;
    totalInvoices: number;
    isProcessing: boolean;
    validationData: BulkOperationValidation;
    toggleSelection: (invoiceId: string) => void;
    toggleSelectAll: () => void;
    clearSelection: () => void;
    validateOperation: (operation: "post" | "cancel" | "reset" | "delete") => Promise<BulkOperationValidation | null>;
    bulkPostInvoices: (options: Omit<BulkPostRequest, "invoice_ids">) => Promise<{
        total_requested: number;
        successful: number;
        failed: number;
        skipped: number;
        successful_ids: string[];
        failed_items: Array<{
            id: string;
            error: string;
            invoice_number?: string;
        }>;
        skipped_items: Array<{
            id: string;
            reason: string;
            current_status?: string;
        }>;
        execution_time_seconds: number;
    }>;
    bulkCancelInvoices: (options: Omit<BulkCancelRequest, "invoice_ids">) => Promise<{
        total_requested: number;
        successful: number;
        failed: number;
        skipped: number;
        successful_ids: string[];
        failed_items: Array<{
            id: string;
            error: string;
            invoice_number?: string;
        }>;
        skipped_items: Array<{
            id: string;
            reason: string;
            current_status?: string;
        }>;
        execution_time_seconds: number;
    }>;
    bulkResetToDraftInvoices: (options: Omit<BulkResetToDraftRequest, "invoice_ids">) => Promise<{
        total_requested: number;
        successful: number;
        failed: number;
        skipped: number;
        successful_ids: string[];
        failed_items: Array<{
            id: string;
            error: string;
            invoice_number?: string;
        }>;
        skipped_items: Array<{
            id: string;
            reason: string;
            current_status?: string;
        }>;
        execution_time_seconds: number;
    }>;
    bulkDeleteInvoices: (options: Omit<BulkDeleteRequest, "invoice_ids">) => Promise<{
        total_requested: number;
        successful: number;
        failed: number;
        skipped: number;
        successful_ids: string[];
        failed_items: Array<{
            id: string;
            error: string;
            invoice_number?: string;
        }>;
        skipped_items: Array<{
            id: string;
            reason: string;
            current_status?: string;
        }>;
        execution_time_seconds: number;
    }>;
    getValidInvoicesForOperation: (operation: "post" | "cancel" | "reset" | "delete") => Invoice[];
};
