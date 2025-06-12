import { apiClient } from '../../../shared/api/client';
import { ExportService } from '../../../shared/services/exportService';
import type { 
  CostCenter, 
  CostCenterTree, 
  CostCenterCreate, 
  CostCenterUpdate, 
  CostCenterFilters,
  CostCenterAnalysis
} from '../types';

export class CostCenterService {
  private static readonly BASE_URL = '/api/v1/cost-centers';

  /**
   * Crear un nuevo centro de costo
   */
  static async createCostCenter(costCenterData: CostCenterCreate): Promise<CostCenter> {
    const response = await apiClient.post<CostCenter>(this.BASE_URL, costCenterData);
    return response.data;
  }

  /**
   * Obtener lista de centros de costo con filtros
   */
  static async getCostCenters(filters?: CostCenterFilters): Promise<{
    data: CostCenter[];
    total: number;
    skip: number;
    limit: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.code) params.append('code', filters.code);
      if (filters.name) params.append('name', filters.name);
      if (filters.parent_id) params.append('parent_id', filters.parent_id);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      if (filters.level !== undefined) params.append('level', filters.level.toString());
      if (filters.has_children !== undefined) params.append('has_children', filters.has_children.toString());
      if (filters.created_after) params.append('created_after', filters.created_after);
      if (filters.created_before) params.append('created_before', filters.created_before);
      if (filters.order_by) params.append('order_by', filters.order_by);
      if (filters.order_desc !== undefined) params.append('order_desc', filters.order_desc.toString());
    }

    const url = params.toString() ? `${this.BASE_URL}?${params}` : this.BASE_URL;
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Obtener un centro de costo por ID
   */
  static async getCostCenterById(id: string): Promise<CostCenter> {
    const response = await apiClient.get<CostCenter>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Obtener un centro de costo por código
   */
  static async getCostCenterByCode(code: string): Promise<CostCenter> {
    const response = await apiClient.get<CostCenter>(`${this.BASE_URL}/code/${code}`);
    return response.data;
  }

  /**
   * Actualizar un centro de costo existente
   */
  static async updateCostCenter(id: string, updateData: CostCenterUpdate): Promise<CostCenter> {
    const response = await apiClient.put<CostCenter>(`${this.BASE_URL}/${id}`, updateData);
    return response.data;
  }

  /**
   * Eliminar un centro de costo permanentemente
   */
  static async deleteCostCenter(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_URL}/${id}`);
  }

  /**
   * Obtener estructura jerárquica de centros de costo
   */
  static async getCostCenterTree(parentId?: string, activeOnly: boolean = true): Promise<CostCenterTree[]> {
    const params = new URLSearchParams();
    if (parentId) params.append('parent_id', parentId);
    if (activeOnly) params.append('active_only', 'true');

    const url = params.toString() 
      ? `${this.BASE_URL}/hierarchy?${params}` 
      : `${this.BASE_URL}/hierarchy`;
    
    const response = await apiClient.get<CostCenterTree[]>(url);
    return response.data;
  }

  /**
   * Validar disponibilidad de código
   */
  static async checkCodeAvailability(code: string, excludeId?: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('code', code);
    if (excludeId) params.append('exclude_id', excludeId);

    const response = await apiClient.get<{ available: boolean }>(`${this.BASE_URL}/validate-code?${params}`);
    return response.data.available;
  }

  /**
   * Activar o desactivar un centro de costo
   */
  static async toggleCostCenterStatus(id: string, isActive: boolean): Promise<CostCenter> {
    const response = await apiClient.patch<CostCenter>(`${this.BASE_URL}/${id}/status`, {
      is_active: isActive
    });
    return response.data;
  }

  /**
   * Obtener movimientos asociados a un centro de costo
   */
  static async getCostCenterMovements(
    id: string, 
    filters?: {
      start_date?: string;
      end_date?: string;
      skip?: number;
      limit?: number;
    }
  ): Promise<{
    movements: Array<{
      id: string;
      date: string;
      description: string;
      account_code: string;
      account_name: string;
      debit_amount: string;
      credit_amount: string;
      journal_entry_number: string;
      reference?: string;
    }>;
    total_count: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    }

    const url = params.toString() 
      ? `${this.BASE_URL}/${id}/movements?${params}` 
      : `${this.BASE_URL}/${id}/movements`;
    
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Obtener análisis de rentabilidad de un centro de costo
   */
  static async getCostCenterAnalysis(
    id: string,
    startDate: string,
    endDate: string
  ): Promise<CostCenterAnalysis> {
    const params = new URLSearchParams();
    params.append('start_date', startDate);
    params.append('end_date', endDate);

    const response = await apiClient.get<CostCenterAnalysis>(
      `${this.BASE_URL}/${id}/analysis?${params}`
    );
    return response.data;
  }

  /**
   * Exportar centros de costo seleccionados
   */
  static async exportCostCenters(
    costCenterIds: string[], 
    format: 'csv' | 'json' | 'xlsx'
  ): Promise<Blob> {
    return ExportService.exportByIds({
      table: 'cost_centers',
      format,
      ids: costCenterIds
    });
  }
  /**
   * Exportar centros de costo con filtros avanzados
   */
  static async exportCostCentersAdvanced(
    format: 'csv' | 'json' | 'xlsx',
    filters?: CostCenterFilters,
    selectedColumns?: string[]
  ): Promise<Blob> {
    const columnsConfig = selectedColumns?.map(name => ({
      name,
      include: true
    }));    return ExportService.exportAdvanced({
      table_name: 'cost_centers',
      export_format: format,
      filters,
      columns: columnsConfig
    });
  }
  /**
   * Obtener esquema de exportación para centros de costo
   */
  static async getExportSchema(): Promise<{
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
    return ExportService.getTableSchema('cost_centers');
  }

  /**
   * Obtener estadísticas generales de centros de costo
   */
  static async getCostCenterStats(): Promise<{
    total_cost_centers: number;
    active_cost_centers: number;
    inactive_cost_centers: number;
    by_level: Record<number, number>;
    with_movements: number;
    without_movements: number;
    total_budget_allocated?: string;
    total_actual_expenses?: string;
  }> {
    const response = await apiClient.get(`${this.BASE_URL}/stats`);
    return response.data;
  }
}
