/**
 * Tipos para el módulo de facturas siguiendo IMPLEMENTAR.md
 * Schema actualizado para coincidir con el backend Odoo
 */

// ================================
// TIPOS BASE SIGUIENDO IMPLEMENTAR.MD
// ================================

export type InvoiceType = "CUSTOMER_INVOICE" | "SUPPLIER_INVOICE" | "CREDIT_NOTE" | "DEBIT_NOTE";

export const InvoiceTypeEnum = {
  CUSTOMER_INVOICE: "CUSTOMER_INVOICE" as const,
  SUPPLIER_INVOICE: "SUPPLIER_INVOICE" as const,
  CREDIT_NOTE: "CREDIT_NOTE" as const,
  DEBIT_NOTE: "DEBIT_NOTE" as const
} as const;

// Legacy types para compatibilidad con archivos existentes
export const InvoiceTypeConst = {
  CUSTOMER_INVOICE: "CUSTOMER_INVOICE" as const,
  SUPPLIER_INVOICE: "SUPPLIER_INVOICE" as const, 
  CREDIT_NOTE: "CREDIT_NOTE" as const,
  DEBIT_NOTE: "DEBIT_NOTE" as const
} as const;

// Estados de factura siguiendo el flujo Odoo implementado en backend
export type InvoiceStatus = "DRAFT" | "POSTED" | "CANCELLED";

export const InvoiceStatusEnum = {
  DRAFT: "DRAFT" as const,
  POSTED: "POSTED" as const,
  CANCELLED: "CANCELLED" as const
} as const;

// Legacy types para compatibilidad con archivos existentes
export const InvoiceStatusConst = {
  DRAFT: "DRAFT" as const,
  POSTED: "POSTED" as const,
  CANCELLED: "CANCELLED" as const
} as const;

// ================================
// LÍNEAS DE FACTURA (IMPLEMENTAR.MD)
// ================================

export interface InvoiceLineBase {
  sequence?: number;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  
  // Overrides de cuentas contables (patrón Odoo)
  account_id?: string;
  cost_center_id?: string;
  
  // Impuestos por línea (patrón Odoo)
  tax_ids?: string[];
}

export interface InvoiceLineCreate extends InvoiceLineBase {}

export interface InvoiceLineResponse extends InvoiceLineBase {
  id: string;
  invoice_id: string;
  sequence: number;
  
  // Información del producto relacionado
  product_name?: string;
  product_code?: string;
  
  // Montos calculados
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  
  // Auditoría
  created_at: string;
  updated_at: string;
  created_by_id: string;
  updated_by_id?: string;
}

// ================================
// FACTURAS (IMPLEMENTAR.MD)
// ================================

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
  // Identificación
  invoice_number?: string;
  
  // Relaciones principales (siguiendo IMPLEMENTAR.md)
  third_party_id: string;
  journal_id?: string;
  payment_terms_id?: string;
  
  // Overrides de cuentas contables (opcionales - patrón Odoo)
  third_party_account_id?: string;
}

export interface InvoiceCreateWithLines extends InvoiceCreate {
  lines: InvoiceLineCreate[];
}

export interface InvoiceResponse extends InvoiceBase {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  
  // Relaciones (usando third_party_id según IMPLEMENTAR.md)
  third_party_id: string;
  journal_id?: string;
  payment_terms_id?: string;
  third_party_account_id?: string;
  
  // Montos calculados
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  
  // Control de pagos (actualizado para flujo Odoo)
  paid_amount: number;
  outstanding_amount: number;
  
  // Centro de costo
  cost_center_id?: string;
  
  // Asiento contable relacionado (NUEVO - flujo Odoo)
  journal_entry_id?: string;
  journal_entry?: JournalEntryReference;
  
  // Auditoría siguiendo patrón Odoo
  created_by_id: string;
  updated_by_id?: string;
  posted_by_id?: string;
  cancelled_by_id?: string;
  
