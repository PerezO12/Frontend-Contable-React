import { useState, useCallback, useEffect } from 'react';
import { GenericImportService } from '../services/GenericImportService';
import type {
  WizardState,
  ModelMetadata,
  ColumnMapping,
  ImportPolicy,
  MappingSuggestion,
} from '../types';

interface UseGenericImportWizardResult {
  state: WizardState;
  availableModels: string[];
  modelMetadata?: ModelMetadata;
  
  // Actions
  loadAvailableModels: () => Promise<void>;
  loadImportConfig: () => Promise<void>;
  selectModel: (modelName: string) => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  updateColumnMappings: (mappings: ColumnMapping[]) => void;
  updateImportSettings: (settings: {
    importPolicy?: ImportPolicy;
    skipValidationErrors?: boolean;
    skipErrors?: boolean;
    defaultValues?: Record<string, any>;
    batchSize?: number;
  }) => void;
  generatePreview: () => Promise<void>;
  generateBatchPreview: (batchNumber: number) => Promise<void>;
  validateFullFile: () => Promise<void>;
  executeImport: () => Promise<void>;
  executeImportWithSkipErrors: () => Promise<void>;
  resetWizard: () => void;
  goToStep: (step: WizardState['currentStep']) => void;
  
  // Utilities
  getMappingSuggestions: () => Promise<MappingSuggestion[]>;
  isStepValid: (step: WizardState['currentStep']) => boolean;
  getStepIndex: (step: WizardState['currentStep']) => number;
}

const initialState: WizardState = {
  currentStep: 'upload',
  columnMappings: [],
  importPolicy: 'create_only',
  skipValidationErrors: false,
  skipErrors: false,
  defaultValues: {},
  isLoading: false,
  batchSize: 2000, // Default batch size
};

