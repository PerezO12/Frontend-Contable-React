// ==========================================
// Hook principal para gestión de reportes
// ==========================================

import { useCallback, useEffect, useMemo } from 'react';
import { useReportsStore } from '../stores/reportsStore';
import { useToast } from '@/shared/hooks/useToast';
import type {
  ReportFilters,
  ReportType,
  GenerateReportParams,
  UseReportsReturn,
  DetailLevel
} from '../types';

export const useReports = (): UseReportsReturn => {
  const store = useReportsStore();
  const { success, error: showError } = useToast();

  // ==========================================
  // Effects
  // ==========================================
  // Cargar tipos de reportes al montar
  useEffect(() => {
    store.loadReportTypes();
  }, []); // Solo ejecutar una vez al montar

  // ==========================================
  // Memoized values
  // ==========================================

  const reportsState = useMemo(() => ({
    currentReport: store.currentReport,
    classicReport: store.classicReport,
    reportHistory: store.reportHistory,
    isGenerating: store.isGenerating,
    isExporting: store.isExporting,
    selectedReportType: store.selectedReportType,
    currentFilters: store.currentFilters,
    availableReportTypes: store.availableReportTypes,
    error: store.error,
    validationErrors: store.validationErrors
  }), [
    store.currentReport,
    store.classicReport,
    store.reportHistory,
    store.isGenerating,
    store.isExporting,
    store.selectedReportType,
    store.currentFilters,
    store.availableReportTypes,
    store.error,
    store.validationErrors
  ]);

  // ==========================================
  // Actions con manejo de errores y toast
  // ==========================================

  const generateReport = useCallback(async (params: GenerateReportParams) => {
    try {
      await store.generateReport(params);
      success('Reporte generado exitosamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al generar reporte';
      showError(message);
      throw error;
    }
  }, [store.generateReport, success, showError]);

  const exportReport = useCallback(async (params: { format: 'pdf' | 'excel' | 'csv'; includeNarrative?: boolean }) => {
    try {
      switch (params.format) {
        case 'pdf':
          await store.exportToPDF(params.includeNarrative);
          break;
        case 'excel':
          await store.exportToExcel();
          break;
        case 'csv':
          await store.exportToCSV();
          break;
      }
      success(`Reporte exportado a ${params.format.toUpperCase()} exitosamente`);
    } catch (error) {      const message = error instanceof Error ? error.message : `Error al exportar a ${params.format.toUpperCase()}`;
      showError(message);
      throw error;
    }
  }, [store.exportToPDF, store.exportToExcel, store.exportToCSV, success, showError]);

  const setFilters = useCallback((filters: Partial<ReportFilters>) => {
    store.setFilters(filters);
  }, [store.setFilters]);

  const clearCurrentReport = useCallback(() => {
    store.clearCurrentReport();
  }, [store.clearCurrentReport]);

  // ==========================================
  // Utility functions
  // ==========================================

  const isValidDateRange = useCallback((dateRange: { from_date: string; to_date: string }) => {
    if (!dateRange.from_date || !dateRange.to_date) return false;
    return new Date(dateRange.from_date) <= new Date(dateRange.to_date);
  }, []);

  const getDefaultFilters = useCallback(() => {
    return store.getDefaultFilters();
  }, [store.getDefaultFilters]);

  const formatCurrency = useCallback((amount: string) => {
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  }, []);

  return {
    reportsState,
    generateReport,
    exportReport,
    clearCurrentReport,
    setFilters,
    isValidDateRange,
    getDefaultFilters,
    formatCurrency
  };
};

// ==========================================
// Hook especializado para filtros de reportes
// ==========================================

export const useReportFilters = () => {
  const store = useReportsStore();

  const setReportType = useCallback((reportType: ReportType) => {
    store.setReportType(reportType);
  }, [store.setReportType]);

  const setDetailLevel = useCallback((level: DetailLevel) => {
    store.setDetailLevel(level);
  }, [store.setDetailLevel]);

  const setDateRange = useCallback((fromDate: string, toDate: string) => {
    store.setDateRange(fromDate, toDate);
  }, [store.setDateRange]);

  const resetFilters = useCallback(() => {
    store.resetFilters();
  }, [store.resetFilters]);

  const validateFilters = useCallback(() => {
    return store.validateFilters();
  }, [store.validateFilters]);

  return {
    filters: store.currentFilters,
    reportType: store.selectedReportType,
    validationErrors: store.validationErrors,
    setReportType,
    setDetailLevel,
    setDateRange,
    resetFilters,
    validateFilters,
    setFilters: store.setFilters
  };
};

// ==========================================
// Hook para exportación de reportes
// ==========================================

export const useReportExport = () => {
  const store = useReportsStore();
  const { success, error: showError } = useToast();

  const exportToPDF = useCallback(async (includeNarrative: boolean = true) => {
    try {
      await store.exportToPDF(includeNarrative);    success('Reporte exportado a PDF exitosamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al exportar a PDF';
      showError(message);
      throw error;
    }
  }, [store.exportToPDF, success, showError]);

  const exportToExcel = useCallback(async () => {
    try {      await store.exportToExcel();
      success('Reporte exportado a Excel exitosamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al exportar a Excel';
      showError(message);
      throw error;
    }
  }, [store.exportToExcel, success, showError]);

  const exportToCSV = useCallback(async () => {
    try {      await store.exportToCSV();
      success('Reporte exportado a CSV exitosamente');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al exportar a CSV';
      showError(message);
      throw error;
    }
  }, [store.exportToCSV, success, showError]);

  return {
    exportToPDF,
    exportToExcel,
    exportToCSV,
    isExporting: store.isExporting,
    exportError: store.error
  };
};

// ==========================================
// Hook para análisis financiero
// ==========================================

export const useFinancialAnalysis = () => {
  const { currentReport } = useReportsStore();

  const calculateRatios = useCallback(() => {
    if (!currentReport || currentReport.report_type !== 'balance_general') {
      return null;
    }

    // Calcular ratios básicos del balance general
    const { table } = currentReport;
    const assets = table.sections.find(s => s.section_name === 'ACTIVOS');
    const liabilities = table.sections.find(s => s.section_name === 'PASIVOS');
    const equity = table.sections.find(s => s.section_name === 'PATRIMONIO');

    if (!assets || !liabilities || !equity) return null;

    const totalAssets = parseFloat(assets.total.replace(/,/g, ''));
    const totalLiabilities = parseFloat(liabilities.total.replace(/,/g, ''));
    const totalEquity = parseFloat(equity.total.replace(/,/g, ''));

    return {
      debtToEquityRatio: totalLiabilities / totalEquity,
      equityRatio: totalEquity / totalAssets,
      debtRatio: totalLiabilities / totalAssets
    };
  }, [currentReport]);

  const getFinancialHealth = useCallback(() => {
    const ratios = calculateRatios();
    if (!ratios) return null;

    let score = 0;
    const alerts = [];

    // Evaluar ratio de deuda sobre patrimonio
    if (ratios.debtToEquityRatio < 0.5) {
      score += 30;
    } else if (ratios.debtToEquityRatio < 1) {
      score += 20;
    } else {
      alerts.push('Alto nivel de endeudamiento');
    }

    // Evaluar ratio de patrimonio
    if (ratios.equityRatio > 0.5) {
      score += 30;
    } else if (ratios.equityRatio > 0.3) {
      score += 20;
    } else {
      alerts.push('Bajo nivel de patrimonio');
    }

    return {
      score,
      level: score >= 50 ? 'Bueno' : score >= 30 ? 'Regular' : 'Preocupante',
      ratios,
      alerts
    };
  }, [calculateRatios]);

  return {
    calculateRatios,
    getFinancialHealth,
    hasAnalysisData: !!currentReport
  };
};

// ==========================================
// Hook para gestión de historial
// ==========================================

export const useReportHistory = () => {
  const { reportHistory, addToHistory } = useReportsStore();

  const getReportsByType = useCallback((reportType: ReportType) => {
    return reportHistory.filter(report => report.report_type === reportType);
  }, [reportHistory]);

  const getRecentReports = useCallback((limit: number = 5) => {
    return reportHistory.slice(0, limit);
  }, [reportHistory]);

  const findReportByFilters = useCallback((filters: ReportFilters) => {
    return reportHistory.find(report => 
      report.period.from_date === filters.from_date &&
      report.period.to_date === filters.to_date
    );
  }, [reportHistory]);

  return {
    history: reportHistory,
    getReportsByType,
    getRecentReports,
    findReportByFilters,
    addToHistory
  };
};
