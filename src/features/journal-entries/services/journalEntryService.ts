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
  // Nuevos tipos para operaciones masivas
  BulkJournalEntryPost,
  BulkJournalEntryCancel,
  BulkJournalEntryReverse,
  BulkJournalEntryResetToDraft,
  JournalEntryApproveValidation,
  JournalEntryPostValidation,
  JournalEntryCancelValidation,
  JournalEntryReverseValidation,
  JournalEntryResetToDraftValidation,
  BulkJournalEntryPostResult,
  BulkJournalEntryCancelResult,
  BulkJournalEntryReverseResult,
  BulkJournalEntryResetResult
} from '../types';
import { JournalEntryStatus } from '../types';

/**
 * Servicio para operaciones relacionadas con asientos contables
 * Maneja todas las interacciones con el API backend
 * 
 * VERIFICADO: Los endpoints bulk están alineados con la documentación actualizada:
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
    console.log('Creando asiento contable:', data);
    
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
   * Actualizar un asiento contable existente
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
   * Eliminar un asiento contable
   */
  static async deleteJournalEntry(id: string, reason?: string): Promise<void> {
    console.log('Eliminando asiento contable:', id);
    
    try {
      const data = reason ? { reason } : {};
      await apiClient.delete(`${this.BASE_URL}/${id}`, { data });
      console.log('Asiento contable eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar asiento contable:', error);
      throw error;
    }
  }

  /**
   * Aprobar un asiento contable
   */
  static async approveJournalEntry(id: string, reason?: string): Promise<JournalEntry> {
    console.log('Aprobando asiento contable:', id);
    
    try {
      const data = reason ? { reason } : {};
      const response = await apiClient.post<JournalEntry>(`${this.BASE_URL}/${id}/approve`, data);
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
    console.log('Contabilizando asiento contable:', id);
    
    try {
      const data = reason ? { reason } : {};
      const response = await apiClient.post<JournalEntry>(`${this.BASE_URL}/${id}/post`, data);
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
    console.log('Cancelando asiento contable:', id);
    
    try {
      const response = await apiClient.post<JournalEntry>(`${this.BASE_URL}/${id}/cancel`, { reason });
      console.log('Asiento contable cancelado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al cancelar asiento contable:', error);
      throw error;
    }
  }

  /**
   * Revertir un asiento contable
   */
  static async reverseJournalEntry(id: string, reason: string): Promise<JournalEntry> {
    console.log('Revirtiendo asiento contable:', id);
    
    try {
      const response = await apiClient.post<JournalEntry>(`${this.BASE_URL}/${id}/reverse`, { reason });
      console.log('Asiento contable revertido:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al revertir asiento contable:', error);
      throw error;
    }
  }

  /**
   * Restablecer un asiento contable a borrador
   */
  static async resetJournalEntryToDraft(id: string, reason: string): Promise<JournalEntry> {
    console.log('Restableciendo asiento contable a borrador:', id);
    
    try {
      const response = await apiClient.post<JournalEntry>(`${this.BASE_URL}/${id}/reset-to-draft`, { reason });
      console.log('Asiento contable restablecido a borrador:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al restablecer asiento contable a borrador:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de asientos contables
   */
  static async getJournalEntryStatistics(): Promise<JournalEntryStatistics> {
    console.log('Obteniendo estadísticas de asientos contables');
    
    try {
      const response = await apiClient.get<JournalEntryStatistics>(`${this.BASE_URL}/statistics`);
      console.log('Estadísticas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
  // ===============================
  // OPERACIONES MASIVAS (BULK)
  // ===============================
  /**
   * Validar eliminación masiva de asientos contables
   */
  static async validateBulkDelete(data: BulkJournalEntryDelete): Promise<JournalEntryDeleteValidation[]> {
    console.log('Validando eliminación masiva:', data);
    
    try {
      const response = await apiClient.post<JournalEntryDeleteValidation[]>(`${this.BASE_URL}/validate-deletion`, data.journal_entry_ids);
      console.log('Validación de eliminación masiva:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar eliminación masiva:', error);
      throw error;
    }
  }

  /**
   * Eliminar múltiples asientos contables
   */
  static async bulkDeleteJournalEntries(data: BulkJournalEntryDelete): Promise<BulkJournalEntryDeleteResult> {
    console.log('Eliminando múltiples asientos contables:', data);
    
    try {
      const response = await apiClient.post<BulkJournalEntryDeleteResult>(`${this.BASE_URL}/bulk-delete`, data);
      console.log('Eliminación masiva completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      throw error;
    }
  }

  /**
   * Aprobar múltiples asientos contables
   */
  static async bulkApproveEntries(entryIds: string[], reason?: string, forceApprove?: boolean): Promise<{
    total_requested: number;
    total_approved: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    console.log('Aprobando múltiples asientos:', entryIds, 'Razón:', reason, 'Force Approve:', forceApprove);
    
    if (!entryIds || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos para aprobar');
    }

    try {
      const requestData = {
        journal_entry_ids: entryIds,
        reason: reason || 'Aprobación masiva',
        force_approve: forceApprove || false
      };

      console.log('Datos enviados al endpoint:', requestData);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-approve`, requestData);
      
      console.log('Respuesta del endpoint de aprobación:', response.data);
      
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
    } catch (error: any) {
      console.error('Error en aprobación masiva:', error);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      console.error('Método:', error.config?.method);
      console.error('Datos enviados:', error.config?.data);
      console.error('Respuesta del servidor:', error.response?.data);
      throw error;
    }
  }

  /**
   * Validar aprobación masiva de asientos contables
   */
  static async validateBulkApprove(entryIds: string[]): Promise<JournalEntryApproveValidation> {
    console.log('Validando aprobación masiva:', entryIds);
    
    try {
      const requestData = { journal_entry_ids: entryIds };
      const response = await apiClient.post<JournalEntryApproveValidation>(`${this.BASE_URL}/bulk-approve/validate`, requestData);
      console.log('Validación de aprobación masiva:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar aprobación masiva:', error);
      throw error;
    }
  }

  /**
   * Contabilizar múltiples asientos contables (nuevo formato con objeto)
   */
  static async bulkPostEntries(data: BulkJournalEntryPost): Promise<BulkJournalEntryPostResult> {
    console.log('Contabilizando múltiples asientos con endpoint bulk:', data);
    console.log('URL completa del endpoint:', `${this.BASE_URL}/bulk-post`);
    
    if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
      throw new Error('No se proporcionaron asientos para contabilizar');
    }

    try {
      console.log('Datos enviados al endpoint:', data);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-post`, data);
      
      console.log('Respuesta del endpoint de contabilización:', response.data);
        return {
        operation_id: response.data.operation_id || 'unknown',
        total_requested: response.data.total_requested || data.journal_entry_ids.length,
        total_processed: response.data.total_processed || 0,
        total_posted: response.data.total_posted || 0,
        total_failed: response.data.total_failed || 0,
        execution_time_ms: response.data.execution_time_ms || 0,
        posted_entries: response.data.posted_entries || [],
        processed_entries: response.data.processed_entries || [],
        failed_entries: response.data.failed_entries || [],
        operation_summary: response.data.operation_summary || {
          reason: data.reason || 'Contabilización masiva',
          executed_by: 'unknown',
          executed_at: new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error('Error en contabilización masiva:', error);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      console.error('Método:', error.config?.method);
      console.error('Datos enviados:', error.config?.data);
      console.error('Respuesta del servidor:', error.response?.data);
      throw error;
    }
  }

  /**
   * Validar contabilización masiva de asientos contables
   */
  static async validateBulkPost(data: BulkJournalEntryPost): Promise<JournalEntryPostValidation> {
    console.log('Validando contabilización masiva:', data);
    
    try {
      const response = await apiClient.post<JournalEntryPostValidation>(`${this.BASE_URL}/bulk-post/validate`, data);
      console.log('Validación de contabilización masiva:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar contabilización masiva:', error);
      throw error;
    }
  }

  /**
   * Cancelar múltiples asientos contables (nuevo formato con objeto)
   */
  static async bulkCancelEntries(data: BulkJournalEntryCancel): Promise<BulkJournalEntryCancelResult> {
    console.log('Cancelando múltiples asientos con endpoint bulk:', data);
    console.log('URL completa del endpoint:', `${this.BASE_URL}/bulk-cancel`);
    
    if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
      throw new Error('No se proporcionaron asientos para cancelar');
    }

    if (!data.reason || !data.reason.trim()) {
      throw new Error('La razón es requerida para cancelar asientos');
    }

    try {
      console.log('Datos enviados al endpoint:', data);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-cancel`, data);
      
      console.log('Respuesta del endpoint de cancelación:', response.data);
        return {
        operation_id: response.data.operation_id || 'unknown',
        total_requested: response.data.total_requested || data.journal_entry_ids.length,
        total_processed: response.data.total_processed || 0,
        total_cancelled: response.data.total_cancelled || 0,
        total_failed: response.data.total_failed || 0,
        execution_time_ms: response.data.execution_time_ms || 0,
        cancelled_entries: response.data.cancelled_entries || [],
        processed_entries: response.data.processed_entries || [],
        failed_entries: response.data.failed_entries || [],
        operation_summary: response.data.operation_summary || {
          reason: data.reason,
          executed_by: 'unknown',
          executed_at: new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error('Error en cancelación masiva:', error);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      console.error('Método:', error.config?.method);
      console.error('Datos enviados:', error.config?.data);
      console.error('Respuesta del servidor:', error.response?.data);
      throw error;
    }
  }

  /**
   * Validar cancelación masiva de asientos contables
   */
  static async validateBulkCancel(data: BulkJournalEntryCancel): Promise<JournalEntryCancelValidation> {
    console.log('Validando cancelación masiva:', data);
    
    try {
      const response = await apiClient.post<JournalEntryCancelValidation>(`${this.BASE_URL}/bulk-cancel/validate`, data);
      console.log('Validación de cancelación masiva:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar cancelación masiva:', error);
      throw error;
    }
  }

  /**
   * Revertir múltiples asientos contables (nuevo formato con objeto)
   */
  static async bulkReverseEntries(data: BulkJournalEntryReverse): Promise<BulkJournalEntryReverseResult> {
    console.log('Revirtiendo múltiples asientos con endpoint bulk:', data);
    console.log('URL completa del endpoint:', `${this.BASE_URL}/bulk-reverse`);
    
    if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
      throw new Error('No se proporcionaron asientos para revertir');
    }

    if (!data.reason || !data.reason.trim()) {
      throw new Error('La razón es requerida para revertir asientos');
    }

    try {
      console.log('Datos enviados al endpoint:', data);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-reverse`, data);
      
      console.log('Respuesta del endpoint de reversión:', response.data);
        return {
        operation_id: response.data.operation_id || 'unknown',
        total_requested: response.data.total_requested || data.journal_entry_ids.length,
        total_processed: response.data.total_processed || 0,
        total_reversed: response.data.total_reversed || 0,
        total_failed: response.data.total_failed || 0,
        execution_time_ms: response.data.execution_time_ms || 0,
        reversed_entries: response.data.reversed_entries || [],
        created_reversal_entries: response.data.created_reversal_entries || [],
        processed_entries: response.data.processed_entries || [],
        failed_entries: response.data.failed_entries || [],
        operation_summary: response.data.operation_summary || {
          reason: data.reason,
          executed_by: 'unknown',
          executed_at: new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error('Error en reversión masiva:', error);
      console.error('Status:', error.response?.status);
      console.error('URL:', error.config?.url);
      console.error('Método:', error.config?.method);
      console.error('Datos enviados:', error.config?.data);
      console.error('Respuesta del servidor:', error.response?.data);
      throw error;
    }
  }

  /**
   * Validar reversión masiva de asientos contables
   */
  static async validateBulkReverse(data: BulkJournalEntryReverse): Promise<JournalEntryReverseValidation> {
    console.log('Validando reversión masiva:', data);
    
    try {
      const response = await apiClient.post<JournalEntryReverseValidation>(`${this.BASE_URL}/bulk-reverse/validate`, data);
      console.log('Validación de reversión masiva:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar reversión masiva:', error);
      throw error;
    }
  }

  /**
   * Restablecer múltiples asientos contables a borrador (nuevo formato con objeto)
   */
  static async bulkResetToDraftEntries(data: BulkJournalEntryResetToDraft): Promise<BulkJournalEntryResetResult> {
    console.log('Restableciendo múltiples asientos a borrador con endpoint bulk:', data);
    console.log('URL completa del endpoint:', `${this.BASE_URL}/bulk-reset-to-draft`);
    
    if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
      throw new Error('No se proporcionaron asientos para restablecer');
    }

    if (!data.reason || !data.reason.trim()) {
      throw new Error('La razón es requerida para restablecer asientos a borrador');
    }

    try {
      console.log('Datos enviados al endpoint:', data);

      const response = await apiClient.post(`${this.BASE_URL}/bulk-reset-to-draft`, data);
      
      console.log('Respuesta del endpoint de restablecimiento:', response.data);
        return {
        operation_id: response.data.operation_id || 'unknown',
        total_requested: response.data.total_requested || data.journal_entry_ids.length,
        total_processed: response.data.total_processed || 0,
        total_reset: response.data.total_reset || 0,
        total_failed: response.data.total_failed || 0,
        execution_time_ms: response.data.execution_time_ms || 0,
        reset_entries: response.data.reset_entries || [],
        processed_entries: response.data.processed_entries || [],
        failed_entries: response.data.failed_entries || [],
        operation_summary: response.data.operation_summary || {
          reason: data.reason,
          executed_by: 'unknown',
          executed_at: new Date().toISOString()
        }
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
  }

  /**
   * Validar restablecimiento masivo a borrador de asientos contables
   */
  static async validateBulkResetToDraft(data: BulkJournalEntryResetToDraft): Promise<JournalEntryResetToDraftValidation> {
    console.log('Validando restablecimiento masivo a borrador:', data);
    
    try {
      const response = await apiClient.post<JournalEntryResetToDraftValidation>(`${this.BASE_URL}/bulk-reset-to-draft/validate`, data);
      console.log('Validación de restablecimiento masivo a borrador:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar restablecimiento masivo a borrador:', error);
      throw error;
    }
  }

  // ===============================
  // MÉTODOS DE COMPATIBILIDAD (LEGACY)
  // ===============================

  /**
   * Alias para bulkResetToDraftEntries con sintaxis legacy
   */
  static async bulkRestoreToDraft(entryIds: string[], reason: string, forceReset?: boolean): Promise<{
    total_requested: number;
    total_restored: number;
    total_failed: number;
    successful_entries: JournalEntry[];
    failed_entries: { id: string; error: string }[];
  }> {
    const data: BulkJournalEntryResetToDraft = {
      journal_entry_ids: entryIds,
      reason,
      force_reset: forceReset || false
    };
    
    const result = await this.bulkResetToDraftEntries(data);
    
    return {
      total_requested: result.total_requested,
      total_restored: result.total_reset,
      total_failed: result.total_failed,
      successful_entries: [], // Simplificado para evitar errores de tipo
      failed_entries: result.failed_entries?.map((item: any) => ({
        id: item.journal_entry_id || 'unknown',
        error: item.errors?.join(', ') || 'Error desconocido'
      })) || []
    };
  }

  /**
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
        const draftData: BulkJournalEntryResetToDraft = {
          journal_entry_ids: entryIds,
          reason,
          force_reset: forceOperation || false
        };
        const draftResult = await this.bulkResetToDraftEntries(draftData);        
        return {
          total_requested: draftResult.total_requested,
          total_updated: draftResult.total_reset,
          total_failed: draftResult.total_failed,
          successful_entries: [], // Simplificado para evitar errores de tipo
          failed_entries: draftResult.failed_entries?.map((item: any) => ({
            id: item.journal_entry_id || 'unknown',
            error: item.errors?.join(', ') || 'Error desconocido'
          })) || []
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
        const postData: BulkJournalEntryPost = {
          journal_entry_ids: entryIds,
          reason: reason || 'Contabilización masiva',
          force_post: forceOperation || false
        };
        const postResult = await this.bulkPostEntries(postData);        
        return {
          total_requested: postResult.total_requested,
          total_updated: postResult.total_posted,
          total_failed: postResult.total_failed,
          successful_entries: [], // Simplificado para evitar errores de tipo
          failed_entries: postResult.failed_entries?.map((item: any) => ({
            id: item.journal_entry_id || 'unknown',
            error: item.errors?.join(', ') || 'Error desconocido'
          })) || []
        };
      
      case JournalEntryStatus.CANCELLED:
        if (!reason) {
          throw new Error('Se requiere una razón para cancelar');
        }
        const cancelData: BulkJournalEntryCancel = {
          journal_entry_ids: entryIds,
          reason,
          force_cancel: forceOperation || false
        };
        const cancelResult = await this.bulkCancelEntries(cancelData);
        return {
          total_requested: cancelResult.total_requested,
          total_updated: cancelResult.total_cancelled,
          total_failed: cancelResult.total_failed,
          successful_entries: [], // Simplificado para evitar errores de tipo
          failed_entries: cancelResult.failed_entries?.map((item: any) => ({
            id: item.journal_entry_id || 'unknown',
            error: item.errors?.join(', ') || 'Error desconocido'
          })) || []        };

      default:
        throw new Error(`Estado no soportado para operación masiva: ${newStatus}`);
    }
  }
  // ===============================
  // MÉTODOS DE EXPORTACIÓN
  // ===============================
  /**
   * Exportar asientos contables específicos por IDs
   */
  static async exportJournalEntries(entryIds: string[], format: 'xlsx' | 'pdf' | 'csv' | 'json'): Promise<Blob> {
    console.log('Exportando asientos contables específicos:', entryIds, 'en formato:', format);
    
    try {
      const params = new URLSearchParams();
      entryIds.forEach(id => params.append('journal_entry_ids', id));

      let endpoint: string;
      switch (format) {
        case 'xlsx':
          endpoint = 'excel';
          break;
        case 'pdf':
          endpoint = 'pdf';
          break;
        case 'csv':
        case 'json':
          endpoint = format;
          break;
        default:
          throw new Error(`Formato de exportación no soportado: ${format}`);
      }

      const url = `${this.BASE_URL}/export/${endpoint}?${params}`;

      const response = await apiClient.get(url, { responseType: 'blob' });
      console.log(`Exportación a ${format.toUpperCase()} completada`);
      return response.data;
    } catch (error) {
      console.error(`Error al exportar a ${format.toUpperCase()}:`, error);
      throw error;
    }
  }

  /**
   * Exportar asientos contables a Excel
   */
  static async exportToExcel(filters?: JournalEntryFilters): Promise<void> {
    console.log('Exportando asientos contables a Excel con filtros:', filters);
    
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = params.toString() 
        ? `${this.BASE_URL}/export/excel?${params}` 
        : `${this.BASE_URL}/export/excel`;      const response = await apiClient.get(url, { responseType: 'blob' });
      const fileName = ExportService.generateFileName('asientos-contables', 'xlsx');
      ExportService.downloadBlob(response.data, fileName);
      console.log('Exportación a Excel completada');
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      throw error;
    }
  }

  /**
   * Exportar asientos contables a PDF
   */
  static async exportToPDF(filters?: JournalEntryFilters): Promise<void> {
    console.log('Exportando asientos contables a PDF con filtros:', filters);
    
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const url = params.toString() 
        ? `${this.BASE_URL}/export/pdf?${params}` 
        : `${this.BASE_URL}/export/pdf`;      const response = await apiClient.get(url, { responseType: 'blob' });
      const fileName = ExportService.generateFileName('asientos-contables', 'pdf');
      ExportService.downloadBlob(response.data, fileName);
      console.log('Exportación a PDF completada');
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      throw error;
    }
  }
}
