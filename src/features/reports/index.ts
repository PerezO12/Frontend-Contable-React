// ==========================================
// Exportaciones principales del módulo de reportes
// ==========================================

// Components
export { ReportFilters } from './components/ReportFilters';
export { ReportViewer } from './components/ReportViewer';
export { ReportHistory } from './components/ReportHistory';
export { FinancialSummary } from './components/FinancialSummary';
export { ReportComparison } from './components/ReportComparison';
export { ExportDemo } from './components/ExportDemo';
export { PDFTestComponent } from './components/PDFTestComponent';
export { CashFlowViewer } from './components/CashFlowViewer';
export { CashFlowDemo } from './components/CashFlowDemo';
export { CashFlowTest } from './components/CashFlowTest';
export { CashFlowImportExportControls } from './components/CashFlowImportExportControls';
export { SimpleCashFlowExportControls } from './components/SimpleCashFlowExportControls';
export { CashFlowTemplateDownload } from './components/CashFlowTemplateDownload';
export { CashFlowImportWizard } from './components/CashFlowImportWizard';

// Routes
export { ReportsRoutes } from './routes';

// Pages
export { ReportsDashboard } from './pages/ReportsDashboard';

// Hooks
export { 
  useReports, 
  useReportFilters, 
  useReportExport,
  useFinancialAnalysis,
  useReportHistory 
} from './hooks/useReports';

export { useClientExport } from './hooks/useClientExport';
export { useCashFlowImport } from './hooks/useCashFlowImport';

// Services
export { reportsAPI } from './services/reportsAPI';
export { CashFlowImportService } from './services/cashFlowImportService';

// Store
export { useReportsStore, useReportsSelectors } from './stores/reportsStore';

// Client Export Utils
export { exportReport, exportToCSV, exportToExcel, exportToPDF } from './utils/clientExportUtils';

// Types
export type {
  ReportResponse,
  BalanceSheet,
  ReportFilters as IReportFilters,
  ReportType,
  DetailLevel,
  AccountType,
  ReportTypeInfo,
  GenerateReportParams,
  ExportReportParams,
  ReportsState,
  UseReportsReturn,
  UseReportExportReturn,
  AccountReportItem,
  ReportSection,
  ReportTable,
  ReportNarrative,
  DateRange,
  FinancialRatio,
  ReportAnalysis,
  ReportConfig,
  ReportError,
  // Nuevos tipos para cash flow
  CashFlowMethod,
  CashFlowCategory,
  CashFlowTotals,
  CashFlowSummary,
  CashFlowNarrative,
  CashFlowResponse
} from './types';

// Utils
export {
  dateUtils,
  currencyUtils,
  validationUtils,
  transformUtils,
  storageUtils,
  exportUtils,
  comparisonUtils
} from './utils/reportUtils';

// Constants
export const REPORT_TYPES = {
  BALANCE_GENERAL: 'balance_general',
  PERDIDAS_GANANCIAS: 'p_g',
  FLUJO_EFECTIVO: 'flujo_efectivo'
} as const;

export const DETAIL_LEVELS = {
  BAJO: 'bajo',
  MEDIO: 'medio',
  ALTO: 'alto'
} as const;

export const ACCOUNT_TYPES = {
  ACTIVO: 'ACTIVO',
  PASIVO: 'PASIVO',
  PATRIMONIO: 'PATRIMONIO',
  INGRESO: 'INGRESO',
  GASTO: 'GASTO',
  COSTOS: 'COSTOS'
} as const;
