// ==========================================
// Store principal para el módulo de reportes
// ==========================================

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  ReportsState,
  ReportResponse,
  BalanceSheet,
  ReportFilters,
  ReportType,
  GenerateReportParams,
  DetailLevel
} from '../types';
import { reportsAPI } from '../services/reportsAPI';

interface ReportsActions {
  // ==========================================
  // Actions para generar reportes
  // ==========================================
  generateReport: (params: GenerateReportParams) => Promise<void>;
  generateBalanceGeneral: (filters: ReportFilters) => Promise<void>;
  generatePerdidasGanancias: (filters: ReportFilters) => Promise<void>;
  generateFlujoEfectivo: (filters: ReportFilters) => Promise<void>;
  
  // ==========================================
  // Actions para gestión de filtros
  // ==========================================
  setFilters: (filters: Partial<ReportFilters>) => void;
  resetFilters: () => void;
  setReportType: (reportType: ReportType) => void;
  setDetailLevel: (level: DetailLevel) => void;
  setDateRange: (from_date: string, to_date: string) => void;
  
  // ==========================================
  // Actions para gestión de estado
  // ==========================================
  clearCurrentReport: () => void;
  clearError: () => void;
  setError: (error: string) => void;
  addToHistory: (report: ReportResponse) => void;
  
  // ==========================================
  // Actions para exportación
  // ==========================================
  exportToPDF: (includeNarrative?: boolean) => Promise<void>;
  exportToExcel: () => Promise<void>;
  exportToCSV: () => Promise<void>;
  
  // ==========================================
  // Actions para tipos de reportes
  // ==========================================
  loadReportTypes: () => Promise<void>;
  
  // ==========================================
  // Actions de utilidad
  // ==========================================
  validateFilters: () => { isValid: boolean; errors: string[] };
  getDefaultFilters: () => ReportFilters;
}

type ReportsStore = ReportsState & ReportsActions;

// Estado inicial
const initialState: ReportsState = {
  // Reports data
  currentReport: null,
  classicReport: null,
  reportHistory: [],
  
  // Loading states
  isGenerating: false,
  isExporting: false,
  
  // UI state
  selectedReportType: 'balance_general',
  currentFilters: {
    from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to_date: new Date().toISOString().split('T')[0],
    detail_level: 'medio',
    include_subaccounts: false,
    include_zero_balances: false
  },
  availableReportTypes: [
    {
      type: 'balance_general',
      name: 'Balance General',
      description: 'Estado de la situación financiera a una fecha específica',
      endpoint: '/reports/balance-general',
      icon: 'balance-scale',
      category: 'financial'
    },
    {
      type: 'p_g',
      name: 'Estado de Pérdidas y Ganancias',
      description: 'Ingresos y gastos en un período específico',
      endpoint: '/reports/perdidas-ganancias',
      icon: 'trending-up',
      category: 'financial'
    },
    {
      type: 'flujo_efectivo',
      name: 'Estado de Flujo de Efectivo',
      description: 'Movimientos de efectivo en un período específico',
      endpoint: '/reports/flujo-efectivo',
      icon: 'dollar-sign',
      category: 'financial'
    }
  ],
  
  // Error handling
  error: null,
  validationErrors: {}
};

