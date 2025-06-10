import { useState, useCallback } from 'react';
import { DataImportService } from '../services';
import type {
  ImportConfiguration,
  ImportPreviewData,
  ImportResult,
  ImportStatus,
  ImportFileUpload,
  ValidationError
} from '../types';
import { useToast } from '@/shared/hooks';

interface UseDataImportState {
  isLoading: boolean;
  previewData: ImportPreviewData | null;
  importResult: ImportResult | null;
  importStatus: ImportStatus | null;
  errors: ValidationError[];
  configuration: ImportConfiguration | null;
}

const initialState: UseDataImportState = {
  isLoading: false,
  previewData: null,
  importResult: null,
  importStatus: null,
  errors: [],
  configuration: null,
};

export function useDataImport() {
  const [state, setState] = useState<UseDataImportState>(initialState);
  const { success, error, warning } = useToast();

  /**
   * Resetea el estado del hook
   */
  const resetState = useCallback(() => {
    setState(initialState);
  }, []);

  /**
   * Actualiza la configuración
   */
  const updateConfiguration = useCallback((config: Partial<ImportConfiguration>) => {
    setState(prev => ({
      ...prev,
      configuration: prev.configuration ? { ...prev.configuration, ...config } : null
    }));
  }, []);

  /**
   * Carga y previsualiza un archivo
   */  const uploadAndPreview = useCallback(async (uploadData: ImportFileUpload) => {
    setState(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      const previewData = await DataImportService.uploadAndPreview(uploadData);
      
      console.log('Hook received preview data:', previewData);
      console.log('Hook preview data validation errors:', previewData.validation_errors);
      console.log('Hook preview data total rows:', previewData.total_rows);
      
      const defaultConfig = DataImportService.getDefaultConfiguration(uploadData.data_type);
      
      console.log('Hook default config:', defaultConfig);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        previewData,
        configuration: { ...defaultConfig, ...uploadData },
        errors: previewData.validation_errors || []
      }));

      console.log('Hook state updated with preview data');

      if (previewData.validation_errors?.length > 0) {
        warning(
          'Errores de validación encontrados',
          `Se encontraron ${previewData.validation_errors.length} errores de validación`
        );
      } else {
        success('Archivo validado', 'Archivo cargado y validado correctamente');
      }

      return previewData;
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      error('Error al cargar archivo', 'No se pudo cargar el archivo');
      throw err;
    }
  }, [success, error, warning]);
  /**
   * Importa datos desde un archivo
   */
  const importFromFile = useCallback(async (
    file: File,
    configuration: ImportConfiguration
  ) => {
    console.log('🎣 === HOOK: INICIANDO IMPORTACIÓN ===');
    console.log('📁 Archivo en hook:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    console.log('⚙️ Configuración en hook:', JSON.stringify(configuration, null, 2));

    setState(prev => ({ ...prev, isLoading: true, errors: [] }));

    try {
      console.log('🚀 Hook: Llamando a DataImportService.importFromFile...');
      const result = await DataImportService.importFromFile(file, configuration);
      console.log('✅ Hook: Resultado recibido del servicio:', result);
        setState(prev => ({
        ...prev,
        isLoading: false,
        importResult: result,
        errors: result.global_errors || []
      }));

      if (result.status === 'completed') {
        success(
          'Importación completada',
          `${result.summary.successful_rows} filas procesadas correctamente`
        );
      } else if (result.status === 'partial') {
        warning(
          'Importación parcial',
          `${result.summary.successful_rows} exitosas, ${result.summary.error_rows} con errores`
        );
      } else {
        error('Importación fallida', 'La importación no pudo completarse');
      }

      console.log('✅ Hook: Estado actualizado, retornando resultado');
      return result;
    } catch (err) {
      console.error('❌ Hook: Error durante importación:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      error('Error durante importación', 'Error durante la importación');
      throw err;
    }
  }, [success, error, warning]);

  /**
   * Obtiene el estado de una importación en progreso
   */
  const getImportStatus = useCallback(async (importId: string) => {
    try {
      const status = await DataImportService.getImportStatus(importId);
      setState(prev => ({ ...prev, importStatus: status }));
      return status;
    } catch (err) {
      error('Error de estado', 'Error al obtener el estado de la importación');
      throw err;
    }
  }, [error]);

  /**
   * Cancela una importación en progreso
   */
  const cancelImport = useCallback(async (importId: string) => {
    try {
      await DataImportService.cancelImport(importId);
      setState(prev => ({
        ...prev,
        importStatus: prev.importStatus ? { ...prev.importStatus, status: 'cancelled' } : null
      }));
      success('Importación cancelada', 'La importación fue cancelada');
    } catch (err) {
      error('Error al cancelar', 'Error al cancelar la importación');
      throw err;
    }
  }, [success, error]);

  /**
   * Valida un archivo antes de importar
   */
  const validateFile = useCallback(async (
    file: File,
    dataType: 'accounts' | 'journal_entries'
  ) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const validation = await DataImportService.validateFile(file, dataType);
      setState(prev => ({ ...prev, isLoading: false }));

      if (!validation.is_valid) {
        error('Archivo inválido', `Archivo inválido: ${validation.errors.join(', ')}`);
      }

      return validation;
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      error('Error de validación', 'Error al validar el archivo');
      throw err;
    }
  }, [error]);

  return {
    // Estado
    ...state,
    
    // Acciones
    resetState,
    updateConfiguration,
    uploadAndPreview,
    importFromFile,
    getImportStatus,
    cancelImport,
    validateFile,
    
    // Helpers
    hasErrors: state.errors.some(e => e.severity === 'error'),
    hasWarnings: state.errors.some(e => e.severity === 'warning'),
    canImport: state.previewData && !state.errors.some(e => e.severity === 'error'),
  };
}