  // Fechas de auditoría
  created_at: string;
  updated_at: string;
  posted_at?: string;
  cancelled_at?: string;
}

export interface InvoiceWithLines extends InvoiceResponse {
  lines: InvoiceLineResponse[];
}

// ================================
// TIPOS PARA FORMULARIOS
// ================================

export interface InvoiceFormData extends InvoiceCreateWithLines {
  // Campos adicionales para el formulario
  third_party_name?: string;
  third_party_code?: string;
  payment_terms_name?: string;
  
  // Totales calculados en tiempo real
  calculated_subtotal?: number;
  calculated_tax_amount?: number;
  calculated_total?: number;
}

export interface InvoiceLineFormData extends InvoiceLineCreate {
  // Campos adicionales para el formulario
  product_code?: string;
  product_name?: string;
  
  // Totales calculados
  calculated_subtotal?: number;
  calculated_discount_amount?: number;
  calculated_tax_amount?: number;
  calculated_total?: number;
}

// ================================
// FILTROS Y LISTADOS
// ================================

export interface InvoiceFilters {
  // Filtros básicos existentes
  status?: InvoiceStatus;
  invoice_type?: InvoiceType;
  third_party_id?: string;
  currency_code?: string;
  created_by_id?: string;
  
  // Filtros de fecha flexibles (nuevos)
  date_from?: string;  // Fecha desde (inclusive)
  date_to?: string;    // Fecha hasta (inclusive)
  
  // Búsquedas de texto parciales (nuevos)
  invoice_number?: string;      // Búsqueda por número de factura
  third_party_name?: string;    // Búsqueda por nombre del tercero
  description?: string;         // Búsqueda por descripción
  reference?: string;           // Búsqueda por referencia interna/externa
  
  // Filtros de monto (nuevos)
  amount_from?: number;         // Monto mínimo
  amount_to?: number;           // Monto máximo
  
  // Ordenamiento (nuevos)
  sort_by?: 'invoice_date' | 'number' | 'total_amount' | 'status' | 'created_at' | 'due_date';
  sort_order?: 'asc' | 'desc';
  
  // Paginación
  page?: number;
  size?: number;
  
  // Legacy
  search?: string;  // Mantenido para compatibilidad
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
  by_status: Record<InvoiceStatus, { count: number; amount: number }>;
  by_type: Record<InvoiceType, { count: number; amount: number }>;
}

// ================================
// ACCIONES Y WORKFLOW
// ================================

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

// ================================
// TIPOS PARA TERCEROS Y PRODUCTOS
// ================================

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

// ================================
// PAYMENT TERMS SCHEDULE PREVIEW (NUEVO - Flujo Odoo)
// ================================

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

// ================================
// JOURNAL ENTRY RELACIONADO (NUEVO - Flujo Odoo)
// ================================

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

// ================================
// WORKFLOW STEPS ODOO
// ================================

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
    title: "Tercero registrado",
    description: "Cliente/Proveedor dado de alta en el sistema",
    status: 'completed'
  },
  {
    step: 2, 
    title: "Factura borrador",
    description: "Crear factura con líneas de productos/servicios (estado DRAFT)",
    status: 'current',
    action: "Crear Factura",
    api_endpoint: "/invoices/"
  },
  {
    step: 3,
    title: "Contabilizar",
    description: "Contabilizar factura - genera asiento automático (DRAFT → POSTED)",
    status: 'pending',
    action: "Contabilizar",
    api_endpoint: "/invoices/{id}/post"
  },
  {
    step: 4,
    title: "Gestión de pagos",
    description: "Registrar y aplicar pagos (funcionalidad futura)",
    status: 'pending'  }
];

// ================================
// TIPOS LEGACY PARA COMPATIBILIDAD
// ================================

// Tipos legacy para mantener compatibilidad con archivos existentes
export interface Invoice extends InvoiceWithLines {
  // Alias para compatibilidad
  number: string;
  invoice_type: InvoiceType;
  status: InvoiceStatus;
  third_party_name?: string;
  third_party_code?: string;
  payment_terms_name?: string;
  payment_terms_code?: string;
  remaining_amount: number;
  lines: InvoiceLine[];
  
