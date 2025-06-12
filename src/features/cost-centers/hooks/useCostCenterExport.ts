import { useState, useCallback } from 'react';
import { CostCenterService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import type { CostCenterFilters } from '../types';

interface UseCostCenterExportOptions {
  onSuccess?: (exportedCount: number, format: string) => void;
  onError?: (error: string) => void;
}

interface ExportProgress {
  current: number;
  total: number;
  message: string;
}

export const useCostCenterExport = (options: UseCostCenterExportOptions = {}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const { success, error: showError } = useToast();

  const exportCostCenters = useCallback(async (
    costCenterIds: string[],
    format: 'csv' | 'json' | 'xlsx',
    fileName?: string
  ) => {
    setIsExporting(true);
    setExportProgress({
      current: 0,
      total: 100,
      message: 'Iniciando exportación...'
    });

    try {
      setExportProgress({
        current: 25,
        total: 100,
        message: 'Procesando centros de costo...'
      });

      const blob = await CostCenterService.exportCostCenters(costCenterIds, format);
      
      setExportProgress({
        current: 75,
        total: 100,
        message: 'Generando archivo...'
      });

      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `centros_de_costo.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportProgress({
        current: 100,
        total: 100,
        message: 'Exportación completada'
      });

      success(`${costCenterIds.length} centro${costCenterIds.length === 1 ? '' : 's'} de costo exportado${costCenterIds.length === 1 ? '' : 's'} exitosamente`);
      options.onSuccess?.(costCenterIds.length, format);
    } catch (error) {
      console.error('Error al exportar centros de costo:', error);
      const errorMsg = error instanceof Error 
        ? `Error al exportar: ${error.message}`
        : 'Error al exportar los centros de costo. Inténtelo nuevamente.';
      
      showError(errorMsg);
      options.onError?.(errorMsg);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  }, [success, showError, options]);

  const exportCostCentersAdvanced = useCallback(async (
    format: 'csv' | 'json' | 'xlsx',
    filters?: CostCenterFilters,
    selectedColumns?: string[],
    fileName?: string
  ) => {
    setIsExporting(true);
    setExportProgress({
      current: 0,
      total: 100,
      message: 'Aplicando filtros...'
    });

    try {
      setExportProgress({
        current: 30,
        total: 100,
        message: 'Generando reporte...'
      });

      const blob = await CostCenterService.exportCostCentersAdvanced(format, filters, selectedColumns);
      
      setExportProgress({
        current: 75,
        total: 100,
        message: 'Preparando descarga...'
      });

      // Crear y descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `centros_de_costo_avanzado.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setExportProgress({
        current: 100,
        total: 100,
        message: 'Exportación completada'
      });

      success('Exportación avanzada completada exitosamente');
      options.onSuccess?.(0, format); // 0 porque no conocemos el conteo exacto
    } catch (error) {
      console.error('Error al exportar centros de costo:', error);
      const errorMsg = error instanceof Error 
        ? `Error al exportar: ${error.message}`
        : 'Error al exportar los centros de costo. Inténtelo nuevamente.';
      
      showError(errorMsg);
      options.onError?.(errorMsg);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  }, [success, showError, options]);

  const getExportSchema = useCallback(async () => {
    try {
      return await CostCenterService.getExportSchema();
    } catch (error) {
      console.error('Error al obtener esquema de exportación:', error);
      showError('Error al cargar información de exportación');
      return null;
    }
  }, [showError]);

  return {
    isExporting,
    exportProgress,
    exportCostCenters,
    exportCostCentersAdvanced,
    getExportSchema
  };
};
