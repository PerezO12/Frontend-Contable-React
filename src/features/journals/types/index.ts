/**
 * Tipos TypeScript para el módulo de Journals (Diarios)
 * Basado en los esquemas del backend
 */

// Tipos de journal como string literals
export type JournalType = 'sale' | 'purchase' | 'cash' | 'bank' | 'miscellaneous';

export const JournalTypeConst = {
  SALE: 'sale' as const,
  PURCHASE: 'purchase' as const,
  CASH: 'cash' as const,
  BANK: 'bank' as const,
  MISCELLANEOUS: 'miscellaneous' as const,
} as const;

// Labels para mostrar en UI
export const JournalTypeLabels: Record<JournalType, string> = {
  sale: 'Ventas',
  purchase: 'Compras',
  cash: 'Efectivo',
  bank: 'Banco',
  miscellaneous: 'Misceláneos',
};

// Colores para badges según tipo
export const JournalTypeColors: Record<JournalType, string> = {
  sale: 'bg-green-100 text-green-800',
  purchase: 'bg-blue-100 text-blue-800',
  cash: 'bg-yellow-100 text-yellow-800',
  bank: 'bg-indigo-100 text-indigo-800',
  miscellaneous: 'bg-gray-100 text-gray-800',
};

// Schema base para journals
export interface JournalBase {
  name: string;
  code: string;
  type: JournalType;
  sequence_prefix: string;
  default_account_id?: string;
  
  // Configuración de cuentas específicas para pagos
  default_debit_account_id?: string;
  default_credit_account_id?: string;
  customer_receivable_account_id?: string;
  supplier_payable_account_id?: string;
  cash_difference_account_id?: string;
  bank_charges_account_id?: string;
  currency_exchange_account_id?: string;
  
  sequence_padding: number;
  include_year_in_sequence: boolean;
  reset_sequence_yearly: boolean;
  requires_validation: boolean;
  allow_manual_entries: boolean;
  is_active: boolean;
  description?: string;
}

// Schema para crear journal
export interface JournalCreate extends JournalBase {}

// Schema para actualizar journal
export interface JournalUpdate {
  name?: string;
  default_account_id?: string;
  
  // Configuración de cuentas específicas para pagos
  default_debit_account_id?: string;
  default_credit_account_id?: string;
  customer_receivable_account_id?: string;
  supplier_payable_account_id?: string;
  cash_difference_account_id?: string;
  bank_charges_account_id?: string;
  currency_exchange_account_id?: string;
  
  sequence_padding?: number;
  include_year_in_sequence?: boolean;
  reset_sequence_yearly?: boolean;
  requires_validation?: boolean;
  allow_manual_entries?: boolean;
  is_active?: boolean;
  description?: string;
}

// Schema para leer journal
export interface JournalRead extends JournalBase {
  id: string;
  current_sequence_number: number;
  last_sequence_reset_year?: number;
  total_journal_entries: number;
  created_at: string;
  updated_at: string;
  created_by_id?: string;
}

// Account relacionada (simplificada)
export interface AccountRead {
  id: string;
  code: string;
  name: string;
  account_type: string;
}

// User relacionado (simplificado)
export interface UserRead {
  id: string;
  name: string;
  email: string;
}

// Schema detallado con relaciones
export interface JournalDetail extends JournalRead {
  default_account?: AccountRead;
  created_by?: UserRead;
  bank_config?: BankJournalConfigRead;
}

// Schema para listado
export interface JournalListItem {
  id: string;
  name: string;
  code: string;
  type: JournalType;
  sequence_prefix: string;
  is_active: boolean;
  current_sequence_number: number;
  total_journal_entries: number;
  created_at: string;
  default_account?: AccountRead;
}

// Filtros de búsqueda
export interface JournalFilter {
  type?: JournalType;
  is_active?: boolean;
  search?: string;
}

// Información de secuencia
export interface JournalSequenceInfo {
  id: string;
  name: string;
  code: string;
  sequence_prefix: string;
  current_sequence_number: number;
  next_sequence_number: string;
  include_year_in_sequence: boolean;
  reset_sequence_yearly: boolean;
  last_sequence_reset_year?: number;
}

// Reset de secuencia
export interface JournalResetSequence {
  confirm: boolean;
  reason?: string;
}

// Estadísticas de journal
export interface JournalStats {
  id: string;
  name: string;
  code: string;
  type: JournalType;
  total_entries: number;
  total_entries_current_year: number;
  total_entries_current_month: number;
  last_entry_date?: string;
  avg_entries_per_month: number;
}

// Respuesta de lista paginada
export interface JournalListResponse {
  items: JournalListItem[];
  total: number;
  skip: number;
  limit: number;
}

// Respuesta genérica para APIs
export interface JournalResponse extends JournalRead {}
export interface JournalDetailResponse extends JournalDetail {}

