import type { ReportResponse } from '../types';
export interface ExportOptions {
    includeNarrative?: boolean;
    includeMetadata?: boolean;
    customFilename?: string;
}
export declare const exportToCSV: (report: ReportResponse, options?: ExportOptions) => void;
export declare const exportToExcel: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
export declare const exportToPDF: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
export declare const exportToPDFSimple: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
export declare const exportReport: (report: ReportResponse, format: "csv" | "excel" | "pdf", options?: ExportOptions) => Promise<void>;
