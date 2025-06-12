// Types for the Cost Centers module
import { z } from 'zod';

// Base CostCenter interface (matching backend model)
export interface CostCenter {
  id: string;
  code: string;
  name: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Calculated properties from backend
  level: number;
  full_code: string;
  is_leaf: boolean;
  
  // Relationship counts for UI
  parent_name?: string;
  children_count: number;
  movements_count: number;
}

// Cost Center Tree structure for hierarchical display
export interface CostCenterTree {
  id: string;
  code: string;
  name: string;
  level: number;
  is_active: boolean;
  children: CostCenterTree[];
}

// DTOs for API operations
export interface CostCenterCreate {
  code: string;
  name: string;
  description?: string;
  parent_id?: string;
  is_active?: boolean;
}

export interface CostCenterUpdate {
  name?: string;
  description?: string;
  parent_id?: string;
  is_active?: boolean;
}

// Filter interfaces
export interface CostCenterFilters {
  skip?: number;
  limit?: number;
  code?: string;
  name?: string;
  parent_id?: string;
  is_active?: boolean;
  level?: number;
  has_children?: boolean;
  created_after?: string;
  created_before?: string;
  order_by?: 'code' | 'name' | 'created_at' | 'level';
  order_desc?: boolean;
}

// Validation schemas using Zod
export const costCenterCreateSchema = z.object({
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

export const costCenterUpdateSchema = z.object({
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

export type CostCenterCreateForm = z.infer<typeof costCenterCreateSchema>;
export type CostCenterUpdateForm = z.infer<typeof costCenterUpdateSchema>;

// Utility types for cost center analysis
export interface CostCenterAnalysis {
  cost_center: CostCenter;
  total_expenses: string;
  total_income: string;
  net_result: string;
  margin_percentage: number;
  period_start: string;
  period_end: string;
}

export interface CostCenterHierarchy {
  cost_center: CostCenter;
  path: string[];
  depth: number;
  children: CostCenterHierarchy[];
}

// Export constants for use throughout the module
export const COST_CENTER_DEFAULT_FILTERS: CostCenterFilters = {
  skip: 0,
  limit: 100,
  is_active: true,
  order_by: 'code',
  order_desc: false
};

// Validation patterns
export const COST_CENTER_CODE_PATTERN = /^[A-Z0-9][A-Z0-9_-]*$/;
export const COST_CENTER_MAX_LEVELS = 5; // Maximum hierarchy levels
