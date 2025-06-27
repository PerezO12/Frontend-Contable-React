var _a, _b, _c, _d;
// Types for the Accounts module
import { z } from 'zod';
// Account Types (matching backend enum)
export var AccountType = {
    ACTIVO: 'activo',
    PASIVO: 'pasivo',
    PATRIMONIO: 'patrimonio',
    INGRESO: 'ingreso',
    GASTO: 'gasto',
    COSTOS: 'costos'
};
// Account Categories (matching backend enum)
export var AccountCategory = {
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
};
// Cash Flow Categories (matching backend enum)
export var CashFlowCategory = {
    OPERATING: 'operating',
    INVESTING: 'investing',
    FINANCING: 'financing',
    CASH_EQUIVALENTS: 'cash'
};
// Validation schemas using Zod
export var accountCreateSchema = z.object({
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
    cash_flow_category: z.enum(['operating', 'investing', 'financing', 'cash']).optional(),
    parent_id: z.string().uuid().optional(),
    is_active: z.boolean().optional(),
    allows_movements: z.boolean().optional(),
    requires_third_party: z.boolean().optional(),
    requires_cost_center: z.boolean().optional(),
    notes: z.string().optional()
});
export var accountUpdateSchema = z.object({
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
    cash_flow_category: z.enum(['operating', 'investing', 'financing', 'cash']).optional(),
    is_active: z.boolean().optional(),
    allows_movements: z.boolean().optional(),
    requires_third_party: z.boolean().optional(),
    requires_cost_center: z.boolean().optional(),
    notes: z.string().optional()
});
// Constants for account type labels and descriptions
export var ACCOUNT_TYPE_LABELS = (_a = {},
    _a[AccountType.ACTIVO] = 'Activo',
    _a[AccountType.PASIVO] = 'Pasivo',
    _a[AccountType.PATRIMONIO] = 'Patrimonio',
    _a[AccountType.INGRESO] = 'Ingreso',
    _a[AccountType.GASTO] = 'Gasto',
    _a[AccountType.COSTOS] = 'Costos',
    _a);
export var ACCOUNT_CATEGORY_LABELS = (_b = {},
    _b[AccountCategory.ACTIVO_CORRIENTE] = 'Activo Corriente',
    _b[AccountCategory.ACTIVO_NO_CORRIENTE] = 'Activo No Corriente',
    _b[AccountCategory.PASIVO_CORRIENTE] = 'Pasivo Corriente',
    _b[AccountCategory.PASIVO_NO_CORRIENTE] = 'Pasivo No Corriente',
    _b[AccountCategory.CAPITAL] = 'Capital',
    _b[AccountCategory.RESERVAS] = 'Reservas',
    _b[AccountCategory.RESULTADOS] = 'Resultados',
    _b[AccountCategory.INGRESOS_OPERACIONALES] = 'Ingresos Operacionales',
    _b[AccountCategory.INGRESOS_NO_OPERACIONALES] = 'Ingresos No Operacionales',
    _b[AccountCategory.GASTOS_OPERACIONALES] = 'Gastos Operacionales',
    _b[AccountCategory.GASTOS_NO_OPERACIONALES] = 'Gastos No Operacionales',
    _b[AccountCategory.COSTO_VENTAS] = 'Costo de Ventas',
    _b[AccountCategory.COSTOS_PRODUCCION] = 'Costos de Producción',
    _b);
export var CASH_FLOW_CATEGORY_LABELS = (_c = {},
    _c[CashFlowCategory.OPERATING] = 'Actividades de Operación',
    _c[CashFlowCategory.INVESTING] = 'Actividades de Inversión',
    _c[CashFlowCategory.FINANCING] = 'Actividades de Financiamiento',
    _c[CashFlowCategory.CASH_EQUIVALENTS] = 'Efectivo y Equivalentes',
    _c);
