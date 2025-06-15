import { z } from 'zod';

// Tipos como constantes para evitar enum issues
export const JournalEntryType = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic', 
  ADJUSTMENT: 'adjustment',
  OPENING: 'opening',
  CLOSING: 'closing',
  REVERSAL: 'reversal'
} as const;

export type JournalEntryType = typeof JournalEntryType[keyof typeof JournalEntryType];

export const JournalEntryStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  POSTED: 'posted',
  CANCELLED: 'cancelled'
} as const;

export type JournalEntryStatus = typeof JournalEntryStatus[keyof typeof JournalEntryStatus];

// Tipos para payment schedule en journal entry lines
export interface PaymentScheduleItem {
  sequence: number;
  days: number;
  percentage: number;
  amount: number;
  payment_date: string;
  description: string;
}

// Interfaces base
export interface JournalEntryLine {
  id: string;
  journal_entry_id: string;
  account_id: string;
  account_code?: string;
  account_name?: string;
  debit_amount: string;
  credit_amount: string;
  description?: string;
  reference?: string;
  third_party_id?: string;
  cost_center_id?: string;
  line_number: number;
  // Nuevos campos para payment terms integration
  payment_terms_id?: string;
  payment_terms_code?: string;
  payment_terms_name?: string;
  invoice_date?: string;
  due_date?: string;
  effective_invoice_date?: string;
  effective_due_date?: string;
  payment_schedule?: PaymentScheduleItem[];
}

export interface JournalEntry {
  id: string;
  number: string;
  reference?: string;
  description: string;
  entry_type: JournalEntryType;
  entry_date: string;
  posting_date?: string;
  status: JournalEntryStatus;
  total_debit: string;
  total_credit: string;
  created_by_id: string;
  approved_by_id?: string;
  posted_by_id?: string;
  cancelled_by_id?: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  posted_at?: string;
  cancelled_at?: string;
  notes?: string;
  external_reference?: string;
  lines: JournalEntryLine[];
  created_by_name?: string;
  approved_by_name?: string;
  posted_by_name?: string;
  cancelled_by_name?: string;
}

// Schemas de validación con Zod
export const journalEntryLineCreateSchema = z.object({
  account_id: z.string().uuid('ID de cuenta inválido'),
  debit_amount: z.string().refine(
    (val) => /^\d+(\.\d{1,2})?$/.test(val),
    'Monto débito debe ser un número válido'
  ),
  credit_amount: z.string().refine(
    (val) => /^\d+(\.\d{1,2})?$/.test(val),
    'Monto crédito debe ser un número válido'
  ),
  description: z.string().optional(),
  reference: z.string().optional(),
  third_party_id: z.string().optional(),
  cost_center_id: z.string().optional(),
  // Nuevos campos para payment terms
  payment_terms_id: z.string().uuid().optional(),
  invoice_date: z.string().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    'Fecha de factura inválida'
  ).optional(),
  due_date: z.string().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    'Fecha de vencimiento inválida'
  ).optional()
}).refine(
  (data) => {
    const debit = parseFloat(data.debit_amount);
    const credit = parseFloat(data.credit_amount);
    return (debit > 0 && credit === 0) || (credit > 0 && debit === 0);
  },
  {
    message: 'Una línea debe tener monto en débito O crédito, no ambos ni ninguno',
    path: ['debit_amount']
  }
).refine(
  (data) => {
    // Validar que si hay payment_terms_id también hay invoice_date
    if (data.payment_terms_id && !data.invoice_date) {
      return false;
    }
    return true;
  },
  {
    message: 'Si especifica condiciones de pago, debe incluir fecha de factura',
    path: ['invoice_date']
  }
).refine(
  (data) => {
    // Validar que la fecha de vencimiento no sea anterior a la fecha de factura
    if (data.invoice_date && data.due_date) {
      const invoiceDate = new Date(data.invoice_date);
      const dueDate = new Date(data.due_date);
      return dueDate >= invoiceDate;
    }
    return true;
  },
  {
    message: 'La fecha de vencimiento no puede ser anterior a la fecha de factura',
    path: ['due_date']
  }
);

