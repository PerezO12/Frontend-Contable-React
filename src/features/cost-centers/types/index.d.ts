import { z } from 'zod';
export interface CostCenter {
    id: string;
    code: string;
    name: string;
    description?: string;
    parent_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    level: number;
    full_code: string;
    is_leaf: boolean;
    parent_name?: string;
    children_count: number;
    movements_count: number;
}
export interface CostCenterTree {
    id: string;
    code: string;
    name: string;
    description?: string;
    is_active: boolean;
    allows_direct_assignment: boolean;
    manager_name?: string;
    level: number;
    is_leaf: boolean;
    children: CostCenterTree[];
}
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
export declare const costCenterCreateSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code?: string;
    name?: string;
    description?: string;
    parent_id?: string;
    is_active?: boolean;
}, {
    code?: string;
    name?: string;
    description?: string;
    parent_id?: string;
    is_active?: boolean;
}>;
export declare const costCenterUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    description?: string;
    parent_id?: string;
    is_active?: boolean;
}, {
    name?: string;
    description?: string;
    parent_id?: string;
    is_active?: boolean;
}>;
export type CostCenterCreateForm = z.infer<typeof costCenterCreateSchema>;
export type CostCenterUpdateForm = z.infer<typeof costCenterUpdateSchema>;
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
export declare const COST_CENTER_DEFAULT_FILTERS: CostCenterFilters;
export declare const COST_CENTER_CODE_PATTERN: RegExp;
export declare const COST_CENTER_MAX_LEVELS = 5;
export interface BulkCostCenterDelete {
    cost_center_ids: string[];
    force_delete?: boolean;
    delete_reason?: string;
}
export interface CostCenterDeleteValidation {
    cost_center_id: string;
    can_delete: boolean;
    blocking_reasons: string[];
    warnings: string[];
    dependencies: Record<string, any>;
}
export interface BulkCostCenterDeleteResult {
    total_requested: number;
    successfully_deleted: string[];
    failed_to_delete: Array<{
        cost_center_id: string;
        reason: string;
        details: Record<string, any>;
    }>;
    validation_errors: Array<{
        cost_center_id: string;
        error: string;
    }>;
    warnings: string[];
    success_count: number;
    failure_count: number;
}
