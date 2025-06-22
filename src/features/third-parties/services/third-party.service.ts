import { apiClient } from '../../../shared/api/client';
import type {
  ThirdParty,
  ThirdPartyCreate,
  ThirdPartyUpdate,
  ThirdPartyFilters,
  ThirdPartyListResponse,
  ThirdPartyStatement,
  ThirdPartyBalance,
  ThirdPartyAnalytics,
  ThirdPartyExportRequest,
  ThirdPartyExportResponse,
  ThirdPartyImportRequest,
  ThirdPartyImportResponse,
  BulkThirdPartyOperation,
  BulkThirdPartyResult,
  ThirdPartySearchResponse,
  ThirdPartyDeleteValidation,
  BulkDeleteResult,
  BulkDeleteRequest
} from '../types';
import { ExportService } from '../../../shared/services/exportService';

export class ThirdPartyService {
  private static readonly BASE_URL = '/api/v1/third-parties';  // CRUD Operations
  static async getThirdParties(filters?: ThirdPartyFilters): Promise<ThirdPartyListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.BASE_URL}?${params}` : this.BASE_URL;
    
    try {
      const response = await apiClient.get<ThirdPartyListResponse>(url);
      return response.data;
    } catch (error) {
      console.error('❌ [ThirdPartyService] Error en getThirdParties:', error);
      throw error;
    }
  }  static async getThirdParty(id: string): Promise<ThirdParty> {
    try {
      const response = await apiClient.get<ThirdParty>(`${this.BASE_URL}/${id}`);
      // El backend retorna directamente el objeto, no envuelto en data
      return response.data;
    } catch (error) {
      console.error('❌ [ThirdPartyService] Error en getThirdParty:', error);
      throw error;
    }
  }  static async createThirdParty(data: ThirdPartyCreate): Promise<ThirdParty> {
    // Limpiar campos vacíos y undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
    ) as ThirdPartyCreate;
    
    console.log('🚀 [ThirdPartyService] Creando tercero con datos:', cleanData);
    
    try {
      const response = await apiClient.post<ThirdParty>(this.BASE_URL, cleanData);
      console.log('✅ [ThirdPartyService] Tercero creado exitosamente:', response.data.id);
      // El backend retorna directamente el objeto creado
      return response.data;
    } catch (error: any) {
      console.error('❌ [ThirdPartyService] Error al crear tercero:');
      console.error('📥 Status:', error.response?.status);
      console.error('📥 Error data:', error.response?.data);
      throw error;
    }
  }
  static async updateThirdParty(id: string, data: ThirdPartyUpdate): Promise<ThirdParty> {
    try {
      const response = await apiClient.put<ThirdParty>(`${this.BASE_URL}/${id}`, data);
      // El backend retorna directamente el objeto actualizado
      return response.data;
    } catch (error: any) {
      console.error('❌ [ThirdPartyService] Error al actualizar tercero:', error);
      throw error;
    }
  }
  static async deleteThirdParty(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
    } catch (error: any) {
      console.error('❌ [ThirdPartyService] Error al eliminar tercero:', error);
      if (error.response?.data?.detail?.includes('existing journal entries')) {
        throw new Error('No se puede eliminar el tercero porque tiene asientos contables asociados');
      }
      throw error;
    }
  }

  // Search
  static async searchThirdParties(query: string, filters?: Partial<ThirdPartyFilters>): Promise<ThirdPartySearchResponse> {
    const params = new URLSearchParams({ q: query });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await apiClient.get<ThirdPartySearchResponse>(`${this.BASE_URL}/search?${params}`);
    return response.data;
  }

  // Statements
  static async getThirdPartyStatement(
    id: string,
    startDate?: string,
    endDate?: string,
    includeAging = true
  ): Promise<ThirdPartyStatement> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (includeAging) params.append('include_aging', 'true');

    const url = `${this.BASE_URL}/${id}/statement?${params}`;
    const response = await apiClient.get<{ data: ThirdPartyStatement }>(url);
    return response.data.data;
  }

  // Balance
  static async getThirdPartyBalance(
    id: string,
    asOfDate?: string,
    includeAging = true
  ): Promise<ThirdPartyBalance> {
    const params = new URLSearchParams();
    if (asOfDate) params.append('as_of_date', asOfDate);
    if (includeAging) params.append('include_aging', 'true');

    const url = `${this.BASE_URL}/${id}/balance?${params}`;
    const response = await apiClient.get<{ data: ThirdPartyBalance }>(url);
    return response.data.data;
  }

  // Analytics
  static async getAnalytics(filters?: Partial<ThirdPartyFilters>): Promise<ThirdPartyAnalytics> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.BASE_URL}/analytics/summary?${params}` : `${this.BASE_URL}/analytics/summary`;
    const response = await apiClient.get<{ data: ThirdPartyAnalytics }>(url);
    return response.data.data;
  }

  static async getAgingReport(filters?: Partial<ThirdPartyFilters>): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() ? `${this.BASE_URL}/analytics/aging-report?${params}` : `${this.BASE_URL}/analytics/aging-report`;
    const response = await apiClient.get(url);
    return response.data.data;
  }  // Export avanzado - IMPLEMENTADO
  static async exportThirdPartiesAdvanced(request: ThirdPartyExportRequest): Promise<ThirdPartyExportResponse> {
    try {
      const response = await apiClient.post(`${this.BASE_URL}/export/advanced`, request);
      return response.data;
    } catch (error) {
      console.error('Error en exportación avanzada:', error);
      throw error;
    }
  }

  static async getExportStatus(exportId: string): Promise<ThirdPartyExportResponse> {
    try {
      const response = await apiClient.get(`${this.BASE_URL}/export/${exportId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener status de exportación:', error);
      throw error;
    }
  }

  static getDownloadUrl(exportId: string): string {
    return `${this.BASE_URL}/export/${exportId}/download`;
  }

  /**
   * Exportar terceros seleccionados usando el sistema de exportación genérico
   */
  static async exportThirdParties(
    thirdPartyIds: string[], 
    format: 'csv' | 'json' | 'xlsx'
  ): Promise<Blob> {
    return ExportService.exportByIds({
      table: 'third_parties',
      format,
      ids: thirdPartyIds
    });
  }  // Import - IMPLEMENTADO
  static async importThirdParties(request: ThirdPartyImportRequest): Promise<ThirdPartyImportResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      formData.append('format', request.format);
      if (request.dry_run !== undefined) {
        formData.append('dry_run', request.dry_run.toString());
      }
      if (request.update_existing !== undefined) {
        formData.append('update_existing', request.update_existing.toString());
      }

      const response = await apiClient.post(`${this.BASE_URL}/import`, {
        total_records: 0,
        dry_run: request.dry_run,
        update_existing: request.update_existing
      });
      
      return response.data;
    } catch (error) {
      console.error('Error en importación:', error);
      throw error;
    }
  }

  static async getImportStatus(importId: string): Promise<ThirdPartyImportResponse> {
    try {
      const response = await apiClient.get(`${this.BASE_URL}/import/${importId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener status de importación:', error);
      throw error;
    }
  }// Bulk Operations - IMPLEMENTADO
  static async bulkOperation(operation: BulkThirdPartyOperation): Promise<BulkThirdPartyResult> {
    try {
      const response = await apiClient.post(`${this.BASE_URL}/bulk-operations`, operation);
      return response.data;
    } catch (error) {
      console.error('Error en operación bulk:', error);
      throw error;
    }
  }

  static async getBulkOperationStatus(operationId: string): Promise<BulkThirdPartyResult> {
    try {
      const response = await apiClient.get(`${this.BASE_URL}/bulk-operations/${operationId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener status de operación bulk:', error);
      throw error;
    }
  }
  // Validación para eliminación
  static async validateDeletion(thirdPartyIds: string[]): Promise<ThirdPartyDeleteValidation[]> {
    try {
      const response = await apiClient.post<ThirdPartyDeleteValidation[]>(
        `${this.BASE_URL}/validate-deletion`, 
        thirdPartyIds
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [ThirdPartyService] Error en validación de eliminación:', error);
      throw error;
    }
  }

  // Nueva eliminación masiva real
  static async bulkDeleteReal(
    thirdPartyIds: string[], 
    forceDelete: boolean = false, 
    deleteReason: string = ''
  ): Promise<BulkDeleteResult> {
    try {
      const request: BulkDeleteRequest = {
        third_party_ids: thirdPartyIds,
        force_delete: forceDelete,
        delete_reason: deleteReason
      };
      
      const response = await apiClient.post<BulkDeleteResult>(
        `${this.BASE_URL}/bulk-delete`, 
        request
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ [ThirdPartyService] Error en eliminación masiva real:', error);
      throw error;
    }
  }

  // Bulk Delete (soft delete - desactivación) - Mantener para compatibilidad
  static async bulkDelete(thirdPartyIds: string[]): Promise<BulkThirdPartyResult> {
    try {
      const operation: BulkThirdPartyOperation = {
        operation: 'delete',
        third_party_ids: thirdPartyIds
      };
      return this.bulkOperation(operation);
    } catch (error: any) {
      console.error('❌ [ThirdPartyService] Error en bulk delete:', error);
      throw error;
    }
  }

  // Bulk Update
  static async bulkUpdate(
    thirdPartyIds: string[],
    updates: Partial<ThirdPartyUpdate>
  ): Promise<BulkThirdPartyResult> {
    const operation: BulkThirdPartyOperation = {
      operation: 'update',
      third_party_ids: thirdPartyIds,
      updates
    };
    return this.bulkOperation(operation);
  }

  // Bulk Activate/Deactivate
  static async bulkActivate(thirdPartyIds: string[]): Promise<BulkThirdPartyResult> {
    const operation: BulkThirdPartyOperation = {
      operation: 'activate',
      third_party_ids: thirdPartyIds
    };
    return this.bulkOperation(operation);
  }

  static async bulkDeactivate(thirdPartyIds: string[]): Promise<BulkThirdPartyResult> {
    const operation: BulkThirdPartyOperation = {
      operation: 'deactivate',
      third_party_ids: thirdPartyIds
    };
    return this.bulkOperation(operation);
  }

  // Utilities
  static formatDisplayName(thirdParty: ThirdParty): string {    if (thirdParty.commercial_name) {
      return thirdParty.commercial_name;
    }
    return thirdParty.name;
  }

  static formatDocumentNumber(thirdParty: ThirdParty): string {
    return `${thirdParty.document_type}: ${thirdParty.document_number}`;
  }
}
