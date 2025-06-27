import type { ImportConfiguration, ImportPreviewData, ImportResult, ImportFileUpload, TemplateInfo } from '../types';
import type { ModelMetadata, ImportSessionResponse, ModelMappingResponse, ColumnMapping } from '../../generic-import/types';
export declare class DataImportService {
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
    static generatePreview(sessionId: string): Promise<any>;
    /**
   * Ejecuta la importación con los parámetros especificados
   */
    static executeImport(sessionId: string, mappings: ColumnMapping[], importPolicy?: string): Promise<any>;
    /**
     * Cargar archivo y obtener previsualización (adaptador)
     * Convierte el flujo anterior al nuevo sistema genérico
     */
    static uploadAndPreview(uploadData: ImportFileUpload): Promise<ImportPreviewData>;
    /**
     * Importar desde archivo cargado (adaptador)
     */
    static importFromFile(file: File, configuration: ImportConfiguration): Promise<ImportResult>;
    /**
     * Mapea data_type del sistema anterior a model_name del sistema genérico
     */
    private static mapDataTypeToModel;
    /**
     * Convierte configuración del sistema anterior a mappings del sistema genérico
     */
    private static convertConfigurationToMappings;
    /**
     * Convierte respuesta del sistema genérico al formato anterior para compatibilidad
     */
    private static convertToLegacyPreviewFormat;
    /**
     * Convierte resultado del sistema genérico al formato anterior
     */ private static convertToLegacyImportResult;
    /**
     * Crea mapeo de columnas a partir de sugerencias
     */
    private static createColumnMapping;
    /**
     * @deprecated Usar uploadAndPreview en su lugar
     */
    static previewImport(): Promise<ImportPreviewData>;
    /**
     * @deprecated Usar importFromFile en su lugar
     */
    static importData(): Promise<ImportResult>;
    /**
     * @deprecated Usar importFromFile en su lugar
     */
    static importFromFileBase64(file: File, configuration: ImportConfiguration): Promise<ImportResult>;
    /**
     * Obtener estado de importación
     */
    static getImportStatus(sessionId: string): Promise<ImportResult>;
    /**
     * Cancela una importación en progreso
     */
    static cancelImport(sessionId: string): Promise<void>;
    /**
     * Obtener resultado de importación
     */
    static getImportResult(importId: string): Promise<ImportResult>;
    /**
     * Obtener historial de importaciones
     * @deprecated El sistema genérico no mantiene historial persistente
     */
    static getImportHistory(): Promise<{
        imports: ImportResult[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    /**
     * Obtener plantillas disponibles
     */
    static getAvailableTemplates(): Promise<{
        available_templates: Record<string, any>;
    }>;
    /**
     * @deprecated El sistema genérico no maneja plantillas de descarga
     */
    static downloadTemplate(): Promise<Blob>;
    /**
     * Obtener información de plantilla
     */
    static getTemplateInfo(dataType: 'accounts' | 'journal_entries', format: 'csv' | 'xlsx' | 'json'): Promise<TemplateInfo>;
    /**
     * Validar archivo antes de importar
     */
    static validateFile(file: File, dataType: 'accounts' | 'journal_entries'): Promise<{
        is_valid: boolean;
        errors: string[];
        warnings: string[];
        detected_format: string;
        total_rows: number;
    }>;
    /**
     * Generar configuración por defecto
     */
    static getDefaultConfiguration(dataType: 'accounts' | 'journal_entries'): ImportConfiguration;
    /**
     * Validar un archivo antes de subirlo
     */
    static validateFileInput(file: File): {
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
}
