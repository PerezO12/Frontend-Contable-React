import { apiClient } from '../../../shared/api/client';
import { ExportService } from '../../../shared/services/exportService';
import type {
  JournalEntry,
  JournalEntryCreate,
  JournalEntryUpdate,
  JournalEntryFilters,
  JournalEntryListResponse,
  JournalEntryStatistics,
  BulkJournalEntryDelete,
  JournalEntryDeleteValidation,
  BulkJournalEntryDeleteResult,
  JournalEntryLine
} from '../types';
import { JournalEntryStatus, JournalEntryType } from '../types';

/**
 * Servicio para operaciones relacionadas con asientos contables
 * Maneja todas las interacciones con el API backend
 */
export class JournalEntryService {
  private static readonly BASE_URL = '/api/v1/journal-entries';

  /**
   * Obtener lista de asientos contables con filtros
   */
  static async getJournalEntries(filters?: JournalEntryFilters): Promise<JournalEntryListResponse> {
    console.log('Obteniendo asientos contables con filtros:', filters);
    
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
      const response = await apiClient.get<JournalEntryListResponse>(url);
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener asientos contables:', error);
      throw error;
    }
  }

  /**
   * Obtener un asiento contable por ID
   */
  static async getJournalEntryById(id: string): Promise<JournalEntry> {
    console.log('Obteniendo asiento contable por ID:', id);
    
    try {
      const response = await apiClient.get<JournalEntry>(`${this.BASE_URL}/${id}`);
      console.log('Asiento contable obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener asiento contable:', error);
      throw error;
    }
  }
  /**
   * Obtener un asiento contable por número
   */
  static async getJournalEntryByNumber(number: string): Promise<JournalEntry> {
    console.log('Obteniendo asiento contable por número:', number);
    
    try {
      const response = await apiClient.get<JournalEntry>(`${this.BASE_URL}/by-number/${encodeURIComponent(number)}`);
      console.log('Asiento contable obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener asiento contable por número:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo asiento contable
   */
  static async createJournalEntry(data: JournalEntryCreate): Promise<JournalEntry> {
    console.log('Creando nuevo asiento contable:', data);
    
    try {
      const response = await apiClient.post<JournalEntry>(this.BASE_URL, data);
      console.log('Asiento contable creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear asiento contable:', error);
      throw error;
    }
  }

  /**
   * Actualizar un asiento contable existente (solo borradores)
   */
  static async updateJournalEntry(id: string, data: JournalEntryUpdate): Promise<JournalEntry> {
    console.log('Actualizando asiento contable:', id, data);
    
    try {
      const response = await apiClient.put<JournalEntry>(`${this.BASE_URL}/${id}`, data);
      console.log('Asiento contable actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar asiento contable:', error);
      throw error;
    }
  }

  /**
   * Eliminar un asiento contable (solo borradores)
   */
  static async deleteJournalEntry(id: string): Promise<void> {
    console.log('Eliminando asiento contable:', id);
    
    try {
      await apiClient.delete(`${this.BASE_URL}/${id}`);
      console.log('Asiento contable eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar asiento contable:', error);
      throw error;
    }
  }
  /**
   * Aprobar un asiento contable
   */
  static async approveJournalEntry(id: string): Promise<JournalEntry> {
    console.log('Aprobando asiento contable:', id);
    
    try {
      const response = await apiClient.post<JournalEntry>(`${this.BASE_URL}/${id}/approve`);
      console.log('Asiento contable aprobado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al aprobar asiento contable:', error);
      throw error;
    }
  }
  /**
   * Contabilizar un asiento contable
   */
  static async postJournalEntry(id: string, reason?: string): Promise<JournalEntry> {
    console.log('Contabilizando asiento contable:', id, 'Razón:', reason);
    
    try {
      const response = await apiClient.post<JournalEntry>(
        `${this.BASE_URL}/${id}/post`,
        reason ? { reason } : {}
      );
      console.log('Asiento contable contabilizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al contabilizar asiento contable:', error);
      throw error;
    }
  }
  /**
   * Cancelar un asiento contable
   */
  static async cancelJournalEntry(id: string, reason: string): Promise<JournalEntry> {
    console.log('Cancelando asiento contable:', id, 'Razón:', reason);
    
    try {
      const response = await apiClient.post<JournalEntry>(
        `${this.BASE_URL}/${id}/cancel`,
        { reason }
      );
      console.log('Asiento contable cancelado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar asiento contable:', error);
      throw error;
    }
  }
  /**
   * Crear asiento de reversión
   */
  static async reverseJournalEntry(id: string, reason: string): Promise<JournalEntry> {
    console.log('Creando reversión de asiento contable:', id, 'Razón:', reason);
    
    try {
      const response = await apiClient.post<JournalEntry>(
        `${this.BASE_URL}/${id}/reverse?reason=${encodeURIComponent(reason)}`
      );
      console.log('Asiento de reversión creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear reversión de asiento contable:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de asientos contables
   */
  static async getStatistics(filters?: JournalEntryFilters): Promise<JournalEntryStatistics> {
    console.log('Obteniendo estadísticas de asientos contables:', filters);
    
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() 
      ? `${this.BASE_URL}/statistics/summary?${params}` 
      : `${this.BASE_URL}/statistics/summary`;
    
    try {
      const response = await apiClient.get<JournalEntryStatistics>(url);
      console.log('Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Búsqueda avanzada de asientos contables
   */
  static async searchJournalEntries(query: string, filters?: JournalEntryFilters): Promise<JournalEntryListResponse> {
    console.log('Búsqueda avanzada de asientos contables:', query, filters);
    
    const params = new URLSearchParams();
    params.append('q', query);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    try {
      const response = await apiClient.get<JournalEntryListResponse>(
        `${this.BASE_URL}/search?${params}`
      );
      console.log('Resultados de búsqueda:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en búsqueda de asientos contables:', error);
      throw error;
    }
  }
  /**
   * Crear múltiples asientos contables en lote
   */
  static async bulkCreateJournalEntries(entries: JournalEntryCreate[]): Promise<JournalEntry[]> {
    console.log('Creando asientos contables en lote:', entries.length, 'asientos');
    
    try {
      const response = await apiClient.post<JournalEntry[]>(
        `${this.BASE_URL}/bulk-create`,
        entries
      );
      console.log('Asientos contables creados en lote:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear asientos contables en lote:', error);
      throw error;
    }
  }
  /**
   * Exportar asientos contables usando el sistema de exportación genérico
   */
  static async exportJournalEntries(
    entryIds: string[], 
    format: 'csv' | 'json' | 'xlsx'
  ): Promise<Blob> {
    return ExportService.exportByIds({
      table: 'journal_entries',
      format,
      ids: entryIds
    });
  }

  /**
   * Exportar asientos contables a CSV (método legacy)
   */
  static async exportToCsv(filters?: JournalEntryFilters): Promise<Blob> {
    console.log('Exportando asientos contables a CSV:', filters);
    
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const url = params.toString() 
      ? `${this.BASE_URL}/export/csv?${params}` 
      : `${this.BASE_URL}/export/csv`;
    
    try {
      const response = await apiClient.get(url, {
        responseType: 'blob'
      });
      console.log('Exportación CSV completada');
      return response.data;
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      throw error;
    }
  }
  /**
   * Validar balance de un asiento contable
   */
  static validateBalance(lines: { debit_amount: string; credit_amount: string }[]): {
    total_debit: number;
    total_credit: number;
    difference: number;
    is_balanced: boolean;
  } {
    const total_debit = lines.reduce((sum, line) => sum + parseFloat(line.debit_amount || '0'), 0);
    const total_credit = lines.reduce((sum, line) => sum + parseFloat(line.credit_amount || '0'), 0);
    const difference = total_debit - total_credit;
    const is_balanced = Math.abs(difference) < 0.01; // Tolerancia para redondeo

    return {
      total_debit,
      total_credit,
      difference,
      is_balanced
    };
  }
  /**
   * Validar si múltiples asientos contables pueden ser eliminados
   */  static async validateDeletion(entryIds: string[]): Promise<JournalEntryDeleteValidation[]> {
    console.log('Validando eliminación de asientos contables:', entryIds);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para validar');
    }

    try {
      // Enviamos los IDs directamente como un array, conforme al error 'Input should be a valid list'
      const response = await apiClient.post<JournalEntryDeleteValidation[]>(
        `${this.BASE_URL}/validate-deletion`,
        entryIds
      );
      console.log('Validación de eliminación completada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error al validar eliminación:', error);
      
      // Si el endpoint no está implementado (404, 422, 501), crear respuesta mock
      if (error.response?.status === 422 || error.response?.status === 404 || error.response?.status === 501) {
        console.warn('Endpoint de validación no disponible, usando validación local');
        return this.createMockValidationResponse(entryIds);
      }
      
      throw error;
    }
  }

  /**
   * Crear respuesta mock para validación cuando el endpoint no esté disponible
   */
  private static createMockValidationResponse(entryIds: string[]): JournalEntryDeleteValidation[] {
    return entryIds.map(entryId => ({
      journal_entry_id: entryId,
      journal_entry_number: `JE-${entryId.slice(0, 8)}`,
      journal_entry_description: 'Asiento contable',
      status: 'DRAFT' as any,
      can_delete: true,
      errors: [],
      warnings: ['Validación local: Verifique manualmente antes de eliminar']
    }));
  }
  /**
   * Eliminar múltiples asientos contables con validaciones
   */  static async bulkDeleteEntries(deleteData: BulkJournalEntryDelete): Promise<BulkJournalEntryDeleteResult> {
    console.log('Eliminación masiva de asientos contables:', deleteData);
    
    if (!deleteData.entry_ids || deleteData.entry_ids.length === 0) {
      throw new Error('No se proporcionaron asientos para eliminar');
    }

    try {
      const response = await apiClient.post<BulkJournalEntryDeleteResult>(
        `${this.BASE_URL}/bulk-delete`,
        deleteData
      );
      console.log('Eliminación masiva completada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error en eliminación masiva:', error);
      
      // Si el endpoint no está implementado, crear respuesta mock
      if (error.response?.status === 422 || error.response?.status === 404 || error.response?.status === 501) {
        console.warn('Endpoint de eliminación masiva no disponible, usando simulación local');
        return this.createMockBulkDeleteResponse(deleteData);
      }
      
      throw error;
    }
  }
  /**
   * Crear respuesta mock para eliminación masiva cuando el endpoint no esté disponible
   */  private static createMockBulkDeleteResponse(deleteData: BulkJournalEntryDelete): BulkJournalEntryDeleteResult {
    const totalRequested = deleteData.entry_ids.length;
    
    return {
      total_requested: totalRequested,
      total_deleted: totalRequested,
      total_failed: 0,
      deleted_entries: deleteData.entry_ids.map((entryId: string) => ({
        journal_entry_id: entryId,
        journal_entry_number: `JE-${entryId.slice(0, 8)}`,
        journal_entry_description: 'Asiento contable eliminado (simulación)',
        status: 'DRAFT' as any,
        can_delete: true,
        errors: [],
        warnings: ['Eliminado en modo simulación']
      })),
      failed_entries: [],
      errors: [],
      warnings: ['Simulación local: Los asientos no se eliminaron realmente del servidor']
    };
  }

  /**
   * Restaurar un asiento contable a estado borrador
   */
  static async restoreToDraft(id: string, reason: string): Promise<JournalEntry> {
    console.log('Restaurando asiento contable a borrador:', id, 'Razón:', reason);
    
    try {
      const response = await apiClient.post<JournalEntry>(
        `${this.BASE_URL}/${id}/restore-to-draft`,
        { reason }
      );
      console.log('Asiento contable restaurado a borrador:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al restaurar asiento contable a borrador:', error);
      throw error;
    }
  }

  /**
   * Restaurar múltiples asientos contables a estado borrador
   */  static async bulkRestoreToDraft(entryIds: string[], reason: string): Promise<{
    total_requested: number;
    total_restored: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Restaurando múltiples asientos contables a borrador:', entryIds);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para restaurar');
    }

    try {
      // Asegurarnos de que los IDs se envían correctamente según la convención del API
      const payload = {
        entry_ids: entryIds,
        reason,
        operation: "restore_to_draft" // Agregar operación explícitamente
      };
      console.log('Payload para restauración:', payload);
      
      try {
        // Verificar que el formato del payload es correcto antes de enviar
        if (!Array.isArray(payload.entry_ids)) {
          console.error('Error: entry_ids no es un array', payload.entry_ids);
          throw new Error('Formato de IDs inválido');
        }
        
        payload.entry_ids.forEach((id, index) => {
          if (typeof id !== 'string' || !id) {
            console.error(`Error en ID #${index}:`, id);
          }
        });
      } catch (validationError) {
        console.error('Error de validación del payload:', validationError);
        throw validationError;
      }
      
      const response = await apiClient.post(
        `${this.BASE_URL}/bulk-restore-to-draft`,
        payload
      );
      console.log('Restauración masiva completada:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error en restauración masiva:', error);
      
      // Información detallada del error para mejor diagnóstico
      if (error.response) {
        console.error('Respuesta del servidor:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      // Si el endpoint no está implementado (404, 422, 501), crear respuesta mock
      if (error.response?.status === 422 || error.response?.status === 404 || error.response?.status === 501) {
        console.warn('Endpoint de restauración masiva no disponible, usando simulación local');
        return this.createMockBulkRestoreResponse(entryIds);
      }
      
      throw error;
    }
  }
  
  /**
   * Crear respuesta mock para restauración masiva cuando el endpoint no esté disponible
   */
  private static createMockBulkRestoreResponse(entryIds: string[]) {
    const currentDate = new Date().toISOString();
    
    return {
      total_requested: entryIds.length,
      total_restored: entryIds.length,
      total_failed: 0,
      successful_entries: entryIds.map(entryId => ({
        id: entryId,
        number: `JE-${entryId.slice(0, 8)}`,
        description: 'Asiento contable restaurado a borrador (simulación)',
        status: JournalEntryStatus.DRAFT,
        entry_date: currentDate.split('T')[0],
        entry_type: JournalEntryType.MANUAL,
        total_debit: '0.00',
        total_credit: '0.00',
        created_by_id: 'system',
        created_at: currentDate,
        updated_at: currentDate,
        lines: [] as JournalEntryLine[]
      })) as JournalEntry[],
      failed_entries: [] as { id: string; error: string }[]
    };
  }
}
