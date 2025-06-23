/**
 * Tipos para el módulo de facturas
 * Basado en el flujo de Odoo adaptado al sistema contable
 */

export interface InvoiceLine {
  id?: string;
  product_id?: string;
  product_code?: string;
  product_name?: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  line_total: number;
  line_number?: number;
}

export interface Invoice {
  id?: string;
  number?: string;
  internal_reference?: string;
  external_reference?: string;
  invoice_type: InvoiceType;
  status: InvoiceStatus;
  third_party_id: string;
  third_party_code?: string;
  third_party_name?: string;
  invoice_date: string;
  due_date: string;
  payment_terms_id?: string;
  payment_terms_code?: string;
  payment_terms_name?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  currency_code: string;
  exchange_rate: number;
  description?: string;
  notes?: string;
  lines: InvoiceLine[];
  created_at?: string;
  updated_at?: string;
  journal_entry_id?: string;
}

export type InvoiceType = 
  | "customer_invoice"
  | "supplier_invoice" 
  | "credit_note"
  | "debit_note";

export const InvoiceType = {
  CUSTOMER_INVOICE: "customer_invoice" as const,
  SUPPLIER_INVOICE: "supplier_invoice" as const,
  CREDIT_NOTE: "credit_note" as const,
  DEBIT_NOTE: "debit_note" as const
} as const;

export type InvoiceStatus = 
  | "draft"
  | "pending"
  | "approved"
  | "posted"
  | "paid"
  | "partially_paid"
  | "overdue"
  | "cancelled";

export const InvoiceStatus = {
  DRAFT: "draft" as const,
  PENDING: "pending" as const,
  APPROVED: "approved" as const,
  POSTED: "posted" as const,
  PAID: "paid" as const,
  PARTIALLY_PAID: "partially_paid" as const,
  OVERDUE: "overdue" as const,
  CANCELLED: "cancelled" as const
} as const;

export interface InvoiceCreateData {
  invoice_type: InvoiceType;
  third_party_id: string;
  invoice_date: string;
  due_date?: string;
  payment_terms_id?: string;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  currency_code?: string;
  exchange_rate?: number;
  description?: string;
  notes?: string;
  lines: Omit<InvoiceLine, 'id' | 'line_number'>[];
}

export interface InvoiceUpdateData extends Partial<InvoiceCreateData> {
  id: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  invoice_type?: InvoiceType;
  third_party_id?: string;
  from_date?: string;
  to_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface InvoiceWorkflowAction {
  action: 'confirm' | 'post' | 'mark_paid' | 'cancel';
  notes?: string;
}

export interface InvoiceSummary {
  total_invoices: number;
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  overdue_count: number;
  overdue_amount: number;
  by_status: Record<InvoiceStatus, { count: number; amount: number }>;
  by_type: Record<InvoiceType, { count: number; amount: number }>;
}

// Tipos para el workflow de Odoo
export interface OdooWorkflowStep {
  step: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  action?: string;
  api_endpoint?: string;
}

export const INVOICE_WORKFLOW_STEPS: OdooWorkflowStep[] = [
  {
    step: 1,
    title: "Cliente registrado",
    description: "Cliente dado de alta en el sistema",
    status: 'completed'
  },
  {
    step: 2, 
    title: "Factura borrador",
    description: "Crear factura con líneas de productos/servicios",
    status: 'current',
    action: "Crear Factura",
    api_endpoint: "/invoices/"
  },
  {
    step: 3,
    title: "Validar y emitir",
    description: "Contabilizar factura - genera asiento automático",
    status: 'pending',
    action: "Emitir Factura",
    api_endpoint: "/invoices/{id}/post"
  },
  {
    step: 4,
    title: "Registrar pago",
    description: "Crear pago del cliente",
    status: 'pending'
  },
  {
    step: 5,
    title: "Aplicar pago",
    description: "Vincular pago con factura",
    status: 'pending'
  }
];
