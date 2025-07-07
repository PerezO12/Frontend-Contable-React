// Types for the Accounts module
import { z } from 'zod';

// Account Types (matching backend enum)
export const AccountType = {
  ASSET: 'asset',
  LIABILITY: 'liability', 
  EQUITY: 'equity',
  INCOME: 'income',
  EXPENSE: 'expense',
  COST: 'cost',
  // Legacy Spanish names for backward compatibility
  ACTIVO: 'asset',
  PASIVO: 'liability',
  PATRIMONIO: 'equity',
  INGRESO: 'income',
  GASTO: 'expense',
  COSTOS: 'cost'
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

// Account Categories (matching backend enum)
export const AccountCategory = {
  // Assets
  CURRENT_ASSET: 'current_asset',
  NON_CURRENT_ASSET: 'non_current_asset',
  // Liabilities
  CURRENT_LIABILITY: 'current_liability',
  NON_CURRENT_LIABILITY: 'non_current_liability',
  // Equity
  CAPITAL: 'capital',
  RESERVES: 'reserves',
  RETAINED_EARNINGS: 'retained_earnings',
  // Income
  OPERATING_INCOME: 'operating_income',
  NON_OPERATING_INCOME: 'non_operating_income',
  // Expenses
  OPERATING_EXPENSE: 'operating_expense',
  NON_OPERATING_EXPENSE: 'non_operating_expense',
  // Costs
  COST_OF_SALES: 'cost_of_sales',
  PRODUCTION_COSTS: 'production_costs',
  // Taxes
  TAXES: 'taxes',
  // Legacy Spanish names for backward compatibility
  ACTIVO_CORRIENTE: 'current_asset',
  ACTIVO_NO_CORRIENTE: 'non_current_asset',
  PASIVO_CORRIENTE: 'current_liability',
  PASIVO_NO_CORRIENTE: 'non_current_liability',
  RESERVAS: 'reserves',
  RESULTADOS: 'retained_earnings',
  INGRESOS_OPERACIONALES: 'operating_income',
  INGRESOS_NO_OPERACIONALES: 'non_operating_income',
  GASTOS_OPERACIONALES: 'operating_expense',
  GASTOS_NO_OPERACIONALES: 'non_operating_expense',
  COSTO_VENTAS: 'cost_of_sales',
  COSTOS_PRODUCCION: 'production_costs'
} as const;

export type AccountCategory = typeof AccountCategory[keyof typeof AccountCategory];

// Cash Flow Categories (matching backend enum)
export const CashFlowCategory = {
  OPERATING: 'operating',
  INVESTING: 'investing',
  FINANCING: 'financing',
  CASH_EQUIVALENTS: 'cash'
} as const;

export type CashFlowCategory = typeof CashFlowCategory[keyof typeof CashFlowCategory];

// Base Account interface
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

// Account Tree structure for hierarchical display
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

// DTOs for API operations
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

// Filter interfaces
export interface AccountFilters {
  skip?: number;
  limit?: number;
  account_type?: AccountType;
  category?: AccountCategory;
  cash_flow_category?: CashFlowCategory;
  is_active?: boolean;
  parent_id?: string;
  search?: string;
  // Paginación como parte del filtro
  page?: number;
  size?: number;
  // Ordenamiento
  order_by?: 'code' | 'name' | 'created_at' | 'level';
  order_desc?: boolean;
}

// API Response types
export interface AccountListResponse {
  items: Account[];
  total: number;
  skip: number;
  limit: number;
}

// Validation schemas using Zod
export const accountCreateSchema = z.object({
  code: z.string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede exceder 20 caracteres')
    .regex(/^[A-Za-z0-9._-]+$/, 'El código solo puede contener letras, números, puntos, guiones y guiones bajos'),
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  description: z.string().optional(),
  account_type: z.enum(['asset', 'liability', 'equity', 'income', 'expense', 'cost']),
  category: z.enum([
    'current_asset', 'non_current_asset',
    'current_liability', 'non_current_liability',
    'capital', 'reserves', 'retained_earnings',
    'operating_income', 'non_operating_income',
    'operating_expense', 'non_operating_expense',
    'cost_of_sales', 'production_costs', 'taxes'
  ]),
  cash_flow_category: z.enum(['operating', 'investing', 'financing', 'cash']).optional(),
  parent_id: z.string().uuid().optional(),
  is_active: z.boolean().optional(),
  allows_movements: z.boolean().optional(),
  requires_third_party: z.boolean().optional(),
  requires_cost_center: z.boolean().optional(),
  notes: z.string().optional()
});

export const accountUpdateSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .optional(),
  description: z.string().optional(),
  category: z.enum([
    'current_asset', 'non_current_asset',
    'current_liability', 'non_current_liability',
    'capital', 'reserves', 'retained_earnings',
    'operating_income', 'non_operating_income',
    'operating_expense', 'non_operating_expense',
    'cost_of_sales', 'production_costs', 'taxes'
  ]).optional(),
  cash_flow_category: z.enum(['operating', 'investing', 'financing', 'cash']).optional(),
  is_active: z.boolean().optional(),
  allows_movements: z.boolean().optional(),
  requires_third_party: z.boolean().optional(),
  requires_cost_center: z.boolean().optional(),
  notes: z.string().optional()
});

