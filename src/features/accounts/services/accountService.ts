import { apiClient } from '../../../shared/api/client';
import { ExportService } from '../../../shared/services/exportService';
import type { 
  Account, 
  AccountTree, 
  AccountCreate, 
  AccountUpdate, 
  AccountFilters,
  BulkAccountDelete,
  AccountDeleteValidation,
  BulkAccountDeleteResult
} from '../types';

export class AccountService {
  private static readonly BASE_URL = '/api/v1/accounts';
  /**
   * Crear una nueva cuenta contable
   */
  static async createAccount(accountData: AccountCreate): Promise<Account> {
    console.log('Datos de cuenta a crear:', accountData);
    console.log('URL de petición:', this.BASE_URL);
    try {
      const response = await apiClient.post<Account>(this.BASE_URL, accountData);
      console.log('Respuesta del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de cuentas con filtros
   */
  static async getAccounts(filters?: AccountFilters): Promise<Account[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.account_type) params.append('account_type', filters.account_type);
      if (filters.category) params.append('category', filters.category);
      if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
      if (filters.parent_id) params.append('parent_id', filters.parent_id);
      if (filters.search) params.append('search', filters.search);
    }

    const url = params.toString() ? `${this.BASE_URL}?${params}` : this.BASE_URL;
    const response = await apiClient.get<Account[]>(url);
    return response.data;
  }

  /**
   * Obtener una cuenta por ID
   */
  static async getAccountById(id: string): Promise<Account> {
    const response = await apiClient.get<Account>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Obtener una cuenta por código
   */
  static async getAccountByCode(code: string): Promise<Account> {
    const response = await apiClient.get<Account>(`${this.BASE_URL}/code/${code}`);
    return response.data;
  }
  /**
   * Actualizar una cuenta existente
   */  static async updateAccount(id: string, updateData: AccountUpdate): Promise<Account> {
    console.log('🔄 AccountService.updateAccount - Iniciando actualización');
    console.log('📋 ID de cuenta:', id);
    console.log('📝 Datos de actualización:', updateData);
    console.log('🌐 URL completa:', `${this.BASE_URL}/${id}`);
    
    try {
      const response = await apiClient.put<Account>(`${this.BASE_URL}/${id}`, updateData);
      console.log('✅ Respuesta exitosa del servidor:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al actualizar cuenta:', error);
      if (error instanceof Error) {
        console.error('📋 Mensaje de error:', error.message);
        console.error('📊 Stack trace:', error.stack);
      }
      throw error;
    }
  }
  /**
   * Eliminar una cuenta permanentemente
   */
  static async deleteAccount(id: string): Promise<void> {
    console.log('Eliminando cuenta:', id);
    console.log('URL de eliminación:', `${this.BASE_URL}/${id}`);
    try {
      const response = await apiClient.delete(`${this.BASE_URL}/${id}`);
      console.log('Cuenta eliminada exitosamente:', id);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      throw error;
    }
  }

  /**
   * Obtener la estructura jerárquica de cuentas como árbol
   */
  static async getAccountTree(accountType?: string, activeOnly: boolean = true): Promise<AccountTree[]> {
    const params = new URLSearchParams();
    
    if (accountType) params.append('account_type', accountType);
    params.append('active_only', activeOnly.toString());

    const url = params.toString() ? `${this.BASE_URL}/tree?${params}` : `${this.BASE_URL}/tree`;
    const response = await apiClient.get<AccountTree[]>(url);
    return response.data;
  }

  /**
   * Obtener cuentas hijas de una cuenta padre
   */
  static async getChildAccounts(parentId: string): Promise<Account[]> {
    const response = await apiClient.get<Account[]>(`${this.BASE_URL}/${parentId}/children`);
    return response.data;
  }

  /**
   * Obtener el camino jerárquico de una cuenta
   */
  static async getAccountPath(id: string): Promise<Account[]> {
    const response = await apiClient.get<Account[]>(`${this.BASE_URL}/${id}/path`);
    return response.data;
  }

  /**
   * Verificar si un código de cuenta está disponible
   */
  static async checkCodeAvailability(code: string, excludeId?: string): Promise<boolean> {
    const params = new URLSearchParams();
    params.append('code', code);
    if (excludeId) params.append('exclude_id', excludeId);

    const response = await apiClient.get<{ available: boolean }>(`${this.BASE_URL}/check-code?${params}`);
    return response.data.available;
  }

  /**
   * Obtener estadísticas de cuentas por tipo
   */
  static async getAccountStats(): Promise<Record<string, number>> {
    const response = await apiClient.get<Record<string, number>>(`${this.BASE_URL}/stats`);
    return response.data;
  }

  /**
   * Exportar plan de cuentas
   */
  static async exportChartOfAccounts(format: 'excel' | 'csv' | 'pdf'): Promise<Blob> {
    const response = await apiClient.get(`${this.BASE_URL}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }

  /**
   * Importar plan de cuentas desde archivo
   */
  static async importChartOfAccounts(file: File): Promise<{ success: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ success: number; errors: string[] }>(
      `${this.BASE_URL}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  }

  /**
   * Activar o desactivar una cuenta
   */
  static async toggleAccountStatus(id: string, isActive: boolean): Promise<Account> {
    const response = await apiClient.patch<Account>(`${this.BASE_URL}/${id}/status`, {
      is_active: isActive
    });
    return response.data;
  }

  /**
   * Obtener saldo actual de una cuenta
   */
  static async getAccountBalance(id: string, asOfDate?: string): Promise<{
    balance: string;
    debit_balance: string;
    credit_balance: string;
    as_of_date: string;
  }> {
    const params = new URLSearchParams();
    if (asOfDate) params.append('as_of_date', asOfDate);

    const url = params.toString() 
      ? `${this.BASE_URL}/${id}/balance?${params}` 
      : `${this.BASE_URL}/${id}/balance`;
    
    const response = await apiClient.get(url);
    return response.data;
  }

  /**
   * Obtener movimientos de una cuenta
   */
  static async getAccountMovements(
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
      debit_amount: string;
      credit_amount: string;
      balance: string;
      transaction_id: string;
    }>;
    total_count: number;
  }> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    }    const url = params.toString() 
      ? `${this.BASE_URL}/${id}/movements?${params}` 
      : `${this.BASE_URL}/${id}/movements`;
    
    const response = await apiClient.get(url);
    return response.data;
  }
  /**
   * Validar si múltiples cuentas pueden ser eliminadas
   */
  static async validateDeletion(accountIds: string[]): Promise<AccountDeleteValidation[]> {
    console.log('Validando eliminación de cuentas:', accountIds);
    try {
      const response = await apiClient.post<AccountDeleteValidation[]>(
        `${this.BASE_URL}/validate-deletion`,
        accountIds
      );
      console.log('Validación completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al validar eliminación:', error);
      throw error;
    }
  }

