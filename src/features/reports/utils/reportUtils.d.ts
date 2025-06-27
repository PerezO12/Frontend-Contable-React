import type { ReportResponse, ReportFilters, ReportType, AccountReportItem } from '../types';
export declare const dateUtils: {
    /**
     * Obtiene el primer día del mes actual
     */
    getStartOfMonth(): string;
    /**
     * Obtiene el último día del mes actual
     */
    getEndOfMonth(): string;
    /**
     * Obtiene el primer día del año actual
     */
    getStartOfYear(): string;
    /**
     * Obtiene la fecha actual
     */
    getToday(): string;
    /**
     * Obtiene fechas para períodos predefinidos
     */
    getPeriodDates(period: "thisMonth" | "lastMonth" | "thisYear" | "lastYear" | "thisQuarter" | "lastQuarter"): {
        from_date: string;
        to_date: string;
    };
    /**
     * Valida que una fecha esté en formato correcto
     */
    isValidDate(dateString: string): boolean;
    /**
     * Formatea una fecha para mostrar en UI
     */
    formatDisplayDate(dateString: string, locale?: string): string;
};
export declare const currencyUtils: {
    /**
     * Formatea un valor monetario
     */
    format(amount: string | number, currency?: string): string;
    /**
     * Convierte string de moneda a número
     */
    toNumber(currencyString: string): number;
    /**
     * Calcula la variación porcentual entre dos valores
     */
    calculateVariation(current: string | number, previous: string | number): number;
};
export declare const validationUtils: {
    /**
     * Valida filtros de reporte
     */
    validateReportFilters(filters: ReportFilters): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Valida que un reporte tenga la estructura correcta
     */
    validateReportStructure(report: ReportResponse): {
        isValid: boolean;
        errors: string[];
    };
};
export declare const transformUtils: {
    /**
     * Convierte reporte a formato CSV
     */
    reportToCSV(report: ReportResponse): string;
    /**
     * Aplana la estructura jerárquica de cuentas
     */
    flattenAccountItems(items: AccountReportItem[]): AccountReportItem[];
    /**
     * Agrupa items por tipo de cuenta
     */
    groupItemsByAccountType(items: AccountReportItem[]): Record<string, AccountReportItem[]>;
};
export declare const storageUtils: {
    /**
     * Guarda filtros en localStorage
     */
    saveFilters(filters: ReportFilters): void;
    /**
     * Carga filtros desde localStorage
     */
    loadFilters(): ReportFilters | null;
    /**
     * Guarda configuración de usuario
     */
    saveUserPreferences(preferences: {
        defaultDetailLevel?: string;
        defaultReportType?: ReportType;
        autoRefresh?: boolean;
    }): void;
    /**
     * Carga configuración de usuario
     */
    loadUserPreferences(): any;
};
export declare const exportUtils: {
    /**
     * Descarga un archivo blob
     */
    downloadBlob(blob: Blob, filename: string): void;
    /**
     * Genera nombre de archivo para exportación
     */
    generateFilename(reportType: ReportType, format: string, date?: string): string;
};
export declare const comparisonUtils: {
    /**
     * Compara dos reportes del mismo tipo
     */
    compareReports(current: ReportResponse, previous: ReportResponse): {
        totalVariations: Record<string, number>;
        sectionVariations: Array<{
            section: string;
            variation: number;
            items: Array<{
                account: string;
                variation: number;
            }>;
        }>;
    };
};
