// Types for the Accounts module
import { z } from 'zod';

// Account Types (matching backend enum)
export const AccountType = {
  ACTIVO: 'activo',
  PASIVO: 'pasivo', 
  PATRIMONIO: 'patrimonio',
  INGRESO: 'ingreso',
  GASTO: 'gasto',
  COSTOS: 'costos'
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

// Account Categories (matching backend enum)
export const AccountCategory = {
  // Activos
  ACTIVO_CORRIENTE: 'activo_corriente',
  ACTIVO_NO_CORRIENTE: 'activo_no_corriente',
  // Pasivos
  PASIVO_CORRIENTE: 'pasivo_corriente',
  PASIVO_NO_CORRIENTE: 'pasivo_no_corriente',
  // Patrimonio
  CAPITAL: 'capital',
  RESERVAS: 'reservas',
  RESULTADOS: 'resultados',
  // Ingresos
  INGRESOS_OPERACIONALES: 'ingresos_operacionales',
  INGRESOS_NO_OPERACIONALES: 'ingresos_no_operacionales',
  // Gastos
  GASTOS_OPERACIONALES: 'gastos_operacionales',
  GASTOS_NO_OPERACIONALES: 'gastos_no_operacionales',
  // Costos
  COSTO_VENTAS: 'costo_ventas',
  COSTOS_PRODUCCION: 'costos_produccion'
} as const;

export type AccountCategory = typeof AccountCategory[keyof typeof AccountCategory];

// Base Account interface
export interface Account {
  id: string;
  code: string;
  name: string;
  description?: string;
  account_type: AccountType;
  category: AccountCategory;
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
  is_active?: boolean;
  parent_id?: string;
  search?: string;
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
  account_type: z.enum(['activo', 'pasivo', 'patrimonio', 'ingreso', 'gasto', 'costos']),
  category: z.enum([
    'activo_corriente', 'activo_no_corriente',
    'pasivo_corriente', 'pasivo_no_corriente',
    'capital', 'reservas', 'resultados',
    'ingresos_operacionales', 'ingresos_no_operacionales',
    'gastos_operacionales', 'gastos_no_operacionales',
    'costo_ventas', 'costos_produccion'
  ]),
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
    'activo_corriente', 'activo_no_corriente',
    'pasivo_corriente', 'pasivo_no_corriente',
    'capital', 'reservas', 'resultados',
    'ingresos_operacionales', 'ingresos_no_operacionales',
    'gastos_operacionales', 'gastos_no_operacionales',
    'costo_ventas', 'costos_produccion'
  ]).optional(),
  is_active: z.boolean().optional(),
  allows_movements: z.boolean().optional(),
  requires_third_party: z.boolean().optional(),
  requires_cost_center: z.boolean().optional(),
  notes: z.string().optional()
});

export type AccountCreateForm = z.infer<typeof accountCreateSchema>;
export type AccountUpdateForm = z.infer<typeof accountUpdateSchema>;

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
  [AccountType.ACTIVO]: 'Activo',
  [AccountType.PASIVO]: 'Pasivo',
  [AccountType.PATRIMONIO]: 'Patrimonio',
  [AccountType.INGRESO]: 'Ingreso',
  [AccountType.GASTO]: 'Gasto',
  [AccountType.COSTOS]: 'Costos'
};

export const ACCOUNT_CATEGORY_LABELS: Record<AccountCategory, string> = {
  [AccountCategory.ACTIVO_CORRIENTE]: 'Activo Corriente',
  [AccountCategory.ACTIVO_NO_CORRIENTE]: 'Activo No Corriente',
  [AccountCategory.PASIVO_CORRIENTE]: 'Pasivo Corriente',
  [AccountCategory.PASIVO_NO_CORRIENTE]: 'Pasivo No Corriente',
  [AccountCategory.CAPITAL]: 'Capital',
  [AccountCategory.RESERVAS]: 'Reservas',
  [AccountCategory.RESULTADOS]: 'Resultados',
  [AccountCategory.INGRESOS_OPERACIONALES]: 'Ingresos Operacionales',
  [AccountCategory.INGRESOS_NO_OPERACIONALES]: 'Ingresos No Operacionales',
  [AccountCategory.GASTOS_OPERACIONALES]: 'Gastos Operacionales',
  [AccountCategory.GASTOS_NO_OPERACIONALES]: 'Gastos No Operacionales',
  [AccountCategory.COSTO_VENTAS]: 'Costo de Ventas',
  [AccountCategory.COSTOS_PRODUCCION]: 'Costos de Producción'
};

// Helper functions for account type behavior
export const getAccountTypeProperties = (accountType: AccountType) => {
  const properties = {
    [AccountType.ACTIVO]: {
      normalBalanceSide: 'debit' as const,
      increasesWith: 'debit' as const,
      decreasesWith: 'credit' as const,
      balanceSheetSide: 'left' as const,
      statement: 'balance_sheet' as const
    },
    [AccountType.PASIVO]: {
      normalBalanceSide: 'credit' as const,
      increasesWith: 'credit' as const,
      decreasesWith: 'debit' as const,
      balanceSheetSide: 'right' as const,
      statement: 'balance_sheet' as const
    },
    [AccountType.PATRIMONIO]: {
      normalBalanceSide: 'credit' as const,
      increasesWith: 'credit' as const,
      decreasesWith: 'debit' as const,
      balanceSheetSide: 'right' as const,
      statement: 'balance_sheet' as const
    },
    [AccountType.INGRESO]: {
      normalBalanceSide: 'credit' as const,
      increasesWith: 'credit' as const,
      decreasesWith: 'debit' as const,
      balanceSheetSide: null,
      statement: 'income_statement' as const
    },
    [AccountType.GASTO]: {
      normalBalanceSide: 'debit' as const,
      increasesWith: 'debit' as const,
      decreasesWith: 'credit' as const,
      balanceSheetSide: null,
      statement: 'income_statement' as const
    },
    [AccountType.COSTOS]: {
      normalBalanceSide: 'debit' as const,
      increasesWith: 'debit' as const,
      decreasesWith: 'credit' as const,
      balanceSheetSide: null,
      statement: 'income_statement' as const
    }
  };

  return properties[accountType];
};