export const useReportsStore = create<ReportsStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // ==========================================
      // Actions para generar reportes
      // ==========================================

      generateReport: async (params: GenerateReportParams) => {
        const { reportType, filters, useClassicFormat = false } = params;
        
        set((state) => {
          state.isGenerating = true;
          state.error = null;
          state.validationErrors = {};
        });

        try {
          // Validar filtros antes de la llamada
          const validation = reportsAPI.validateFilters(filters);
          if (!validation.isValid) {
            throw new Error(validation.errors.join(', '));
          }

          const result = await reportsAPI.generateReport(params);

          set((state) => {
            state.isGenerating = false;
            
            if (useClassicFormat) {
              state.classicReport = result as BalanceSheet;
              state.currentReport = null;
            } else {
              state.currentReport = result as ReportResponse;
              state.classicReport = null;
              
              // Agregar al historial
              state.reportHistory.unshift(result as ReportResponse);
              
              // Mantener solo los últimos 10 reportes
              if (state.reportHistory.length > 10) {
                state.reportHistory = state.reportHistory.slice(0, 10);
              }
            }
            
            state.selectedReportType = reportType;
            state.currentFilters = filters;
          });

        } catch (error) {
          set((state) => {
            state.isGenerating = false;
            state.error = error instanceof Error ? error.message : 'Error al generar reporte';
            state.currentReport = null;
            state.classicReport = null;
          });
          throw error;
        }
      },

      generateBalanceGeneral: async (filters: ReportFilters) => {
        await get().generateReport({
          reportType: 'balance_general',
          filters,
          useClassicFormat: false
        });
      },

      generatePerdidasGanancias: async (filters: ReportFilters) => {
        await get().generateReport({
          reportType: 'p_g',
          filters,
          useClassicFormat: false
        });
      },

      generateFlujoEfectivo: async (filters: ReportFilters) => {
        await get().generateReport({
          reportType: 'flujo_efectivo',
          filters,
          useClassicFormat: false
        });
      },

      // ==========================================
      // Actions para gestión de filtros
      // ==========================================

      setFilters: (newFilters: Partial<ReportFilters>) => {
        set((state) => {
          state.currentFilters = { ...state.currentFilters, ...newFilters };
          state.validationErrors = {};
        });
      },

      resetFilters: () => {
        set((state) => {
          state.currentFilters = reportsAPI.getDefaultFilters(state.selectedReportType);
          state.validationErrors = {};
        });
      },

      setReportType: (reportType: ReportType) => {
        set((state) => {
          state.selectedReportType = reportType;
          state.currentFilters = reportsAPI.getDefaultFilters(reportType);
          state.error = null;
        });
      },

      setDetailLevel: (level: DetailLevel) => {
        set((state) => {
          state.currentFilters.detail_level = level;
        });
      },

      setDateRange: (from_date: string, to_date: string) => {
        set((state) => {
          state.currentFilters.from_date = from_date;
          state.currentFilters.to_date = to_date;
          state.validationErrors = {};
        });
      },

      // ==========================================
      // Actions para gestión de estado
      // ==========================================

      clearCurrentReport: () => {
        set((state) => {
          state.currentReport = null;
          state.classicReport = null;
          state.error = null;
        });
      },

      clearError: () => {
        set((state) => {
          state.error = null;
          state.validationErrors = {};
        });
      },

      setError: (error: string) => {
        set((state) => {
          state.error = error;
        });
      },

      addToHistory: (report: ReportResponse) => {
        set((state) => {
          state.reportHistory.unshift(report);
          if (state.reportHistory.length > 10) {
            state.reportHistory = state.reportHistory.slice(0, 10);
          }
        });
      },

      // ==========================================
      // Actions para exportación
      // ==========================================

      exportToPDF: async (includeNarrative: boolean = true) => {
        const { currentReport, classicReport } = get();
        const reportData = currentReport || classicReport;
        
        if (!reportData) {
          throw new Error('No hay reporte para exportar');
        }

        set((state) => {
          state.isExporting = true;
          state.error = null;
        });

        try {
          const blob = await reportsAPI.exportToPDF(reportData, { includeNarrative });
          
          // Crear URL para descarga
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-${get().selectedReportType}-${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Error al exportar a PDF';
          });
          throw error;
        } finally {
          set((state) => {
            state.isExporting = false;
          });
        }
      },

      exportToExcel: async () => {
        const { currentReport, classicReport } = get();
        const reportData = currentReport || classicReport;
        
        if (!reportData) {
          throw new Error('No hay reporte para exportar');
        }

        set((state) => {
          state.isExporting = true;
          state.error = null;
        });

        try {
          const blob = await reportsAPI.exportToExcel(reportData);
          
          // Crear URL para descarga
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-${get().selectedReportType}-${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Error al exportar a Excel';
          });
          throw error;
        } finally {
          set((state) => {
            state.isExporting = false;
          });
        }
      },

      exportToCSV: async () => {
        const { currentReport, classicReport } = get();
        const reportData = currentReport || classicReport;
        
        if (!reportData) {
          throw new Error('No hay reporte para exportar');
        }

        set((state) => {
          state.isExporting = true;
          state.error = null;
        });

        try {
          const blob = await reportsAPI.exportToCSV(reportData);
          
          // Crear URL para descarga
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte-${get().selectedReportType}-${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Error al exportar a CSV';
          });
          throw error;
        } finally {
          set((state) => {
            state.isExporting = false;
          });
        }
      },

      // ==========================================
      // Actions para tipos de reportes
      // ==========================================

      loadReportTypes: async () => {
        try {
          const types = await reportsAPI.getReportTypes();
          set((state) => {
            state.availableReportTypes = types;
          });
        } catch (error) {
          console.error('Error cargando tipos de reportes:', error);
          // No actualizar el estado para mantener los tipos por defecto
        }
      },

      // ==========================================
      // Actions de utilidad
      // ==========================================

      validateFilters: () => {
        const { currentFilters } = get();
        return reportsAPI.validateFilters(currentFilters);
      },

      getDefaultFilters: () => {
        const { selectedReportType } = get();
        return reportsAPI.getDefaultFilters(selectedReportType);
      }
    })),    {
      name: 'reports-store',
      partialize: (state: ReportsStore) => ({
        // Solo persistir configuraciones, no reportes generados
        selectedReportType: state.selectedReportType,
        currentFilters: state.currentFilters
      })
    }
  )
);

// Selectores útiles
export const useReportsSelectors = () => {
  const store = useReportsStore();
  
  return {
    // Estado del reporte actual
    currentReport: store.currentReport,
    isGenerating: store.isGenerating,
    error: store.error,
    
    // Configuraciones
    filters: store.currentFilters,
    reportType: store.selectedReportType,
    reportTypes: store.availableReportTypes,
    
    // Historial
    history: store.reportHistory,
    
    // Estados de carga
    isExporting: store.isExporting,
    
    // Acciones principales
    generateReport: store.generateReport,
    setFilters: store.setFilters,
    exportToPDF: store.exportToPDF,
    exportToExcel: store.exportToExcel,
    clearError: store.clearError
  };
};