// Tipos para formularios
export interface JournalFormData extends Omit<JournalCreate, 'default_account_id' | 'default_debit_account_id' | 'default_credit_account_id' | 'customer_receivable_account_id' | 'supplier_payable_account_id' | 'cash_difference_account_id' | 'bank_charges_account_id' | 'currency_exchange_account_id'> {
  default_account_id?: string;
  default_debit_account_id?: string;
  default_credit_account_id?: string;
  customer_receivable_account_id?: string;
  supplier_payable_account_id?: string;
  cash_difference_account_id?: string;
  bank_charges_account_id?: string;
  currency_exchange_account_id?: string;
}

// Tipos para opciones de selects
export interface JournalOption {
  value: string;
  label: string;
  type: JournalType;
  sequence_prefix: string;
  is_active: boolean;
}

// Orden y paginación
export interface JournalOrderBy {
  field: 'name' | 'code' | 'type' | 'created_at' | 'total_journal_entries';
  direction: 'asc' | 'desc';
}

export interface JournalPagination {
  skip: number;
  limit: number;
  order_by?: string;
  order_dir?: 'asc' | 'desc';
}

// Estado de carga y errores
export interface JournalState {
  journals: JournalListItem[];
  currentJournal: JournalDetail | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  total: number;
  skip: number;
  limit: number;
}

// Tipos para hooks
export interface UseJournalsReturn {
  journals: JournalListItem[];
  loading: boolean;
  error: string | null;
  total: number;
  fetchJournals: (filters?: JournalFilter, pagination?: JournalPagination) => Promise<void>;
  refresh: () => Promise<void>;
}

export interface UseJournalReturn {
  journal: JournalDetail | null;
  loading: boolean;
  error: string | null;
  fetchJournal: (id: string) => Promise<void>;
  createJournal: (data: JournalCreate) => Promise<JournalDetail>;
  updateJournal: (id: string, data: JournalUpdate) => Promise<JournalDetail>;
  deleteJournal: (id: string) => Promise<void>;
  resetSequence: (id: string, reason?: string) => Promise<JournalDetail>;
}

// Exportar todos los tipos principales directamente al final

// Tipos para configuración bancaria
export type PaymentMode = 'manual' | 'batch';

export const PaymentModeConst = {
  MANUAL: 'manual' as const,
  BATCH: 'batch' as const,
} as const;

export const PaymentModeLabels: Record<PaymentMode, string> = {
  manual: 'Manual',
  batch: 'Por Lotes',
};

// Schema base para configuración bancaria
export interface BankJournalConfigBase {
  bank_account_number?: string;
  bank_account_id?: string;
  transit_account_id?: string;
  profit_account_id?: string;
  loss_account_id?: string;
  dedicated_payment_sequence: boolean;
  allow_inbound_payments: boolean;
  inbound_payment_mode: PaymentMode;
  inbound_receipt_account_id?: string;
  allow_outbound_payments: boolean;
  outbound_payment_mode: PaymentMode;
  outbound_payment_method?: string;
  outbound_payment_name?: string;
  outbound_pending_account_id?: string;
  currency_code: string;
  allow_currency_exchange: boolean;
  auto_reconcile: boolean;
  description?: string;
}

// Schema para crear configuración bancaria
export interface BankJournalConfigCreate extends BankJournalConfigBase {}

// Schema para actualizar configuración bancaria
export interface BankJournalConfigUpdate {
  bank_account_number?: string;
  bank_account_id?: string;
  transit_account_id?: string;
  profit_account_id?: string;
  loss_account_id?: string;
  dedicated_payment_sequence?: boolean;
  allow_inbound_payments?: boolean;
  inbound_payment_mode?: PaymentMode;
  inbound_receipt_account_id?: string;
  allow_outbound_payments?: boolean;
  outbound_payment_mode?: PaymentMode;
  outbound_payment_method?: string;
  outbound_payment_name?: string;
  outbound_pending_account_id?: string;
  currency_code?: string;
  allow_currency_exchange?: boolean;
  auto_reconcile?: boolean;
  description?: string;
}

// Schema para leer configuración bancaria
export interface BankJournalConfigRead extends BankJournalConfigBase {
  journal_id: string;
  // Cuentas relacionadas expandidas
  bank_account?: AccountRead;
  transit_account?: AccountRead;
  profit_account?: AccountRead;
  loss_account?: AccountRead;
  inbound_receipt_account?: AccountRead;
  outbound_pending_account?: AccountRead;
}

// Schema para validación de configuración bancaria
export interface BankJournalConfigValidation {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
}

// Journal con configuración bancaria incluida
export interface JournalWithBankConfig extends JournalRead {
  bank_config?: BankJournalConfigRead;
}
