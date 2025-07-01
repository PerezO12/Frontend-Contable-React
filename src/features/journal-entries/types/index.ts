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

// Nuevo enum para origen de transacción
export const TransactionOrigin = {
  SALE: 'sale',
  PURCHASE: 'purchase',
  ADJUSTMENT: 'adjustment',
  TRANSFER: 'transfer',
  PAYMENT: 'payment',
  COLLECTION: 'collection',
  OPENING: 'opening',
  CLOSING: 'closing',
  OTHER: 'other'
} as const;

export type TransactionOrigin = typeof TransactionOrigin[keyof typeof TransactionOrigin];

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
  created_at: string;
  updated_at: string;
  // Campos de terceros
  third_party_code?: string;
  third_party_name?: string;
  third_party_document_type?: string;
  third_party_document_number?: string;
  third_party_tax_id?: string;
  third_party_email?: string;
  third_party_phone?: string;
  third_party_address?: string;
  third_party_city?: string;
  third_party_type?: 'customer' | 'supplier' | 'employee' | 'other';
  // Campos de centro de costo
  cost_center_code?: string;
  cost_center_name?: string;
  // Campos para payment terms integration
  payment_terms_id?: string;
  payment_terms_code?: string;
  payment_terms_name?: string;
  payment_terms_description?: string;
  invoice_date?: string;
  due_date?: string;
  effective_invoice_date?: string;
  effective_due_date?: string;
  // Campos para productos
  product_id?: string;
  product_code?: string;
  product_name?: string;
  product_type?: string;
  product_measurement_unit?: string;
  quantity?: string;
  unit_price?: string;
  discount_percentage?: string;
  discount_amount?: string;
  tax_percentage?: string;
  tax_amount?: string;
  // Campos calculados adicionales
  subtotal_before_discount?: string;
  effective_unit_price?: string;
  total_discount?: string;
  subtotal_after_discount?: string;
  net_amount?: string;
  gross_amount?: string;
  amount?: string; // Monto de la línea (debit_amount o credit_amount)
  movement_type?: 'debit' | 'credit'; // Tipo de movimiento
  payment_schedule?: PaymentScheduleItem[];
}

export interface JournalEntry {
  id: string;
  number: string;
  reference?: string;
  description: string;
  entry_type: JournalEntryType;
  transaction_origin?: TransactionOrigin;
  entry_date: string;
  earliest_due_date?: string;
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
  // Nombres de usuarios
  created_by_name?: string;
  approved_by_name?: string;
  posted_by_name?: string;
  cancelled_by_name?: string;
  // Campos de estado y validación
  is_balanced?: boolean;
  can_be_posted?: boolean;
  can_be_edited?: boolean;
}

