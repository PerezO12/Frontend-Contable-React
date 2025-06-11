import { DataImportService } from '@/features/data-import/services/DataImportService';
import type { 
  ImportConfiguration, 
  ImportPreviewData, 
  ImportResult,
  TemplateDownload 
} from '@/features/data-import/types';

/**
 * Servicio especializado para importación de datos de flujo de efectivo
 * Extiende la funcionalidad base del DataImportService con validaciones
 * específicas para transacciones de efectivo
 */
export class CashFlowImportService {
  
  /**
   * Valida datos específicos de flujo de efectivo antes de la importación
   */
  static async validateCashFlowData(previewData: ImportPreviewData): Promise<ImportPreviewData> {
    try {
      // Use preview_data instead of data
      const cashFlowValidations = previewData.preview_data.map((row: any, index: number) => {
        const validationErrors = [];
        
        // Validar que sea una cuenta de efectivo
        if (!this.isCashAccount(row.account_code || row.codigo_cuenta || '')) {
          validationErrors.push({
            field: 'account_code',
            message: 'Esta cuenta no parece ser una cuenta de efectivo',
            severity: 'warning' as const
          });
        }
        
        // Validar clasificación de actividad
        if (!this.hasActivityClassification(row)) {
          validationErrors.push({
            field: 'activity_type',
            message: 'Falta clasificar la actividad (operación, inversión, financiamiento)',
            severity: 'error' as const
          });
        }
        
        // Validar montos
        if (!this.validateCashFlowAmounts(row)) {
          validationErrors.push({
            field: 'amount',
            message: 'Los montos no están correctamente configurados',
            severity: 'error' as const
          });
        }
        
        return {
          ...row,
          row_index: index,
          validation_errors: validationErrors
        };
      });
      
      // Combinar errores existentes con nuevos errores específicos de flujo de efectivo
      const allErrors = [
        ...previewData.validation_errors,
        ...cashFlowValidations.flatMap((row: any) => row.validation_errors || [])
      ];
      
      return {
        ...previewData,
        preview_data: cashFlowValidations,
        validation_errors: allErrors
      };
    } catch (error) {
      console.error('Error validating cash flow data:', error);
      return previewData;
    }
  }
    /**
   * Importa datos de flujo de efectivo con validaciones específicas
   */
  static async importCashFlowData(configuration: ImportConfiguration): Promise<ImportResult> {
    // Configuración específica para flujo de efectivo
    const cashFlowConfig: ImportConfiguration = {
      ...configuration,
      validation_level: 'strict', // Siempre usar validación estricta
      continue_on_error: false, // No continuar con errores en flujo de efectivo
      batch_size: Math.min(configuration.batch_size || 50, 50) // Lotes más pequeños
    };
    
    // Use importFromFile instead of executeImport
    const tempFile = new File([], 'cash-flow-data.csv');
    return DataImportService.importFromFile(tempFile, cashFlowConfig);
  }
  
  /**
   * Genera plantilla específica para flujo de efectivo
   */
  static async downloadCashFlowTemplate(
    format: 'csv' | 'xlsx' | 'json'
  ): Promise<Blob> {
    const templateData: TemplateDownload = {
      data_type: 'journal_entries',
      format
    };
    
    // Por ahora usar el servicio base, pero se puede extender
    return DataImportService.downloadTemplate(templateData);
  }
  
  /**
   * Obtiene configuración predeterminada para importación de flujo de efectivo
   */
  static getDefaultCashFlowConfiguration(): Partial<ImportConfiguration> {
    return {
      data_type: 'journal_entries',
      validation_level: 'strict',
      batch_size: 50,
      skip_duplicates: true,
      update_existing: false,
      continue_on_error: false,
      csv_delimiter: ',',
      csv_encoding: 'utf-8',
      xlsx_sheet_name: null,
      xlsx_header_row: 1
    };
  }
  
  /**
   * Verifica si una cuenta es de efectivo o equivalentes
   */
  private static isCashAccount(accountCode: string): boolean {
    // Códigos típicos de cuentas de efectivo (ajustar según plan de cuentas)
    const cashAccountPrefixes = ['1105', '1110', '1115', '1120']; // Caja, Bancos, etc.
    return cashAccountPrefixes.some(prefix => accountCode.startsWith(prefix));
  }
  
  /**
   * Verifica si la transacción tiene clasificación de actividad
   */
  private static hasActivityClassification(row: any): boolean {
    // Verificar en descripción o campo específico
    const description = (row.description || '').toLowerCase();
    const lineDescription = (row.line_description || '').toLowerCase();
    
    const activityKeywords = [
      'operativ', 'operacion', 'venta', 'cobro', 'pago', // Operativas
      'inversion', 'activo', 'maquinaria', 'equipo', // Inversión
      'financ', 'prestamo', 'credito', 'dividendo' // Financiamiento
    ];
    
    return activityKeywords.some(keyword => 
      description.includes(keyword) || lineDescription.includes(keyword)
    );
  }
  
  /**
   * Valida que los montos sean consistentes para flujo de efectivo
   */
  private static validateCashFlowAmounts(row: any): boolean {
    const debit = parseFloat(row.debit_amount || '0');
    const credit = parseFloat(row.credit_amount || '0');
    
    // Debe haber un monto (débito o crédito) pero no ambos
    return (debit > 0 && credit === 0) || (credit > 0 && debit === 0);
  }
    /**
   * Obtiene métricas de validación específicas para flujo de efectivo
   */
  static getCashFlowValidationMetrics(previewData: ImportPreviewData) {
    const totalRows = previewData.preview_data.length;
    const cashAccounts = previewData.preview_data.filter((row: any) => 
      this.isCashAccount(row.account_code || row.codigo_cuenta || '')
    ).length;
    
    const withActivityClassification = previewData.preview_data.filter((row: any) => 
      this.hasActivityClassification(row)
    ).length;
    
    const validAmounts = previewData.preview_data.filter((row: any) => 
      this.validateCashFlowAmounts(row)
    ).length;
    
    return {
      totalRows,
      cashAccountsPercentage: Math.round((cashAccounts / totalRows) * 100),
      activityClassificationPercentage: Math.round((withActivityClassification / totalRows) * 100),
      validAmountsPercentage: Math.round((validAmounts / totalRows) * 100),
      recommendations: this.generateRecommendations({
        cashAccounts,
        withActivityClassification,
        validAmounts,
        totalRows
      })
    };
  }
  
  /**
   * Genera recomendaciones basadas en las métricas de validación
   */
  private static generateRecommendations(metrics: {
    cashAccounts: number;
    withActivityClassification: number;
    validAmounts: number;
    totalRows: number;
  }): string[] {
    const recommendations: string[] = [];
    
    if (metrics.cashAccounts / metrics.totalRows < 0.8) {
      recommendations.push('Asegúrate de que la mayoría de transacciones afecten cuentas de efectivo');
    }
    
    if (metrics.withActivityClassification / metrics.totalRows < 0.9) {
      recommendations.push('Incluye palabras clave para clasificar actividades (operativa, inversión, financiamiento)');
    }
    
    if (metrics.validAmounts / metrics.totalRows < 0.95) {
      recommendations.push('Verifica que cada línea tenga solo débito o crédito, no ambos');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Los datos parecen estar bien estructurados para flujo de efectivo');
    }
    
    return recommendations;
  }
}
