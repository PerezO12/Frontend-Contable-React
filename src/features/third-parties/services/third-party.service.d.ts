import type { ThirdParty, ThirdPartyCreate, ThirdPartyUpdate, ThirdPartyFilters, ThirdPartyListResponse, ThirdPartyStatement, ThirdPartyBalance, ThirdPartyAnalytics, ThirdPartyExportRequest, ThirdPartyExportResponse, ThirdPartyImportRequest, ThirdPartyImportResponse, BulkThirdPartyOperation, BulkThirdPartyResult, ThirdPartySearchResponse, ThirdPartyDeleteValidation, BulkDeleteResult } from '../types';
export declare class ThirdPartyService {
    private static readonly BASE_URL;
    static getThirdParties(filters?: ThirdPartyFilters): Promise<ThirdPartyListResponse>;
    static getThirdParty(id: string): Promise<ThirdParty>;
    static createThirdParty(data: ThirdPartyCreate): Promise<ThirdParty>;
    static updateThirdParty(id: string, data: ThirdPartyUpdate): Promise<ThirdParty>;
    static deleteThirdParty(id: string): Promise<void>;
    static searchThirdParties(query: string, filters?: Partial<ThirdPartyFilters>): Promise<ThirdPartySearchResponse>;
    static getThirdPartyStatement(id: string, startDate?: string, endDate?: string, includeAging?: boolean): Promise<ThirdPartyStatement>;
    static getThirdPartyBalance(id: string, asOfDate?: string, includeAging?: boolean): Promise<ThirdPartyBalance>;
    static getAnalytics(filters?: Partial<ThirdPartyFilters>): Promise<ThirdPartyAnalytics>;
    static getAgingReport(filters?: Partial<ThirdPartyFilters>): Promise<any>;
    static exportThirdPartiesAdvanced(request: ThirdPartyExportRequest): Promise<ThirdPartyExportResponse>;
    static getExportStatus(exportId: string): Promise<ThirdPartyExportResponse>;
    static getDownloadUrl(exportId: string): string;
    /**
     * Exportar terceros seleccionados usando el sistema de exportación genérico
     */
    static exportThirdParties(thirdPartyIds: string[], format: 'csv' | 'json' | 'xlsx'): Promise<Blob>;
    static importThirdParties(request: ThirdPartyImportRequest): Promise<ThirdPartyImportResponse>;
    static getImportStatus(importId: string): Promise<ThirdPartyImportResponse>;
    static bulkOperation(operation: BulkThirdPartyOperation): Promise<BulkThirdPartyResult>;
    static getBulkOperationStatus(operationId: string): Promise<BulkThirdPartyResult>;
    static validateDeletion(thirdPartyIds: string[]): Promise<ThirdPartyDeleteValidation[]>;
    static bulkDeleteReal(thirdPartyIds: string[], forceDelete?: boolean, deleteReason?: string): Promise<BulkDeleteResult>;
    static bulkDelete(thirdPartyIds: string[]): Promise<BulkThirdPartyResult>;
    static bulkUpdate(thirdPartyIds: string[], updates: Partial<ThirdPartyUpdate>): Promise<BulkThirdPartyResult>;
    static bulkActivate(thirdPartyIds: string[]): Promise<BulkThirdPartyResult>;
    static bulkDeactivate(thirdPartyIds: string[]): Promise<BulkThirdPartyResult>;
    static formatDisplayName(thirdParty: ThirdParty): string;
    static formatDocumentNumber(thirdParty: ThirdParty): string;
}
