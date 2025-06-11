// ==========================================
// Types para el módulo de Reportes
// ==========================================

// Enums principales
export const ReportType = {
  BALANCE_GENERAL: 'balance_general',
  PERDIDAS_GANANCIAS: 'p_g', 
  FLUJO_EFECTIVO: 'flujo_efectivo',
  BALANCE_COMPROBACION: 'balance_comprobacion',
  LIBRO_MAYOR: 'libro_mayor'
} as const;

export type ReportType = typeof ReportType[keyof typeof ReportType];

export const DetailLevel = {
  BAJO: 'bajo',
  MEDIO: 'medio', 
  ALTO: 'alto'
} as const;

export type DetailLevel = typeof DetailLevel[keyof typeof DetailLevel];

// Nuevos tipos para cash flow
export const CashFlowMethod = {
  DIRECT: 'direct',
  INDIRECT: 'indirect'
} as const;

export type CashFlowMethod = typeof CashFlowMethod[keyof typeof CashFlowMethod];

export const CashFlowCategory = {
  OPERATING: 'operating',
  INVESTING: 'investing',
  FINANCING: 'financing',
  CASH_EQUIVALENTS: 'cash_equivalents'
} as const;

export type CashFlowCategory = typeof CashFlowCategory[keyof typeof CashFlowCategory];

export const AccountType = {
  ACTIVO: 'ACTIVO',
  PASIVO: 'PASIVO',
  PATRIMONIO: 'PATRIMONIO',
  INGRESO: 'INGRESO',
  GASTO: 'GASTO',
  COSTOS: 'COSTOS'
} as const;

export type AccountType = typeof AccountType[keyof typeof AccountType];

// Interfaces para períodos y filtros
export interface DateRange {
  from_date: string;
  to_date: string;
}

export interface ReportFilters {
  project_context?: string;
  from_date: string;
  to_date: string;
  detail_level?: DetailLevel;
  include_subaccounts?: boolean;
  include_zero_balances?: boolean;
  company_name?: string;
  account_types?: AccountType[];
  account_codes?: string[];
  // Nuevos parámetros para flujo de efectivo
  cash_flow_method?: CashFlowMethod;
  enable_reconciliation?: boolean;
  include_projections?: boolean;
}

// Estructuras de datos para reportes unificados
export interface AccountReportItem {
  account_group: string;
  account_code: string;
  account_name: string;
  opening_balance: string;
  movements: string;
  closing_balance: string;
  level: number;
  account_id?: string;
  children?: AccountReportItem[];
}

export interface ReportSection {
  section_name: string;
  items: AccountReportItem[];
  total: string;
  account_type?: AccountType;
}

export interface ReportTable {
  sections: ReportSection[];
  totals: Record<string, string>;
  summary: Record<string, any>;
}

export interface ReportNarrative {
  executive_summary: string;
  key_insights: string[];
  recommendations: string[];
  financial_highlights: Record<string, any>;
}

export interface ReportResponse {
  success: boolean;
  report_type: ReportType;
  generated_at: string;
  period: DateRange;
  project_context: string;
  table: ReportTable;
  narrative: ReportNarrative;
}

// Estructuras para reportes clásicos
export interface BalanceSheetItem {
  account_id: string;
  account_code: string;
  account_name: string;
  balance: string;
  level: number;
  children: BalanceSheetItem[];
}

export interface BalanceSheetSection {
  section_name: string;
  account_type: AccountType;
  items: BalanceSheetItem[];
  total: string;
}

export interface BalanceSheet {
  report_date: string;
  company_name: string;
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  total_assets: string;
  total_liabilities_equity: string;
  is_balanced: boolean;
}

// Interfaces para reportes específicos
export interface IncomeStatementTotals {
  total_ingresos: string;
  total_gastos: string;
  utilidad_bruta: string;
  utilidad_operacional: string;
  utilidad_neta: string;
}

export interface CashFlowTotals {
  flujo_operativo: string;
  flujo_inversion: string;
  flujo_financiamiento: string;
  flujo_neto: string;
}

// Nuevas interfaces para análisis avanzado de flujo de efectivo
export interface CashFlowSummary {
  start_date: string;
  end_date: string;
  company_name: string;
  method: CashFlowMethod;
  is_reconciled: boolean;
  beginning_cash_balance?: string;
  ending_cash_balance?: string;
  net_increase_decrease?: string;
}

