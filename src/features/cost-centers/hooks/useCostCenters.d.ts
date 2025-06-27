import type { CostCenter, CostCenterTree, CostCenterCreate, CostCenterUpdate, CostCenterFilters, CostCenterAnalysis } from '../types';
export declare const useCostCenters: (initialFilters?: CostCenterFilters) => {
    costCenters: CostCenter[];
    total: number;
    loading: boolean;
    error: string;
    refetch: () => Promise<void>;
    refetchWithFilters: (newFilters: CostCenterFilters) => Promise<void>;
    createCostCenter: (costCenterData: CostCenterCreate) => Promise<CostCenter | null>;
    updateCostCenter: (id: string, updateData: CostCenterUpdate) => Promise<CostCenter | null>;
    deleteCostCenter: (id: string) => Promise<boolean>;
    toggleCostCenterStatus: (id: string, isActive: boolean) => Promise<boolean>;
};
export declare const useCostCenterTree: (activeOnly?: boolean) => {
    costCenterTree: CostCenterTree[];
    loading: boolean;
    error: string;
    refetch: (active?: boolean) => Promise<void>;
};
export declare const useCostCenter: (id?: string) => {
    costCenter: CostCenter;
    loading: boolean;
    error: string;
    fetchCostCenter: (costCenterId: string) => Promise<void>;
    fetchCostCenterByCode: (code: string) => Promise<void>;
    setCostCenter: import("react").Dispatch<import("react").SetStateAction<CostCenter>>;
};
export declare const useCostCenterValidation: () => {
    checking: boolean;
    checkCodeAvailability: (code: string, excludeId?: string) => Promise<boolean>;
};
export declare const useCostCenterMovements: (costCenterId?: string) => {
    movements: {
        id: string;
        date: string;
        description: string;
        account_code: string;
        account_name: string;
        debit_amount: string;
        credit_amount: string;
        journal_entry_number: string;
        reference?: string;
    }[];
    totalCount: number;
    loading: boolean;
    error: string;
    refetch: (id: string, filters?: {
        start_date?: string;
        end_date?: string;
        skip?: number;
        limit?: number;
    }) => Promise<void>;
};
export declare const useCostCenterAnalysis: () => {
    analysis: CostCenterAnalysis;
    loading: boolean;
    error: string;
    fetchAnalysis: (id: string, startDate: string, endDate: string) => Promise<void>;
};