export type AccountCreateForm = z.infer<typeof accountCreateSchema>;
export type AccountUpdateForm = z.infer<typeof accountUpdateSchema>;

// Bulk deletion types
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

// Bulk activate/deactivate types
export interface BulkAccountActivate {
  account_ids: string[];
  activation_reason?: string;
}

export interface BulkAccountDeactivate {
  account_ids: string[];
  deactivation_reason?: string;
}

export interface BulkAccountStatusResult {
  total_requested: number;
  successfully_processed: string[];
  failed_to_process: Array<{
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

// Utility types for account management
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

// Constants for account type labels and descriptions
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.ASSET]: 'Asset',
  [AccountType.LIABILITY]: 'Liability',
  [AccountType.EQUITY]: 'Equity',
  [AccountType.INCOME]: 'Income',
  [AccountType.EXPENSE]: 'Expense',
  [AccountType.COST]: 'Cost'
};

export const ACCOUNT_CATEGORY_LABELS: Record<AccountCategory, string> = {
  [AccountCategory.CURRENT_ASSET]: 'Current Asset',
  [AccountCategory.NON_CURRENT_ASSET]: 'Non-Current Asset',
  [AccountCategory.CURRENT_LIABILITY]: 'Current Liability',
  [AccountCategory.NON_CURRENT_LIABILITY]: 'Non-Current Liability',
  [AccountCategory.CAPITAL]: 'Capital',
  [AccountCategory.RESERVES]: 'Reserves',
  [AccountCategory.RETAINED_EARNINGS]: 'Retained Earnings',
  [AccountCategory.OPERATING_INCOME]: 'Operating Income',
  [AccountCategory.NON_OPERATING_INCOME]: 'Non-Operating Income',
  [AccountCategory.OPERATING_EXPENSE]: 'Operating Expense',
  [AccountCategory.NON_OPERATING_EXPENSE]: 'Non-Operating Expense',
  [AccountCategory.COST_OF_SALES]: 'Cost of Sales',
  [AccountCategory.PRODUCTION_COSTS]: 'Production Costs',
  [AccountCategory.TAXES]: 'Taxes'
};

export const CASH_FLOW_CATEGORY_LABELS: Record<CashFlowCategory, string> = {
  [CashFlowCategory.OPERATING]: 'Actividades de Operación',
  [CashFlowCategory.INVESTING]: 'Actividades de Inversión',
  [CashFlowCategory.FINANCING]: 'Actividades de Financiamiento',
  [CashFlowCategory.CASH_EQUIVALENTS]: 'Efectivo y Equivalentes'
};

export const CASH_FLOW_CATEGORY_DESCRIPTIONS: Record<CashFlowCategory, string> = {
  [CashFlowCategory.OPERATING]: 'Cuentas relacionadas con la actividad principal del negocio (ventas, gastos operativos, etc.)',
  [CashFlowCategory.INVESTING]: 'Cuentas relacionadas con compra/venta de activos a largo plazo (equipos, propiedades, etc.)',
  [CashFlowCategory.FINANCING]: 'Cuentas relacionadas con financiamiento y estructura de capital (préstamos, capital social, etc.)',
  [CashFlowCategory.CASH_EQUIVALENTS]: 'Cuentas que representan efectivo o instrumentos líquidos (caja, bancos, inversiones temporales)'
};

