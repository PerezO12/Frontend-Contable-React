import { apiClient } from '@/shared/api/client';
import type {
  ImportConfiguration,
  ImportPreviewData,
  ImportResult,
  ImportFileUpload,
  TemplateInfo
} from '../types';

// Importar tipos del sistema genérico
import type {
  ModelMetadata,
  ImportSessionResponse,
  ModelMappingResponse,
  ColumnMapping,
} from '../../generic-import/types';

const BASE_URL = '/api/v1/generic-import';

export class DataImportService {
  // === Gestión de Modelos ===
    /**
   * Obtiene la lista de modelos disponibles para importación
   */
  static async getAvailableModels(): Promise<string[]> {
    console.log('🔍 Obteniendo modelos disponibles...');
    const response = await apiClient.get(`${BASE_URL}/models`);
    console.log('✅ Respuesta getAvailableModels:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  /**
   * Obtiene los metadatos de un modelo específico
   */
  static async getModelMetadata(modelName: string): Promise<ModelMetadata> {
    const response = await apiClient.get(`${BASE_URL}/models/${modelName}/metadata`);
    return response.data;
  }

  // === Gestión de Sesiones de Importación ===
  /**
   * Crea una nueva sesión de importación subiendo un archivo
   */
  static async createImportSession(
    modelName: string,
    file: File
  ): Promise<ImportSessionResponse> {
    console.log(`🔍 Creando sesión de importación para modelo: ${modelName}, archivo: ${file.name}`);
    const formData = new FormData();
    formData.append('model_name', modelName);
    formData.append('file', file);

    const response = await apiClient.post(`${BASE_URL}/sessions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Respuesta createImportSession:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  /**
   * Obtiene los detalles de una sesión de importación existente
   */
  static async getImportSession(sessionId: string): Promise<ImportSessionResponse> {
    const response = await apiClient.get(`${BASE_URL}/sessions/${sessionId}`);
    return response.data;
  }

  /**
   * Elimina una sesión de importación
   */
  static async deleteImportSession(sessionId: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/sessions/${sessionId}`);
  }

  // === Mapeo de Campos ===
    /**
   * Obtiene sugerencias automáticas de mapeo
   */
  static async getMappingSuggestions(sessionId: string): Promise<ModelMappingResponse> {
    console.log(`🔍 Obteniendo sugerencias de mapeo para sesión: ${sessionId}`);
    const response = await apiClient.get(`${BASE_URL}/sessions/${sessionId}/mapping-suggestions`);
    console.log('✅ Respuesta getMappingSuggestions:', JSON.stringify(response.data, null, 2));
    return response.data;
  }
  /**
   * Establece el mapeo de campos para una sesión
   */
  static async setFieldMapping(
    sessionId: string,
    mappings: ColumnMapping[]
  ): Promise<ModelMappingResponse> {
    console.log(`🔍 Estableciendo mapeo de campos para sesión: ${sessionId}`);
    console.log('📋 Mappings enviados:', JSON.stringify(mappings, null, 2));
    const response = await apiClient.post(`${BASE_URL}/sessions/${sessionId}/mapping`, mappings);
    console.log('✅ Respuesta setFieldMapping:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // === Vista Previa ===
  /**
   * Genera vista previa de la importación con los mapeos actuales
   */
  static async generatePreview(sessionId: string): Promise<any> {
    console.log(`🔍 Generando vista previa para sesión: ${sessionId}`);
    const response = await apiClient.post(`${BASE_URL}/sessions/${sessionId}/preview`, {});
    console.log('✅ Respuesta generatePreview:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // === Ejecución de Importación ===
    /**
   * Ejecuta la importación con los parámetros especificados
   */
  static async executeImport(
    sessionId: string,
    mappings: ColumnMapping[],
    importPolicy: string = 'create_only'
  ): Promise<any> {
    console.log('📤 EJECUTANDO IMPORTACIÓN:');
    console.log('  🆔 Session ID:', sessionId);
    console.log('  📋 Mappings:', mappings);
    console.log('  ⚙️ Import Policy:', importPolicy);
    console.log('  🌐 URL:', `${BASE_URL}/sessions/${sessionId}/execute?import_policy=${importPolicy}`);
    
    const response = await apiClient.post(
      `${BASE_URL}/sessions/${sessionId}/execute?import_policy=${importPolicy}`,
      mappings
    );
    
    console.log('📥 RESPUESTA DEL EXECUTE:');
    console.log('  📊 Status:', response.status);
    console.log('  📄 Data:', response.data);
    console.log('  📋 Headers:', response.headers);
    
    return response.data;
  }

  // === Métodos de Compatibilidad (adaptadores para el sistema anterior) ===

  /**
   * Cargar archivo y obtener previsualización (adaptador)
   * Convierte el flujo anterior al nuevo sistema genérico
   */
  static async uploadAndPreview(uploadData: ImportFileUpload): Promise<ImportPreviewData> {
    console.log('🚀 === UPLOAD AND PREVIEW CON SISTEMA GENÉRICO ===');
    console.log('📁 Archivo:', uploadData.file.name);
    console.log('📊 Data type:', uploadData.data_type);

    try {
      // Mapear data_type a model_name
      const modelName = this.mapDataTypeToModel(uploadData.data_type);
      console.log('🔄 Modelo mapeado:', modelName);
      
      // Crear sesión de importación
      const session = await this.createImportSession(modelName, uploadData.file);
      console.log('✅ Sesión creada:', session.import_session_token);
      
      // Obtener sugerencias de mapeo automático
      const mappingSuggestions = await this.getMappingSuggestions(session.import_session_token);
      console.log('🎯 Sugerencias de mapeo obtenidas');
      
      // Generar vista previa
      const preview = await this.generatePreview(session.import_session_token);
      console.log('👀 Vista previa generada');
      
      // Convertir respuesta del sistema genérico al formato anterior
      return this.convertToLegacyPreviewFormat(preview, session, mappingSuggestions);
      
    } catch (error: any) {
      console.log('❌ Error en uploadAndPreview:', error);
      throw error;
    }
  }
  /**
   * Importar desde archivo cargado (adaptador)
   */
  static async importFromFile(
    file: File,
    configuration: ImportConfiguration
  ): Promise<ImportResult> {
    console.log('🚀 === IMPORTACIÓN CON SISTEMA GENÉRICO ===');
    console.log('📁 Archivo:', file.name);
    console.log('⚙️ Configuración:', configuration.data_type);

    try {
      // Mapear data_type a model_name
      const modelName = this.mapDataTypeToModel(configuration.data_type);
      console.log('🔄 Modelo mapeado:', modelName);
      
      // Crear sesión de importación
      const session = await this.createImportSession(modelName, file);
      console.log('✅ Sesión creada:', session.import_session_token);
      console.log('📄 Datos de sesión completos:', JSON.stringify(session, null, 2));
      
      // Obtener sugerencias de mapeo automático
      const mappingSuggestions = await this.getMappingSuggestions(session.import_session_token);
      console.log('🎯 Sugerencias de mapeo obtenidas');
      console.log('📄 Sugerencias completas:', JSON.stringify(mappingSuggestions, null, 2));
      
      // Convertir configuración a mappings del sistema genérico
      const mappings = this.convertConfigurationToMappings(mappingSuggestions);
      console.log('🔧 Mappings convertidos:', mappings.length, 'mapeos');
      console.log('📄 Mappings detallados:', JSON.stringify(mappings, null, 2));
      
      // Ejecutar importación
      const importPolicy = configuration.update_existing ? 'upsert' : 'create_only';
      console.log('🚀 Ejecutando importación con política:', importPolicy);
      
      const result = await this.executeImport(session.import_session_token, mappings, importPolicy);
      console.log('✅ Importación ejecutada - Resultado RAW del backend:');
      console.log('📄 Resultado completo:', JSON.stringify(result, null, 2));
      
      // Convertir resultado del sistema genérico al formato anterior
      const convertedResult = this.convertToLegacyImportResult(result, configuration);
      console.log('🔄 Resultado convertido para frontend:');
      console.log('📄 Resultado final:', JSON.stringify(convertedResult, null, 2));
      
      return convertedResult;
      
    } catch (error: any) {
      console.log('❌ Error en importFromFile:', error);
      console.log('📄 Error response:', error.response?.data);
      console.log('📄 Error status:', error.response?.status);
      throw error;
    }
  }

  // === Métodos de Mapeo y Conversión ===

  /**
   * Mapea data_type del sistema anterior a model_name del sistema genérico
   */
  private static mapDataTypeToModel(dataType: string): string {
    const mapping: Record<string, string> = {
      'accounts': 'account',
      'journal_entries': 'journal_entry'
    };
    
    return mapping[dataType] || dataType;
  }

  /**
   * Convierte configuración del sistema anterior a mappings del sistema genérico
   */
  private static convertConfigurationToMappings(
    mappingSuggestions: ModelMappingResponse
  ): ColumnMapping[] {
    // Usar las sugerencias automáticas como base
    const suggestions = mappingSuggestions.suggested_mappings || [];
    
    // Convertir sugerencias a mappings válidos
    return suggestions
      .filter(suggestion => suggestion.suggested_field && suggestion.suggested_field.trim() !== '')
      .map(suggestion => ({
        column_name: suggestion.column_name,
        field_name: suggestion.suggested_field,
        default_value: undefined
      }));
  }
  /**
   * Convierte respuesta del sistema genérico al formato anterior para compatibilidad
   */
  private static convertToLegacyPreviewFormat(
    preview: any,
    session: ImportSessionResponse,
    mappingSuggestions: ModelMappingResponse
  ): ImportPreviewData {
    console.log('🔄 === CONVERTIR A FORMATO LEGACY ===');
    console.log('  📊 Preview recibido:', JSON.stringify(preview, null, 2));
    console.log('  🔗 Session recibida:', JSON.stringify(session, null, 2));
    console.log('  🎯 Mapping suggestions:', JSON.stringify(mappingSuggestions, null, 2));
      const convertedData = {
      detected_format: 'csv' as 'csv' | 'xlsx' | 'json',
      detected_data_type: 'accounts' as 'accounts' | 'journal_entries', // Por simplicidad
      total_rows: preview.validation_summary?.total_rows || session.sample_rows?.length || 0,
      preview_data: session.sample_rows || [],
      column_mapping: this.createColumnMapping(mappingSuggestions),
      validation_errors: [],
      recommendations: []
    };
    
    console.log('  ✅ Resultado convertido:', JSON.stringify(convertedData, null, 2));
    return convertedData;
  }
  /**
   * Convierte resultado del sistema genérico al formato anterior
   */  private static convertToLegacyImportResult(
    result: any,
    configuration: ImportConfiguration
  ): ImportResult {
    console.log('🔄 === CONVIRTIENDO RESULTADO BACKEND A LEGACY ===');
    console.log('� Resultado RAW del backend:', JSON.stringify(result, null, 2));
    
    const now = new Date().toISOString();
    
    // Extraer valores del resultado del backend genérico
    const totalRows = result?.total_rows || 0;
    const successfulRows = result?.successful_rows || 0;
    const errorRows = result?.error_rows || 0;
    const processingTime = result?.processing_time_seconds || 0;
    const errors = result?.errors || [];
    const status = result?.status || (errorRows > 0 ? 'completed_with_errors' : 'completed');
    
    // Para el sistema legacy, asumimos que todos los successful_rows son accounts_created
    // (ya que no tenemos distinción entre created/updated en el backend genérico)
    const accountsCreated = successfulRows;
    const accountsUpdated = 0; // El backend no distingue entre creados/actualizados
    
    const convertedResult = {
      import_id: result?.session_id || 'unknown',
      configuration,
      summary: {
        total_rows: totalRows,
        processed_rows: totalRows,
        successful_rows: successfulRows,
        error_rows: errorRows,
        warning_rows: 0,
        skipped_rows: 0,
        processing_time_seconds: processingTime,
        accounts_created: accountsCreated,
        accounts_updated: accountsUpdated,
        journal_entries_created: 0,
        most_common_errors: {},
        failed_rows: errorRows,
        errors: errorRows,
        warnings: 0
      },
      row_results: [],
      global_errors: errors,
      started_at: now,
      completed_at: now,
      status: (status === 'completed_with_errors' ? 'completed' : 'completed') as 'completed' | 'failed' | 'partial' | 'processing',
      errors: errors,
      warnings: [],
      processing_time: processingTime,
      created_at: now
    };
      console.log('📤 Resultado convertido para frontend legacy:', JSON.stringify(convertedResult, null, 2));
    return convertedResult;
  }

  /**
   * Crea mapeo de columnas a partir de sugerencias
   */
  private static createColumnMapping(mappingSuggestions: ModelMappingResponse): Record<string, string> {
    console.log('🔗 === CREAR COLUMN MAPPING ===');
    console.log('  📥 Mapping suggestions:', JSON.stringify(mappingSuggestions, null, 2));
    
    const mapping: Record<string, string> = {};
    
    if (mappingSuggestions.suggested_mappings) {
      mappingSuggestions.suggested_mappings.forEach(suggestion => {
        if (suggestion.suggested_field) {
          mapping[suggestion.column_name] = suggestion.suggested_field;
          console.log(`  ✅ Mapped: ${suggestion.column_name} -> ${suggestion.suggested_field}`);
        }
      });
    }
    
    console.log('  📄 Final mapping:', JSON.stringify(mapping, null, 2));
    return mapping;
  }

  // === Métodos heredados del sistema anterior (simplificados o deprecados) ===

  /**
   * @deprecated Usar uploadAndPreview en su lugar
   */
  static async previewImport(): Promise<ImportPreviewData> {
    throw new Error('Método deprecado. Usar uploadAndPreview con File en lugar de base64.');
  }

  /**
   * @deprecated Usar importFromFile en su lugar
   */
  static async importData(): Promise<ImportResult> {
    throw new Error('Método deprecado. Usar importFromFile con File en lugar de base64.');
  }

  /**
   * @deprecated Usar importFromFile en su lugar
   */
  static async importFromFileBase64(
    file: File,
    configuration: ImportConfiguration
  ): Promise<ImportResult> {
    return this.importFromFile(file, configuration);
  }

  /**
   * Obtener estado de importación
   */
  static async getImportStatus(sessionId: string): Promise<ImportResult> {
    // Crear un resultado básico para compatibilidad
    const now = new Date().toISOString();
    const defaultConfig = this.getDefaultConfiguration('accounts');
    
    return {
      import_id: sessionId,
      configuration: defaultConfig,
      summary: {
        total_rows: 0,
        processed_rows: 0,
        successful_rows: 0,
        error_rows: 0,
        warning_rows: 0,
        skipped_rows: 0,
        processing_time_seconds: 0,
        accounts_created: 0,
        accounts_updated: 0,
        journal_entries_created: 0,
        most_common_errors: {},
        failed_rows: 0,
        errors: 0,
        warnings: 0
      },
      row_results: [],
      global_errors: [],
      started_at: now,
      completed_at: now,
      status: 'completed',
      errors: [],
      warnings: [],
      processing_time: 0,
      created_at: now
    };
  }

  /**
   * Cancela una importación en progreso
   */
  static async cancelImport(sessionId: string): Promise<void> {
    await this.deleteImportSession(sessionId);
  }

  /**
   * Obtener resultado de importación
   */
  static async getImportResult(importId: string): Promise<ImportResult> {
    return this.getImportStatus(importId);
  }

  /**
   * Obtener historial de importaciones
   * @deprecated El sistema genérico no mantiene historial persistente
   */
  static async getImportHistory(): Promise<{
    imports: ImportResult[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    return {
      imports: [],
      total: 0,
      page: 1,
      limit: 20,
      total_pages: 0
    };
  }

  /**
   * Obtener plantillas disponibles
   */
  static async getAvailableTemplates(): Promise<{
    available_templates: Record<string, any>;
  }> {
    const models = await this.getAvailableModels();
    const templates: Record<string, any> = {};
    
    for (const model of models) {
      try {
        const metadata = await this.getModelMetadata(model);
        templates[model] = {
          description: metadata.description || `Import ${metadata.display_name}`,
          formats: ['csv', 'xlsx'],
          endpoints: {
            upload: `${BASE_URL}/sessions`,
            preview: `${BASE_URL}/sessions/{session_id}/preview`,
            execute: `${BASE_URL}/sessions/{session_id}/execute`
          },
          required_fields: metadata.fields.filter(f => f.is_required).map(f => f.internal_name),
          optional_fields: metadata.fields.filter(f => !f.is_required).map(f => f.internal_name),
          example_data: {}
        };
      } catch (error) {
        console.warn(`Error obteniendo metadata para modelo ${model}:`, error);
      }
    }
    
    return { available_templates: templates };
  }

  /**
   * @deprecated El sistema genérico no maneja plantillas de descarga
   */
  static async downloadTemplate(): Promise<Blob> {
    throw new Error('Las plantillas de descarga no están disponibles en el sistema genérico. Use getModelMetadata para obtener la estructura de campos.');
  }

  /**
   * Obtener información de plantilla
   */
  static async getTemplateInfo(
    dataType: 'accounts' | 'journal_entries',
    format: 'csv' | 'xlsx' | 'json'
  ): Promise<TemplateInfo> {
    const modelName = this.mapDataTypeToModel(dataType);
    const metadata = await this.getModelMetadata(modelName);
      return {
      data_type: dataType,
      format: format,
      description: metadata.description || '',
      required_fields: metadata.fields.filter(f => f.is_required).map(f => f.internal_name),
      optional_fields: metadata.fields.filter(f => !f.is_required).map(f => f.internal_name),
      field_descriptions: metadata.fields.reduce((acc, field) => {
        acc[field.internal_name] = field.description || field.display_label;
        return acc;
      }, {} as Record<string, string>)
    };
  }

  /**
   * Validar archivo antes de importar
   */
  static async validateFile(file: File, dataType: 'accounts' | 'journal_entries'): Promise<{
    is_valid: boolean;
    errors: string[];
    warnings: string[];
    detected_format: string;
    total_rows: number;
  }> {
    try {
      const modelName = this.mapDataTypeToModel(dataType);
      
      // Crear sesión temporal para validación
      const session = await this.createImportSession(modelName, file);
      
      // La creación exitosa de la sesión implica validación básica
      // Limpiar la sesión temporal
      await this.deleteImportSession(session.import_session_token);
      
      return {
        is_valid: true,
        errors: [],
        warnings: [],
        detected_format: 'csv',
        total_rows: session.sample_rows?.length || 0
      };
    } catch (error: any) {
      return {
        is_valid: false,
        errors: [error.message || 'Error validando archivo'],
        warnings: [],
        detected_format: 'unknown',
        total_rows: 0
      };
    }
  }

  // === Utilidades ===

  /**
   * Generar configuración por defecto
   */
  static getDefaultConfiguration(dataType: 'accounts' | 'journal_entries'): ImportConfiguration {
    return {
      data_type: dataType,
      format: 'csv',
      validation_level: 'strict',
      batch_size: 100,
      skip_duplicates: true,
      update_existing: false,
      continue_on_error: false,
      csv_delimiter: ',',
      csv_encoding: 'utf-8',
      xlsx_sheet_name: null,
      xlsx_header_row: 1,
    };
  }

  /**
   * Validar un archivo antes de subirlo
   */
  static validateFileInput(file: File): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
    ];

    if (!file) {
      errors.push('Debe seleccionar un archivo');
      return { isValid: false, errors };
    }

    if (file.size > maxSize) {
      errors.push('El archivo no puede superar los 10MB');
    }

    if (!allowedTypes.includes(file.type) && !this.isValidFileExtension(file.name)) {
      errors.push('Formato de archivo no soportado. Use CSV, XLSX o JSON');
    }

    return { isValid: errors.length === 0, errors };
  }

  private static isValidFileExtension(filename: string): boolean {
    const validExtensions = ['.csv', '.xlsx', '.xls', '.json'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return validExtensions.includes(extension);
  }

  /**
   * Formatea el tamaño de archivo para mostrar
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Detecta el tipo de archivo por extensión
   */
  static detectFileFormat(filename: string): 'csv' | 'xlsx' | 'json' | 'unknown' {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    switch (extension) {
      case '.csv':
        return 'csv';
      case '.xlsx':
      case '.xls':
        return 'xlsx';
      case '.json':
        return 'json';
      default:
        return 'unknown';
    }
  }
}
