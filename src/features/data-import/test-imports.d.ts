import { FileUpload } from './components/FileUpload';
import { useDataImport } from './hooks/useDataImport';
import { DataImportService } from './services/DataImportService';
import { validateAccountData } from './utils/validation';
export declare const testImports: {
    FileUpload: typeof FileUpload;
    useDataImport: typeof useDataImport;
    DataImportService: typeof DataImportService;
    validateAccountData: typeof validateAccountData;
};