export function useGenericImportWizard(): UseGenericImportWizardResult {
  const [state, setState] = useState<WizardState>(initialState);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [modelMetadata, setModelMetadata] = useState<ModelMetadata | undefined>();

  // === Carga inicial ===
  
  const loadAvailableModels = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      const models = await GenericImportService.getAvailableModels();
      setAvailableModels(models);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error cargando modelos disponibles'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // === Carga de configuración de importación ===
  
  const loadImportConfig = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      const config = await GenericImportService.getImportConfig();
      setState(prev => ({ 
        ...prev, 
        importConfig: config,
        batchSize: config.batch_size.default,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error cargando configuración de importación'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // === Selección de modelo ===
  
  const selectModel = useCallback(async (modelName: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      const metadata = await GenericImportService.getModelMetadata(modelName);
      setModelMetadata(metadata);
      setState(prev => ({ 
        ...prev, 
        selectedModel: modelName,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error cargando metadatos del modelo'
      }));
    }
  }, []);

  // === Upload de archivo ===
  
  const uploadFile = useCallback(async (file: File) => {
    if (!state.selectedModel) {
      setState(prev => ({ ...prev, error: 'Debe seleccionar un modelo primero' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      // Validar archivo
      const validation = GenericImportService.validateFile(file);
      if (!validation.isValid) {
        setState(prev => ({ ...prev, error: validation.errors.join(', ') }));
        return;
      }

      // Crear sesión de importación
      const importSession = await GenericImportService.createImportSession(
        state.selectedModel,
        file
      );

      // Inicializar mapeos vacíos para cada columna detectada
      const initialMappings: ColumnMapping[] = importSession.detected_columns.map(column => ({
        column_name: column.name,
        field_name: undefined,
        default_value: undefined,
      }));

      setState(prev => ({
        ...prev,
        importSession,
        columnMappings: initialMappings,
        currentStep: 'mapping',
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error subiendo archivo'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.selectedModel]);  // === Obtener sugerencias de mapeo ===
  
  const getMappingSuggestions = useCallback(async (): Promise<MappingSuggestion[]> => {
    if (!state.importSession) {
      return [];
    }

    try {
      const response = await GenericImportService.getMappingSuggestions(
        state.importSession.import_session_token
      );
      // El backend simple retorna un objeto con `suggestions` en lugar de `suggested_mappings`
      return (response as any).suggestions || response.suggested_mappings || [];
    } catch (error) {
      console.error('Error obteniendo sugerencias de mapeo:', error);
      return [];
    }
  }, [state.importSession]);

  // === Actualizar mapeos ===
  
  const updateColumnMappings = useCallback((mappings: ColumnMapping[]) => {
    setState(prev => ({ ...prev, columnMappings: mappings }));
  }, []);

  // === Actualizar configuraciones ===
  const updateImportSettings = useCallback((settings: {
    importPolicy?: ImportPolicy;
    skipValidationErrors?: boolean;
    skipErrors?: boolean;
    defaultValues?: Record<string, any>;
    batchSize?: number;
  }) => {
    setState(prev => ({
      ...prev,
      importPolicy: settings.importPolicy ?? prev.importPolicy,
      skipValidationErrors: settings.skipValidationErrors ?? prev.skipValidationErrors,
      skipErrors: settings.skipErrors ?? prev.skipErrors,
      defaultValues: { ...prev.defaultValues, ...settings.defaultValues },
      batchSize: settings.batchSize ?? prev.batchSize,
    }));
  }, []);

  // === Generar vista previa ===
  
  const generatePreview = useCallback(async () => {
    if (!state.importSession) {
      setState(prev => ({ ...prev, error: 'No hay sesión de importación activa' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));      const previewRequest = {
        import_session_token: state.importSession.import_session_token,
        column_mappings: state.columnMappings,
        import_policy: state.importPolicy,
        skip_validation_errors: state.skipValidationErrors,
        default_values: state.defaultValues,
      };

      const previewData = await GenericImportService.generatePreview(
        state.importSession.import_session_token,
        previewRequest
      );

      setState(prev => ({
        ...prev,
        previewData,
        currentStep: 'preview',
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error generando vista previa'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues]);

  // === Generar vista previa de lote específico ===
  
  const generateBatchPreview = useCallback(async (batchNumber: number) => {
    if (!state.importSession) {
      setState(prev => ({ ...prev, error: 'No hay sesión de importación activa' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));      const previewRequest = {
        import_session_token: state.importSession.import_session_token,
        column_mappings: state.columnMappings,
        import_policy: state.importPolicy,
        skip_validation_errors: state.skipValidationErrors,
        default_values: state.defaultValues,
      };

      const previewData = await GenericImportService.generateBatchPreview(
        state.importSession.import_session_token,
        previewRequest,
        batchNumber,
        state.batchSize
      );

      setState(prev => ({
        ...prev,
        previewData,
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error generando vista previa del lote'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues, state.batchSize]);

  // === Validar archivo completo ===
  
  const validateFullFile = useCallback(async () => {
    if (!state.importSession) {
      setState(prev => ({ ...prev, error: 'No hay sesión de importación activa' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      const previewRequest = {
        import_session_token: state.importSession.import_session_token,
        column_mappings: state.columnMappings,
        import_policy: state.importPolicy,
        skip_validation_errors: state.skipValidationErrors,
        default_values: state.defaultValues,
      };

      const validationData = await GenericImportService.validateFullFile(
        state.importSession.import_session_token,
        previewRequest
      );

      setState(prev => ({
        ...prev,
        previewData: validationData,
        currentStep: 'preview',
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error validando archivo completo'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues]);

  // === Ejecutar importación ===
  
  const executeImport = useCallback(async () => {
    if (!state.importSession) {
      setState(prev => ({ ...prev, error: 'No hay sesión de importación activa' }));
      return;
    }    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined, currentStep: 'execute' }));

      // Debug: Log mappings before sending
      console.log('Hook executeImport - columnMappings:', state.columnMappings);      const importResult = await GenericImportService.executeImport(
        state.importSession.import_session_token,
        state.columnMappings,
        state.importPolicy,
        state.skipErrors,
        state.batchSize
      );

      setState(prev => ({
        ...prev,
        importResult,
        currentStep: 'result',
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev,        error: error instanceof Error ? error.message : 'Error ejecutando importación',
        currentStep: 'result'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.skipErrors, state.defaultValues, state.batchSize]);

  // === Ejecutar importación omitiendo errores ===
  
  const executeImportWithSkipErrors = useCallback(async () => {
    if (!state.importSession) {
      setState(prev => ({ ...prev, error: 'No hay sesión de importación activa' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: undefined, currentStep: 'execute' }));

      // Debug: Log mappings before sending
      console.log('Hook executeImportWithSkipErrors - columnMappings:', state.columnMappings);

      const importResult = await GenericImportService.executeImport(
        state.importSession.import_session_token,
        state.columnMappings,
        state.importPolicy,
        true, // Force skip errors to true
        state.batchSize
      );

      setState(prev => ({
        ...prev,
        importResult,
        currentStep: 'result',
        isLoading: false,
      }));

    } catch (error) {
      setState(prev => ({ 
        ...prev,
        error: error instanceof Error ? error.message : 'Error ejecutando importación con omisión de errores',
        currentStep: 'result'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.importSession, state.columnMappings, state.importPolicy, state.skipValidationErrors, state.defaultValues, state.batchSize]);

  // === Navegación y utilidades ===
  
  const resetWizard = useCallback(() => {
    setState(initialState);
    setModelMetadata(undefined);
  }, []);

  const goToStep = useCallback((step: WizardState['currentStep']) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const isStepValid = useCallback((step: WizardState['currentStep']): boolean => {
    switch (step) {
      case 'upload':
        return !!state.selectedModel;
      case 'mapping':
        return !!state.importSession && state.columnMappings.some(m => m.field_name);
      case 'preview':
        return !!state.previewData;
      case 'execute':
        return !!state.previewData && !state.previewData.validation_summary.rows_with_errors;
      case 'result':
        return !!state.importResult;
      default:
        return false;
    }
  }, [state]);

  const getStepIndex = useCallback((step: WizardState['currentStep']): number => {
    const steps: WizardState['currentStep'][] = ['upload', 'mapping', 'preview', 'execute', 'result'];
    return steps.indexOf(step);
  }, []);

  // === Efectos ===
  
  useEffect(() => {
    loadAvailableModels();
  }, [loadAvailableModels]);

  useEffect(() => {
    loadImportConfig();
  }, []); // Load config only once on mount

  return {
    state,
    availableModels,
    modelMetadata,
    
    // Actions
    loadAvailableModels,
    loadImportConfig,
    selectModel,
    uploadFile,
    updateColumnMappings,
    updateImportSettings,
    generatePreview,
    generateBatchPreview,
    validateFullFile,
    executeImport,
    executeImportWithSkipErrors,
    resetWizard,
    goToStep,
    
    // Utilities
    getMappingSuggestions,
    isStepValid,
    getStepIndex,
  };
}
