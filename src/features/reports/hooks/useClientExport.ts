import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks/useToast';
import { exportReport, type ExportOptions } from '../utils/clientExportUtils';
import type { ReportResponse } from '../types';

export interface UseClientExportReturn {
  exportToPDF: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
  exportToExcel: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
  exportToCSV: (report: ReportResponse, options?: ExportOptions) => Promise<void>;
  isExporting: boolean;
  exportError: string | null;
  lastExportMethod: string | null;
}

export const useClientExport = (): UseClientExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [lastExportMethod, setLastExportMethod] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const handleExport = useCallback(async (
    report: ReportResponse,
    format: 'csv' | 'excel' | 'pdf',
    options: ExportOptions = {}
  ) => {
    if (!report) {
      const error = 'No hay reporte disponible para exportar';
      setExportError(error);
      showError(error);
      return;
    }

    setIsExporting(true);
    setExportError(null);
    setLastExportMethod(null);

    try {
      await exportReport(report, format, options);
      setLastExportMethod(format === 'pdf' ? 'PDF (sistema de fallback automático)' : format.toUpperCase());
      success(`Reporte exportado a ${format.toUpperCase()} exitosamente`);
    } catch (error) {
      const message = error instanceof Error ? error.message : `Error al exportar a ${format.toUpperCase()}`;
      setExportError(message);
      showError(message);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [success, showError]);

  const exportToPDF = useCallback(async (report: ReportResponse, options: ExportOptions = {}) => {
    await handleExport(report, 'pdf', options);
  }, [handleExport]);

  const exportToExcel = useCallback(async (report: ReportResponse, options: ExportOptions = {}) => {
    await handleExport(report, 'excel', options);
  }, [handleExport]);

  const exportToCSV = useCallback(async (report: ReportResponse, options: ExportOptions = {}) => {
    await handleExport(report, 'csv', options);
  }, [handleExport]);

  return {
    exportToPDF,
    exportToExcel,
    exportToCSV,
    isExporting,
    exportError,
    lastExportMethod
  };
};
