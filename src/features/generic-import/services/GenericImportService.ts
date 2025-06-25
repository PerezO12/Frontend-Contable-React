import { apiClient } from '@/shared/api/client';
import type {
  ModelMetadata,
  ImportSessionResponse,
  ModelMappingResponse,
  ImportPreviewRequest,
  ImportPreviewResponse,
  ImportResult,
  ImportTemplate,
  SaveTemplateRequest,
  ColumnMapping,
  ImportConfig,
  ExecuteImportRequest,
  BatchProcessingResult,
} from '../types';

const BASE_URL = '/api/v1/generic-import';

export class GenericImportService {
  // === Gestión de Modelos ===
    /**
   * Obtiene la lista de modelos disponibles para importación
   */
  static async getAvailableModels(): Promise<string[]> {
    console.log('🔍 [GenericImportService] Obteniendo modelos disponibles...');
    const response = await apiClient.get(`${BASE_URL}/models`);
    console.log('✅ [GenericImportService] Respuesta getAvailableModels:', JSON.stringify(response.data, null, 2));
    return response.data;
  }
  /**
   * Obtiene los metadatos de un modelo específico
   */
  static async getModelMetadata(modelName: string): Promise<ModelMetadata> {
    console.log(`🔍 [GenericImportService] Obteniendo metadatos para modelo: ${modelName}`);
    const response = await apiClient.get(`${BASE_URL}/models/${modelName}/metadata`);
    console.log('✅ [GenericImportService] Respuesta getModelMetadata:', JSON.stringify(response.data, null, 2));
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
    console.log(`🔍 [GenericImportService] Creando sesión de importación para modelo: ${modelName}, archivo: ${file.name}`);
    const formData = new FormData();
    formData.append('model_name', modelName);
    formData.append('file', file);

    const response = await apiClient.post(`${BASE_URL}/sessions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },    });

    console.log('✅ [GenericImportService] Respuesta createImportSession:', JSON.stringify(response.data, null, 2));
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
    console.log(`🔍 [GenericImportService] Obteniendo sugerencias de mapeo para sesión: ${sessionId}`);
    const response = await apiClient.get(`${BASE_URL}/sessions/${sessionId}/mapping-suggestions`);
    console.log('✅ [GenericImportService] Respuesta getMappingSuggestions:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  /**
   * Establece el mapeo de campos para una sesión
   */
  static async setFieldMapping(
    sessionId: string,
    mappings: ColumnMapping[]
  ): Promise<ModelMappingResponse> {
    const response = await apiClient.post(`${BASE_URL}/sessions/${sessionId}/mapping`, mappings);
    return response.data;
  }
  // === Vista Previa ===
  /**
   * Genera vista previa de la importación con los mapeos actuales
   */
  static async generatePreview(
    sessionId: string,
    previewRequest: ImportPreviewRequest
  ): Promise<ImportPreviewResponse> {
    console.log(`🔍 [GenericImportService] Generando vista previa para sesión: ${sessionId}`);
    console.log('📋 [GenericImportService] Preview request:', JSON.stringify(previewRequest, null, 2));
    const response = await apiClient.post(`${BASE_URL}/sessions/${sessionId}/preview`, previewRequest);
    console.log('✅ [GenericImportService] Respuesta generatePreview:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  /**
   * Genera vista previa de un lote específico
   */
  static async generateBatchPreview(
    sessionId: string,
    previewRequest: ImportPreviewRequest,
    batchNumber: number,
    batchSize: number
  ): Promise<ImportPreviewResponse> {
    console.log(`🔍 [GenericImportService] Generando vista previa del lote ${batchNumber} para sesión: ${sessionId}`);
    
    const batchPreviewRequest = {
      ...previewRequest,
      batch_number: batchNumber,
      batch_size: batchSize
    };
    
    console.log('📋 [GenericImportService] Batch preview request:', JSON.stringify(batchPreviewRequest, null, 2));
    const response = await apiClient.post(`${BASE_URL}/sessions/${sessionId}/preview`, batchPreviewRequest);
    console.log('✅ [GenericImportService] Respuesta generateBatchPreview:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  /**
   * Obtiene información de lotes para una sesión
   */
  static async getBatchInfo(
    sessionId: string,
    batchSize: number
  ): Promise<{ total_batches: number; total_rows: number }> {
    console.log(`🔍 [GenericImportService] Obteniendo información de lotes para sesión: ${sessionId}`);
    const response = await apiClient.get(`${BASE_URL}/sessions/${sessionId}/batch-info?batch_size=${batchSize}`);
    console.log('✅ [GenericImportService] Respuesta getBatchInfo:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  /**
   * Valida todo el archivo completo para mostrar estadísticas completas
   */
  static async validateFullFile(
    sessionId: string,
    previewRequest: ImportPreviewRequest
  ): Promise<ImportPreviewResponse> {
    console.log(`🔍 [GenericImportService] Validando archivo completo para sesión: ${sessionId}`);
    console.log('📋 [GenericImportService] Validation request:', JSON.stringify(previewRequest, null, 2));
    const response = await apiClient.post(`${BASE_URL}/sessions/${sessionId}/validate-full`, previewRequest);
    console.log('✅ [GenericImportService] Respuesta validateFullFile:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // === Ejecución de Importación ===
  /**
   * Ejecuta la importación con los parámetros especificados (con soporte para batch processing)
   */
  static async executeImport(
    sessionId: string,
    mappings: ColumnMapping[],
    importPolicy: string = 'create_only',
    skipErrors: boolean = false,
    batchSize: number = 2000
  ): Promise<ImportResult> {
    console.log('📤 [GenericImportService] EJECUTANDO IMPORTACIÓN:');
    console.log('  🆔 Session ID:', sessionId);
    console.log('  📋 Mappings:', JSON.stringify(mappings, null, 2));
    console.log('  ⚙️ Import Policy:', importPolicy);
    console.log('  🚫 Skip Errors:', skipErrors);
    console.log('  📦 Batch Size:', batchSize);
    console.log('  🌐 URL:', `${BASE_URL}/sessions/${sessionId}/execute?import_policy=${importPolicy}&skip_errors=${skipErrors}&batch_size=${batchSize}`);
    
    // El backend espera los parámetros como query params y body separado
    const response = await apiClient.post(
      `${BASE_URL}/sessions/${sessionId}/execute?import_policy=${importPolicy}&skip_errors=${skipErrors}&batch_size=${batchSize}`,
      mappings  // Enviar mappings directamente como array en el body
    );
    
    console.log('📥 [GenericImportService] RESPUESTA DEL EXECUTE:');
    console.log('  📊 Status:', response.status);
    console.log('  📄 Data:', JSON.stringify(response.data, null, 2));
    console.log('  📋 Headers:', response.headers);
    
    // Transformar la respuesta del backend al formato esperado por el frontend
    const backendResult = response.data;
    
    console.log('🔍 [GenericImportService] Estructura de respuesta del backend:');
    console.log('  📊 Summary:', JSON.stringify(backendResult.summary, null, 2));
    console.log('  ⚡ Performance:', JSON.stringify(backendResult.performance_metrics, null, 2));
    console.log('  📋 Quality Report:', JSON.stringify(backendResult.quality_report, null, 2));
    
    // Mapear el estado del backend al formato del frontend
    let frontendStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' = 'completed';
    if (backendResult.status === 'completed' || backendResult.status === 'completed_with_errors') {
      frontendStatus = 'completed';
    } else if (backendResult.status === 'failed') {
      frontendStatus = 'failed';
    }
    
    // Extraer estadísticas de la nueva estructura EnhancedImportExecutionResponse
    const summary = backendResult.summary || {};
    const performanceMetrics = backendResult.performance_metrics || {};
    
    // Crear error_summary a partir de los errores del backend
    const error_summary: Record<string, number> = {};
    
    // Procesar errores por tipo desde summary.errors_by_type
    if (summary.errors_by_type) {
      Object.entries(summary.errors_by_type).forEach(([errorType, count]) => {
        error_summary[errorType] = count as number;
      });
    }
    
    // Procesar failed_records si existen
    if (backendResult.failed_records && Array.isArray(backendResult.failed_records)) {
      backendResult.failed_records.forEach((failedRecord: any) => {
        if (failedRecord.error && failedRecord.error.message) {
          const errorMessage = failedRecord.error.message;
          let errorType = 'Error general';
          
          if (errorMessage.includes('already exists')) {
            errorType = 'Registro duplicado';
          } else if (errorMessage.includes('Missing required')) {
            errorType = 'Campo requerido faltante';
          } else if (errorMessage.includes('Invalid')) {
            errorType = 'Valor inválido';
          }
          
          error_summary[errorType] = (error_summary[errorType] || 0) + 1;
        }
      });
    }
    
    const transformedResult: ImportResult = {
      import_id: backendResult.import_session_token || sessionId,
      import_session_token: backendResult.import_session_token || sessionId,
      model: backendResult.model || 'unknown',
      status: frontendStatus,
      total_rows: summary.total_processed || 0,
      processed_rows: summary.total_processed || 0,
      created_rows: summary.successful || 0,
      updated_rows: summary.updated || 0,
      failed_rows: summary.failed || 0,
      skipped_rows: summary.skipped || 0,
      skip_errors: skipErrors,
      skipped_details: [], // No disponible en la nueva estructura
      processing_time_seconds: performanceMetrics.total_execution_time_seconds || undefined,
      error_summary: Object.keys(error_summary).length > 0 ? error_summary : undefined,
      detailed_errors: undefined, // No implementado en el backend actual
      created_entities: undefined,
      updated_entities: undefined,
      started_at: new Date().toISOString(), // Aproximación ya que el backend no lo devuelve
      completed_at: new Date().toISOString()
    };
    
    console.log('🔄 [GenericImportService] RESULTADO TRANSFORMADO:', JSON.stringify(transformedResult, null, 2));
    
    return transformedResult;
  }

  /**
   * Obtiene el estado de una importación en progreso
   */
  static async getImportStatus(sessionId: string): Promise<ImportResult> {
    // El backend simple no tiene seguimiento de estado separado
    // Retornamos el resultado de la sesión
    try {
      await apiClient.get(`${BASE_URL}/sessions/${sessionId}`);      return {
        import_id: sessionId,
        import_session_token: sessionId,
        model: 'unknown',
        status: 'completed',
        total_rows: 0,
        processed_rows: 0,
        created_rows: 0,
        updated_rows: 0,
        failed_rows: 0,
        skipped_rows: 0,
        skip_errors: false,
        processing_time_seconds: 0,
        error_summary: {},
        detailed_errors: [],
        created_entities: [],
        updated_entities: [],
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };
    } catch {      return {
        import_id: sessionId,
        import_session_token: sessionId,
        model: 'unknown',
        status: 'failed',
        total_rows: 0,
        processed_rows: 0,
        created_rows: 0,
        updated_rows: 0,
        failed_rows: 0,
        skipped_rows: 0,
        skip_errors: false,
        processing_time_seconds: 0,
        error_summary: {},
        detailed_errors: [],
        created_entities: [],
        updated_entities: [],        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      };
    }
  }

  /**
   * Cancela una importación en progreso
   */
  static async cancelImport(sessionId: string): Promise<void> {
    // El backend simple no soporta cancelación
    await apiClient.delete(`${BASE_URL}/sessions/${sessionId}`);
  }
  // === Gestión de Plantillas ===

  /**
   * Obtiene las plantillas disponibles para un modelo
   */
  static async getTemplates(modelName?: string): Promise<ImportTemplate[]> {
    const response = await apiClient.get(`${BASE_URL}/templates`, { 
      params: modelName ? { model_name: modelName } : {} 
    });
    return response.data;
  }

  /**
   * Guarda una nueva plantilla de importación
   */
  static async saveTemplate(
    templateRequest: SaveTemplateRequest
  ): Promise<ImportTemplate> {
    const response = await apiClient.post(`${BASE_URL}/templates`, templateRequest);
    return response.data;
  }

  /**
   * Actualiza una plantilla existente
   */
  static async updateTemplate(
    templateId: string,
    templateRequest: Partial<SaveTemplateRequest>
  ): Promise<ImportTemplate> {
    const response = await apiClient.put(`${BASE_URL}/templates/${templateId}`, templateRequest);
    return response.data;
  }

  /**
   * Elimina una plantilla
   */
  static async deleteTemplate(templateId: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/templates/${templateId}`);
  }

