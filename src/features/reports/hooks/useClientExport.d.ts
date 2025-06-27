import { type ExportOptions } from '../utils/clientExportUtils';
import type { ReportResponse } from '../types';
export interface UseClientExportReturn {
    exportToPDF: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
    exportToExcel: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
    exportToCSV: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
    isExporting: boolean;
    exportError: string | null;
    lastExportMethod: string | null;
}
export declare const useClientExport: () => UseClientExportReturn;
