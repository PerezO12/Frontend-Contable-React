import type { ImportConfiguration, ImportPreviewData, ImportResult, ImportStatus, ImportFileUpload, ValidationError } from '../types';
export declare function useDataImport(): {
    resetState: () => void;
    updateConfiguration: (config: Partial<ImportConfiguration>) => void;
    uploadAndPreview: (uploadData: ImportFileUpload) => Promise<ImportPreviewData>;
    importFromFile: (file: File, configuration: ImportConfiguration) => Promise<ImportResult>;
    getImportStatus: (importId: string) => Promise<ImportStatus>;
    cancelImport: (importId: string) => Promise<void>;
    validateFile: (file: File, dataType: "accounts" | "journal_entries") => Promise<{
        is_valid: boolean;
        errors: string[];
        warnings: string[];
        detected_format: string;
        total_rows: number;
    }>;
    hasErrors: boolean;
    hasWarnings: boolean;
    canImport: boolean;
    isLoading: boolean;
    previewData: ImportPreviewData | null;
    importResult: ImportResult | null;
    importStatus: ImportStatus | null;
    errors: ValidationError[];
    configuration: ImportConfiguration | null;
};
