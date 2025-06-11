// ==========================================
// API Client para Reportes Financieros
// ==========================================

import { apiClient } from '@/shared/api/client';
import type {
  ReportResponse,
  BalanceSheet,
  ReportFilters,
  ReportType,
  ReportTypeInfo,
  GenerateReportParams
} from '../types';

// Base endpoints
const REPORTS_BASE = '/api/v1/reports';

class ReportsAPIService {
  // ==========================================
  // API de Reportes Unificados
  // ==========================================

  /**
   * Genera Balance General con formato unificado
   */
  async generateBalanceGeneral(filters: ReportFilters): Promise<ReportResponse> {
    const params = new URLSearchParams({
      from_date: filters.from_date,
      to_date: filters.to_date,
      ...(filters.project_context && { project_context: filters.project_context }),
      ...(filters.detail_level && { detail_level: filters.detail_level }),
      ...(filters.include_subaccounts !== undefined && { 
        include_subaccounts: filters.include_subaccounts.toString() 
      })
    });

    const response = await apiClient.get<ReportResponse>(
      `${REPORTS_BASE}/balance-general?${params}`
    );
    
    return response.data;
  }

  /**
   * Genera Estado de Pérdidas y Ganancias
   */
  async generatePerdidasGanancias(filters: ReportFilters): Promise<ReportResponse> {
    const params = new URLSearchParams({
      from_date: filters.from_date,
      to_date: filters.to_date,
      ...(filters.project_context && { project_context: filters.project_context }),
      ...(filters.detail_level && { detail_level: filters.detail_level }),
      ...(filters.include_subaccounts !== undefined && { 
        include_subaccounts: filters.include_subaccounts.toString() 
      })
    });

    const response = await apiClient.get<ReportResponse>(
      `${REPORTS_BASE}/perdidas-ganancias?${params}`
    );
    
    return response.data;
  }
  /**
   * Genera Estado de Flujo de Efectivo
   */
  async generateFlujoEfectivo(filters: ReportFilters): Promise<ReportResponse> {
    const params = new URLSearchParams({
      from_date: filters.from_date,
      to_date: filters.to_date,
      ...(filters.project_context && { project_context: filters.project_context }),
      ...(filters.detail_level && { detail_level: filters.detail_level }),
      ...(filters.include_subaccounts !== undefined && { 
        include_subaccounts: filters.include_subaccounts.toString() 
      }),
      // Nuevos parámetros para flujo de efectivo
      ...(filters.cash_flow_method && { method: filters.cash_flow_method }),
      ...(filters.enable_reconciliation !== undefined && { 
        enable_reconciliation: filters.enable_reconciliation.toString() 
      }),
      ...(filters.include_projections !== undefined && { 
        include_projections: filters.include_projections.toString() 
      })
    });

    const response = await apiClient.get<ReportResponse>(
      `${REPORTS_BASE}/flujo-efectivo?${params}`
    );
    
    return response.data;
  }

  // ==========================================
  // API de Reportes Clásicos
  // ==========================================

  /**
   * Genera Balance General clásico
   */
  async generateClassicBalanceSheet(filters: ReportFilters): Promise<BalanceSheet> {
    const params = new URLSearchParams({
      ...(filters.to_date && { as_of_date: filters.to_date }),
      ...(filters.include_zero_balances !== undefined && { 
        include_zero_balances: filters.include_zero_balances.toString() 
      }),
      ...(filters.company_name && { company_name: filters.company_name })
    });

    const response = await apiClient.get<BalanceSheet>(
      `${REPORTS_BASE}/balance-sheet?${params}`
    );
    
    return response.data;
  }

  // ==========================================
  // Gestión de Tipos de Reportes
  // ==========================================

  /**
   * Obtiene todos los tipos de reportes disponibles
   */
  async getReportTypes(): Promise<ReportTypeInfo[]> {
    const response = await apiClient.get<ReportTypeInfo[]>(`${REPORTS_BASE}/tipos`);
    return response.data;
  }

