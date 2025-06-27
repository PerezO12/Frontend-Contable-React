interface UseAccountExportOptions {
    onSuccess?: (exportedCount: number, format: string) => void;
    onError?: (error: string) => void;
}
export declare const useAccountExport: (options?: UseAccountExportOptions) => {
    isExporting: boolean;
    exportProgress: {
        current: number;
        total: number;
        message: string;
    };
    exportAccounts: (accountIds: string[], format: "csv" | "json" | "xlsx", fileName?: string) => Promise<void>;
    exportAccountsAdvanced: (format: "csv" | "json" | "xlsx", filters?: {
        account_type?: string;
        category?: string;
        is_active?: boolean;
        parent_id?: string;
        search?: string;
        date_from?: string;
        date_to?: string;
    }, selectedColumns?: string[], fileName?: string) => Promise<void>;
    getExportSchema: () => Promise<{
        table_name: string;
        display_name: string;
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
