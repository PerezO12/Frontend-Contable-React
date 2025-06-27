import type { ReportsState, ReportResponse, ReportFilters, ReportType, GenerateReportParams, DetailLevel } from '../types';
interface ReportsActions {
    generateReport: (params: GenerateReportParams) => Promise<void>;
    generateBalanceGeneral: (filters: ReportFilters) => Promise<void>;
    generatePerdidasGanancias: (filters: ReportFilters) => Promise<void>;
    generateFlujoEfectivo: (filters: ReportFilters) => Promise<void>;
    setFilters: (filters: Partial<ReportFilters>) => void;
    resetFilters: () => void;
    setReportType: (reportType: ReportType) => void;
    setDetailLevel: (level: DetailLevel) => void;
    setDateRange: (from_date: string, to_date: string) => void;
    clearCurrentReport: () => void;
    clearError: () => void;
    setError: (error: string) => void;
    addToHistory: (report: ReportResponse) => void;
    exportToPDF: (includeNarrative?: boolean) => Promise<void>;
    exportToExcel: () => Promise<void>;
    exportToCSV: () => Promise<void>;
    loadReportTypes: () => Promise<void>;
    validateFilters: () => {
        isValid: boolean;
        errors: string[];
    };
    getDefaultFilters: () => ReportFilters;
}
type ReportsStore = ReportsState & ReportsActions;
export declare const useReportsStore: import("zustand").UseBoundStore<Omit<Omit<import("zustand").StoreApi<ReportsStore>, "setState" | "devtools"> & {
    setState(partial: ReportsStore | Partial<ReportsStore> | ((state: ReportsStore) => ReportsStore | Partial<ReportsStore>), replace?: false, action?: string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }): void;
    setState(state: ReportsStore | ((state: ReportsStore) => ReportsStore), replace: true, action?: string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }): void;
    devtools: {
        cleanup: () => void;
    };
}, "setState"> & {
    setState(nextStateOrUpdater: ReportsStore | Partial<ReportsStore> | ((state: import("immer").WritableDraft<ReportsStore>) => void), shouldReplace?: false, action?: string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }): void;
    setState(nextStateOrUpdater: ReportsStore | ((state: import("immer").WritableDraft<ReportsStore>) => void), shouldReplace: true, action?: string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }): void;
}>;
export declare const useReportsSelectors: () => {
    currentReport: ReportResponse;
    isGenerating: boolean;
    error: string;
    filters: ReportFilters;
    reportType: ReportType;
    reportTypes: import("..").ReportTypeInfo[];
    history: ReportResponse[];
    isExporting: boolean;
    generateReport: (params: GenerateReportParams) => Promise<void>;
    setFilters: (filters: Partial<ReportFilters>) => void;
    exportToPDF: (includeNarrative?: boolean) => Promise<void>;
    exportToExcel: () => Promise<void>;
    clearError: () => void;
};
export {};
