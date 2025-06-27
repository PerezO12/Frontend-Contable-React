import type { CostCenterFilters } from '../types';
interface UseCostCenterExportOptions {
    onSuccess?: (exportedCount: number, format: string) => void;
    onError?: (error: string) => void;
}
interface ExportProgress {
    current: number;
    total: number;
    message: string;
}
export declare const useCostCenterExport: (options?: UseCostCenterExportOptions) => {
    isExporting: boolean;
    exportProgress: ExportProgress;
    exportCostCenters: (costCenterIds: string[], format: "csv" | "json" | "xlsx", fileName?: string) => Promise<void>;
    exportCostCentersAdvanced: (format: "csv" | "json" | "xlsx", filters?: CostCenterFilters, selectedColumns?: string[], fileName?: string) => Promise<void>;
    getExportSchema: () => Promise<{
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
};
export {};
