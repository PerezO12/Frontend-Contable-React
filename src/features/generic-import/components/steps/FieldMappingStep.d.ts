import type { ImportSessionResponse, ModelMetadata, ColumnMapping, ImportPolicy, MappingSuggestion } from '../../types';
interface FieldMappingStepProps {
    importSession: ImportSessionResponse;
    modelMetadata: ModelMetadata;
    columnMappings: ColumnMapping[];
    onMappingsChange: (mappings: ColumnMapping[]) => void;
    onSettingsChange: (settings: {
        importPolicy?: ImportPolicy;
        skipValidationErrors?: boolean;
        defaultValues?: Record<string, any>;
    }) => void;
    onNext: () => Promise<void>;
    onValidateFullFile: () => Promise<void>;
    onBack: () => void;
    getMappingSuggestions: () => Promise<MappingSuggestion[]>;
    isLoading: boolean;
    importPolicy: ImportPolicy;
    skipValidationErrors: boolean;
    defaultValues: Record<string, any>;
}
export declare function FieldMappingStep({ importSession, modelMetadata, columnMappings, onMappingsChange, onSettingsChange, onNext, onValidateFullFile, onBack, getMappingSuggestions, isLoading, importPolicy, skipValidationErrors, }: FieldMappingStepProps): import("react").JSX.Element;
export {};