  /**
   * Eliminar múltiples cuentas con validaciones
   */
  static async bulkDeleteAccounts(deleteData: BulkAccountDelete): Promise<BulkAccountDeleteResult> {
    console.log('Eliminación masiva de cuentas:', deleteData);
    try {
      const response = await apiClient.post<BulkAccountDeleteResult>(
        `${this.BASE_URL}/bulk-delete`,
        deleteData
      );
      console.log('Eliminación masiva completada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      throw error;
    }
  }

  /**
   * Exportar cuentas seleccionadas usando el sistema de exportación genérico
   */
  static async exportAccounts(
    accountIds: string[], 
    format: 'csv' | 'json' | 'xlsx'
  ): Promise<Blob> {
    return ExportService.exportByIds({
      table: 'accounts',
      format,
      ids: accountIds
    });
  }

  /**
   * Exportar cuentas con filtros avanzados
   */
  static async exportAccountsAdvanced(
    format: 'csv' | 'json' | 'xlsx',
    filters?: {
      account_type?: string;
      category?: string;
      is_active?: boolean;
      parent_id?: string;
      search?: string;
      date_from?: string;
      date_to?: string;
    },
    selectedColumns?: string[]
  ): Promise<Blob> {
    const columnsConfig = selectedColumns?.map(name => ({
      name,
      include: true
    }));

    return ExportService.exportAdvanced({
      table_name: 'accounts',
      export_format: format,
      filters: {
        ...filters,      active_only: filters?.is_active
      },
      columns: columnsConfig
    });
  }

  /**
   * Obtener información de esquema para exportación
   */
  static async getExportSchema(): Promise<{
    table_name: string;
    display_name: string;
    available_columns: Array<{
      name: string;
      data_type: string;
      include: boolean;
    }>;
    total_records: number;
  }> {
    return ExportService.getTableSchema('accounts');
  }
}
