import { apiClient } from '@/shared/api/client';
import type {
  ImportConfiguration,
  ImportPreviewData,
  ImportResult,
  ImportStatus,
  ImportFileUpload,
  TemplateDownload,
  TemplateInfo
} from '../types';

const BASE_URL = '/api/v1';

export class DataImportService {
  /**
   * Previsualizar datos de importación desde contenido base64
   */
  static async previewImport(
    fileContent: string,
    filename: string,
    configuration: ImportConfiguration,
    previewRows: number = 10
  ): Promise<ImportPreviewData> {
    const response = await apiClient.post(`${BASE_URL}/import/preview`, {
      file_content: fileContent,
      filename,
      configuration,
      preview_rows: previewRows
    });
    return response.data;
  }  /**
   * Cargar archivo y obtener previsualización
   */
  static async uploadAndPreview(uploadData: ImportFileUpload): Promise<ImportPreviewData> {
    const formData = new FormData();
    formData.append('file', uploadData.file);
    
    // Construir query parameters
    const queryParams = new URLSearchParams({
      data_type: uploadData.data_type,
      validation_level: uploadData.validation_level,
    });
    
    // Agregar parámetros opcionales
    if (uploadData.batch_size) {
      queryParams.append('batch_size', uploadData.batch_size.toString());
    } else {
      queryParams.append('batch_size', '100'); // Valor por defecto
    }
    
    if (uploadData.preview_rows) {
      queryParams.append('preview_rows', uploadData.preview_rows.toString());
    }    console.log('Sending request to:', `${BASE_URL}/import/upload-file?${queryParams.toString()}`);
    console.log('FormData file:', uploadData.file.name);

    const response = await apiClient.post(
      `${BASE_URL}/import/upload-file?${queryParams.toString()}`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Response headers:', response.headers);
    
    return response.data;
  }

  /**
   * Importar datos
   */
  static async importData(
    fileContent: string,
    filename: string,
    configuration: ImportConfiguration
  ): Promise<ImportResult> {
    const response = await apiClient.post(`${BASE_URL}/import/import`, {
      file_content: fileContent,
      filename,
      configuration
    });
    return response.data;
  }  /**
   * Importar desde archivo cargado (usando endpoint import-file con FormData)
   */
  static async importFromFile(
    file: File,
    configuration: ImportConfiguration
  ): Promise<ImportResult> {
    console.log('🚀 === INICIO DE IMPORTACIÓN ===');
    console.log('📁 Archivo:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    });
    console.log('⚙️ Configuración recibida:', JSON.stringify(configuration, null, 2));

    const formData = new FormData();
    formData.append('file', file);
    
    // Log del FormData
    console.log('📦 FormData creado:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    // Construir query parameters según la documentación
    const queryParams = new URLSearchParams({
      data_type: configuration.data_type,
      validation_level: configuration.validation_level,
      batch_size: configuration.batch_size.toString(),
      skip_duplicates: configuration.skip_duplicates.toString(),
      update_existing: configuration.update_existing.toString(),
      continue_on_error: configuration.continue_on_error.toString(),
    });

    // Agregar parámetros específicos de CSV si aplica
    if (configuration.format === 'csv') {
      if (configuration.csv_delimiter) {
        queryParams.append('csv_delimiter', configuration.csv_delimiter);
      }
      if (configuration.csv_encoding) {
        queryParams.append('csv_encoding', configuration.csv_encoding);
      }
    }

    // Agregar parámetros específicos de Excel si aplica
    if (configuration.format === 'xlsx') {
      if (configuration.xlsx_sheet_name) {
        queryParams.append('xlsx_sheet_name', configuration.xlsx_sheet_name);
      }
      if (configuration.xlsx_header_row !== undefined) {
        queryParams.append('xlsx_header_row', configuration.xlsx_header_row.toString());
      }
    }

    const fullUrl = `${BASE_URL}/import/import-file?${queryParams.toString()}`;
    console.log('🌐 URL completa:', fullUrl);
    console.log('🔗 Query parameters:', Object.fromEntries(queryParams.entries()));

    console.log('📤 Enviando solicitud POST...');
    
    try {
      const response = await apiClient.post(
        fullUrl,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      console.log('✅ Respuesta exitosa:');
      console.log('📊 Status:', response.status);
      console.log('📋 Headers:', response.headers);
      console.log('📄 Data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error: any) {
      console.log('❌ Error en la solicitud:');
      console.log('🔥 Error completo:', error);
      
      if (error.response) {
        console.log('📊 Response status:', error.response.status);
        console.log('📋 Response headers:', error.response.headers);
        console.log('📄 Response data:', error.response.data);
      } else if (error.request) {
        console.log('📡 Request sin respuesta:', error.request);
      } else {
        console.log('⚙️ Error de configuración:', error.message);
      }
      
      throw error;
    }
  }

  /**
   * Importar desde archivo cargado (versión legacy usando base64)
   */
  static async importFromFileBase64(
    file: File,
    configuration: ImportConfiguration
  ): Promise<ImportResult> {
    // Convertir archivo a base64
    const fileContent = await this.fileToBase64(file);
    return this.importData(fileContent, file.name, configuration);
  }

  /**
   * Obtener estado de importación
   */
  static async getImportStatus(importId: string): Promise<ImportStatus> {
    const response = await apiClient.get(`${BASE_URL}/import/status/${importId}`);
    return response.data;
  }

  /**
   * Obtener resultado de importación
   */
  static async getImportResult(importId: string): Promise<ImportResult> {
    const response = await apiClient.get(`${BASE_URL}/import/result/${importId}`);
    return response.data;
  }

  /**
   * Cancelar importación en progreso
   */
  static async cancelImport(importId: string): Promise<void> {
    await apiClient.post(`${BASE_URL}/import/cancel/${importId}`);
  }

  /**
   * Obtener historial de importaciones
   */
  static async getImportHistory(
    page: number = 1,
    limit: number = 20,
    dataType?: 'accounts' | 'journal_entries'
  ): Promise<{
    imports: ImportResult[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (dataType) {
      params.append('data_type', dataType);
    }

    const response = await apiClient.get(`${BASE_URL}/import/history?${params}`);
    return response.data;
  }

  /**
   * Obtener plantillas disponibles
   */
  static async getAvailableTemplates(): Promise<{
    available_templates: Record<string, {
      description: string;
      formats: string[];
      endpoints: Record<string, string>;
      required_fields: string[];
      optional_fields: string[];
      example_data: any;
    }>;
  }> {
    const response = await apiClient.get(`${BASE_URL}/templates/`);
    return response.data;
  }
  /**
   * Descargar plantilla
   */
  static async downloadTemplate(templateData: TemplateDownload): Promise<Blob> {
    // Convertir journal_entries a journal-entries para la URL
    const dataTypeUrl = templateData.data_type === 'journal_entries' ? 'journal-entries' : templateData.data_type;
    
    const response = await apiClient.get(
      `${BASE_URL}/templates/${dataTypeUrl}/${templateData.format}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }
  /**
   * Obtener información de plantilla específica
   */
  static async getTemplateInfo(
    dataType: 'accounts' | 'journal_entries',
    format: 'csv' | 'xlsx' | 'json'
  ): Promise<TemplateInfo> {
    // Convertir journal_entries a journal-entries para la URL
    const dataTypeUrl = dataType === 'journal_entries' ? 'journal-entries' : dataType;
    
    const response = await apiClient.get(`${BASE_URL}/templates/${dataTypeUrl}/${format}/info`);
    return response.data;
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
    const formData = new FormData();
    formData.append('file', file);

    const queryParams = new URLSearchParams({
      data_type: dataType
    });

    const response = await apiClient.post(`${BASE_URL}/import/validate?${queryParams.toString()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Convertir archivo a base64
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:*/*;base64,"
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }
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
}
