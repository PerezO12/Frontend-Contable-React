// Types for the Cost Centers module
import { z } from 'zod';
// Validation schemas using Zod
export var costCenterCreateSchema = z.object({
    code: z.string()
        .min(1, 'El código es requerido')
        .max(20, 'El código no puede exceder 20 caracteres')
        .regex(/^[A-Z0-9][A-Z0-9_-]*$/, 'Código debe contener solo letras, números, guiones y guiones bajos'),
    name: z.string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    description: z.string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .optional(),
    parent_id: z.string().uuid().optional(),
    is_active: z.boolean().optional()
});
export var costCenterUpdateSchema = z.object({
    name: z.string()
        .min(1, 'El nombre es requerido')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .optional(),
    description: z.string()
        .max(500, 'La descripción no puede exceder 500 caracteres')
        .optional(),
    parent_id: z.string().uuid().optional(),
    is_active: z.boolean().optional()
});
// Export constants for use throughout the module
export var COST_CENTER_DEFAULT_FILTERS = {
    skip: 0,
    limit: 100,
    is_active: true,
    order_by: 'code',
    order_desc: false
};
// Validation patterns
export var COST_CENTER_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]*$/;
export var COST_CENTER_MAX_LEVELS = 5; // Maximum hierarchy levels
