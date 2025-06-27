import { z } from 'zod';
export declare const AccountType: {
    readonly ACTIVO: "activo";
    readonly PASIVO: "pasivo";
    readonly PATRIMONIO: "patrimonio";
    readonly INGRESO: "ingreso";
    readonly GASTO: "gasto";
    readonly COSTOS: "costos";
};
export type AccountType = typeof AccountType[keyof typeof AccountType];
export declare const AccountCategory: {
    readonly ACTIVO_CORRIENTE: "activo_corriente";
    readonly ACTIVO_NO_CORRIENTE: "activo_no_corriente";
    readonly PASIVO_CORRIENTE: "pasivo_corriente";
    readonly PASIVO_NO_CORRIENTE: "pasivo_no_corriente";
    readonly CAPITAL: "capital";
    readonly RESERVAS: "reservas";
    readonly RESULTADOS: "resultados";
    readonly INGRESOS_OPERACIONALES: "ingresos_operacionales";
    readonly INGRESOS_NO_OPERACIONALES: "ingresos_no_operacionales";
    readonly GASTOS_OPERACIONALES: "gastos_operacionales";
    readonly GASTOS_NO_OPERACIONALES: "gastos_no_operacionales";
    readonly COSTO_VENTAS: "costo_ventas";
    readonly COSTOS_PRODUCCION: "costos_produccion";
};
export type AccountCategory = typeof AccountCategory[keyof typeof AccountCategory];
export declare const CashFlowCategory: {
    readonly OPERATING: "operating";
    readonly INVESTING: "investing";
    readonly FINANCING: "financing";
    readonly CASH_EQUIVALENTS: "cash";
};
export type CashFlowCategory = typeof CashFlowCategory[keyof typeof CashFlowCategory];
export interface Account {
    id: string;
    code: string;
    name: string;
    description?: string;
    account_type: AccountType;
    category: AccountCategory;
    cash_flow_category?: CashFlowCategory;
    parent_id?: string;
    level: number;
    is_active: boolean;
    allows_movements: boolean;
    requires_third_party: boolean;
    requires_cost_center: boolean;
    balance: string;
    debit_balance: string;
    credit_balance: string;
    notes?: string;
    created_by_id: string;
    created_at: string;
    updated_at: string;
}
export interface AccountTree {
    id: string;
    code: string;
    name: string;
    account_type: AccountType;
    level: number;
    balance: string;
    is_active: boolean;
    allows_movements: boolean;
    children: AccountTree[];
}
export interface AccountCreate {
    code: string;
    name: string;
    description?: string;
    account_type: AccountType;
    category: AccountCategory;
    cash_flow_category?: CashFlowCategory;
    parent_id?: string;
    is_active?: boolean;
    allows_movements?: boolean;
    requires_third_party?: boolean;
    requires_cost_center?: boolean;
    notes?: string;
}
export interface AccountUpdate {
    name?: string;
    description?: string;
    category?: AccountCategory;
    cash_flow_category?: CashFlowCategory;
    is_active?: boolean;
    allows_movements?: boolean;
    requires_third_party?: boolean;
    requires_cost_center?: boolean;
    notes?: string;
}
export interface AccountFilters {
    skip?: number;
    limit?: number;
    account_type?: AccountType;
    category?: AccountCategory;
    cash_flow_category?: CashFlowCategory;
    is_active?: boolean;
    parent_id?: string;
    search?: string;
    page?: number;
    size?: number;
}
export interface AccountListResponse {
    items: Account[];
    total: number;
    skip: number;
    limit: number;
}
export declare const accountCreateSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    account_type: z.ZodEnum<["activo", "pasivo", "patrimonio", "ingreso", "gasto", "costos"]>;
    category: z.ZodEnum<["activo_corriente", "activo_no_corriente", "pasivo_corriente", "pasivo_no_corriente", "capital", "reservas", "resultados", "ingresos_operacionales", "ingresos_no_operacionales", "gastos_operacionales", "gastos_no_operacionales", "costo_ventas", "costos_produccion"]>;
    cash_flow_category: z.ZodOptional<z.ZodEnum<["operating", "investing", "financing", "cash"]>>;
    parent_id: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    allows_movements: z.ZodOptional<z.ZodBoolean>;
    requires_third_party: z.ZodOptional<z.ZodBoolean>;
    requires_cost_center: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code?: string;
    name?: string;
    description?: string;
    account_type?: "activo" | "pasivo" | "patrimonio" | "ingreso" | "gasto" | "costos";
    category?: "activo_corriente" | "activo_no_corriente" | "pasivo_corriente" | "pasivo_no_corriente" | "capital" | "reservas" | "resultados" | "ingresos_operacionales" | "ingresos_no_operacionales" | "gastos_operacionales" | "gastos_no_operacionales" | "costo_ventas" | "costos_produccion";
    cash_flow_category?: "operating" | "investing" | "financing" | "cash";
    parent_id?: string;
    is_active?: boolean;
    allows_movements?: boolean;
    requires_third_party?: boolean;
    requires_cost_center?: boolean;
    notes?: string;
}, {
    code?: string;
    name?: string;
    description?: string;
    account_type?: "activo" | "pasivo" | "patrimonio" | "ingreso" | "gasto" | "costos";
    category?: "activo_corriente" | "activo_no_corriente" | "pasivo_corriente" | "pasivo_no_corriente" | "capital" | "reservas" | "resultados" | "ingresos_operacionales" | "ingresos_no_operacionales" | "gastos_operacionales" | "gastos_no_operacionales" | "costo_ventas" | "costos_produccion";
    cash_flow_category?: "operating" | "investing" | "financing" | "cash";
    parent_id?: string;
    is_active?: boolean;
    allows_movements?: boolean;
    requires_third_party?: boolean;
    requires_cost_center?: boolean;
    notes?: string;
}>;
export declare const accountUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodEnum<["activo_corriente", "activo_no_corriente", "pasivo_corriente", "pasivo_no_corriente", "capital", "reservas", "resultados", "ingresos_operacionales", "ingresos_no_operacionales", "gastos_operacionales", "gastos_no_operacionales", "costo_ventas", "costos_produccion"]>>;
    cash_flow_category: z.ZodOptional<z.ZodEnum<["operating", "investing", "financing", "cash"]>>;
    is_active: z.ZodOptional<z.ZodBoolean>;
    allows_movements: z.ZodOptional<z.ZodBoolean>;
    requires_third_party: z.ZodOptional<z.ZodBoolean>;
    requires_cost_center: z.ZodOptional<z.ZodBoolean>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    description?: string;
    category?: "activo_corriente" | "activo_no_corriente" | "pasivo_corriente" | "pasivo_no_corriente" | "capital" | "reservas" | "resultados" | "ingresos_operacionales" | "ingresos_no_operacionales" | "gastos_operacionales" | "gastos_no_operacionales" | "costo_ventas" | "costos_produccion";
    cash_flow_category?: "operating" | "investing" | "financing" | "cash";
    is_active?: boolean;
    allows_movements?: boolean;
    requires_third_party?: boolean;
    requires_cost_center?: boolean;
    notes?: string;
}, {
    name?: string;
    description?: string;
    category?: "activo_corriente" | "activo_no_corriente" | "pasivo_corriente" | "pasivo_no_corriente" | "capital" | "reservas" | "resultados" | "ingresos_operacionales" | "ingresos_no_operacionales" | "gastos_operacionales" | "gastos_no_operacionales" | "costo_ventas" | "costos_produccion";
    cash_flow_category?: "operating" | "investing" | "financing" | "cash";
    is_active?: boolean;
    allows_movements?: boolean;
    requires_third_party?: boolean;
    requires_cost_center?: boolean;
    notes?: string;
}>;
export type AccountCreateForm = z.infer<typeof accountCreateSchema>;
export type AccountUpdateForm = z.infer<typeof accountUpdateSchema>;
export interface BulkAccountDelete {
    account_ids: string[];
    force_delete?: boolean;
    delete_reason?: string;
}
export interface AccountDeleteValidation {
    account_id: string;
    can_delete: boolean;
    blocking_reasons: string[];
    warnings: string[];
    dependencies: Record<string, any>;
}
export interface BulkAccountDeleteResult {
    total_requested: number;
    successfully_deleted: string[];
    failed_to_delete: Array<{
        account_id: string;
        reason: string;
        details: Record<string, any>;
    }>;
    validation_errors: Array<{
        account_id: string;
        error: string;
    }>;
    warnings: string[];
    success_count: number;
    failure_count: number;
    success_rate: number;
}
export interface AccountBalance {
    balance: string;
    debit_balance: string;
    credit_balance: string;
    normal_balance_side: 'debit' | 'credit';
}
export interface AccountHierarchy {
    full_code: string;
    full_name: string;
    is_parent_account: boolean;
    is_leaf_account: boolean;
    path: string[];
}
export declare const ACCOUNT_TYPE_LABELS: Record<AccountType, string>;
export declare const ACCOUNT_CATEGORY_LABELS: Record<AccountCategory, string>;
export declare const CASH_FLOW_CATEGORY_LABELS: Record<CashFlowCategory, string>;
export declare const CASH_FLOW_CATEGORY_DESCRIPTIONS: Record<CashFlowCategory, string>;
export declare const getAccountTypeProperties: (accountType: AccountType) => {
    normalBalanceSide: "debit";
    increasesWith: "debit";
    decreasesWith: "credit";
    balanceSheetSide: "left";
    statement: "balance_sheet";
} | {
    normalBalanceSide: "credit";
    increasesWith: "credit";
    decreasesWith: "debit";
    balanceSheetSide: "right";
    statement: "balance_sheet";
} | {
    normalBalanceSide: "credit";
    increasesWith: "credit";
    decreasesWith: "debit";
    balanceSheetSide: "right";
    statement: "balance_sheet";
} | {
    normalBalanceSide: "credit";
    increasesWith: "credit";
    decreasesWith: "debit";
    balanceSheetSide: any;
    statement: "income_statement";
} | {
    normalBalanceSide: "debit";
    increasesWith: "debit";
    decreasesWith: "credit";
    balanceSheetSide: any;
    statement: "income_statement";
} | {
    normalBalanceSide: "debit";
    increasesWith: "debit";
    decreasesWith: "credit";
    balanceSheetSide: any;
    statement: "income_statement";
};
export declare const getRecommendedCashFlowCategories: (accountType: AccountType) => CashFlowCategory[];
export declare const getDefaultCashFlowCategory: (accountType: AccountType, category: AccountCategory) => CashFlowCategory | undefined;