export const journalEntryCreateSchema = z.object({
  reference: z.string().optional(),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  entry_type: z.enum(['manual', 'automatic', 'adjustment', 'opening', 'closing', 'reversal']),
  entry_date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Fecha inválida'
  ),
  notes: z.string().optional(),
  external_reference: z.string().optional(),
  lines: z.array(journalEntryLineCreateSchema).min(2, 'Un asiento debe tener al menos 2 líneas')
}).refine(
  (data) => {
    const totalDebit = data.lines.reduce((sum, line) => sum + parseFloat(line.debit_amount), 0);
    const totalCredit = data.lines.reduce((sum, line) => sum + parseFloat(line.credit_amount), 0);
    return Math.abs(totalDebit - totalCredit) < 0.01; // Tolerancia para redondeo
  },
  {
    message: 'El total de débitos debe ser igual al total de créditos (partida doble)',
    path: ['lines']
  }
);

export const journalEntryUpdateSchema = z.object({
  id: z.string().uuid(),
  reference: z.string().optional(),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres').optional(),
  entry_type: z.enum(['manual', 'automatic', 'adjustment', 'opening', 'closing', 'reversal']).optional(),
  entry_date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Fecha inválida'
  ).optional(),
  notes: z.string().optional(),
  external_reference: z.string().optional(),
  lines: z.array(journalEntryLineCreateSchema).min(2, 'Un asiento debe tener al menos 2 líneas').optional()
});

export const journalEntryFiltersSchema = z.object({
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(1000).optional(),
  entry_type: z.enum(['manual', 'automatic', 'adjustment', 'opening', 'closing', 'reversal']).optional(),
  status: z.enum(['draft', 'pending', 'approved', 'posted', 'cancelled']).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  search: z.string().optional(),
  account_id: z.string().uuid().optional(),
  created_by_id: z.string().uuid().optional(),
  reference: z.string().optional()
});

// Tipos derivados de los schemas
export type JournalEntryCreate = z.infer<typeof journalEntryCreateSchema>;
export type JournalEntryUpdate = z.infer<typeof journalEntryUpdateSchema>;
export type JournalEntryLineCreate = z.infer<typeof journalEntryLineCreateSchema>;
export type JournalEntryFilters = z.infer<typeof journalEntryFiltersSchema>;

// Form types para los componentes
export interface JournalEntryFormData {
  reference?: string;
  description: string;
  entry_type: JournalEntryType;
  entry_date: string;
  notes?: string;
  external_reference?: string;
  // Campos de payment terms a nivel de asiento
  third_party_id?: string;
  cost_center_id?: string;
  payment_terms_id?: string;
  invoice_date?: string;
  due_date?: string;
  lines: JournalEntryLineFormData[];
}

export interface JournalEntryLineFormData {
  account_id: string;
  account_code?: string;
  account_name?: string;
  debit_amount: string;
  credit_amount: string;
  description?: string;
  reference?: string;
  third_party_id?: string;
  cost_center_id?: string;
  // Nuevos campos para payment terms
  payment_terms_id?: string;
  invoice_date?: string;
  due_date?: string;
}

// Constantes y etiquetas
export const JOURNAL_ENTRY_TYPE_LABELS: Record<JournalEntryType, string> = {
  [JournalEntryType.MANUAL]: 'Manual',
  [JournalEntryType.AUTOMATIC]: 'Automático',
  [JournalEntryType.ADJUSTMENT]: 'Ajuste',
  [JournalEntryType.OPENING]: 'Apertura',
  [JournalEntryType.CLOSING]: 'Cierre',
  [JournalEntryType.REVERSAL]: 'Reversión'
};

export const JOURNAL_ENTRY_STATUS_LABELS: Record<JournalEntryStatus, string> = {
  [JournalEntryStatus.DRAFT]: 'Borrador',
  [JournalEntryStatus.PENDING]: 'Pendiente',
  [JournalEntryStatus.APPROVED]: 'Aprobado',
  [JournalEntryStatus.POSTED]: 'Contabilizado',
  [JournalEntryStatus.CANCELLED]: 'Cancelado'
};

export const JOURNAL_ENTRY_TYPE_DESCRIPTIONS: Record<JournalEntryType, string> = {
  [JournalEntryType.MANUAL]: 'Asiento creado manualmente por el usuario',
  [JournalEntryType.AUTOMATIC]: 'Asiento generado automáticamente por el sistema',
  [JournalEntryType.ADJUSTMENT]: 'Asiento de ajuste contable',
  [JournalEntryType.OPENING]: 'Asiento de apertura de periodo',
  [JournalEntryType.CLOSING]: 'Asiento de cierre de periodo',
  [JournalEntryType.REVERSAL]: 'Asiento de reversión'
};

// Utility types
export interface JournalEntryStatistics {
  total_entries: number;
  total_by_status: Record<JournalEntryStatus, number>;
  total_by_type: Record<JournalEntryType, number>;
  total_amount: string;
  entries_this_month: number;
  pending_approval: number;
}

