import type { ThirdParty, ThirdPartyCreate, ThirdPartyUpdate, ThirdPartyFilters, ThirdPartyStatement, ThirdPartyBalance, BulkThirdPartyResult, ThirdPartyDeleteValidation, BulkDeleteResult } from '../types';
export declare const useThirdParties: (filters?: ThirdPartyFilters) => {
    thirdParties: ThirdParty[];
    loading: boolean;
    error: string;
    total: number;
    refetch: () => void;
    refetchWithFilters: (filters: ThirdPartyFilters) => void;
    forceRefetch: (newFilters?: ThirdPartyFilters) => void;
};
export declare const useThirdParty: (id?: string) => {
    thirdParty: ThirdParty;
    loading: boolean;
    error: string;
    refetch: () => void;
};
export declare const useCreateThirdParty: () => {
    createThirdParty: (data: ThirdPartyCreate) => Promise<ThirdParty | null>;
    loading: boolean;
    error: string;
};
export declare const useUpdateThirdParty: () => {
    updateThirdParty: (id: string, data: ThirdPartyUpdate) => Promise<ThirdParty | null>;
    loading: boolean;
    error: string;
};
export declare const useDeleteThirdParty: () => {
    deleteThirdParty: (id: string) => Promise<boolean>;
    loading: boolean;
    error: string;
};
export declare const useThirdPartyStatement: (id?: string) => {
    statement: ThirdPartyStatement;
    loading: boolean;
    error: string;
    fetchStatement: (thirdPartyId: string, startDate?: string, endDate?: string) => Promise<void>;
    refetch: (startDate?: string, endDate?: string) => void;
};
export declare const useThirdPartyBalance: (id?: string) => {
    balance: ThirdPartyBalance;
    loading: boolean;
    error: string;
    fetchBalance: (thirdPartyId: string, asOfDate?: string) => Promise<void>;
    refetch: (asOfDate?: string) => void;
};
export declare const useThirdPartySearch: () => {
    results: any[];
    loading: boolean;
    error: string;
    search: (query: string, filters?: Partial<ThirdPartyFilters>) => Promise<void>;
    clearResults: () => void;
};
export declare const useBulkThirdPartyOperations: () => {
    bulkDelete: (thirdPartyIds: string[]) => Promise<BulkThirdPartyResult | null>;
    bulkUpdate: (thirdPartyIds: string[], updates: Partial<ThirdPartyUpdate>) => Promise<BulkThirdPartyResult | null>;
    bulkActivate: (thirdPartyIds: string[]) => Promise<BulkThirdPartyResult | null>;
    bulkDeactivate: (thirdPartyIds: string[]) => Promise<BulkThirdPartyResult | null>;
    loading: boolean;
    error: string;
};
export declare const useBulkDeleteValidation: () => {
    validationData: ThirdPartyDeleteValidation[];
    validateDeletion: (thirdPartyIds: string[]) => Promise<ThirdPartyDeleteValidation[] | null>;
    bulkDeleteReal: (thirdPartyIds: string[], forceDelete?: boolean, deleteReason?: string) => Promise<BulkDeleteResult | null>;
    loading: boolean;
    error: string;
};