export var CASH_FLOW_CATEGORY_DESCRIPTIONS = (_d = {},
    _d[CashFlowCategory.OPERATING] = 'Cuentas relacionadas con la actividad principal del negocio (ventas, gastos operativos, etc.)',
    _d[CashFlowCategory.INVESTING] = 'Cuentas relacionadas con compra/venta de activos a largo plazo (equipos, propiedades, etc.)',
    _d[CashFlowCategory.FINANCING] = 'Cuentas relacionadas con financiamiento y estructura de capital (préstamos, capital social, etc.)',
    _d[CashFlowCategory.CASH_EQUIVALENTS] = 'Cuentas que representan efectivo o instrumentos líquidos (caja, bancos, inversiones temporales)',
    _d);
// Helper functions for account type behavior
export var getAccountTypeProperties = function (accountType) {
    var _a;
    var properties = (_a = {},
        _a[AccountType.ACTIVO] = {
            normalBalanceSide: 'debit',
            increasesWith: 'debit',
            decreasesWith: 'credit',
            balanceSheetSide: 'left',
            statement: 'balance_sheet'
        },
        _a[AccountType.PASIVO] = {
            normalBalanceSide: 'credit',
            increasesWith: 'credit',
            decreasesWith: 'debit',
            balanceSheetSide: 'right',
            statement: 'balance_sheet'
        },
        _a[AccountType.PATRIMONIO] = {
            normalBalanceSide: 'credit',
            increasesWith: 'credit',
            decreasesWith: 'debit',
            balanceSheetSide: 'right',
            statement: 'balance_sheet'
        },
        _a[AccountType.INGRESO] = {
            normalBalanceSide: 'credit',
            increasesWith: 'credit',
            decreasesWith: 'debit',
            balanceSheetSide: null,
            statement: 'income_statement'
        },
        _a[AccountType.GASTO] = {
            normalBalanceSide: 'debit',
            increasesWith: 'debit',
            decreasesWith: 'credit',
            balanceSheetSide: null,
            statement: 'income_statement'
        },
        _a[AccountType.COSTOS] = {
            normalBalanceSide: 'debit',
            increasesWith: 'debit',
            decreasesWith: 'credit',
            balanceSheetSide: null,
            statement: 'income_statement'
        },
        _a);
    return properties[accountType];
};
// Helper function to get recommended cash flow categories based on account type
export var getRecommendedCashFlowCategories = function (accountType) {
    var _a;
    var recommendations = (_a = {},
        _a[AccountType.ACTIVO] = [CashFlowCategory.CASH_EQUIVALENTS, CashFlowCategory.OPERATING, CashFlowCategory.INVESTING],
        _a[AccountType.PASIVO] = [CashFlowCategory.OPERATING, CashFlowCategory.FINANCING],
        _a[AccountType.PATRIMONIO] = [CashFlowCategory.FINANCING],
        _a[AccountType.INGRESO] = [CashFlowCategory.OPERATING],
        _a[AccountType.GASTO] = [CashFlowCategory.OPERATING],
        _a[AccountType.COSTOS] = [CashFlowCategory.OPERATING],
        _a);
    return recommendations[accountType] || [];
};
// Helper function to get the default cash flow category for an account type
export var getDefaultCashFlowCategory = function (accountType, category) {
    // Cash and bank accounts should default to cash equivalents
    if (accountType === AccountType.ACTIVO && category === AccountCategory.ACTIVO_CORRIENTE) {
        return CashFlowCategory.CASH_EQUIVALENTS;
    }
    // Fixed assets should default to investing
    if (accountType === AccountType.ACTIVO && category === AccountCategory.ACTIVO_NO_CORRIENTE) {
        return CashFlowCategory.INVESTING;
    }
    // Current liabilities should default to operating
    if (accountType === AccountType.PASIVO && category === AccountCategory.PASIVO_CORRIENTE) {
        return CashFlowCategory.OPERATING;
    }
    // Long-term liabilities should default to financing
    if (accountType === AccountType.PASIVO && category === AccountCategory.PASIVO_NO_CORRIENTE) {
        return CashFlowCategory.FINANCING;
    }
    // Equity accounts should default to financing
    if (accountType === AccountType.PATRIMONIO) {
        return CashFlowCategory.FINANCING;
    }
    // Income, expense, and cost accounts should default to operating
    if (accountType === AccountType.INGRESO || accountType === AccountType.GASTO || accountType === AccountType.COSTOS) {
        return CashFlowCategory.OPERATING;
    }
    return undefined;
};
