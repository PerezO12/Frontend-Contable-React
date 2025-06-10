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
  APPROVED: 'approved',
  POSTED: 'posted',
  CANCELLED: 'cancelled'
} as const;

export type JournalEntryStatus = typeof JournalEntryStatus[keyof typeof JournalEntryStatus];

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
  cost_center_id: z.string().optional()
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
  status: z.enum(['draft', 'approved', 'posted', 'cancelled']).optional(),
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