export interface CashFlowNarrative extends ReportNarrative {
  financial_highlights: {
    operating_cash_flow: string;
    investing_cash_flow: string;
    financing_cash_flow: string;
    net_cash_flow: string;
    cash_position_strength: string;
    liquidity_trend: string;
    method_used: string;
  };
  liquidity_analysis?: {
    current_ratio: string;
    quick_ratio: string;
    cash_runway_days: number;
    burn_rate: string;
    liquidity_health: 'Excelente' | 'Muy fuerte' | 'Bueno' | 'Aceptable' | 'Crítico';
  };
  projections?: {
    next_30_days: {
      projected_operating: number;
      projected_investing: number;
      projected_financing: number;
      projected_net: number;
    };
    confidence_level: string;
  };
}

export interface CashFlowResponse extends Omit<ReportResponse, 'narrative'> {
  report_type: 'flujo_efectivo';
  narrative: CashFlowNarrative;
  table: ReportTable & {
    summary: CashFlowSummary;
    totals: CashFlowTotals;
  };
}

// Estado del store
export interface ReportsState {
  // Reports data
  currentReport: ReportResponse | null;
  classicReport: BalanceSheet | null;
  reportHistory: ReportResponse[];
  
  // Loading states
  isGenerating: boolean;
  isExporting: boolean;
  
  // UI state
  selectedReportType: ReportType;
  currentFilters: ReportFilters;
  availableReportTypes: ReportTypeInfo[];
  
  // Error handling
  error: string | null;
  validationErrors: Record<string, string>;
}

export interface ReportTypeInfo {
  type: ReportType;
  name: string;
  description: string;
  endpoint: string;
  icon?: string;
  category?: 'financial' | 'operational' | 'analytical';
}

// Parámetros para generar reportes
export interface GenerateReportParams {
  reportType: ReportType;
  filters: ReportFilters;
  useClassicFormat?: boolean;
}

export interface ExportReportParams {
  format: 'pdf' | 'excel' | 'csv';
  includeNarrative?: boolean;
  includeCharts?: boolean;
}

// Métricas y análisis
export interface FinancialRatio {
  name: string;
  value: number;
  description: string;
  category: 'liquidity' | 'profitability' | 'leverage' | 'efficiency';
  interpretation: 'good' | 'warning' | 'critical';
}

export interface ReportAnalysis {
  ratios: FinancialRatio[];
  trends: Array<{
    period: string;
    value: number;
    change_percentage: number;
  }>;
  alerts: Array<{
    type: 'info' | 'warning' | 'error';
    message: string;
    recommendation?: string;
  }>;
}

// Configuración de reportes
export interface ReportConfig {
  defaultDetailLevel: DetailLevel;
  defaultDateRange: {
    from: string; // relative dates like 'start-of-month', 'start-of-year'
    to: string;   // 'today', 'end-of-month'
  };
  autoRefreshInterval?: number; // milliseconds
  exportFormats: string[];
  enableNarrative: boolean;
  enableAnalysis: boolean;
}

// Error types específicos
export interface ReportError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Hooks return types
export interface UseReportsReturn {
  // State
  reportsState: ReportsState;
  
  // Actions
  generateReport: (params: GenerateReportParams) => Promise<void>;
  exportReport: (params: ExportReportParams) => Promise<void>;
  clearCurrentReport: () => void;
  setFilters: (filters: Partial<ReportFilters>) => void;
  
  // Utils
  isValidDateRange: (dateRange: DateRange) => boolean;
  getDefaultFilters: () => ReportFilters;
  formatCurrency: (amount: string) => string;
}

export interface UseReportExportReturn {
  exportToPDF: (report: ReportResponse) => Promise<void>;
  exportToExcel: (report: ReportResponse) => Promise<void>;
  exportToCSV: (report: ReportResponse) => Promise<void>;
  isExporting: boolean;
  exportError: string | null;
}

// API Response types
export interface ApiReportResponse {
  success: boolean;
  data?: ReportResponse | BalanceSheet;
  error?: string;
  message?: string;
}

export interface ReportTypesResponse {
  types: ReportTypeInfo[];
}
