import { type InvoiceResponse, type InvoiceWithLines, type PaymentSchedulePreview, type InvoiceStatus } from '../types';
interface UseInvoiceWorkflowOptions {
    onStatusChange?: (newStatus: InvoiceStatus) => void;
}
export declare function useInvoiceWorkflow(options?: UseInvoiceWorkflowOptions): {
    loading: boolean;
    actionLoading: boolean;
    loadInvoice: (id: string) => Promise<InvoiceWithLines | null>;
    loadPaymentSchedule: (invoiceId: string) => Promise<PaymentSchedulePreview[]>;
    validatePaymentTerms: (paymentTermsId: string) => Promise<boolean>;
    postInvoice: (id: string, postOptions?: {
        notes?: string;
        posting_date?: string;
        force_post?: boolean;
    }) => Promise<InvoiceResponse | null>;
    cancelInvoice: (id: string, reason?: string) => Promise<InvoiceResponse | null>;
    resetToDraft: (id: string, reason?: string) => Promise<InvoiceResponse | null>;
    duplicateInvoice: (id: string) => Promise<InvoiceResponse | null>;
    bulkPostInvoices: (invoiceIds: string[]) => Promise<{
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
    } | {
        successful: any[];
        failed: any[];
    }>;
    bulkCancelInvoices: (invoiceIds: string[]) => Promise<{
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
    } | {
        successful: number;
        failed: number;
        failed_items: any[];
        successful_ids: any[];
    }>;
    canPost: (status: InvoiceStatus) => boolean;
    canCancel: (status: InvoiceStatus) => boolean;
    canEdit: (status: InvoiceStatus) => boolean;
    canResetToDraft: (status: InvoiceStatus) => boolean;
};
export default useInvoiceWorkflow;
