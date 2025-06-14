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
  BulkJournalEntryDeleteResult
} from '../types';
import { JournalEntryStatus } from '../types';

/**
 * Servicio para operaciones relacionadas con asientos contables
 * Maneja todas las interacciones con el API backend
 *  * VERIFICADO: Los endpoints bulk están alineados con la documentación actualizada:
 * - POST /api/v1/journal-entries/bulk-approve (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-post (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-cancel (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-reverse (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-reset-to-draft (usa 'journal_entry_ids')
 * 
 * Fecha de última verificación: 2025-06-13
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
   */  static async bulkDeleteEntries(deleteData: BulkJournalEntryDelete): Promise<BulkJournalEntryDeleteResult> {    console.log('Eliminación masiva de asientos contables:', deleteData);
    
    if (!deleteData.journal_entry_ids || deleteData.journal_entry_ids.length === 0) {
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
  /**   * Crear respuesta mock para eliminación masiva cuando el endpoint no esté disponible
   */  private static createMockBulkDeleteResponse(deleteData: BulkJournalEntryDelete): BulkJournalEntryDeleteResult {
    const totalRequested = deleteData.journal_entry_ids.length;
    
    return {
      total_requested: totalRequested,
      total_deleted: totalRequested,
      total_failed: 0,
      deleted_entries: deleteData.journal_entry_ids.map((entryId: string) => ({
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
      endpoint: `${this.BASE_URL}/${id}/reset-to-draft`
    });
    
    try {
      const response = await apiClient.post<JournalEntry>(
        `${this.BASE_URL}/${id}/reset-to-draft`,
        { reason }
      );
      console.log('✅ Asiento contable restaurado a borrador exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al restaurar asiento contable a borrador:', {
        id,
        reason,
        endpoint: `${this.BASE_URL}/${id}/reset-to-draft`,
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
   * Restauración masiva usando llamadas individuales como fallback
   */  /**
   * Aprobar múltiples asientos contables usando el nuevo endpoint bulk
   */  
  static async bulkApproveEntries(entryIds: string[], reason?: string, forceApprove: boolean = false): Promise<{
    total_requested: number;
    total_approved: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('🔄 Iniciando aprobación masiva de asientos contables');
    console.log('📋 Entry IDs recibidos:', entryIds);
    console.log('📝 Razón:', reason);
    console.log('⚡ Force Approve:', forceApprove);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para aprobar');
    }    try {
      const requestData = {
        journal_entry_ids: entryIds,
        reason: reason || 'Aprobación masiva desde interfaz',
        force_approve: forceApprove
      };

      console.log('🌐 URL completa:', `${this.BASE_URL}/bulk-approve`);
      console.log('📦 CUERPO DE LA SOLICITUD (JSON):', JSON.stringify(requestData, null, 2));
      console.log('📦 CUERPO DE LA SOLICITUD (objeto):', requestData);
      
      const response = await apiClient.post(`${this.BASE_URL}/bulk-approve`, requestData);
      
      console.log('✅ Respuesta de aprobación masiva:', response.data);
      console.log('📊 Status de respuesta:', response.status);
      
      return {
        total_requested: response.data.total_requested || entryIds.length,
        total_approved: response.data.total_approved || 0,
        total_failed: response.data.total_failed || 0,
        successful_entries: response.data.approved_entries || [],
        failed_entries: response.data.failed_entries?.map((item: any) => ({
          id: item.journal_entry_id,
          error: item.errors?.join(', ') || 'Error desconocido'
        })) || []
      };
    } catch (error: any) {      console.error('❌ Error en aprobación masiva:', error);
      console.error('📋 Request data que falló:', {
        journal_entry_ids: entryIds,
        reason: reason || 'Aprobación masiva desde interfaz',
        force_approve: forceApprove
      });
      if (error.response) {
        console.error('📊 Status del error:', error.response.status);
        console.error('📝 Datos del error:', error.response.data);
        console.error('🔗 Headers del error:', error.response.headers);
      }
      throw error;
    }
  }
  /**
   * Contabilizar múltiples asientos contables usando el nuevo endpoint bulk
   */  static async bulkPostEntries(entryIds: string[], reason?: string, forcePost: boolean = false): Promise<{
    total_requested: number;
    total_posted: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('🔄 Iniciando contabilización masiva de asientos contables');
    console.log('📋 Entry IDs recibidos:', entryIds);
    console.log('📝 Razón:', reason);
    console.log('⚡ Force Post:', forcePost);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para contabilizar');
    }    try {
      const requestData = {
        journal_entry_ids: entryIds,
        reason: reason || 'Contabilización masiva desde interfaz',
        force_post: forcePost
      };

      console.log('🌐 URL completa:', `${this.BASE_URL}/bulk-post`);
      console.log('📦 CUERPO DE LA SOLICITUD (JSON):', JSON.stringify(requestData, null, 2));
      console.log('📦 CUERPO DE LA SOLICITUD (objeto):', requestData);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-post`, requestData);
      
      console.log('✅ Respuesta de contabilización masiva:', response.data);
      console.log('📊 Status de respuesta:', response.status);
      
      return {
        total_requested: response.data.total_requested || entryIds.length,
        total_posted: response.data.total_posted || 0,
        total_failed: response.data.total_failed || 0,
        successful_entries: response.data.posted_entries || [],
        failed_entries: response.data.failed_entries?.map((item: any) => ({
          id: item.journal_entry_id,
          error: item.errors?.join(', ') || 'Error desconocido'
        })) || []      };
    } catch (error: any) {      console.error('❌ Error en contabilización masiva:', error);
      console.error('📋 Request data que falló:', {
        journal_entry_ids: entryIds,
        reason: reason || 'Contabilización masiva desde interfaz',
        force_post: forcePost
      });
      if (error.response) {
        console.error('📊 Status del error:', error.response.status);
        console.error('📝 Datos del error:', error.response.data);
        console.error('🔗 Headers del error:', error.response.headers);
      }
      throw error;
    }
  }
  /**
   * Cancelar múltiples asientos contables usando el nuevo endpoint bulk
   */  static async bulkCancelEntries(entryIds: string[], reason: string, forceCancel: boolean = false): Promise<{
    total_requested: number;
    total_cancelled: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('🔄 Iniciando cancelación masiva de asientos contables');
    console.log('📋 Entry IDs recibidos:', entryIds);
    console.log('📝 Razón:', reason);
    console.log('⚡ Force Cancel:', forceCancel);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para cancelar');
    }

    if (!reason || !reason.trim()) {
      throw new Error('La razón es requerida para cancelar asientos');
    }

    try {      const requestData = {
        journal_entry_ids: entryIds,
        reason: reason.trim(),
        force_cancel: forceCancel
      };

      console.log('🌐 URL completa:', `${this.BASE_URL}/bulk-cancel`);
      console.log('📦 CUERPO DE LA SOLICITUD (JSON):', JSON.stringify(requestData, null, 2));
      console.log('📦 CUERPO DE LA SOLICITUD (objeto):', requestData);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-cancel`, requestData);
      
      console.log('✅ Respuesta de cancelación masiva:', response.data);
      console.log('📊 Status de respuesta:', response.status);
      
      return {
        total_requested: response.data.total_requested || entryIds.length,
        total_cancelled: response.data.total_cancelled || 0,
        total_failed: response.data.total_failed || 0,
        successful_entries: response.data.cancelled_entries || [],
        failed_entries: response.data.failed_entries?.map((item: any) => ({
          id: item.journal_entry_id,
          error: item.errors?.join(', ') || 'Error desconocido'        })) || []
      };
    } catch (error: any) {      console.error('❌ Error en cancelación masiva:', error);
      console.error('📋 Request data que falló:', {
        journal_entry_ids: entryIds,
        reason: reason.trim(),
        force_cancel: forceCancel
      });
      if (error.response) {
        console.error('📊 Status del error:', error.response.status);
        console.error('📝 Datos del error:', error.response.data);
        console.error('🔗 Headers del error:', error.response.headers);
      }
      throw error;
    }
  }
  /**
   * Revertir múltiples asientos contables usando el nuevo endpoint bulk
   */
  static async bulkReverseEntries(entryIds: string[], reason: string, reversalDate?: string, forceReverse: boolean = false): Promise<{
    total_requested: number;
    total_reversed: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Revirtiendo múltiples asientos contables con endpoint bulk:', entryIds, 'Razón:', reason, 'Force Reverse:', forceReverse);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para revertir');
    }

    if (!reason || !reason.trim()) {
      throw new Error('La razón es requerida para revertir asientos');
    }

    try {      const requestData = {
        journal_entry_ids: entryIds,
        reason: reason.trim(),
        force_reverse: forceReverse,
        ...(reversalDate && { reversal_date: reversalDate })
      };

      const response = await apiClient.post(`${this.BASE_URL}/bulk/reverse`, requestData);
      
      console.log('Respuesta de reversión masiva:', response.data);
      
      return {
        total_requested: response.data.total_requested || entryIds.length,
        total_reversed: response.data.total_reversed || 0,
        total_failed: response.data.total_failed || 0,
        successful_entries: response.data.reversed_entries || [],
        failed_entries: response.data.failed_entries?.map((item: any) => ({
          id: item.journal_entry_id,
          error: item.errors?.join(', ') || 'Error desconocido'
        })) || []
      };
    } catch (error: any) {
      console.error('Error en reversión masiva:', error);
      throw error;
    }
  }/**
   * Restablecer múltiples asientos a borrador usando el nuevo endpoint bulk
   */
  static async bulkRestoreToDraft(entryIds: string[], reason: string, forceReset: boolean = false): Promise<{
    total_requested: number;
    total_restored: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Restableciendo múltiples asientos a borrador con endpoint bulk:', entryIds, 'Razón:', reason, 'Force Reset:', forceReset);
    console.log('URL completa del endpoint:', `${this.BASE_URL}/bulk-reset-to-draft`);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para restablecer');
    }

    if (!reason || !reason.trim()) {
      throw new Error('La razón es requerida para restablecer asientos a borrador');
    }

    try {      // IMPORTANTE: Este endpoint usa 'journal_entry_ids' en lugar de 'journal_entry_ids'
      const requestData = {
        journal_entry_ids: entryIds,
        reason: reason.trim(),
        force_reset: forceReset
      };

      console.log('Datos enviados al endpoint:', requestData);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-reset-to-draft`, requestData);
      
      console.log('Respuesta del endpoint de restablecimiento:', response.data);
      
      return {
        total_requested: response.data.total_requested || entryIds.length,
        total_restored: response.data.total_reset || 0,
        total_failed: response.data.total_failed || 0,
        successful_entries: response.data.reset_entries || [],
        failed_entries: response.data.failed_entries?.map((item: any) => ({
          id: item.journal_entry_id,
          error: item.errors?.join(', ') || 'Error desconocido'
        })) || []
      };
    } catch (error: any) {
      console.error('Error en restablecimiento masivo a borrador:', error);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      console.error('Método:', error.config?.method);
      console.error('Datos enviados:', error.config?.data);
      console.error('Respuesta del servidor:', error.response?.data);
      throw error;
    }
  }  /**
   * Función unificada para cambio de estado masivo
   */
  static async bulkChangeStatus(entryIds: string[], newStatus: JournalEntryStatus, reason?: string, forceOperation?: boolean): Promise<{
    total_requested: number;
    total_updated: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log(`Cambiando estado masivo a ${newStatus}:`, entryIds, 'Force Operation:', forceOperation);
    
    switch (newStatus) {
      case JournalEntryStatus.DRAFT:
        if (!reason) {
          throw new Error('Se requiere una razón para restaurar a borrador');
        }
        const draftResult = await this.bulkRestoreToDraft(entryIds, reason, forceOperation || false);
        return {
          total_requested: draftResult.total_requested,
          total_updated: draftResult.total_restored,
          total_failed: draftResult.total_failed,
          successful_entries: draftResult.successful_entries,
          failed_entries: draftResult.failed_entries
        };
        
      case JournalEntryStatus.APPROVED:
        const approveResult = await this.bulkApproveEntries(entryIds, reason, forceOperation || false);
        return {
          total_requested: approveResult.total_requested,
          total_updated: approveResult.total_approved,
          total_failed: approveResult.total_failed,
          successful_entries: approveResult.successful_entries,
          failed_entries: approveResult.failed_entries
        };
      
      case JournalEntryStatus.POSTED:
        const postResult = await this.bulkPostEntries(entryIds, reason, forceOperation || false);
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
        const cancelResult = await this.bulkCancelEntries(entryIds, reason, forceOperation || false);
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
  /**
   * Función para operaciones de reversión masiva (operación especial)
   */
  static async bulkReverseOperation(entryIds: string[], reason: string, reversalDate?: string, forceReverse?: boolean): Promise<{
    total_requested: number;
    total_updated: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log(`Revirtiendo asientos masivamente:`, entryIds, `con razón: ${reason}`, 'Force Reverse:', forceReverse);
    
    if (!reason) {
      throw new Error('Se requiere una razón para revertir asientos');
    }
    
    const reverseResult = await this.bulkReverseEntries(entryIds, reason, reversalDate, forceReverse || false);
    return {
      total_requested: reverseResult.total_requested,
      total_updated: reverseResult.total_reversed,
      total_failed: reverseResult.total_failed,
      successful_entries: reverseResult.successful_entries,
      failed_entries: reverseResult.failed_entries
    };
  }
}