// Schemas de validación con Zod
export const journalEntryLineCreateSchema = z.object({
  account_id: z.string().uuid('ID de cuenta inválido'),
  debit_amount: z.union([
    z.string().refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      'Monto débito debe ser un número válido'
    ),
    z.number().min(0, 'Monto débito debe ser positivo')
  ]),
  credit_amount: z.union([
    z.string().refine(
      (val) => /^\d+(\.\d{1,2})?$/.test(val),
      'Monto crédito debe ser un número válido'
    ),
    z.number().min(0, 'Monto crédito debe ser positivo')
  ]),  description: z.string().optional(),
  reference: z.string().optional(),
  third_party_id: z.string().refine(
    (val) => !val || val === '' || z.string().uuid().safeParse(val).success,
    'ID de tercero inválido'
  ).optional(),
  cost_center_id: z.string().refine(
    (val) => !val || val === '' || z.string().uuid().safeParse(val).success,
    'ID de centro de costo inválido'
  ).optional(),// Campos para payment terms - OPCIONAL y solo valida UUID si tiene valor
  payment_terms_id: z.string().refine(
    (val) => !val || val === '' || z.string().uuid().safeParse(val).success,
    'ID de términos de pago inválido'
  ).optional(),
  invoice_date: z.string().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    'Fecha de factura inválida'
  ).optional(),
  due_date: z.string().refine(
    (val) => !val || !isNaN(Date.parse(val)),
    'Fecha de vencimiento inválida'
  ).optional(),  // Nuevos campos para productos
  product_id: z.string().refine(
    (val) => !val || val === '' || z.string().uuid().safeParse(val).success,
    'ID de producto inválido'
  ).optional(),
  quantity: z.string().refine(
    (val) => !val || (/^\d+(\.\d{1,4})?$/.test(val) && parseFloat(val) > 0),
    'La cantidad debe ser un número positivo'
  ).optional(),  unit_price: z.string().refine(
    (val) => {
      if (!val || val === '' || val === '0' || val === '0.00') return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && isFinite(num);
    },
    'El precio unitario debe ser un número válido'
  ).optional(),
  discount_percentage: z.string().refine(
    (val) => !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0 && parseFloat(val) <= 100),
    'El porcentaje de descuento debe estar entre 0 y 100'
  ).optional(),
  discount_amount: z.string().refine(
    (val) => !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0),
    'El monto de descuento debe ser un número positivo'
  ).optional(),
  tax_percentage: z.string().refine(
    (val) => !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0),
    'El porcentaje de impuesto debe ser un número positivo'
  ).optional(),
  tax_amount: z.string().refine(
    (val) => !val || (/^\d+(\.\d{1,2})?$/.test(val) && parseFloat(val) >= 0),
    'El monto de impuesto debe ser un número positivo'
  ).optional()
}).refine(
  (data) => {
    const debit = typeof data.debit_amount === 'string' 
      ? parseFloat(data.debit_amount) 
      : data.debit_amount;
    const credit = typeof data.credit_amount === 'string' 
      ? parseFloat(data.credit_amount) 
      : data.credit_amount;
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
).refine(
  (data) => {
    // Si hay producto, debe haber cantidad para productos físicos
    if (data.product_id && !data.quantity) {
      return false; // Será validado en el backend según el tipo de producto
    }
    return true;
  },
  {
    message: 'Si especifica un producto, debe incluir la cantidad',
    path: ['quantity']
  }
).refine(
  (data) => {
    // No permitir ambos tipos de descuento al mismo tiempo
    if (data.discount_percentage && data.discount_amount) {
      return false;
    }
    return true;
  },
  {
    message: 'No se puede especificar porcentaje y monto de descuento al mismo tiempo',
    path: ['discount_amount']
  }
).refine(
  (data) => {
    // No permitir ambos tipos de impuesto al mismo tiempo
    if (data.tax_percentage && data.tax_amount) {
      return false;
    }
    return true;
  },
  {
    message: 'No se puede especificar porcentaje y monto de impuesto al mismo tiempo',
    path: ['tax_amount']
  }
);

export const journalEntryCreateSchema = z.object({
  reference: z.string().optional(),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  entry_type: z.enum(['manual', 'automatic', 'adjustment', 'opening', 'closing', 'reversal']),
  transaction_origin: z.enum(['sale', 'purchase', 'adjustment', 'transfer', 'payment', 'collection', 'opening', 'closing', 'other']).optional(),
  entry_date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Fecha inválida'
  ),
  notes: z.string().optional(),
  external_reference: z.string().optional(),
  lines: z.array(journalEntryLineCreateSchema).min(2, 'Un asiento debe tener al menos 2 líneas')
}).refine(
  (data) => {
    const totalDebit = data.lines.reduce((sum, line) => {
      const amount = typeof line.debit_amount === 'string' 
        ? parseFloat(line.debit_amount) 
        : line.debit_amount;
      return sum + amount;
    }, 0);
    const totalCredit = data.lines.reduce((sum, line) => {
      const amount = typeof line.credit_amount === 'string' 
        ? parseFloat(line.credit_amount) 
        : line.credit_amount;
      return sum + amount;
    }, 0);
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
  transaction_origin: z.array(z.enum(['sale', 'purchase', 'adjustment', 'transfer', 'payment', 'collection', 'opening', 'closing', 'other'])).optional(),
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
  transaction_origin?: TransactionOrigin;
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
  // Campos para payment terms
  payment_terms_id?: string;
  invoice_date?: string;
  due_date?: string;
  // Nuevos campos para productos
  product_id?: string;
  quantity?: string;
  unit_price?: string;
  discount_percentage?: string;
  discount_amount?: string;
  tax_percentage?: string;
  tax_amount?: string;
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

// Labels para mostrar en UI
export const TransactionOriginLabels: Record<TransactionOrigin, string> = {
  [TransactionOrigin.SALE]: 'Venta',
  [TransactionOrigin.PURCHASE]: 'Compra',
  [TransactionOrigin.ADJUSTMENT]: 'Ajuste',
  [TransactionOrigin.TRANSFER]: 'Transferencia',
  [TransactionOrigin.PAYMENT]: 'Pago',
  [TransactionOrigin.COLLECTION]: 'Cobro',
  [TransactionOrigin.OPENING]: 'Apertura',
  [TransactionOrigin.CLOSING]: 'Cierre',
  [TransactionOrigin.OTHER]: 'Otro'
};

// Helpers para validación de productos en journal entries
export const getTransactionOriginColor = (origin?: TransactionOrigin): string => {
  if (!origin) return 'bg-gray-100 text-gray-800';
  
  switch (origin) {
    case TransactionOrigin.SALE:
    case TransactionOrigin.COLLECTION:
      return 'bg-green-100 text-green-800';
    case TransactionOrigin.PURCHASE:
    case TransactionOrigin.PAYMENT:
      return 'bg-blue-100 text-blue-800';
    case TransactionOrigin.ADJUSTMENT:
      return 'bg-yellow-100 text-yellow-800';
    case TransactionOrigin.TRANSFER:
      return 'bg-purple-100 text-purple-800';
    case TransactionOrigin.OPENING:
      return 'bg-indigo-100 text-indigo-800';
    case TransactionOrigin.CLOSING:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper para determinar si una transacción requiere productos
export const isProductTransaction = (origin?: TransactionOrigin): boolean => {
  return origin === TransactionOrigin.SALE || origin === TransactionOrigin.PURCHASE;
};

// Helper para validar coherencia de origen con líneas
export const validateTransactionOriginCoherence = (
  origin?: TransactionOrigin,
  lines?: { debit_amount: string; credit_amount: string }[]
): { valid: boolean; message?: string } => {
  if (!origin || !lines || lines.length === 0) {
    return { valid: true };
  }

  const salesOrigins: TransactionOrigin[] = [TransactionOrigin.SALE, TransactionOrigin.COLLECTION];
  const purchaseOrigins: TransactionOrigin[] = [TransactionOrigin.PURCHASE, TransactionOrigin.PAYMENT];

  if (salesOrigins.includes(origin)) {
    const hasRevenueLines = lines.some(line => parseFloat(line.credit_amount) > 0);
    if (!hasRevenueLines) {
      return {
        valid: false,
        message: 'Los asientos de ventas/cobros deben incluir al menos una línea de crédito (ingreso)'
      };
    }
  }

  if (purchaseOrigins.includes(origin)) {
    const hasExpenseLines = lines.some(line => parseFloat(line.debit_amount) > 0);
    if (!hasExpenseLines) {
      return {
        valid: false,
        message: 'Los asientos de compras/pagos deben incluir al menos una línea de débito (gasto o activo)'
      };
    }
  }

  return { valid: true };
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
  skip: number;
  limit: number;
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

export interface BulkJournalEntryDeleteResult extends BulkJournalEntryOperationResult {
  total_deleted: number;
  deleted_entries: JournalEntryDeleteValidation[];
  warnings?: string[];
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

// Interfaces específicas para el backend (con números en amounts)
export interface JournalEntryLineBackend {
  account_id: string;
  description?: string;
  debit_amount: number;
  credit_amount: number;
  third_party_id?: string;
  cost_center_id?: string;
  reference?: string;
  // Campos de productos
  product_id?: string;
  quantity?: number;
  unit_price?: number;
  discount_percentage?: number;
  discount_amount?: number;
  tax_percentage?: number;
  tax_amount?: number;
  // Campos de payment terms
  payment_terms_id?: string;
  invoice_date?: string;
  due_date?: string;
}

export interface JournalEntryBackend {
  entry_date: string;
  reference?: string;
  description: string;
  entry_type: JournalEntryType;
  transaction_origin?: TransactionOrigin;
  notes?: string;
  lines: JournalEntryLineBackend[];
}
