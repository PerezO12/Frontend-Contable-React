import { apiClient } from '../../../shared/api/client';
import { ExportService } from '../../../shared/services/exportService';
import type {
  JournalEntry,
  JournalEntryCreate,
  JournalEntryUpdate,
  JournalEntryFilters,
  JournalEntryListResponse,
  JournalEntryStatistics,
  JournalEntryOperationResponse
} from '../types';

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
      const response = await apiClient.get<JournalEntry>(`${this.BASE_URL}/by-number/${number}`);
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
  static async approveJournalEntry(id: string): Promise<JournalEntryOperationResponse> {
    console.log('Aprobando asiento contable:', id);
    
    try {
      const response = await apiClient.post<JournalEntryOperationResponse>(`${this.BASE_URL}/${id}/approve`);
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
  static async postJournalEntry(id: string): Promise<JournalEntryOperationResponse> {
    console.log('Contabilizando asiento contable:', id);
    
    try {
      const response = await apiClient.post<JournalEntryOperationResponse>(`${this.BASE_URL}/${id}/post`);
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
  static async cancelJournalEntry(id: string, reason?: string): Promise<JournalEntryOperationResponse> {
    console.log('Cancelando asiento contable:', id, 'Razón:', reason);
    
    try {
      const response = await apiClient.post<JournalEntryOperationResponse>(
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
  static async reverseJournalEntry(id: string, reason?: string): Promise<JournalEntryOperationResponse> {
    console.log('Creando reversión de asiento contable:', id, 'Razón:', reason);
    
    try {
      const response = await apiClient.post<JournalEntryOperationResponse>(
        `${this.BASE_URL}/${id}/reverse`,
        { reason }
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
        { entries }
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
}
