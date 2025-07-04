/**
 * Tipos TypeScript para el módulo de flujo de pagos
 * Reflejan exactamente los schemas del backend de payment_flow
 */

// Enums que coinciden exactamente con el backend
export enum PaymentStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentType {
  CUSTOMER_PAYMENT = 'CUSTOMER_PAYMENT',
  SUPPLIER_PAYMENT = 'SUPPLIER_PAYMENT'
}

export enum PaymentMethod {
  CASH = 'cash',
  CHECK = 'check',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  ELECTRONIC = 'electronic',
  OTHER = 'other'
}

// Labels para los enums
export const PAYMENT_STATUS_LABELS = {
  [PaymentStatus.DRAFT]: 'Borrador',
  [PaymentStatus.POSTED]: 'Contabilizado',
  [PaymentStatus.CANCELLED]: 'Cancelado'
} as const;

export const PAYMENT_TYPE_LABELS = {
  [PaymentType.CUSTOMER_PAYMENT]: 'Pago de Cliente',
  [PaymentType.SUPPLIER_PAYMENT]: 'Pago a Proveedor'
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PaymentMethod.CASH]: 'Efectivo',
  [PaymentMethod.CHECK]: 'Cheque',
  [PaymentMethod.BANK_TRANSFER]: 'Transferencia Bancaria',
  [PaymentMethod.CREDIT_CARD]: 'Tarjeta de Crédito',
  [PaymentMethod.DEBIT_CARD]: 'Tarjeta de Débito',
  [PaymentMethod.ELECTRONIC]: 'Pago Electrónico',
  [PaymentMethod.OTHER]: 'Otro'
} as const;

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  POSTED = 'POSTED', 
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE'
}

export enum BankExtractLineStatus {
  IMPORTED = 'IMPORTED',
  MATCHED = 'MATCHED',
  RECONCILED = 'RECONCILED'
}

// Interface principal de Payment - refleja PaymentResponse del backend
export interface Payment {
  id: string;
  number: string;
  reference?: string;
  external_reference?: string;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  third_party_id: string;
  payment_date: string;
  value_date?: string;
  amount: number;
  allocated_amount: number;
  unallocated_amount: number;
  currency_code: string;
  exchange_rate: number;
  account_id: string;
  bank_account_number?: string;
  check_number?: string;
  transaction_id?: string;
  description?: string;
  notes?: string;
  journal_entry_id?: string;
  is_reconciled: boolean;
  reconciled_at?: string;
  
  // Campos de auditoría
  created_by_id: string;
  confirmed_by_id?: string;
  posted_by_id?: string;
  cancelled_by_id?: string;
  confirmed_at?: string;
  posted_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
  
  // Campos calculados/relacionales que puede incluir el backend
  partner_name?: string;
  account_name?: string;
  journal_name?: string;
}

// Tipo para crear un nuevo pago - debe coincidir exactamente con PaymentCreate del backend
export interface PaymentCreate {
  // Campos de PaymentBase
  reference?: string;
  payment_date: string; // ISO date string
  amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  currency_code: string;
  exchange_rate?: number;
  description?: string;
  notes?: string;
  
  // Campos específicos de PaymentCreate
  customer_id?: string; // UUID del tercero (cliente/proveedor) - opcional
  journal_id: string; // UUID del diario (obligatorio)
  // account_id se elimina - se toma del diario seleccionado
}

