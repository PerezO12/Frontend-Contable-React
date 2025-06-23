/**
 * API Client para Journals (Diarios)
 * Implementa todos los endpoints del backend para journals
 */
import { apiClient } from '@/shared/api/client';
import type {
  JournalCreate,
  JournalUpdate,
  JournalDetail,
  JournalListItem,
  JournalFilter,
  JournalSequenceInfo,
  JournalResetSequence,
  JournalStats,
  JournalType,
  JournalPagination,
} from '../types';

// Respuesta paginada del backend
interface PagedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Cliente API para operaciones con journals
 */
export class JournalAPI {
  private static readonly BASE_URL = '/api/v1/journals';

  /**
   * Crear un nuevo journal
   */
  static async createJournal(data: JournalCreate): Promise<JournalDetail> {
    const response = await apiClient.post<JournalDetail>(this.BASE_URL, data);
    return response.data;
  }

  /**
   * Obtener lista de journals con filtros y paginación
   */
  static async getJournals(
    filters?: JournalFilter,
    pagination?: JournalPagination
  ): Promise<PagedResponse<JournalListItem>> {
    const params = new URLSearchParams();

    // Agregar filtros
    if (filters?.type) {
      params.append('type', filters.type);
    }
    if (filters?.is_active !== undefined) {
      params.append('is_active', filters.is_active.toString());
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    // Agregar paginación
    if (pagination) {
      if (pagination.skip !== undefined) {
        params.append('skip', pagination.skip.toString());
      }
      if (pagination.limit !== undefined) {
        params.append('limit', pagination.limit.toString());
      }
      if (pagination.order_by) {
        params.append('order_by', pagination.order_by);
      }
      if (pagination.order_dir) {
        params.append('order_dir', pagination.order_dir);
      }
    }

    const url = params.toString() 
      ? `${this.BASE_URL}?${params.toString()}`
      : this.BASE_URL;

    const response = await apiClient.get<PagedResponse<JournalListItem>>(url);
    return response.data;
  }

  /**
   * Obtener un journal por ID
   */
  static async getJournal(id: string): Promise<JournalDetail> {
    const response = await apiClient.get<JournalDetail>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Actualizar un journal
   */
  static async updateJournal(id: string, data: JournalUpdate): Promise<JournalDetail> {
    const response = await apiClient.put<JournalDetail>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar un journal
   */
  static async deleteJournal(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Obtener estadísticas de un journal
   */
  static async getJournalStats(id: string): Promise<JournalStats> {
    const response = await apiClient.get<JournalStats>(`${this.BASE_URL}/${id}/stats`);
    return response.data;
  }

  /**
   * Obtener información de secuencia de un journal
   */
  static async getJournalSequenceInfo(id: string): Promise<JournalSequenceInfo> {
    const response = await apiClient.get<JournalSequenceInfo>(`${this.BASE_URL}/${id}/sequence`);
    return response.data;
  }

  /**
   * Resetear secuencia de un journal
   */
  static async resetJournalSequence(id: string, data: JournalResetSequence): Promise<JournalDetail> {
    const response = await apiClient.post<JournalDetail>(`${this.BASE_URL}/${id}/sequence/reset`, data);
    return response.data;
  }

  /**
   * Obtener journals por tipo
   */
  static async getJournalsByType(type: JournalType): Promise<JournalListItem[]> {
    const response = await apiClient.get<JournalListItem[]>(`${this.BASE_URL}/by-type/${type}`);
    return response.data;
  }

  /**
   * Obtener journal por defecto para un tipo
   */
  static async getDefaultJournalForType(type: JournalType): Promise<JournalDetail | null> {
    try {
      const response = await apiClient.get<JournalDetail>(`${this.BASE_URL}/default/${type}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Obtener todos los journals activos (para selects)
   */
  static async getActiveJournals(): Promise<JournalListItem[]> {
    const response = await this.getJournals(
      { is_active: true },
      { skip: 0, limit: 1000, order_by: 'name', order_dir: 'asc' }
    );
    return response.items;
  }

  /**
   * Buscar journals (para componentes de búsqueda)
   */
  static async searchJournals(query: string, limit: number = 50): Promise<JournalListItem[]> {
    const response = await this.getJournals(
      { search: query, is_active: true },
      { skip: 0, limit, order_by: 'name', order_dir: 'asc' }
    );
    return response.items;
  }
}

export default JournalAPI;
