import type { Account, AccountTree, AccountCreate, AccountUpdate, AccountFilters, AccountType, AccountDeleteValidation, BulkAccountDelete, BulkAccountDeleteResult } from '../types';
export declare const useAccounts: (filters?: AccountFilters) => {
    accounts: Account[];
    total: number;
    loading: boolean;
    error: string;
    refetch: () => void;
    refetchWithFilters: (newFilters: AccountFilters) => void;
    forceRefetch: (newFilters?: AccountFilters) => void;
    createAccount: (accountData: AccountCreate) => Promise<Account | null>;
    updateAccount: (id: string, updateData: AccountUpdate) => Promise<Account | null>;
    deleteAccount: (id: string) => Promise<boolean>;
    toggleAccountStatus: (id: string, isActive: boolean) => Promise<boolean>;
    getParentAccountsByType: (accountType: AccountType) => Promise<Account[]>;
    validateBulkDeletion: (accountIds: string[]) => Promise<AccountDeleteValidation[]>;
    bulkDeleteAccounts: (deleteData: BulkAccountDelete) => Promise<BulkAccountDeleteResult>;
};
export declare const useAccountTree: (accountType?: string, activeOnly?: boolean) => {
    accountTree: AccountTree[];
    loading: boolean;
    error: string;
    refetch: (type?: string, active?: boolean) => Promise<void>;
};
export declare const useAccount: (id?: string) => {
    account: Account;
    loading: boolean;
    error: string;
    fetchAccount: (accountId: string) => Promise<void>;
    fetchAccountByCode: (code: string) => Promise<void>;
    setAccount: import("react").Dispatch<import("react").SetStateAction<Account>>;
};
export declare const useAccountValidation: () => {
    checking: boolean;
    checkCodeAvailability: (code: string, excludeId?: string) => Promise<boolean>;
};
export declare const useAccountBalance: (accountId?: string) => {
    balance: {
        balance: string;
        debit_balance: string;
        credit_balance: string;
        as_of_date: string;
    };
    loading: boolean;
    error: string;
    refetch: (id: string, asOfDate?: string) => Promise<void>;
};
export declare const useAccountMovements: (accountId?: string) => {
    movements: {
        id: string;
        date: string;
        description: string;
        debit_amount: string;
        credit_amount: string;
        balance: string;
        transaction_id: string;
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
