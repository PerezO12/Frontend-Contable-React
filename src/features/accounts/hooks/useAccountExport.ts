import { useState, useCallback } from 'react';
import { useToast } from '../../../shared/hooks';
import { AccountService } from '../services';
import { ExportService } from '../../../shared/services/exportService';

interface UseAccountExportOptions {
  onSuccess?: (exportedCount: number, format: string) => void;
  onError?: (error: string) => void;
}

export const useAccountExport = (options: UseAccountExportOptions = {}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{
    current: number;
    total: number;
    message: string;
  } | null>(null);

  const { success, error: showError } = useToast();

  const exportAccounts = useCallback(async (
    accountIds: string[],
    format: 'csv' | 'json' | 'xlsx',
    fileName?: string
  ) => {
    if (accountIds.length === 0) {
      const errorMsg = 'Debe seleccionar al menos una cuenta para exportar';
      showError(errorMsg);
      options.onError?.(errorMsg);
      return;
    }

    setIsExporting(true);
    setExportProgress({
      current: 0,
      total: accountIds.length,
      message: 'Preparando exportación...'
    });

    try {
      // Simular progreso (en una implementación real, esto vendría del backend)
      setExportProgress({
        current: accountIds.length / 2,
        total: accountIds.length,
        message: 'Procesando cuentas...'
      });

      const blob = await AccountService.exportAccounts(accountIds, format);
      
      setExportProgress({
        current: accountIds.length,
        total: accountIds.length,
        message: 'Generando archivo...'
      });

      // Generar nombre de archivo único
      const finalFileName = fileName || ExportService.generateFileName('cuentas', format);
      
      // Descargar archivo
      ExportService.downloadBlob(blob, finalFileName);
      
      const successMsg = `Se exportaron ${accountIds.length} cuenta${accountIds.length === 1 ? '' : 's'} exitosamente`;
      success(successMsg);
      options.onSuccess?.(accountIds.length, format);
      
    } catch (error) {
      console.error('Error al exportar cuentas:', error);
      const errorMsg = error instanceof Error 
        ? `Error al exportar: ${error.message}`
        : 'Error al exportar las cuentas. Inténtelo nuevamente.';
      
      showError(errorMsg);
      options.onError?.(errorMsg);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  }, [success, showError, options]);

  const exportAccountsAdvanced = useCallback(async (
    format: 'csv' | 'json' | 'xlsx',
    filters?: {
      account_type?: string;
      category?: string;
      is_active?: boolean;
      parent_id?: string;
      search?: string;
      date_from?: string;
      date_to?: string;
    },
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
        message: 'Consultando datos...'
      });

      const blob = await AccountService.exportAccountsAdvanced(format, filters, selectedColumns);
      
      setExportProgress({
        current: 80,
        total: 100,
        message: 'Generando archivo...'
      });

      // Generar nombre de archivo único
      const finalFileName = fileName || ExportService.generateFileName('cuentas_filtradas', format);
      
      // Descargar archivo
      ExportService.downloadBlob(blob, finalFileName);
      
      setExportProgress({
        current: 100,
        total: 100,
        message: 'Exportación completada'
      });

      const successMsg = `Exportación avanzada completada exitosamente`;
      success(successMsg);
      options.onSuccess?.(0, format); // No sabemos el count exacto en filtros avanzados
      
    } catch (error) {
      console.error('Error al exportar cuentas con filtros:', error);
      const errorMsg = error instanceof Error 
        ? `Error al exportar: ${error.message}`
        : 'Error al exportar las cuentas. Inténtelo nuevamente.';
      
      showError(errorMsg);
      options.onError?.(errorMsg);
    } finally {
      setIsExporting(false);
      setExportProgress(null);
    }
  }, [success, showError, options]);

  const getExportSchema = useCallback(async () => {
    try {
      return await AccountService.getExportSchema();
    } catch (error) {
      console.error('Error al obtener esquema de exportación:', error);
      showError('Error al cargar información de exportación');
      return null;
    }
  }, [showError]);

  return {
    isExporting,
    exportProgress,
    exportAccounts,
    exportAccountsAdvanced,
    getExportSchema
  };
};
