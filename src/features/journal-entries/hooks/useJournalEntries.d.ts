import type { JournalEntry, JournalEntryCreate, JournalEntryUpdate, JournalEntryFilters, JournalEntryStatistics, JournalEntryFormData, BulkJournalEntryDelete, JournalEntryDeleteValidation, BulkJournalEntryDeleteResult } from '../types';
/**
 * Hook principal para gestión de asientos contables
 * Maneja el estado, loading, errores y operaciones CRUD
 */
export declare const useJournalEntries: (initialFilters?: JournalEntryFilters) => {
    entries: JournalEntry[];
    pagination: {
        total: number;
        page: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
    loading: boolean;
    error: string;
    refetch: () => Promise<void>;
    refetchWithFilters: (newFilters: JournalEntryFilters) => Promise<void>;
    createEntry: (data: JournalEntryCreate) => Promise<JournalEntry | null>;
    updateEntry: (id: string, data: JournalEntryUpdate) => Promise<JournalEntry | null>;
    deleteEntry: (id: string) => Promise<boolean>;
    approveEntry: (id: string) => Promise<boolean>;
    postEntry: (id: string, reason?: string) => Promise<boolean>;
    cancelEntry: (id: string, reason: string) => Promise<boolean>;
    reverseEntry: (id: string, reason: string) => Promise<boolean>;
    searchEntries: (query: string, filters?: JournalEntryFilters) => Promise<void>;
    validateDeletion: (entryIds: string[]) => Promise<JournalEntryDeleteValidation[]>;
    bulkDeleteEntries: (deleteData: BulkJournalEntryDelete) => Promise<BulkJournalEntryDeleteResult>;
    restoreEntryToDraft: (id: string, reason: string) => Promise<boolean>;
    bulkRestoreToDraft: (entryIds: string[], reason: string) => Promise<import("..").BulkJournalEntryResetResult>;
};
/**
 * Hook para gestionar un asiento contable individual
 */
export declare const useJournalEntry: (id?: string) => {
    entry: JournalEntry;
    loading: boolean;
    error: string;
    refetch: (entryId: string) => Promise<void>;
    fetchByNumber: (number: string) => Promise<void>;
    updateLocalEntry: (updatedEntry: JournalEntry) => void;
    refetchIfMatches: (entryId: string) => void;
};
/**
 * Hook para estadísticas de asientos contables
 */
export declare const useJournalEntryStatistics: (filters?: JournalEntryFilters) => {
    statistics: JournalEntryStatistics;
    loading: boolean;
    error: string;
    refetch: (_statsFilters?: JournalEntryFilters) => Promise<void>;
};
/**
 * Hook para validación de balance en tiempo real
 */
export declare const useJournalEntryBalance: (lines: JournalEntryFormData["lines"]) => {
    total_debit: number;
    total_credit: number;
    difference: number;
    is_balanced: boolean;
};
