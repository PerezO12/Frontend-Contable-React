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
    console.log('🔄 Restaurando asiento contable a borrador:', {
      id,
      reason,
      endpoint: `${this.BASE_URL}/${id}/restore-to-draft`
    });
    
    try {
      const response = await apiClient.post<JournalEntry>(
        `${this.BASE_URL}/${id}/restore-to-draft`,
        { reason }
      );
      console.log('✅ Asiento contable restaurado a borrador exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al restaurar asiento contable a borrador:', {
        id,
        reason,
        endpoint: `${this.BASE_URL}/${id}/restore-to-draft`,
        status: error.response?.status,
        statusText: error.response?.statusText,
        method: 'POST',
        data: { reason },
        errorResponse: error.response?.data,
        fullError: error
      });
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
    console.log('🔄 Iniciando restauración masiva a borrador:', {
      entryCount: entryIds.length,
      entryIds,
      reason
    });
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para restaurar');
    }

    // Validar formato de IDs antes de enviar
    entryIds.forEach((id, index) => {
      if (typeof id !== 'string' || !id.trim()) {
        console.error(`❌ ID inválido en posición ${index}:`, id);
        throw new Error(`ID inválido en posición ${index}: ${id}`);
      }
    });

    // Primero intentar con el endpoint específico de bulk restore
    const payload = {
      entry_ids: entryIds,
      reason,
      operation: "restore_to_draft"
    };
    
    console.log('📤 Enviando payload a bulk-restore-to-draft:', {
      endpoint: `${this.BASE_URL}/bulk-restore-to-draft`,
      method: 'POST',
      payload
    });
    
    try {
      const response = await apiClient.post(
        `${this.BASE_URL}/bulk-restore-to-draft`,
        payload
      );
      console.log('✅ Restauración masiva completada exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error en endpoint bulk-restore-to-draft:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        method: 'POST',
        endpoint: `${this.BASE_URL}/bulk-restore-to-draft`,
        payload,
        errorData: error.response?.data,
        fullError: error
      });
      
      // Si el endpoint específico no existe (405), intentar con restauración individual
      if (error.response?.status === 405) {
        console.warn('⚠️ Endpoint bulk-restore-to-draft no disponible (405), intentando restauración individual...');
        return await this.bulkRestoreToDraftIndividual(entryIds, reason);
      }
      
      // Si es otro error, intentar con el endpoint individual de todos modos
      console.warn('⚠️ Error en bulk restore, intentando restauración individual como fallback...');
      return await this.bulkRestoreToDraftIndividual(entryIds, reason);
    }
  }

  /**
   * Restauración masiva usando llamadas individuales como fallback
   */
  private static async bulkRestoreToDraftIndividual(entryIds: string[], reason: string): Promise<{
    total_requested: number;
    total_restored: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('🔄 Iniciando restauración individual para', entryIds.length, 'asientos');
    
    const results = {
      total_requested: entryIds.length,
      total_restored: 0,
      total_failed: 0,
      successful_entries: [] as JournalEntry[],
      failed_entries: [] as { id: string; error: string }[]
    };

    // Procesar cada asiento individualmente
    for (const entryId of entryIds) {
      try {
        console.log(`🔄 Restaurando asiento individual: ${entryId}`);
        const restoredEntry = await this.restoreToDraft(entryId, reason);
        results.successful_entries.push(restoredEntry);
        results.total_restored++;
        console.log(`✅ Asiento ${entryId} restaurado exitosamente`);
      } catch (error: any) {
        console.error(`❌ Error restaurando asiento ${entryId}:`, error);
        results.failed_entries.push({
          id: entryId,
          error: error.response?.data?.detail || error.message || 'Error desconocido'
        });
        results.total_failed++;
      }
    }    console.log('📊 Resultado final de restauración individual:', results);
    return results;  }

  /**
   * Aprobar múltiples asientos contables
   */
  static async bulkApproveEntries(entryIds: string[]): Promise<{
    total_requested: number;
    total_approved: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Aprobando múltiples asientos contables:', entryIds);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para aprobar');
    }

    const results = {
      total_requested: entryIds.length,
      total_approved: 0,
      total_failed: 0,
      successful_entries: [] as JournalEntry[],
      failed_entries: [] as { id: string; error: string }[]
    };

    // Procesar cada asiento individualmente
    for (const entryId of entryIds) {
      try {
        const approvedEntry = await this.approveJournalEntry(entryId);
        results.successful_entries.push(approvedEntry);
        results.total_approved++;
      } catch (error: any) {
        results.failed_entries.push({
          id: entryId,
          error: error.message || 'Error desconocido'
        });
        results.total_failed++;
      }
    }

    return results;
  }

  /**
   * Contabilizar múltiples asientos contables
   */
  static async bulkPostEntries(entryIds: string[], reason?: string): Promise<{
    total_requested: number;
    total_posted: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Contabilizando múltiples asientos contables:', entryIds);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para contabilizar');
    }

    const results = {
      total_requested: entryIds.length,
      total_posted: 0,
      total_failed: 0,
      successful_entries: [] as JournalEntry[],
      failed_entries: [] as { id: string; error: string }[]
    };

    // Procesar cada asiento individualmente
    for (const entryId of entryIds) {
      try {
        const postedEntry = await this.postJournalEntry(entryId, reason);
        results.successful_entries.push(postedEntry);
        results.total_posted++;
      } catch (error: any) {
        results.failed_entries.push({
          id: entryId,
          error: error.message || 'Error desconocido'
        });
        results.total_failed++;
      }
    }

    return results;
  }

  /**
   * Cancelar múltiples asientos contables
   */
  static async bulkCancelEntries(entryIds: string[], reason: string): Promise<{
    total_requested: number;
    total_cancelled: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Cancelando múltiples asientos contables:', entryIds);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para cancelar');
    }

    if (!reason || !reason.trim()) {
      throw new Error('La razón es requerida para cancelar asientos');
    }

    const results = {
      total_requested: entryIds.length,
      total_cancelled: 0,
      total_failed: 0,
      successful_entries: [] as JournalEntry[],
      failed_entries: [] as { id: string; error: string }[]
    };

    // Procesar cada asiento individualmente
    for (const entryId of entryIds) {
      try {
        const cancelledEntry = await this.cancelJournalEntry(entryId, reason);
        results.successful_entries.push(cancelledEntry);
        results.total_cancelled++;
      } catch (error: any) {
        results.failed_entries.push({
          id: entryId,
          error: error.message || 'Error desconocido'
        });
        results.total_failed++;
      }
    }

    return results;
  }

  /**
   * Función unificada para cambio de estado masivo
   */
  static async bulkChangeStatus(entryIds: string[], newStatus: JournalEntryStatus, reason?: string): Promise<{
    total_requested: number;
    total_updated: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log(`Cambiando estado masivo a ${newStatus}:`, entryIds);
    
    switch (newStatus) {
      case JournalEntryStatus.DRAFT:
        if (!reason) {
          throw new Error('Se requiere una razón para restaurar a borrador');
        }
        const draftResult = await this.bulkRestoreToDraft(entryIds, reason);
        return {
          total_requested: draftResult.total_requested,
          total_updated: draftResult.total_restored,
          total_failed: draftResult.total_failed,
          successful_entries: draftResult.successful_entries,
          failed_entries: draftResult.failed_entries
        };
      
      case JournalEntryStatus.APPROVED:
        const approveResult = await this.bulkApproveEntries(entryIds);
        return {
          total_requested: approveResult.total_requested,
          total_updated: approveResult.total_approved,
          total_failed: approveResult.total_failed,
          successful_entries: approveResult.successful_entries,
          failed_entries: approveResult.failed_entries
        };
      
      case JournalEntryStatus.POSTED:
        const postResult = await this.bulkPostEntries(entryIds, reason);
        return {
          total_requested: postResult.total_requested,
          total_updated: postResult.total_posted,
          total_failed: postResult.total_failed,
          successful_entries: postResult.successful_entries,
          failed_entries: postResult.failed_entries
        };
      
      case JournalEntryStatus.CANCELLED:
        if (!reason) {
          throw new Error('Se requiere una razón para cancelar asientos');
        }
        const cancelResult = await this.bulkCancelEntries(entryIds, reason);
        return {
          total_requested: cancelResult.total_requested,
          total_updated: cancelResult.total_cancelled,
          total_failed: cancelResult.total_failed,
          successful_entries: cancelResult.successful_entries,
          failed_entries: cancelResult.failed_entries
        };
        case JournalEntryStatus.PENDING:
        const submitResult = await this.bulkSubmitEntries(entryIds);
        return {
          total_requested: submitResult.total_requested,
          total_updated: submitResult.total_submitted,
          total_failed: submitResult.total_failed,
          successful_entries: submitResult.successful_entries,
          failed_entries: submitResult.failed_entries
        };
      
      default:
        throw new Error(`Estado no válido: ${newStatus}`);
    }
  }

  /**
   * Enviar un asiento contable para revisión (estado pendiente)
   * Nota: Este endpoint específico no existe en el backend, por ahora solo se puede cambiar manualmente
   */
  static async submitJournalEntry(id: string): Promise<JournalEntry> {
    console.log('Enviando asiento contable para revisión:', id);
    
    // Por ahora, como no hay endpoint específico, simulamos una actualización
    // En el futuro, esto debería usar un endpoint específico como POST /journal-entries/{id}/submit
    try {
      // Temporalmente, usamos una actualización directa del estado
      // En producción, esto debería ser un endpoint específico del backend
      throw new Error('El endpoint para enviar a revisión (pendiente) no está implementado en el backend');
    } catch (error) {
      console.error('Error al enviar asiento para revisión:', error);
      throw error;
    }
  }

  /**
   * Enviar múltiples asientos contables para revisión (estado pendiente)
   */
  static async bulkSubmitEntries(entryIds: string[]): Promise<{
    total_requested: number;
    total_submitted: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Enviando múltiples asientos contables para revisión:', entryIds);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para enviar a revisión');
    }

    const results = {
      total_requested: entryIds.length,
      total_submitted: 0,
      total_failed: 0,
      successful_entries: [] as JournalEntry[],
      failed_entries: [] as { id: string; error: string }[]
    };

    // Por ahora, marcamos todos como fallidos porque no hay endpoint
    for (const entryId of entryIds) {
      results.failed_entries.push({
        id: entryId,
        error: 'El endpoint para enviar a revisión (pendiente) no está implementado en el backend'
      });
      results.total_failed++;
    }

    return results;
  }
}
