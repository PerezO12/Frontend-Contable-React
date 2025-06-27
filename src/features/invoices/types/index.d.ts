/**
 * Tipos para el módulo de facturas siguiendo IMPLEMENTAR.md
 * Schema actualizado para coincidir con el backend Odoo
 */
export type InvoiceType = "CUSTOMER_INVOICE" | "SUPPLIER_INVOICE" | "CREDIT_NOTE" | "DEBIT_NOTE";
export declare const InvoiceTypeEnum: {
    readonly CUSTOMER_INVOICE: "CUSTOMER_INVOICE";
    readonly SUPPLIER_INVOICE: "SUPPLIER_INVOICE";
    readonly CREDIT_NOTE: "CREDIT_NOTE";
    readonly DEBIT_NOTE: "DEBIT_NOTE";
};
export declare const InvoiceTypeConst: {
    readonly CUSTOMER_INVOICE: "CUSTOMER_INVOICE";
    readonly SUPPLIER_INVOICE: "SUPPLIER_INVOICE";
    readonly CREDIT_NOTE: "CREDIT_NOTE";
    readonly DEBIT_NOTE: "DEBIT_NOTE";
};
export type InvoiceStatus = "DRAFT" | "POSTED" | "CANCELLED";
export declare const InvoiceStatusEnum: {
    readonly DRAFT: "DRAFT";
    readonly POSTED: "POSTED";
    readonly CANCELLED: "CANCELLED";
};
export declare const InvoiceStatusConst: {
    readonly DRAFT: "DRAFT";
    readonly POSTED: "POSTED";
    readonly CANCELLED: "CANCELLED";
};
export interface InvoiceLineBase {
    sequence?: number;
    product_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    discount_percentage?: number;
    account_id?: string;
    cost_center_id?: string;
    tax_ids?: string[];
}
export interface InvoiceLineCreate extends InvoiceLineBase {
}
export interface InvoiceLineResponse extends InvoiceLineBase {
    id: string;
    invoice_id: string;
    sequence: number;
    product_name?: string;
    product_code?: string;
    subtotal: number;
    discount_amount: number;
    tax_amount: number;
    total_amount: number;
    created_at: string;
    updated_at: string;
    created_by_id: string;
    updated_by_id?: string;
}
export interface InvoiceBase {
    invoice_date: string;
    due_date?: string;
    invoice_type: InvoiceType;
    currency_code?: string;
    exchange_rate?: number;
    description?: string;
    notes?: string;
}
export interface InvoiceCreate extends InvoiceBase {
    invoice_number?: string;
    third_party_id: string;
    journal_id?: string;
    payment_terms_id?: string;
    third_party_account_id?: string;
}
export interface InvoiceCreateWithLines extends InvoiceCreate {
    lines: InvoiceLineCreate[];
}
export interface InvoiceResponse extends InvoiceBase {
    id: string;
    invoice_number: string;
    status: InvoiceStatus;
    third_party_id: string;
    journal_id?: string;
    payment_terms_id?: string;
    third_party_account_id?: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    paid_amount: number;
    outstanding_amount: number;
    cost_center_id?: string;
    journal_entry_id?: string;
    journal_entry?: JournalEntryReference;
    created_by_id: string;
    updated_by_id?: string;
    posted_by_id?: string;
    cancelled_by_id?: string;
    created_at: string;
    updated_at: string;
    posted_at?: string;
    cancelled_at?: string;
}
export interface InvoiceWithLines extends InvoiceResponse {
    lines: InvoiceLineResponse[];
}
export interface InvoiceFormData extends InvoiceCreateWithLines {
    third_party_name?: string;
    third_party_code?: string;
    payment_terms_name?: string;
    calculated_subtotal?: number;
    calculated_tax_amount?: number;
    calculated_total?: number;
}
export interface InvoiceLineFormData extends InvoiceLineCreate {
    product_code?: string;
    product_name?: string;
    calculated_subtotal?: number;
    calculated_discount_amount?: number;
    calculated_tax_amount?: number;
    calculated_total?: number;
}
export interface InvoiceFilters {
    status?: InvoiceStatus;
    invoice_type?: InvoiceType;
    third_party_id?: string;
    currency_code?: string;
    created_by_id?: string;
    date_from?: string;
    date_to?: string;
    invoice_number?: string;
    third_party_name?: string;
    description?: string;
    reference?: string;
    amount_from?: number;
    amount_to?: number;
    sort_by?: 'invoice_date' | 'number' | 'total_amount' | 'status' | 'created_at' | 'due_date';
    sort_order?: 'asc' | 'desc';
    page?: number;
    size?: number;
    search?: string;
}
export interface InvoiceListResponse {
    items: InvoiceResponse[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
}
export interface InvoiceSummary {
    total_invoices: number;
    total_amount: number;
    paid_amount: number;
    outstanding_amount: number;
    by_status: Record<InvoiceStatus, {
        count: number;
        amount: number;
    }>;
    by_type: Record<InvoiceType, {
        count: number;
        amount: number;
    }>;
}
export interface InvoiceWorkflowAction {
    action: 'post' | 'cancel' | 'reset_to_draft';
    notes?: string;
    posting_date?: string;
    force_post?: boolean;
}
export interface InvoiceActionResult {
    success: boolean;
    message: string;
    invoice?: InvoiceResponse;
    errors?: string[];
}
export interface ThirdPartyInfo {
    id: string;
    code: string;
    name: string;
    document_number: string;
    third_party_type: string;
    default_account_id?: string;
}
export interface ProductInfo {
    id: string;
    code: string;
    name: string;
    sale_price: number;
    purchase_price: number;
    income_account_id?: string;
    expense_account_id?: string;
    tax_ids?: string[];
}
export interface TaxInfo {
    id: string;
    code: string;
    name: string;
    percentage: number;
    tax_type: string;
    account_id: string;
}
export interface PaymentSchedulePreview {
    sequence: number;
    amount: number;
    percentage: number;
    due_date: string;
    description: string;
}
export interface PaymentTermsValidation {
    is_valid: boolean;
    errors: string[];
}
export interface JournalEntryReference {
    id: string;
    number: string;
    date: string;
    reference: string;
    state: "DRAFT" | "POSTED" | "CANCELLED";
    lines_count: number;
    total_debit: number;
    total_credit: number;
}
export interface PaymentTermsInfo {
    id: string;
    code: string;
    name: string;
    days: number;
}
export interface AccountInfo {
    id: string;
    code: string;
    name: string;
    account_type: string;
}
export interface OdooWorkflowStep {
    step: number;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'pending';
    action?: string;
    api_endpoint?: string;
}
export declare const INVOICE_WORKFLOW_STEPS: OdooWorkflowStep[];
export interface Invoice extends InvoiceWithLines {
    number: string;
    invoice_type: InvoiceType;
    status: InvoiceStatus;
    third_party_name?: string;
    third_party_code?: string;
    payment_terms_name?: string;
    payment_terms_code?: string;
    remaining_amount: number;
    lines: InvoiceLine[];
    internal_reference?: string;
    external_reference?: string;
}
export interface InvoiceLine extends InvoiceLineResponse {
    line_number?: number;
    line_total: number;
    product_name?: string;
    product_code?: string;
    tax_rate?: number;
}
export interface InvoiceLineCreateLegacy extends InvoiceLineCreate {
    line_total?: number;
    tax_rate?: number;
}
export interface InvoiceCreateDataLegacy extends Omit<InvoiceCreateWithLines, 'lines'> {
    lines: InvoiceLineCreateLegacy[];
    subtotal?: number;
    tax_amount?: number;
    total_amount?: number;
}
export interface InvoiceCreateData extends InvoiceCreateDataLegacy {
}
export interface InvoiceUpdateData extends Partial<InvoiceCreateDataLegacy> {
}
export interface InvoiceFiltersLegacy extends InvoiceFilters {
    from_date?: string;
    to_date?: string;
    page_size?: number;
}
export interface InvoiceListResponseLegacy extends InvoiceListResponse {
    page_size?: number;
}
export declare function convertInvoiceResponseToLegacy(response: InvoiceWithLines): Invoice;
export declare function convertInvoiceResponseToLegacyWithLines(response: InvoiceResponse): Invoice;
export declare function convertInvoiceWithLinesToLegacy(response: InvoiceWithLines): Invoice;
export declare function convertInvoiceListResponseToLegacy(response: InvoiceListResponse): InvoiceListResponseLegacy & {
    items: Invoice[];
};
/**
 * Resultado de validación de operación bulk
 */
export interface BulkOperationValidation {
    operation: string;
    total_requested: number;
    valid_count: number;
    invalid_count: number;
    not_found_count: number;
    valid_invoices: Array<{
        id: string;
        invoice_number: string;
        status: string;
        total_amount: number;
    }>;
    invalid_invoices: Array<{
        id: string;
        invoice_number: string;
        status: string;
        reasons: string[];
    }>;
    not_found_ids: string[];
    can_proceed: boolean;
}
/**
 * Resultado estándar de operaciones bulk
 */
export interface BulkOperationResult {
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
}
/**
 * Request para contabilización masiva
 */
export interface BulkPostRequest {
    invoice_ids: string[];
    posting_date?: string;
    notes?: string;
    force_post?: boolean;
    stop_on_error?: boolean;
}
/**
 * Request para cancelación masiva
 */
export interface BulkCancelRequest {
    invoice_ids: string[];
    reason?: string;
    stop_on_error?: boolean;
}
/**
 * Request para reset masivo a borrador
 */
export interface BulkResetToDraftRequest {
    invoice_ids: string[];
    reason?: string;
    force_reset?: boolean;
    stop_on_error?: boolean;
}
/**
 * Request para eliminación masiva
 */
export interface BulkDeleteRequest {
    invoice_ids: string[];
    confirmation: 'CONFIRM_DELETE';
    reason?: string;
}
/**
 * Estado de selección para operaciones bulk
 */
export interface BulkSelectionState {
    selectedIds: Set<string>;
    isAllSelected: boolean;
    isIndeterminate: boolean;
}
/**
 * Opciones para filtrar facturas por validez en operaciones bulk
 */
export interface BulkOperationFilter {
    operation: 'post' | 'cancel' | 'reset' | 'delete';
    includeValid?: boolean;
    includeInvalid?: boolean;
    showReasons?: boolean;
}
