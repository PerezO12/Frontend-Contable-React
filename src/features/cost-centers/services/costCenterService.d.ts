import type { CostCenter, CostCenterTree, CostCenterCreate, CostCenterUpdate, CostCenterFilters, CostCenterAnalysis, CostCenterDeleteValidation, BulkCostCenterDelete, BulkCostCenterDeleteResult } from '../types';
export declare class CostCenterService {
    private static readonly BASE_URL;
    /**
     * Crear un nuevo centro de costo
     */
    static createCostCenter(costCenterData: CostCenterCreate): Promise<CostCenter>;
    /**
     * Obtener lista de centros de costo con filtros
     */
    static getCostCenters(filters?: CostCenterFilters): Promise<{
        data: CostCenter[];
        total: number;
        skip: number;
        limit: number;
    }>;
    /**
     * Obtener un centro de costo por ID
     */
    static getCostCenterById(id: string): Promise<CostCenter>;
    /**
     * Obtener un centro de costo por código
     */
    static getCostCenterByCode(code: string): Promise<CostCenter>;
    /**
     * Actualizar un centro de costo existente
     */
    static updateCostCenter(id: string, updateData: CostCenterUpdate): Promise<CostCenter>;
    /**
     * Eliminar un centro de costo permanentemente
     */
    static deleteCostCenter(id: string): Promise<void>;
    /**
     * Obtener estructura jerárquica de centros de costo como árbol
     */
    static getCostCenterTree(activeOnly?: boolean): Promise<CostCenterTree[]>;
    /**
     * Validar disponibilidad de código
     */
    static checkCodeAvailability(code: string, excludeId?: string): Promise<boolean>;
    /**
     * Activar o desactivar un centro de costo
     */
    static toggleCostCenterStatus(id: string, isActive: boolean): Promise<CostCenter>;
    /**
     * Obtener movimientos asociados a un centro de costo
     */
    static getCostCenterMovements(id: string, filters?: {
        start_date?: string;
        end_date?: string;
        skip?: number;
        limit?: number;
    }): Promise<{
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
    }>;
    /**
     * Obtener análisis de rentabilidad de un centro de costo
     */
    static getCostCenterAnalysis(id: string, startDate: string, endDate: string): Promise<CostCenterAnalysis>;
    /**
     * Validar si múltiples centros de costo pueden ser eliminados
     */
    static validateDeletion(costCenterIds: string[]): Promise<CostCenterDeleteValidation[]>;
    /**
     * Eliminar múltiples centros de costo con validaciones
     */
    static bulkDeleteCostCenters(deleteData: BulkCostCenterDelete): Promise<BulkCostCenterDeleteResult>;
    /**
     * Exportar centros de costo seleccionados
     */
    static exportCostCenters(costCenterIds: string[], format: 'csv' | 'json' | 'xlsx'): Promise<Blob>; /**
     * Exportar centros de costo con filtros avanzados - MÉTODO OBSOLETO
     * Use getCostCenters() para obtener IDs filtrados y luego exportCostCenters()
     */
    static exportCostCentersAdvanced(_format: 'csv' | 'json' | 'xlsx', _filters?: CostCenterFilters, _selectedColumns?: string[]): Promise<Blob>; /**
     * Obtener esquema de exportación para centros de costo
     */
    static getExportSchema(): Promise<{
        table_name: string;
        display_name: string;
        description: string;
        columns: Array<{
            name: string;
            data_type: string;
            nullable: boolean;
            description?: string;
        }>;
        total_records: number;
    }>;
    /**
     * Obtener estadísticas generales de centros de costo
     */
    static getCostCenterStats(): Promise<{
        total_cost_centers: number;
        active_cost_centers: number;
        inactive_cost_centers: number;
        by_level: Record<number, number>;
        with_movements: number;
        without_movements: number;
        total_budget_allocated?: string;
        total_actual_expenses?: string;
    }>;
}
