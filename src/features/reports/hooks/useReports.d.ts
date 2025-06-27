import type { ReportFilters, ReportType, UseReportsReturn, DetailLevel } from '../types';
export declare const useReports: () => UseReportsReturn;
export declare const useReportFilters: () => {
    filters: ReportFilters;
    reportType: ReportType;
    validationErrors: Record<string, string>;
    setReportType: (reportType: ReportType) => void;
    setDetailLevel: (level: DetailLevel) => void;
    setDateRange: (fromDate: string, toDate: string) => void;
    resetFilters: () => void;
    validateFilters: () => {
        isValid: boolean;
        errors: string[];
    };
    setFilters: (filters: Partial<ReportFilters>) => void;
};
export declare const useReportExport: () => {
    exportToPDF: (includeNarrative?: boolean) => Promise<void>;
    exportToExcel: () => Promise<void>;
    exportToCSV: () => Promise<void>;
    isExporting: boolean;
    exportError: string;
};
export declare const useFinancialAnalysis: () => {
    calculateRatios: () => {
        debtToEquityRatio: number;
        equityRatio: number;
        debtRatio: number;
    };
    getFinancialHealth: () => {
        score: number;
        level: string;
        ratios: {
            debtToEquityRatio: number;
            equityRatio: number;
            debtRatio: number;
        };
        alerts: any[];
    };
    hasAnalysisData: boolean;
};
export declare const useReportHistory: () => {
    history: import("..").ReportResponse[];
    getReportsByType: (reportType: ReportType) => import("..").ReportResponse[];
    getRecentReports: (limit?: number) => import("..").ReportResponse[];
    findReportByFilters: (filters: ReportFilters) => import("..").ReportResponse;
    addToHistory: (report: import("..").ReportResponse) => void;
};