export interface BankExtractLine {
  id: string;
  extract_id: string;
  transaction_date: string;
  amount: number;
  description?: string;
  reference?: string;
  partner_name?: string;
  status: BankExtractLineStatus;
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BankExtract {
  id: string;
  reference: string;
  import_date: string;
  total_lines: number;
  processed_lines: number;
  lines?: BankExtractLine[];
  created_at: string;
  updated_at: string;
}

// DTOs para operaciones del flujo de pagos
export interface PaymentFlowImportRequest {
  bank_extract: {
    reference: string;
    lines: Array<{
      transaction_date: string;
      amount: number;
      description?: string;
      reference?: string;
      partner_name?: string;
    }>;
  };
}

export interface PaymentAutoMatchResult {
  line_id: string;
  payment_created: boolean;
  payment_id?: string;
  matched_invoice_id?: string;
  match_confidence: number;
  match_reason: string;
}

export interface PaymentFlowImportResult {
  extract_id: string;
  total_lines: number;
  auto_matched_lines: number;
  payments_created: number;
  results: PaymentAutoMatchResult[];
}

export interface PaymentFlowStatus {
  extract_id: string;
  total_lines: number;
  matched_lines: number;
  confirmed_payments: number;
  pending_reconciliation: number;
  fully_reconciled: boolean;
}

export interface PaymentConfirmation {
  payment_id: string;
  success: boolean;
  error?: string;
  journal_entry_id?: string;
  reconciled_invoices: string[];
}

export interface PaymentBatchConfirmation {
  total_payments: number;
  successful_confirmations: number;
  failed_confirmations: number;
  results: PaymentConfirmation[];
}

export interface PaymentReconciliationSummary {
  total_pending: number;
  total_amount_pending: number;
  by_currency: Record<string, number>;
  by_partner: Array<{
    partner_id: string;
    partner_name: string;
    pending_count: number;
    total_amount: number;
  }>;
}

// Filtros para las listas
export interface PaymentFilters {
  status?: PaymentStatus;
  payment_type?: PaymentType;
  partner_id?: string;
  journal_id?: string;
  currency_code?: string;
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  reference?: string;
  description?: string;
  page?: number;
  per_page?: number;
}

export interface BankExtractFilters {
  reference?: string;
  import_date_from?: string;
  import_date_to?: string;
  status?: BankExtractLineStatus;
  page?: number;
  per_page?: number;
}

// Respuestas paginadas
export interface PaymentListResponse {
  data: Payment[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface BankExtractListResponse {
  data: BankExtract[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

// Para importación de archivos - ACTUALIZADO para el nuevo endpoint consolidado
export interface FileImportRequest {
  file: File;
  format: 'csv' | 'excel' | 'xlsx' | 'xls' | 'txt';  // Más formatos soportados
  extract_reference?: string;  // Ahora será extract_name en el backend
  account_id?: string;         // ID de la cuenta bancaria (requerido por backend)
  statement_date?: string;     // Fecha del extracto (requerido por backend)
  auto_match?: boolean;        // Auto-vinculación activada (opcional, default true)
}

// Estados del UI
export interface PaymentFlowState {
  payments: Payment[];
  extracts: BankExtract[];
  selectedPayments: string[];
  selectedExtracts: string[];
  loading: boolean;
  error: string | null;
  filters: PaymentFilters;
  extractFilters: BankExtractFilters;
  importProgress?: {
    step: 'uploading' | 'processing' | 'matching' | 'completed';
    progress: number;
    message?: string;
  };
}

// Configuración de estado y colores para badges
export type BadgeColor = "gray" | "yellow" | "blue" | "green" | "emerald" | "orange" | "red" | "purple" | "indigo" | "pink";

export interface StatusConfig {
  label: string;
  color: BadgeColor;
  icon?: any;
}

// Acciones bulk disponibles
export interface BulkAction {
  id: string;
  label: string;
  icon?: any;
  variant?: 'default' | 'destructive' | 'success';
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationMessage?: string;
}

// ===== TIPOS PARA OPERACIONES BULK =====

export interface PaymentValidationResult {
  payment_id: string;
  payment_number: string;
  can_confirm: boolean;
  blocking_reasons: string[];
  warnings: string[];
  requires_confirmation: boolean;
}

export interface BulkPaymentValidationResponse {
  total_payments: number;
  can_confirm_count: number;
  blocked_count: number;
  warnings_count: number;
  validation_results: PaymentValidationResult[];
}

export interface PaymentOperationResult {
  payment_id: string;
  payment_number: string;
  success: boolean;
  message: string;
  error?: string;
}

// Formato real del backend para operaciones bulk
export interface BackendBulkPaymentResult {
  success: boolean;
  payment_number?: string;
  message: string;
  error?: string;
}

export interface BulkPaymentOperationResponse {
  operation?: string;
  total_payments: number;
  successful: number;
  failed: number;
  results: Record<string, BackendBulkPaymentResult>; // Objeto con payment_id como claves
  summary?: string;
  processing_time?: number;
}

export interface BulkPaymentConfirmationRequest {
  payment_ids: string[];
  confirmation_notes?: string;
}

export interface BulkPaymentValidationRequest {
  payment_ids: string[];
}

// ===== PROPS PARA COMPONENTES BULK =====

export interface BulkConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentIds: string[];
  onConfirm: (confirmationNotes?: string, force?: boolean) => void;
  onValidate?: (paymentIds: string[]) => Promise<BulkPaymentValidationResponse>;
  loading?: boolean;
}

export interface BulkOperationBarProps {
  selectedPayments: string[];
  onConfirm: (paymentIds: string[]) => void;
  onCancel: (paymentIds: string[]) => void;
  onDelete: (paymentIds: string[]) => void;
  onClearSelection: () => void;
  loading?: boolean;
}

export interface PaymentValidationSummaryProps {
  validationResults: BulkPaymentValidationResponse;
  onViewDetails: (paymentId: string) => void;
}
