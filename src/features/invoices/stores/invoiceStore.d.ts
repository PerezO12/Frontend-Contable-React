import type { Invoice, InvoiceCreateData, InvoiceUpdateData, InvoiceFiltersLegacy as InvoiceFilters, InvoiceWorkflowAction, InvoiceSummary, InvoiceType } from '../types';
import { type InvoiceStatus } from '../types';
interface InvoiceState {
    invoices: Invoice[];
    currentInvoice: Invoice | null;
    summary: InvoiceSummary | null;
    loading: boolean;
    saving: boolean;
    deleting: boolean;
    pagination: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
    filters: InvoiceFilters;
    error: string | null;
    validationErrors: string[];
    fetchInvoices: (filters?: InvoiceFilters) => Promise<void>;
    fetchInvoice: (id: string) => Promise<void>;
    createInvoice: (data: InvoiceCreateData) => Promise<Invoice>;
    updateInvoice: (data: InvoiceUpdateData) => Promise<Invoice>;
    deleteInvoice: (id: string) => Promise<void>;
    duplicateInvoice: (id: string) => Promise<Invoice>;
    confirmInvoice: (id: string, notes?: string) => Promise<Invoice>;
    postInvoice: (id: string, notes?: string) => Promise<Invoice>;
    markAsPaid: (id: string, notes?: string) => Promise<Invoice>;
    cancelInvoice: (id: string, reason?: string) => Promise<Invoice>;
    executeWorkflowAction: (id: string, action: InvoiceWorkflowAction) => Promise<Invoice>;
    setFilters: (filters: Partial<InvoiceFilters>) => void;
    clearFilters: () => void;
    setCurrentInvoice: (invoice: Invoice | null) => void;
    clearError: () => void;
    fetchSummary: (filters?: Partial<InvoiceFilters>) => Promise<void>;
    validateInvoiceData: (data: InvoiceCreateData | InvoiceUpdateData) => Promise<boolean>;
    getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
    getInvoicesByType: (type: InvoiceType) => Invoice[];
    getOverdueInvoices: () => Invoice[];
}
export declare const useInvoiceStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<InvoiceState>, "setState"> & {
    setState(nextStateOrUpdater: InvoiceState | Partial<InvoiceState> | ((state: import("immer").WritableDraft<InvoiceState>) => void), shouldReplace?: false): void;
    setState(nextStateOrUpdater: InvoiceState | ((state: import("immer").WritableDraft<InvoiceState>) => void), shouldReplace: true): void;
}>;
export {};