  // ==========================================
  // Método unificado para generar reportes
  // ==========================================

  /**
   * Genera cualquier tipo de reporte basado en los parámetros
   */
  async generateReport(params: GenerateReportParams): Promise<ReportResponse | BalanceSheet> {
    const { reportType, filters, useClassicFormat = false } = params;

    // Si se especifica formato clásico, usar API clásica
    if (useClassicFormat) {
      switch (reportType) {
        case 'balance_general':
          return this.generateClassicBalanceSheet(filters);
        default:
          throw new Error(`Formato clásico no disponible para ${reportType}`);
      }
    }

    // Usar API unificada
    switch (reportType) {
      case 'balance_general':
        return this.generateBalanceGeneral(filters);
      case 'p_g':
        return this.generatePerdidasGanancias(filters);
      case 'flujo_efectivo':
        return this.generateFlujoEfectivo(filters);
      default:
        throw new Error(`Tipo de reporte no soportado: ${reportType}`);
    }
  }

  // ==========================================
  // Utilidades y validaciones
  // ==========================================

  /**
   * Valida los filtros antes de generar reporte
   */
  validateFilters(filters: ReportFilters): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar fechas requeridas
    if (!filters.from_date) {
      errors.push('La fecha de inicio es requerida');
    }
    if (!filters.to_date) {
      errors.push('La fecha de fin es requerida');
    }

    // Validar que la fecha de inicio no sea mayor que la de fin
    if (filters.from_date && filters.to_date) {
      if (new Date(filters.from_date) > new Date(filters.to_date)) {
        errors.push('La fecha de inicio no puede ser mayor que la fecha de fin');
      }
    }

    // Validar período no mayor a 2 años para reportes detallados
    if (filters.from_date && filters.to_date && filters.detail_level === 'alto') {
      const diffTime = Math.abs(new Date(filters.to_date).getTime() - new Date(filters.from_date).getTime());
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
      
      if (diffYears > 2) {
        errors.push('El período no puede ser mayor a 2 años para reportes detallados');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
  /**
   * Genera filtros por defecto basados en el tipo de reporte
   */
  getDefaultFilters(reportType: ReportType): ReportFilters {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const baseFilters: ReportFilters = {
      from_date: startOfMonth.toISOString().split('T')[0],
      to_date: endOfMonth.toISOString().split('T')[0],
      detail_level: 'medio',
      include_subaccounts: false,
      include_zero_balances: false
    };

    // Agregar configuraciones específicas por tipo de reporte
    if (reportType === 'flujo_efectivo') {
      return {
        ...baseFilters,
        cash_flow_method: 'indirect',
        enable_reconciliation: true,
        include_projections: false
      };
    }

    return baseFilters;
  }

  // ==========================================
  // Exportación de reportes
  // ==========================================

  /**
   * Exporta reporte a PDF
   */
  async exportToPDF(reportData: ReportResponse | BalanceSheet, options: {
    includeNarrative?: boolean;
    includeCharts?: boolean;
  } = {}): Promise<Blob> {
    const response = await apiClient.post<Blob>(
      `${REPORTS_BASE}/export/pdf`,
      {
        reportData,
        options
      },
      {
        responseType: 'blob'
      }
    );

    return response.data;
  }

  /**
   * Exporta reporte a Excel
   */
  async exportToExcel(reportData: ReportResponse | BalanceSheet): Promise<Blob> {
    const response = await apiClient.post<Blob>(
      `${REPORTS_BASE}/export/excel`,
      { reportData },
      {
        responseType: 'blob'
      }
    );

    return response.data;
  }

  /**
   * Exporta reporte a CSV
   */
  async exportToCSV(reportData: ReportResponse | BalanceSheet): Promise<Blob> {
    const response = await apiClient.post<Blob>(
      `${REPORTS_BASE}/export/csv`,
      { reportData },
      {
        responseType: 'blob'
      }
    );

    return response.data;
  }
}

// Exportar instancia única
export const reportsAPI = new ReportsAPIService();
export default reportsAPI;
