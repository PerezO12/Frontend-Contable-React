import { z } from 'zod';

// ==========================================
// TIPOS BASE PARA PAYMENT TERMS
// ==========================================

export interface PaymentSchedule {
  id: string;
  payment_terms_id: string;
  sequence: number;
  days: number;
  percentage: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTerms {
  id: string;
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  notes?: string;
  total_percentage: number;
  max_days: number;
  is_valid: boolean;
  created_at: string;
  updated_at: string;
  payment_schedules: PaymentSchedule[];
  payment_schedules_count?: number;
}

// ==========================================
// SCHEMAS DE VALIDACIÓN
// ==========================================

export const paymentScheduleCreateSchema = z.object({
  sequence: z.number().int().min(1, 'La secuencia debe ser mayor a 0'),
  days: z.number().int().min(0, 'Los días deben ser mayor o igual a 0'),
  percentage: z.number().min(0.01, 'El porcentaje debe ser mayor a 0').max(100, 'El porcentaje no puede exceder 100'),
  description: z.string().optional()
});

export const paymentTermsCreateSchema = z.object({
  code: z.string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede exceder 20 caracteres')
    .regex(/^[A-Z0-9-_]+$/, 'El código solo puede contener letras mayúsculas, números, guiones y guiones bajos'),
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  is_active: z.boolean().default(true),
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional(),
  payment_schedules: z.array(paymentScheduleCreateSchema)
    .min(1, 'Debe incluir al menos un cronograma de pago')
    .refine(
      (schedules) => {
        // Validar que las secuencias sean únicas
        const sequences = schedules.map(s => s.sequence);
        return new Set(sequences).size === sequences.length;
      },
      { message: 'Las secuencias deben ser únicas' }
    )
    .refine(
      (schedules) => {
        // Validar que los porcentajes sumen 100%
        const totalPercentage = schedules.reduce((sum, s) => sum + s.percentage, 0);
        return Math.abs(totalPercentage - 100) < 0.01;
      },
      { message: 'Los porcentajes deben sumar exactamente 100%' }
    )
    .refine(
      (schedules) => {
        // Validar que los días estén en orden ascendente por secuencia
        const sortedBySequence = [...schedules].sort((a, b) => a.sequence - b.sequence);
        for (let i = 1; i < sortedBySequence.length; i++) {
          if (sortedBySequence[i].days < sortedBySequence[i - 1].days) {
            return false;
          }
        }
        return true;
      },
      { message: 'Los días deben estar en orden ascendente por secuencia' }
    )
});

export const paymentTermsUpdateSchema = paymentTermsCreateSchema.partial().extend({
  id: z.string().uuid('ID inválido')
});

export const paymentTermsFiltersSchema = z.object({
  skip: z.number().min(0).optional(),
  limit: z.number().min(1).max(100).optional(),
  is_active: z.boolean().optional(),
  search: z.string().optional(),
  sort_by: z.enum(['code', 'name', 'created_at', 'updated_at', 'max_days']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional()
});

// ==========================================
// TIPOS DERIVADOS DE SCHEMAS
// ==========================================

export type PaymentScheduleCreate = z.infer<typeof paymentScheduleCreateSchema>;
export type PaymentTermsCreate = z.infer<typeof paymentTermsCreateSchema>;
export type PaymentTermsUpdate = z.infer<typeof paymentTermsUpdateSchema>;
export type PaymentTermsFilters = z.infer<typeof paymentTermsFiltersSchema>;

// ==========================================
// TIPOS PARA COMPONENTES DE FORMULARIO
// ==========================================

export interface PaymentTermsFormData {
  code: string;
  name: string;
  description?: string;
  is_active: boolean;
  notes?: string;
  payment_schedules: PaymentScheduleFormData[];
}

export interface PaymentScheduleFormData {
  sequence: number;
  days: number;
  percentage: number;
  description?: string;
}

// ==========================================
// TIPOS PARA CÁLCULOS Y CRONOGRAMAS
// ==========================================

export interface PaymentCalculationRequest {
  payment_terms_id: string;
  invoice_date: string;
  amount: number;
}

export interface PaymentCalculationItem {
  sequence: number;
  days: number;
  percentage: number;
  amount: number;
  payment_date: string;
  description: string;
}

export interface PaymentCalculationResult {
  payment_terms: {
    id: string;
    code: string;
    name: string;
  };
  invoice_date: string;
  total_amount: number;
  schedule: PaymentCalculationItem[];
  final_due_date: string;
}

// ==========================================
// TIPOS PARA VALIDACIÓN
// ==========================================

export interface PaymentTermsValidationResult {
  is_valid: boolean;
  total_percentage: number;
  schedules_count: number;
  max_days: number;
  validation_errors: string[];
}

// ==========================================
// TIPOS PARA RESPUESTAS DE API
// ==========================================

export interface PaymentTermsListResponse {
  items: PaymentTerms[];
  total: number;
  skip: number;
  limit: number;
}

export interface PaymentTermsActiveResponse extends Array<{
  id: string;
  code: string;
  name: string;
  max_days: number;
}> {}

// ==========================================
// CONSTANTES Y LABELS
// ==========================================

export const PAYMENT_TERMS_SORT_OPTIONS = [
  { value: 'code', label: 'Código' },
  { value: 'name', label: 'Nombre' },
  { value: 'created_at', label: 'Fecha de creación' },
  { value: 'updated_at', label: 'Última actualización' },
  { value: 'max_days', label: 'Días máximos' }
] as const;

export const PAYMENT_TERMS_COMMON_TEMPLATES = [
  {
    code: 'CONTADO',
    name: 'Contado',
    description: 'Pago inmediato al contado',
    payment_schedules: [
      { sequence: 1, days: 0, percentage: 100, description: 'Pago inmediato' }
    ]
  },
  {
    code: '30D',
    name: '30 días',
    description: 'Pago a 30 días fecha factura',
    payment_schedules: [
      { sequence: 1, days: 30, percentage: 100, description: 'Pago único a 30 días' }
    ]
  },
  {
    code: '60D',
    name: '60 días',
    description: 'Pago a 60 días fecha factura',
    payment_schedules: [
      { sequence: 1, days: 60, percentage: 100, description: 'Pago único a 60 días' }
    ]
  },
  {
    code: '30-60',
    name: '30-60 días',
    description: 'Pago fraccionado: 50% a 30 días, 50% a 60 días',
    payment_schedules: [
      { sequence: 1, days: 30, percentage: 50, description: 'Primer pago - 50%' },
      { sequence: 2, days: 60, percentage: 50, description: 'Segundo pago - 50%' }
    ]
  },
  {
    code: '30-60-90',
    name: '30-60-90 días',
    description: 'Pago en tres cuotas iguales',
    payment_schedules: [
      { sequence: 1, days: 30, percentage: 33.33, description: 'Primera cuota - 33.33%' },
      { sequence: 2, days: 60, percentage: 33.33, description: 'Segunda cuota - 33.33%' },
      { sequence: 3, days: 90, percentage: 33.34, description: 'Tercera cuota - 33.34%' }
    ]
  }
] as const;

// ==========================================
// TIPOS PARA INTEGRACIÓN CON JOURNAL ENTRIES
// ==========================================

export interface JournalEntryLinePaymentInfo {
  payment_terms_id?: string;
  payment_terms_code?: string;
  payment_terms_name?: string;
  invoice_date?: string;
  due_date?: string;
  effective_invoice_date?: string;
  effective_due_date?: string;
  payment_schedule?: PaymentCalculationItem[];
}

// ==========================================
// UTILITY TYPES
// ==========================================

export interface PaymentTermsStatistics {
  total_active: number;
  total_inactive: number;
  most_used: PaymentTerms[];
  average_days: number;
  total_terms: number;
}

export interface PaymentTermsUsageInfo {
  payment_terms_id: string;
  usage_count: number;
  last_used: string;
  most_used_by: string[];
}
