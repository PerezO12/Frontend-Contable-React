import { apiClient } from '../api/client';

// Tipos para el servicio de exportación genérica
export interface ExportRequest {
  table: string;
  format: 'csv' | 'json' | 'xlsx';
  ids: string[];
}

export interface ExportResponse {
  file_name: string;
  file_content: string;
  content_type: string;
  metadata: {
    export_date: string;
    user_id: string;
    table_name: string;
    total_records: number;
    exported_records: number;
    filters_applied: {
      ids: string[];
    };
    format: string;
    file_size_bytes: number;
    columns_exported: string[];
  };
  success: boolean;
  message: string;
}

export interface ExportAdvancedRequest {
  table_name: string;
  export_format: 'csv' | 'json' | 'xlsx';
  filters?: {
    ids?: string[];
    date_from?: string;
    date_to?: string;
    active_only?: boolean;
    custom_filters?: Record<string, any>;
    offset?: number;
    limit?: number;
  };
  columns?: Array<{
    name: string;
    include: boolean;
  }>;
}

/**
 * Servicio genérico de exportación siguiendo la documentación del sistema
 */
export class ExportService {
  private static readonly BASE_URL = '/api/v1/export';
  /**
   * Exportación simple por IDs - Endpoint principal según documentación
   */
  static async exportByIds(request: ExportRequest): Promise<Blob> {
    const response = await apiClient.post(
      `${this.BASE_URL}/export`,
      request,
      {
        responseType: 'blob'
      }
    );
    return response.data;
  }
  /**
   * Exportación avanzada con filtros
   */
  static async exportAdvanced(request: ExportAdvancedRequest): Promise<Blob> {
    const response = await apiClient.post(
      `${this.BASE_URL}/export/advanced`,
      request,
      {
        responseType: 'blob'
      }
    );
    return response.data;
  }

  /**
   * Obtener tablas disponibles para exportación
   */
  static async getAvailableTables(): Promise<{
    tables: Array<{
      table_name: string;
      display_name: string;
      description: string;
      available_columns: Array<{
        name: string;
        data_type: string;
        include: boolean;
      }>;
      total_records: number;
    }>;
    total_tables: number;
  }> {
    const response = await apiClient.get(`${this.BASE_URL}/tables`);
    return response.data;
  }

  /**
   * Obtener esquema de una tabla específica
   */
  static async getTableSchema(tableName: string): Promise<{
    table_name: string;
    display_name: string;
    description: string;
    available_columns: Array<{
      name: string;
      data_type: string;
      include: boolean;
    }>;
    total_records: number;
    sample_data: any[];
  }> {
    const response = await apiClient.get(`${this.BASE_URL}/tables/${tableName}/schema`);
    return response.data;
  }

  /**
   * Generar nombre de archivo único para exportación
   */
  static generateFileName(tableName: string, format: string, date?: Date): string {
    const timestamp = (date || new Date()).toISOString().slice(0, 19).replace(/[:-]/g, '');
    return `${tableName}_${timestamp}.${format}`;
  }

  /**
   * Obtener tipo MIME según formato
   */
  static getContentType(format: string): string {
    const types = {
      csv: 'text/csv',
      json: 'application/json',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    return types[format as keyof typeof types] || 'application/octet-stream';
  }

  /**
   * Descargar blob como archivo
   */
  static downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