  // Referencias adicionales (campos opcionales de facturas)
  internal_reference?: string;
  external_reference?: string;
}

export interface InvoiceLine extends InvoiceLineResponse {
  // Alias para compatibilidad
  line_number?: number;
  line_total: number;
  product_name?: string;
  product_code?: string;
  tax_rate?: number;
}

// Tipos de datos legacy para stores
export interface InvoiceLineCreateLegacy extends InvoiceLineCreate {
  // Propiedades legacy para formularios
  line_total?: number;
  tax_rate?: number;
}

export interface InvoiceCreateDataLegacy extends Omit<InvoiceCreateWithLines, 'lines'> {
  lines: InvoiceLineCreateLegacy[];
  // Campos calculados legacy
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
}

export interface InvoiceCreateData extends InvoiceCreateDataLegacy {}
export interface InvoiceUpdateData extends Partial<InvoiceCreateDataLegacy> {}

// Filtros legacy con propiedades adicionales
export interface InvoiceFiltersLegacy extends InvoiceFilters {
  from_date?: string;
  to_date?: string;
  page_size?: number;
}

// Response legacy para lists
export interface InvoiceListResponseLegacy extends InvoiceListResponse {
  page_size?: number;
}

// ================================
// FUNCIONES DE CONVERSIÓN
// ================================

// Convertir de Response a Legacy
export function convertInvoiceResponseToLegacy(response: InvoiceWithLines): Invoice {
  return {
    ...response,
    number: response.invoice_number,
    remaining_amount: response.outstanding_amount,
    lines: (response.lines || []).map(line => ({
      ...line,
      line_number: line.sequence,
      line_total: line.total_amount,
      product_name: '', // TODO: obtener del producto
      product_code: '', // TODO: obtener del producto
      tax_rate: 0 // TODO: calcular del tax_amount
    }))
  };
}

// Convertir InvoiceResponse a formato legacy (sin líneas)
export function convertInvoiceResponseToLegacyWithLines(response: InvoiceResponse): Invoice {
  return {
    ...response,
    number: response.invoice_number,
    remaining_amount: response.outstanding_amount,
    lines: [] // Respuestas simples no incluyen líneas
  };
}

// Convertir InvoiceWithLines a formato legacy
export function convertInvoiceWithLinesToLegacy(response: InvoiceWithLines): Invoice {
  return {
    ...response,
    number: response.invoice_number,
    remaining_amount: response.outstanding_amount,
    lines: (response.lines || []).map(line => ({
      ...line,
      line_number: line.sequence,
      line_total: line.total_amount,
      product_name: line.product_name || '', // Mantener el valor del backend
      product_code: line.product_code || '', // Mantener el valor del backend
      tax_rate: 0 // TODO: calcular del tax_amount
    }))
  };
}

// Convertir lista de responses
export function convertInvoiceListResponseToLegacy(response: InvoiceListResponse): InvoiceListResponseLegacy & { items: Invoice[] } {
  // Verificar que response existe
  if (!response) {
    console.warn('convertInvoiceListResponseToLegacy: response is null/undefined');
    return {
      items: [],
      total: 0,
      page: 1,
      size: 20,
      page_size: 20,
      total_pages: 0
    };
  }

  // Verificar que items existe
  if (!Array.isArray(response.items)) {
    console.warn('convertInvoiceListResponseToLegacy: response.items is not an array', response);
    return {
      ...response,
      page_size: response.size || 20,
      items: []
    };
  }
  return {
    ...response,
    page_size: response.size,
    items: response.items.map(item => ({
      ...item,
      number: item.invoice_number,
      remaining_amount: item.outstanding_amount,
      lines: [] // Lista no incluye líneas por defecto
    }))
  };
}

// ===== BULK OPERATIONS TYPES =====

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
