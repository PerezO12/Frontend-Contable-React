// ==========================================
// Types para el módulo de Reportes
// ==========================================
// Enums principales
export var ReportType = {
    BALANCE_GENERAL: 'balance_general',
    PERDIDAS_GANANCIAS: 'p_g',
    FLUJO_EFECTIVO: 'flujo_efectivo',
    BALANCE_COMPROBACION: 'balance_comprobacion',
    LIBRO_MAYOR: 'libro_mayor'
};
export var DetailLevel = {
    BAJO: 'bajo',
    MEDIO: 'medio',
    ALTO: 'alto'
};
// Nuevos tipos para cash flow
export var CashFlowMethod = {
    DIRECT: 'direct',
    INDIRECT: 'indirect'
};
export var CashFlowCategory = {
    OPERATING: 'operating',
    INVESTING: 'investing',
    FINANCING: 'financing',
    CASH_EQUIVALENTS: 'cash_equivalents'
};
export var AccountType = {
    ACTIVO: 'ACTIVO',
    PASIVO: 'PASIVO',
    PATRIMONIO: 'PATRIMONIO',
    INGRESO: 'INGRESO',
    GASTO: 'GASTO',
    COSTOS: 'COSTOS'
};
