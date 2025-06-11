// ==========================================
// Utilidades para el módulo de reportes
// ==========================================

import type { ReportResponse, ReportFilters, ReportType, AccountReportItem } from '../types';

// ==========================================
// Date utilities
// ==========================================

export const dateUtils = {
  /**
   * Obtiene el primer día del mes actual
   */
  getStartOfMonth(): string {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  },

  /**
   * Obtiene el último día del mes actual
   */
  getEndOfMonth(): string {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
  },

  /**
   * Obtiene el primer día del año actual
   */
  getStartOfYear(): string {
    const date = new Date();
    return new Date(date.getFullYear(), 0, 1).toISOString().split('T')[0];
  },

  /**
   * Obtiene la fecha actual
   */
  getToday(): string {
    return new Date().toISOString().split('T')[0];
  },

  /**
   * Obtiene fechas para períodos predefinidos
   */
  getPeriodDates(period: 'thisMonth' | 'lastMonth' | 'thisYear' | 'lastYear' | 'thisQuarter' | 'lastQuarter'): {
    from_date: string;
    to_date: string;
  } {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    switch (period) {
      case 'thisMonth':
        return {
          from_date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
          to_date: today.toISOString().split('T')[0]
        };

      case 'lastMonth':
        return {
          from_date: new Date(currentYear, currentMonth - 1, 1).toISOString().split('T')[0],
          to_date: new Date(currentYear, currentMonth, 0).toISOString().split('T')[0]
        };

      case 'thisYear':
        return {
          from_date: new Date(currentYear, 0, 1).toISOString().split('T')[0],
          to_date: today.toISOString().split('T')[0]
        };

      case 'lastYear':
        return {
          from_date: new Date(currentYear - 1, 0, 1).toISOString().split('T')[0],
          to_date: new Date(currentYear - 1, 11, 31).toISOString().split('T')[0]
        };

      case 'thisQuarter':
        const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
        return {
          from_date: new Date(currentYear, quarterStartMonth, 1).toISOString().split('T')[0],
          to_date: today.toISOString().split('T')[0]
        };

      case 'lastQuarter':
        const lastQuarterStartMonth = Math.floor(currentMonth / 3) * 3 - 3;
        const lastQuarterYear = lastQuarterStartMonth < 0 ? currentYear - 1 : currentYear;
        const adjustedStartMonth = lastQuarterStartMonth < 0 ? 9 : lastQuarterStartMonth;
        return {
          from_date: new Date(lastQuarterYear, adjustedStartMonth, 1).toISOString().split('T')[0],
          to_date: new Date(lastQuarterYear, adjustedStartMonth + 3, 0).toISOString().split('T')[0]
        };

      default:
        return {
          from_date: this.getStartOfMonth(),
          to_date: this.getToday()
        };
    }
  },

  /**
   * Valida que una fecha esté en formato correcto
   */
  isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  },

  /**
   * Formatea una fecha para mostrar en UI
   */
  formatDisplayDate(dateString: string, locale: string = 'es-CO'): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

// ==========================================
// Currency utilities
// ==========================================

export const currencyUtils = {
  /**
   * Formatea un valor monetario
   */
  format(amount: string | number, currency: string = 'COP'): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
    
    if (isNaN(numAmount)) return '$0';

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  },

  /**
   * Convierte string de moneda a número
   */
  toNumber(currencyString: string): number {
    return parseFloat(currencyString.replace(/[$,]/g, '')) || 0;
  },

  /**
   * Calcula la variación porcentual entre dos valores
   */
  calculateVariation(current: string | number, previous: string | number): number {
    const currentNum = typeof current === 'string' ? this.toNumber(current) : current;
    const previousNum = typeof previous === 'string' ? this.toNumber(previous) : previous;
    
    if (previousNum === 0) return currentNum > 0 ? 100 : 0;
    
    return ((currentNum - previousNum) / previousNum) * 100;
  }
};

// ==========================================
// Report validation utilities
// ==========================================

