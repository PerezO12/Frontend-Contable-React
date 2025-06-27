import type { ModelMetadata, ImportSessionResponse, ModelMappingResponse, ImportPreviewRequest, ImportPreviewResponse, ImportResult, ImportTemplate, SaveTemplateRequest, ColumnMapping, ImportConfig, ExecuteImportRequest, BatchProcessingResult } from '../types';
export declare class GenericImportService {
    /**
   * Obtiene la lista de modelos disponibles para importación
   */
    static getAvailableModels(): Promise<string[]>;
    /**
     * Obtiene los metadatos de un modelo específico
     */
    static getModelMetadata(modelName: string): Promise<ModelMetadata>;
    /**
     * Crea una nueva sesión de importación subiendo un archivo
     */
    static createImportSession(modelName: string, file: File): Promise<ImportSessionResponse>;
    /**
     * Obtiene los detalles de una sesión de importación existente
     */
    static getImportSession(sessionId: string): Promise<ImportSessionResponse>;
    /**
     * Elimina una sesión de importación
     */
    static deleteImportSession(sessionId: string): Promise<void>;
    /**
     * Obtiene sugerencias automáticas de mapeo
     */
    static getMappingSuggestions(sessionId: string): Promise<ModelMappingResponse>;
    /**
     * Establece el mapeo de campos para una sesión
     */
    static setFieldMapping(sessionId: string, mappings: ColumnMapping[]): Promise<ModelMappingResponse>;
    /**
     * Genera vista previa de la importación con los mapeos actuales
     */
    static generatePreview(sessionId: string, previewRequest: ImportPreviewRequest): Promise<ImportPreviewResponse>;
    /**
     * Genera vista previa de un lote específico
     */
    static generateBatchPreview(sessionId: string, previewRequest: ImportPreviewRequest, batchNumber: number, batchSize: number): Promise<ImportPreviewResponse>;
    /**
     * Obtiene información de lotes para una sesión
     */
    static getBatchInfo(sessionId: string, batchSize: number): Promise<{
        total_batches: number;
        total_rows: number;
    }>;
    /**
     * Valida todo el archivo completo para mostrar estadísticas completas
     */
    static validateFullFile(sessionId: string, previewRequest: ImportPreviewRequest): Promise<ImportPreviewResponse>;
    /**
     * Ejecuta la importación con los parámetros especificados (con soporte para batch processing)
     */
    static executeImport(sessionId: string, mappings: ColumnMapping[], importPolicy?: string, skipErrors?: boolean, batchSize?: number): Promise<ImportResult>;
    /**
     * Obtiene el estado de una importación en progreso
     */
    static getImportStatus(sessionId: string): Promise<ImportResult>;
    /**
     * Cancela una importación en progreso
     */
    static cancelImport(sessionId: string): Promise<void>;
    /**
     * Obtiene las plantillas disponibles para un modelo
     */
    static getTemplates(modelName?: string): Promise<ImportTemplate[]>;
    /**
     * Guarda una nueva plantilla de importación
     */
    static saveTemplate(templateRequest: SaveTemplateRequest): Promise<ImportTemplate>;
    /**
     * Actualiza una plantilla existente
     */
    static updateTemplate(templateId: string, templateRequest: Partial<SaveTemplateRequest>): Promise<ImportTemplate>;
    /**
     * Elimina una plantilla
     */
    static deleteTemplate(templateId: string): Promise<void>;
    /**
     * Aplica una plantilla a una sesión de importación
     */
    static applyTemplate(sessionId: string, templateId: string): Promise<ModelMappingResponse>;
    /**
     * Descarga la plantilla CSV para un modelo específico
     */
    static downloadTemplate(modelName: string): Promise<void>;
    /**
     * Verifica si una plantilla está disponible para un modelo
     */
    static isTemplateAvailable(modelName: string): Promise<boolean>;
    /**
     * Descarga ejemplos prácticos para un modelo específico
     */
    static downloadExamples(modelName: string, exampleType?: string): Promise<void>;
    /**
     * Obtiene información sobre los ejemplos disponibles para un modelo
     */
    static getExamplesInfo(modelName: string): Promise<any>;
    /**
     * Verifica si hay ejemplos disponibles para un modelo específico
     */
    static areExamplesAvailable(modelName: string, exampleType?: string): Promise<boolean>;
    /**
     * Valida un archivo antes de subirlo
     */
    static validateFile(file: File): {
        isValid: boolean;
        errors: string[];
    };
    private static isValidFileExtension;
    /**
     * Formatea el tamaño de archivo para mostrar
     */
    static formatFileSize(bytes: number): string;
    /**
     * Detecta el tipo de archivo por extensión
     */
    static detectFileFormat(filename: string): 'csv' | 'xlsx' | 'json' | 'unknown';
    /**
     * Obtiene la configuración predeterminada para importaciones
     */
    static getImportConfig(): Promise<ImportConfig>;
    /**
     * Ejecuta importación con parámetros individuales usando la nueva API de batch processing
     */
    static executeImportWithBatchProcessing(sessionId: string, request: ExecuteImportRequest): Promise<BatchProcessingResult>;
    /**
     * Calcula el número estimado de lotes basado en filas totales y tamaño de lote
     */
    static calculateEstimatedBatches(totalRows: number, batchSize: number): number;
    /**
     * Estima el tiempo de procesamiento basado en filas y un factor de rendimiento
     */
    static estimateProcessingTime(totalRows: number, batchSize: number): {
        estimatedMinutes: number;
        estimatedBatches: number;
        recommendedBatchSize: number;
    };
    /**
     * Valida la configuración de batch processing
     */
    static validateBatchConfig(batchSize: number, totalRows: number, config: ImportConfig): {
        isValid: boolean;
        warnings: string[];
        recommendations: string[];
    };
}
