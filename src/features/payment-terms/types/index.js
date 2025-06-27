var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { z } from 'zod';
// ==========================================
// SCHEMAS DE VALIDACIÓN
// ==========================================
export var paymentScheduleCreateSchema = z.object({
    sequence: z.number().int().min(1, 'La secuencia debe ser mayor a 0'),
    days: z.number().int().min(0, 'Los días deben ser mayor o igual a 0'),
    percentage: z.number()
        .min(0.000001, 'El porcentaje debe ser mayor a 0')
        .max(100, 'El porcentaje no puede exceder 100')
        .refine(function (val) {
        // Validar que tenga máximo 6 decimales
        var str = val.toString();
        var decimalIndex = str.indexOf('.');
        if (decimalIndex === -1)
            return true;
        return str.slice(decimalIndex + 1).length <= 6;
    }, { message: 'El porcentaje puede tener máximo 6 decimales' }),
    description: z.string().optional()
});
export var paymentTermsCreateSchema = z.object({
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
        .refine(function (schedules) {
        // Validar que las secuencias sean únicas
        var sequences = schedules.map(function (s) { return s.sequence; });
        return new Set(sequences).size === sequences.length;
    }, { message: 'Las secuencias deben ser únicas' }).refine(function (schedules) {
        // Validar que los porcentajes sumen exactamente 100% (hasta 6 decimales)
        var totalPercentage = schedules.reduce(function (sum, s) { return sum + s.percentage; }, 0);
        return Math.abs(totalPercentage - 100) < 0.000001;
    }, { message: 'Los porcentajes deben sumar exactamente 100.000000%' })
        .refine(function (schedules) {
        // Validar que los días estén en orden ascendente por secuencia
        var sortedBySequence = __spreadArray([], schedules, true).sort(function (a, b) { return a.sequence - b.sequence; });
        for (var i = 1; i < sortedBySequence.length; i++) {
            if (sortedBySequence[i].days < sortedBySequence[i - 1].days) {
                return false;
            }
        }
        return true;
    }, { message: 'Los días deben estar en orden ascendente por secuencia' })
});
export var paymentTermsUpdateSchema = paymentTermsCreateSchema.partial().extend({
    id: z.string().uuid('ID inválido')
});
export var paymentTermsFiltersSchema = z.object({
    skip: z.number().min(0).optional(),
    limit: z.number().min(1).max(100).optional(),
    is_active: z.boolean().optional(),
    search: z.string().optional(),
    sort_by: z.enum(['code', 'name', 'created_at', 'updated_at', 'max_days']).optional(),
    sort_order: z.enum(['asc', 'desc']).optional()
});
// ==========================================
// CONSTANTES Y LABELS
// ==========================================
export var PAYMENT_TERMS_SORT_OPTIONS = [
    { value: 'code', label: 'Código' },
    { value: 'name', label: 'Nombre' },
    { value: 'created_at', label: 'Fecha de creación' },
    { value: 'updated_at', label: 'Última actualización' },
    { value: 'max_days', label: 'Días máximos' }
];
export var PAYMENT_TERMS_COMMON_TEMPLATES = [
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
];
