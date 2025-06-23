/**
 * Parche temporal para corregir errores de TypeScript
 * Este archivo proporciona tipos y funciones de compatibilidad
 * mientras migramos completamente al sistema Odoo
 */

// Re-export de tipos principales con alias para compatibilidad
export type {
  InvoiceType as InvoiceTypeAlias,
  InvoiceStatus as InvoiceStatusAlias,
  InvoiceCreate,
  InvoiceCreateWithLines,
  InvoiceResponse,
  InvoiceWithLines,
  InvoiceFilters as InvoiceFiltersOdoo,
  InvoiceListResponse as InvoiceListResponseOdoo
} from './index';

// Imports específicos de los enums/constantes
export { 
  InvoiceType,
  InvoiceStatus,
  InvoiceTypeEnum,
  InvoiceStatusEnum 
} from './index';

// Tipos legacy corregidos
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

// Funciones de conversión simples
export function mapToLegacyInvoice(data: any): Invoice {
  return {
    ...data,
    number: data.invoice_number || data.number,
    remaining_amount: data.outstanding_amount || data.remaining_amount || 0,
    lines: (data.lines || []).map((line: any) => ({
      ...line,
      line_number: line.sequence || line.line_number,
      line_total: line.total_amount || line.line_total || 0,
      product_name: line.product_name || '',
      product_code: line.product_code || '',
      tax_rate: line.tax_rate || 0
    }))
  };
}

export function mapToLegacyInvoiceList(response: any): InvoiceListResponse {
  return {
    ...response,
    page_size: response.size || response.page_size || 20,
    items: (response.items || []).map(mapToLegacyInvoice)
  };
}
