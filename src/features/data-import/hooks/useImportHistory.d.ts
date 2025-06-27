import type { ImportResult } from '../types';
export declare function useImportHistory(): {
    getImportHistory: (page?: number, limit?: number, _dataType?: "accounts" | "journal_entries") => Promise<{
        imports: ImportResult[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    getImportResult: (importId: string) => Promise<ImportResult>;
    refreshHistory: () => Promise<{
        imports: ImportResult[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    changePage: (newPage: number) => Promise<{
        imports: ImportResult[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    changeLimit: (newLimit: number) => Promise<{
        imports: ImportResult[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    filterByDataType: (dataType?: "accounts" | "journal_entries") => Promise<{
        imports: ImportResult[];
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    }>;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    isEmpty: boolean;
    isLoading: boolean;
    imports: ImportResult[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