// Helper functions for account type behavior
export const getAccountTypeProperties = (accountType: AccountType) => {
  const properties = {
    [AccountType.ASSET]: {
      normalBalanceSide: 'debit' as const,
      increasesWith: 'debit' as const,
      decreasesWith: 'credit' as const,
      balanceSheetSide: 'left' as const,
      statement: 'balance_sheet' as const
    },
    [AccountType.LIABILITY]: {
      normalBalanceSide: 'credit' as const,
      increasesWith: 'credit' as const,
      decreasesWith: 'debit' as const,
      balanceSheetSide: 'right' as const,
      statement: 'balance_sheet' as const
    },
    [AccountType.EQUITY]: {
      normalBalanceSide: 'credit' as const,
      increasesWith: 'credit' as const,
      decreasesWith: 'debit' as const,
      balanceSheetSide: 'right' as const,
      statement: 'balance_sheet' as const
    },
    [AccountType.INCOME]: {
      normalBalanceSide: 'credit' as const,
      increasesWith: 'credit' as const,
      decreasesWith: 'debit' as const,
      balanceSheetSide: null,
      statement: 'income_statement' as const
    },
    [AccountType.EXPENSE]: {
      normalBalanceSide: 'debit' as const,
      increasesWith: 'debit' as const,
      decreasesWith: 'credit' as const,
      balanceSheetSide: null,
      statement: 'income_statement' as const
    },
    [AccountType.COST]: {
      normalBalanceSide: 'debit' as const,
      increasesWith: 'debit' as const,
      decreasesWith: 'credit' as const,
      balanceSheetSide: null,
      statement: 'income_statement' as const
    }
  };
  return properties[accountType];
};

// Helper function to get recommended cash flow categories based on account type
export const getRecommendedCashFlowCategories = (accountType: AccountType): CashFlowCategory[] => {
  const recommendations = {
    [AccountType.ASSET]: [CashFlowCategory.CASH_EQUIVALENTS, CashFlowCategory.OPERATING, CashFlowCategory.INVESTING],
    [AccountType.LIABILITY]: [CashFlowCategory.OPERATING, CashFlowCategory.FINANCING],
    [AccountType.EQUITY]: [CashFlowCategory.FINANCING],
    [AccountType.INCOME]: [CashFlowCategory.OPERATING],
    [AccountType.EXPENSE]: [CashFlowCategory.OPERATING],
    [AccountType.COST]: [CashFlowCategory.OPERATING]
  };

  return recommendations[accountType] || [];
};

// Helper function to get the default cash flow category for an account type
export const getDefaultCashFlowCategory = (accountType: AccountType, category: AccountCategory): CashFlowCategory | undefined => {
  // Cash and bank accounts should default to cash equivalents
  if (accountType === AccountType.ASSET && category === AccountCategory.CURRENT_ASSET) {
    return CashFlowCategory.CASH_EQUIVALENTS;
  }
  
  // Fixed assets should default to investing
  if (accountType === AccountType.ASSET && category === AccountCategory.NON_CURRENT_ASSET) {
    return CashFlowCategory.INVESTING;
  }
  
  // Current liabilities should default to operating
  if (accountType === AccountType.LIABILITY && category === AccountCategory.CURRENT_LIABILITY) {
    return CashFlowCategory.OPERATING;
  }
  
  // Long-term liabilities should default to financing
  if (accountType === AccountType.LIABILITY && category === AccountCategory.NON_CURRENT_LIABILITY) {
    return CashFlowCategory.FINANCING;
  }
  
  // Equity accounts should default to financing
  if (accountType === AccountType.EQUITY) {
    return CashFlowCategory.FINANCING;
  }
    // Income, expense, and cost accounts should default to operating
  if (accountType === AccountType.INCOME || accountType === AccountType.EXPENSE || accountType === AccountType.COST) {
    return CashFlowCategory.OPERATING;
  }
  
  return undefined;
};
