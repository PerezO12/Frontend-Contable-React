/**
 * Parche temporal para corregir errores de TypeScript
 * Este archivo proporciona tipos y funciones de compatibilidad
 * mientras migramos completamente al sistema Odoo
 */
export type { InvoiceType as InvoiceTypeAlias, InvoiceStatus as InvoiceStatusAlias, InvoiceCreate, InvoiceCreateWithLines, InvoiceResponse, InvoiceWithLines, InvoiceFilters as InvoiceFiltersOdoo, InvoiceListResponse as InvoiceListResponseOdoo } from './index';
export type { InvoiceType, InvoiceStatus, InvoiceTypeEnum, InvoiceStatusEnum } from './index';
export interface InvoiceFilters {
    status?: string;
    invoice_type?: string;
    third_party_id?: string;
    from_date?: string;
    to_date?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
    page?: number;
    size?: number;
    page_size?: number;
}
export interface InvoiceListResponse {
    items: any[];
    total: number;
    page: number;
    size: number;
    page_size?: number;
    total_pages: number;
}
export interface Invoice {
    id: string;
    number: string;
    invoice_number: string;
    status: string;
    invoice_type: string;
    third_party_id: string;
    third_party_name?: string;
    third_party_code?: string;
    payment_terms_name?: string;
    payment_terms_code?: string;
    invoice_date: string;
    due_date?: string;
    subtotal: number;
    tax_amount: number;
    total_amount: number;
    paid_amount: number;
    remaining_amount: number;
    outstanding_amount: number;
    currency_code?: string;
    exchange_rate?: number;
    description?: string;
    notes?: string;
    internal_reference?: string;
    external_reference?: string;
    lines: InvoiceLine[];
    created_at?: string;
    updated_at?: string;
    posted_at?: string;
    cancelled_at?: string;
    journal_entry_id?: string;
}
export interface InvoiceLine {
    id?: string;
    line_number?: number;
    sequence?: number;
    product_id?: string;
    product_name?: string;
    product_code?: string;
    description: string;
    quantity: number;
    unit_price: number;
    discount_percentage?: number;
    tax_rate?: number;
    tax_ids?: string[];
    subtotal: number;
    discount_amount?: number;
    tax_amount: number;
    total_amount: number;
    line_total: number;
    account_id?: string;
    cost_center_id?: string;
}
export interface InvoiceCreateData {
    invoice_type: string;
    invoice_date: string;
    due_date?: string;
    third_party_id: string;
    payment_terms_id?: string;
    currency_code?: string;
    exchange_rate?: number;
    description?: string;
    notes?: string;
    lines: InvoiceLineCreate[];
}
export interface InvoiceLineCreate {
    sequence?: number;
    product_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    discount_percentage?: number;
    tax_ids?: string[];
    account_id?: string;
    cost_center_id?: string;
}
export interface InvoiceUpdateData extends Partial<InvoiceCreateData> {
    id?: string;
}
export declare function mapToLegacyInvoice(data: any): Invoice;
export declare function mapToLegacyInvoiceList(response: any): InvoiceListResponse;
