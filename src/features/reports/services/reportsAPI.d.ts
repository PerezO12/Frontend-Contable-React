import type { ReportResponse, BalanceSheet, ReportFilters, ReportType, ReportTypeInfo, GenerateReportParams } from '../types';
declare class ReportsAPIService {
    /**
     * Genera Balance General con formato unificado
     */
    generateBalanceGeneral(filters: ReportFilters): Promise<ReportResponse>;
    /**
     * Genera Estado de Pérdidas y Ganancias
     */
    generatePerdidasGanancias(filters: ReportFilters): Promise<ReportResponse>;
    /**
     * Genera Estado de Flujo de Efectivo
     */
    generateFlujoEfectivo(filters: ReportFilters): Promise<ReportResponse>;
    /**
     * Genera Balance General clásico
     */
    generateClassicBalanceSheet(filters: ReportFilters): Promise<BalanceSheet>;
    /**
     * Obtiene todos los tipos de reportes disponibles - IMPLEMENTADO
     */
    getReportTypes(): Promise<ReportTypeInfo[]>;
    /**
     * Genera cualquier tipo de reporte basado en los parámetros
     */
    generateReport(params: GenerateReportParams): Promise<ReportResponse | BalanceSheet>;
    /**
     * Valida los filtros antes de generar reporte
     */
    validateFilters(filters: ReportFilters): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Genera filtros por defecto basados en el tipo de reporte
     */
    getDefaultFilters(reportType: ReportType): ReportFilters;
    /**
     * Exporta reporte a PDF - IMPLEMENTADO
     */
    exportToPDF(reportData: ReportResponse | BalanceSheet, options?: {
        includeNarrative?: boolean;
        includeCharts?: boolean;
    }): Promise<Blob>;
    /**
     * Exporta reporte a Excel - IMPLEMENTADO
     */
    exportToExcel(reportData: ReportResponse | BalanceSheet): Promise<Blob>;
    /**
     * Exporta reporte a CSV - IMPLEMENTADO
     */
    exportToCSV(reportData: ReportResponse | BalanceSheet): Promise<Blob>;
}
export declare const reportsAPI: ReportsAPIService;
export default reportsAPI;