  /**
   * Aplica una plantilla a una sesión de importación
   */
  static async applyTemplate(
    sessionId: string,
    templateId: string
  ): Promise<ModelMappingResponse> {
    const response = await apiClient.post(
      `${BASE_URL}/sessions/${sessionId}/apply-template/${templateId}`
    );
    return response.data;
  }

  /**
   * Descarga la plantilla CSV para un modelo específico
   */
  static async downloadTemplate(modelName: string): Promise<void> {
    console.log(`🔍 [GenericImportService] Descargando plantilla para modelo: ${modelName}`);
    
    try {
      const response = await apiClient.get(`/api/v1/import/models/${modelName}/template`, {
        responseType: 'blob',
      });

      // Crear un blob con el contenido CSV
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
      
      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga temporal
      const link = document.createElement('a');
      link.href = url;
      link.download = `${modelName}_plantilla_importacion.csv`;
      
      // Ejecutar descarga
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ [GenericImportService] Plantilla descargada exitosamente: ${modelName}_plantilla_importacion.csv`);
    } catch (error) {
      console.error(`❌ [GenericImportService] Error descargando plantilla para ${modelName}:`, error);
      throw new Error(`Error al descargar la plantilla: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Verifica si una plantilla está disponible para un modelo
   */
  static async isTemplateAvailable(modelName: string): Promise<boolean> {
    try {
      const response = await apiClient.head(`/api/v1/import/models/${modelName}/template`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Descarga ejemplos prácticos para un modelo específico
   */
  static async downloadExamples(modelName: string, exampleType: string = 'complete'): Promise<void> {
    console.log(`🔍 [GenericImportService] Descargando ejemplos para modelo: ${modelName}, tipo: ${exampleType}`);
    
    try {
      const response = await apiClient.get(`/api/v1/import/models/${modelName}/examples`, {
        params: { example_type: exampleType },
        responseType: 'blob',
      });

      // Crear un blob con el contenido CSV
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' });
      
      // Crear URL temporal para descarga
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga temporal
      const link = document.createElement('a');
      link.href = url;
      link.download = `${modelName}_ejemplos_${exampleType}.csv`;
      
      // Ejecutar descarga
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ [GenericImportService] Ejemplos descargados exitosamente: ${modelName}_ejemplos_${exampleType}.csv`);
    } catch (error) {
      console.error(`❌ [GenericImportService] Error descargando ejemplos para ${modelName}:`, error);
      throw new Error(`Error al descargar ejemplos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene información sobre los ejemplos disponibles para un modelo
   */
  static async getExamplesInfo(modelName: string): Promise<any> {
    console.log(`🔍 [GenericImportService] Obteniendo información de ejemplos para modelo: ${modelName}`);
    
    try {
      const response = await apiClient.get(`/api/v1/import/models/${modelName}/examples/info`);
      console.log(`✅ [GenericImportService] Información de ejemplos obtenida para: ${modelName}`);
      return response.data;
    } catch (error) {
      console.error(`❌ [GenericImportService] Error obteniendo información de ejemplos para ${modelName}:`, error);
      throw new Error(`Error al obtener información de ejemplos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Verifica si hay ejemplos disponibles para un modelo específico
   */
  static async areExamplesAvailable(modelName: string, exampleType: string = 'complete'): Promise<boolean> {
    try {
      const response = await apiClient.head(`/api/v1/import/models/${modelName}/examples`, {
        params: { example_type: exampleType }
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // === Utilidades ===

  /**
   * Valida un archivo antes de subirlo
   */
  static validateFile(file: File): { isValid: boolean; errors: string[] } {
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

  // === Configuración de Batch Processing ===

  /**
   * Obtiene la configuración predeterminada para importaciones
   */
  static async getImportConfig(): Promise<ImportConfig> {
    console.log('🔍 [GenericImportService] Obteniendo configuración de importación...');
    const response = await apiClient.get(`${BASE_URL}/config`);
    console.log('✅ [GenericImportService] Configuración obtenida:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // === Ejecución con Batch Processing ===

  /**
   * Ejecuta importación con parámetros individuales usando la nueva API de batch processing
   */
  static async executeImportWithBatchProcessing(
    sessionId: string,
    request: ExecuteImportRequest
  ): Promise<BatchProcessingResult> {
    console.log(`🔍 [GenericImportService] Ejecutando importación por lotes para sesión: ${sessionId}`);
    console.log('📋 [GenericImportService] Configuración de ejecución:', JSON.stringify(request, null, 2));
    
    const response = await apiClient.post(
      `${BASE_URL}/sessions/${sessionId}/execute`,
      null,
      {
        params: {
          import_policy: request.import_policy,
          skip_errors: request.skip_errors,
          batch_size: request.batch_size
        },
        data: request.mappings
      }
    );

    console.log('✅ [GenericImportService] Resultado de importación:', JSON.stringify(response.data, null, 2));
    return response.data;
  }

  // === Utilidades para Batch Processing ===

  /**
   * Calcula el número estimado de lotes basado en filas totales y tamaño de lote
   */
  static calculateEstimatedBatches(totalRows: number, batchSize: number): number {
    return Math.ceil(totalRows / batchSize);
  }

  /**
   * Estima el tiempo de procesamiento basado en filas y un factor de rendimiento
   */
  static estimateProcessingTime(totalRows: number, batchSize: number): {
    estimatedMinutes: number;
    estimatedBatches: number;
    recommendedBatchSize: number;
  } {
    const estimatedBatches = this.calculateEstimatedBatches(totalRows, batchSize);
    
    // Estimación conservadora: 50-100 filas por segundo
    const rowsPerSecond = 75;
    const estimatedSeconds = totalRows / rowsPerSecond;
    const estimatedMinutes = Math.ceil(estimatedSeconds / 60);
    
    // Recomendar tamaño de lote basado en el tamaño del archivo
    let recommendedBatchSize = batchSize;
    if (totalRows < 1000) {
      recommendedBatchSize = Math.min(1000, totalRows);
    } else if (totalRows < 10000) {
      recommendedBatchSize = 2000;
    } else if (totalRows < 50000) {
      recommendedBatchSize = 5000;
    } else {
      recommendedBatchSize = 10000;
    }

    return {
      estimatedMinutes,
      estimatedBatches,
      recommendedBatchSize
    };
  }

  /**
   * Valida la configuración de batch processing
   */
  static validateBatchConfig(batchSize: number, totalRows: number, config: ImportConfig): {
    isValid: boolean;
    warnings: string[];
    recommendations: string[];
  } {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // Validar límites
    const isValid = batchSize >= config.batch_size.min && batchSize <= config.batch_size.max;
    
    if (batchSize < config.batch_size.min) {
      warnings.push(`El tamaño de lote ${batchSize} es menor al mínimo recomendado (${config.batch_size.min})`);
    }
    
    if (batchSize > config.batch_size.max) {
      warnings.push(`El tamaño de lote ${batchSize} excede el máximo permitido (${config.batch_size.max})`);
    }
    
    // Recomendaciones basadas en el tamaño del archivo
    if (totalRows > 0) {
      const estimation = this.estimateProcessingTime(totalRows, batchSize);
      
      if (batchSize !== estimation.recommendedBatchSize) {
        recommendations.push(
          `Para ${totalRows} filas, se recomienda un tamaño de lote de ${estimation.recommendedBatchSize} ` +
          `(estimado: ${estimation.estimatedMinutes} minutos en ${estimation.estimatedBatches} lotes)`
        );
      }
      
      if (estimation.estimatedMinutes > 30) {
        recommendations.push(
          'Procesamiento largo estimado. Considere procesar el archivo en modo background o dividirlo en archivos más pequeños.'
        );
      }
    }
    
    return {
      isValid,
      warnings,
      recommendations
    };
  }
}
