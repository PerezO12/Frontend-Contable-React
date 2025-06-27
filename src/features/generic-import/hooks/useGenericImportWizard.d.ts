import type { WizardState, ModelMetadata, ColumnMapping, ImportPolicy, MappingSuggestion } from '../types';
interface UseGenericImportWizardResult {
    state: WizardState;
    availableModels: string[];
    modelMetadata?: ModelMetadata;
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
    getMappingSuggestions: () => Promise<MappingSuggestion[]>;
    isStepValid: (step: WizardState['currentStep']) => boolean;
    getStepIndex: (step: WizardState['currentStep']) => number;
}
export declare function useGenericImportWizard(): UseGenericImportWizardResult;
export {};
