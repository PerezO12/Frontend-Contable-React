import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks';
import { CashFlowImportService } from '../services/cashFlowImportService';
import type { 
  ImportConfiguration, 
  ImportPreviewData, 
  ImportResult 
} from '@/features/data-import/types';

interface UseCashFlowImportState {
  isValidating: boolean;
  validationMetrics: any | null;
  importRecommendations: string[];
}

interface UseCashFlowImportReturn extends UseCashFlowImportState {
  validateCashFlowData: (previewData: ImportPreviewData) => Promise<ImportPreviewData>;
  importCashFlowData: (configuration: ImportConfiguration) => Promise<ImportResult>;
  getValidationMetrics: (previewData: ImportPreviewData) => any;
  downloadCashFlowTemplate: (format: 'csv' | 'xlsx' | 'json') => Promise<void>;
  resetValidation: () => void;
}

export const useCashFlowImport = (): UseCashFlowImportReturn => {
  const [state, setState] = useState<UseCashFlowImportState>({
    isValidating: false,
    validationMetrics: null,
    importRecommendations: []
  });
  const { success, error, warning } = useToast();

  /**
   * Valida datos específicos para flujo de efectivo
   */
  const validateCashFlowData = useCallback(async (previewData: ImportPreviewData) => {
    setState(prev => ({ ...prev, isValidating: true }));
    
    try {
      // Realizar validación específica de flujo de efectivo
      const validatedData = await CashFlowImportService.validateCashFlowData(previewData);
      
      // Obtener métricas de validación
      const metrics = CashFlowImportService.getCashFlowValidationMetrics(validatedData);
      
      setState(prev => ({
        ...prev,
        isValidating: false,
        validationMetrics: metrics,
        importRecommendations: metrics.recommendations
      }));

      // Mostrar advertencias si es necesario
      if (metrics.cashAccountsPercentage < 80) {
        warning(
          'Validación de cuentas de efectivo',
          `Solo ${metrics.cashAccountsPercentage}% de las transacciones afectan cuentas de efectivo`
        );
      }

      if (metrics.activityClassificationPercentage < 90) {
        warning(
          'Clasificación de actividades',
          `${metrics.activityClassificationPercentage}% de las transacciones tienen clasificación de actividad`
        );
      }

      // Mostrar éxito si todo está bien
      if (metrics.cashAccountsPercentage >= 80 && 
          metrics.activityClassificationPercentage >= 90 && 
          metrics.validAmountsPercentage >= 95) {
        success(
          'Datos validados',
          'Los datos están correctamente estructurados para flujo de efectivo'
        );
      }

      return validatedData;
    } catch (err) {
      setState(prev => ({ ...prev, isValidating: false }));
      error('Error de validación', 'No se pudieron validar los datos de flujo de efectivo');
      throw err;
    }
  }, [success, error, warning]);

  /**
   * Importa datos de flujo de efectivo con configuración específica
   */
  const importCashFlowData = useCallback(async (configuration: ImportConfiguration) => {
    try {
      const result = await CashFlowImportService.importCashFlowData(configuration);
      
      if (result.status === 'completed') {
        success(
          'Importación completada',
          `Se importaron ${result.summary.successful_rows} transacciones de flujo de efectivo`
        );
      } else if (result.status === 'partial') {
        warning(
          'Importación parcial',
          `Se importaron ${result.summary.successful_rows} de ${result.summary.total_rows} transacciones`
        );
      } else {
        error(
          'Error en importación',
          'No se pudieron importar las transacciones de flujo de efectivo'
        );
      }

      return result;
    } catch (err) {
      error('Error de importación', 'Error al importar datos de flujo de efectivo');
      throw err;
    }
  }, [success, error, warning]);

  /**
   * Obtiene métricas de validación para datos de vista previa
   */
  const getValidationMetrics = useCallback((previewData: ImportPreviewData) => {
    return CashFlowImportService.getCashFlowValidationMetrics(previewData);
  }, []);

  /**
   * Descarga plantilla específica de flujo de efectivo
   */  const downloadCashFlowTemplate = useCallback(async (
    format: 'csv' | 'xlsx' | 'json'
  ) => {
    try {
      const blob = await CashFlowImportService.downloadCashFlowTemplate(format);
        // Generar nombre de archivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const filename = `plantilla_flujo_efectivo_${timestamp}.${format}`;
      
      // Crear y descargar archivo
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      success(
        'Plantilla descargada',
        `Plantilla de flujo de efectivo descargada en formato ${format.toUpperCase()}`
      );
    } catch (err) {
      error('Error de descarga', 'No se pudo descargar la plantilla de flujo de efectivo');
    }
  }, [success, error]);

  /**
   * Resetea el estado de validación
   */
  const resetValidation = useCallback(() => {
    setState({
      isValidating: false,
      validationMetrics: null,
      importRecommendations: []
    });
  }, []);

  return {
    ...state,
    validateCashFlowData,
    importCashFlowData,
    getValidationMetrics,
    downloadCashFlowTemplate,
    resetValidation
  };
};