export const validationUtils = {
  /**
   * Valida filtros de reporte
   */
  validateReportFilters(filters: ReportFilters): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar fechas requeridas
    if (!filters.from_date) {
      errors.push('La fecha de inicio es requerida');
    }
    if (!filters.to_date) {
      errors.push('La fecha de fin es requerida');
    }

    // Validar formato de fechas
    if (filters.from_date && !dateUtils.isValidDate(filters.from_date)) {
      errors.push('Fecha de inicio inválida');
    }
    if (filters.to_date && !dateUtils.isValidDate(filters.to_date)) {
      errors.push('Fecha de fin inválida');
    }

    // Validar rango de fechas
    if (filters.from_date && filters.to_date) {
      if (new Date(filters.from_date) > new Date(filters.to_date)) {
        errors.push('La fecha de inicio no puede ser mayor que la fecha de fin');
      }

      // Validar período máximo para reportes detallados
      if (filters.detail_level === 'alto') {
        const diffTime = Math.abs(new Date(filters.to_date).getTime() - new Date(filters.from_date).getTime());
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
        
        if (diffYears > 2) {
          errors.push('El período no puede ser mayor a 2 años para reportes detallados');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Valida que un reporte tenga la estructura correcta
   */
  validateReportStructure(report: ReportResponse): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!report.success) {
      errors.push('El reporte indica que no fue exitoso');
    }

    if (!report.table || !report.table.sections) {
      errors.push('El reporte no contiene secciones de datos');
    }

    if (report.table?.sections) {
      report.table.sections.forEach((section, index) => {
        if (!section.section_name) {
          errors.push(`Sección ${index + 1} no tiene nombre`);
        }
        if (!section.items || !Array.isArray(section.items)) {
          errors.push(`Sección ${section.section_name} no contiene items válidos`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// ==========================================
// Data transformation utilities
// ==========================================

export const transformUtils = {
  /**
   * Convierte reporte a formato CSV
   */
  reportToCSV(report: ReportResponse): string {
    const lines: string[] = [];
    
    // Header
    lines.push(`"${report.project_context}"`);
    lines.push(`"${dateUtils.formatDisplayDate(report.period.from_date)} - ${dateUtils.formatDisplayDate(report.period.to_date)}"`);
    lines.push('');

    // Sections
    report.table.sections.forEach(section => {
      lines.push(`"${section.section_name}"`);
      lines.push('"Código","Cuenta","Saldo Inicial","Movimientos","Saldo Final"');
      
      section.items.forEach(item => {
        lines.push(`"${item.account_code}","${item.account_name}","${item.opening_balance}","${item.movements}","${item.closing_balance}"`);
      });
      
      lines.push(`"TOTAL","${section.section_name}","","","${section.total}"`);
      lines.push('');
    });

    return lines.join('\n');
  },

  /**
   * Aplana la estructura jerárquica de cuentas
   */
  flattenAccountItems(items: AccountReportItem[]): AccountReportItem[] {
    const flattened: AccountReportItem[] = [];
    
    const addItemsRecursively = (itemList: AccountReportItem[], level: number = 0) => {
      itemList.forEach(item => {
        flattened.push({ ...item, level });
        if (item.children && item.children.length > 0) {
          addItemsRecursively(item.children, level + 1);
        }
      });
    };

    addItemsRecursively(items);
    return flattened;
  },

  /**
   * Agrupa items por tipo de cuenta
   */
  groupItemsByAccountType(items: AccountReportItem[]): Record<string, AccountReportItem[]> {
    return items.reduce((groups, item) => {
      const group = item.account_group || 'OTHER';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    }, {} as Record<string, AccountReportItem[]>);
  }
};

// ==========================================
// Storage utilities
// ==========================================

export const storageUtils = {
  /**
   * Guarda filtros en localStorage
   */
  saveFilters(filters: ReportFilters): void {
    try {
      localStorage.setItem('reportFilters', JSON.stringify(filters));
    } catch (error) {
      console.warn('No se pudieron guardar los filtros:', error);
    }
  },

  /**
   * Carga filtros desde localStorage
   */
  loadFilters(): ReportFilters | null {
    try {
      const saved = localStorage.getItem('reportFilters');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('No se pudieron cargar los filtros:', error);
      return null;
    }
  },

  /**
   * Guarda configuración de usuario
   */
  saveUserPreferences(preferences: {
    defaultDetailLevel?: string;
    defaultReportType?: ReportType;
    autoRefresh?: boolean;
  }): void {
    try {
      localStorage.setItem('reportPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.warn('No se pudieron guardar las preferencias:', error);
    }
  },

  /**
   * Carga configuración de usuario
   */
  loadUserPreferences(): any {
    try {
      const saved = localStorage.getItem('reportPreferences');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('No se pudieron cargar las preferencias:', error);
      return {};
    }
  }
};

// ==========================================
// Export utilities
// ==========================================

export const exportUtils = {
  /**
   * Descarga un archivo blob
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Genera nombre de archivo para exportación
   */
  generateFilename(reportType: ReportType, format: string, date?: string): string {
    const dateStr = date || new Date().toISOString().split('T')[0];    const typeNames: Record<string, string> = {
      'balance_general': 'balance-general',
      'p_g': 'perdidas-ganancias',
      'flujo_efectivo': 'flujo-efectivo',
      'balance_comprobacion': 'balance-comprobacion'
    };
    
    const typeName = typeNames[reportType] || reportType;
    return `${typeName}-${dateStr}.${format}`;
  }
};

// ==========================================
// Report comparison utilities
// ==========================================

export const comparisonUtils = {
  /**
   * Compara dos reportes del mismo tipo
   */
  compareReports(current: ReportResponse, previous: ReportResponse): {
    totalVariations: Record<string, number>;
    sectionVariations: Array<{
      section: string;
      variation: number;
      items: Array<{
        account: string;
        variation: number;
      }>;
    }>;
  } {
    const totalVariations: Record<string, number> = {};
    const sectionVariations: any[] = [];

    // Compare totals
    Object.keys(current.table.totals).forEach(key => {
      if (previous.table.totals[key]) {
        const currentValue = currencyUtils.toNumber(current.table.totals[key]);
        const previousValue = currencyUtils.toNumber(previous.table.totals[key]);
        totalVariations[key] = currencyUtils.calculateVariation(currentValue, previousValue);
      }
    });

    // Compare sections
    current.table.sections.forEach(currentSection => {
      const previousSection = previous.table.sections.find(s => s.section_name === currentSection.section_name);
      
      if (previousSection) {
        const currentTotal = currencyUtils.toNumber(currentSection.total);
        const previousTotal = currencyUtils.toNumber(previousSection.total);
        const sectionVariation = currencyUtils.calculateVariation(currentTotal, previousTotal);

        const itemVariations: any[] = [];
        currentSection.items.forEach(currentItem => {
          const previousItem = previousSection.items.find(i => i.account_code === currentItem.account_code);
          if (previousItem) {
            const currentAmount = currencyUtils.toNumber(currentItem.closing_balance);
            const previousAmount = currencyUtils.toNumber(previousItem.closing_balance);
            const variation = currencyUtils.calculateVariation(currentAmount, previousAmount);
            
            itemVariations.push({
              account: currentItem.account_name,
              variation
            });
          }
        });

        sectionVariations.push({
          section: currentSection.section_name,
          variation: sectionVariation,
          items: itemVariations
        });
      }
    });

    return {
      totalVariations,
      sectionVariations
    };
  }
};
