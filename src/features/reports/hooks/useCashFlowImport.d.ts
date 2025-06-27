import type { ImportConfiguration, ImportPreviewData, ImportResult } from '@/features/data-import/types';
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
export declare const useCashFlowImport: () => UseCashFlowImportReturn;
export {};
