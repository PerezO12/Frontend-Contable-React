import type { ImportConfiguration, ImportPreviewData, ImportResult } from '@/features/data-import/types';
/**
 * Servicio especializado para importación de datos de flujo de efectivo
 * Extiende la funcionalidad base del DataImportService con validaciones
 * específicas para transacciones de efectivo
 */
export declare class CashFlowImportService {
    /**
     * Valida datos específicos de flujo de efectivo antes de la importación
     */
    static validateCashFlowData(previewData: ImportPreviewData): Promise<ImportPreviewData>;
    /**
   * Importa datos de flujo de efectivo con validaciones específicas
   */
    static importCashFlowData(configuration: ImportConfiguration): Promise<ImportResult>;
    /**
     * Genera plantilla específica para flujo de efectivo
     */
    static downloadCashFlowTemplate(_format: 'csv' | 'xlsx' | 'json'): Promise<Blob>;
    /**
     * Obtiene configuración predeterminada para importación de flujo de efectivo
     */
    static getDefaultCashFlowConfiguration(): Partial<ImportConfiguration>;
    /**
     * Verifica si una cuenta es de efectivo o equivalentes
     */
    private static isCashAccount;
    /**
     * Verifica si la transacción tiene clasificación de actividad
     */
    private static hasActivityClassification;
    /**
     * Valida que los montos sean consistentes para flujo de efectivo
     */
    private static validateCashFlowAmounts;
    /**
   * Obtiene métricas de validación específicas para flujo de efectivo
   */
    static getCashFlowValidationMetrics(previewData: ImportPreviewData): {
        totalRows: number;
        cashAccountsPercentage: number;
        activityClassificationPercentage: number;
        validAmountsPercentage: number;
        recommendations: string[];
    };
    /**
     * Genera recomendaciones basadas en las métricas de validación
     */
    private static generateRecommendations;
}