export interface JournalEntryBalance {
  total_debit: string;
  total_credit: string;
  difference: string;
  is_balanced: boolean;
}

// API Response types
export interface JournalEntryListResponse {
  items: JournalEntry[];
  total: number;
  page: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface JournalEntryOperationResponse {
  success: boolean;
  message: string;
  journal_entry?: JournalEntry;
}

// Bulk operations types - Operaciones masivas
export interface BulkJournalEntryRequest {
  journal_entry_ids: string[];
  reason: string;
  force?: boolean;
}

export interface BulkJournalEntryApprove extends BulkJournalEntryRequest {
  approved_by_id?: string;
  force_approve?: boolean;
}

export interface BulkJournalEntryPost extends BulkJournalEntryRequest {
  posted_by_id?: string;
  force_post?: boolean;
}

export interface BulkJournalEntryCancel extends BulkJournalEntryRequest {
  cancelled_by_id?: string;
  force_cancel?: boolean;
}

export interface BulkJournalEntryReverse extends BulkJournalEntryRequest {
  reversal_date: string;
  reversed_by_id?: string;
  force_reverse?: boolean;
}

export interface BulkJournalEntryResetToDraft extends BulkJournalEntryRequest {
  reset_by_id?: string;
  force_reset?: boolean;
}

// Validaciones para operaciones masivas
export interface JournalEntryOperationValidation {
  journal_entry_id: string;
  journal_entry_number: string;
  journal_entry_description: string;
  current_status: JournalEntryStatus;
  can_approve?: boolean;
  can_post?: boolean;
  can_cancel?: boolean;
  can_reverse?: boolean;
  can_reset?: boolean;
  errors: string[];
  warnings: string[];
}

export interface JournalEntryApproveValidation extends JournalEntryOperationValidation {
  can_approve: boolean;
}

export interface JournalEntryPostValidation extends JournalEntryOperationValidation {
  can_post: boolean;
}

export interface JournalEntryCancelValidation extends JournalEntryOperationValidation {
  can_cancel: boolean;
}

export interface JournalEntryReverseValidation extends JournalEntryOperationValidation {
  can_reverse: boolean;
  reversal_date: string;
}

export interface JournalEntryResetToDraftValidation extends JournalEntryOperationValidation {
  can_reset: boolean;
}

// Resultados de operaciones masivas
export interface BulkJournalEntryOperationResult {
  operation_id: string;
  total_requested: number;
  total_processed: number;
  total_failed: number;
  execution_time_ms: number;
  processed_entries: JournalEntryOperationValidation[];
  failed_entries: JournalEntryOperationValidation[];
  operation_summary: {
    reason: string;
    executed_by: string;
    executed_at: string;
  };
}

export interface BulkJournalEntryApproveResult extends BulkJournalEntryOperationResult {
  total_approved: number;
  approved_entries: JournalEntryApproveValidation[];
}

export interface BulkJournalEntryPostResult extends BulkJournalEntryOperationResult {
  total_posted: number;
  posted_entries: JournalEntryPostValidation[];
}

export interface BulkJournalEntryCancelResult extends BulkJournalEntryOperationResult {
  total_cancelled: number;
  cancelled_entries: JournalEntryCancelValidation[];
}

export interface BulkJournalEntryReverseResult extends BulkJournalEntryOperationResult {
  total_reversed: number;
  reversed_entries: JournalEntryReverseValidation[];
  created_reversal_entries: JournalEntry[];
}

export interface BulkJournalEntryResetResult extends BulkJournalEntryOperationResult {
  total_reset: number;
  reset_entries: JournalEntryResetToDraftValidation[];
}

// Bulk deletion types - Ya existía pero se mantiene por compatibilidad
export interface BulkJournalEntryDelete {
  journal_entry_ids: string[];  // Actualizado según la especificación del backend
  force_delete?: boolean;
  reason?: string;
}

export interface JournalEntryDeleteValidation {
  journal_entry_id: string;
  journal_entry_number: string;
  journal_entry_description: string;
  status: JournalEntryStatus;
  can_delete: boolean;
  errors: string[];
  warnings: string[];
}

export interface BulkJournalEntryDeleteResult {
  total_requested: number;
  total_deleted: number;
  total_failed: number;
  deleted_entries: JournalEntryDeleteValidation[];
  failed_entries: JournalEntryDeleteValidation[];
  errors: string[];
  warnings: string[];
}
