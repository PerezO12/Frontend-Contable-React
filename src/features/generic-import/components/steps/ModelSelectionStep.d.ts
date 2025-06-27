import type { ModelMetadata } from '../../types';
interface ModelSelectionStepProps {
    selectedModel?: string;
    availableModels: string[];
    modelMetadata?: ModelMetadata;
    onModelSelect: (modelName: string) => Promise<void>;
    isLoading: boolean;
}
export declare function ModelSelectionStep({ selectedModel, availableModels, modelMetadata, onModelSelect, isLoading, }: ModelSelectionStepProps): import("react").JSX.Element;
export {};
