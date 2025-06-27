import type { JournalFilter, JournalPagination, JournalCreate, JournalUpdate, JournalResetSequence } from '../types';
/**
 * Hook para listado de journals con filtros y paginación
 */
export declare function useJournals(initialFilters?: JournalFilter, initialPagination?: JournalPagination, autoFetch?: boolean): {
    journals: import("..").JournalListItem[];
    loading: boolean;
    error: string;
    total: number;
    skip: number;
    limit: number;
    fetchJournals: (filters?: JournalFilter, pagination?: JournalPagination) => Promise<void>;
    clearError: () => void;
    refresh: () => Promise<void>;
};
/**
 * Hook para operaciones con un journal específico
 */
export declare function useJournal(id?: string, autoFetch?: boolean): {
    journal: import("..").JournalDetail;
    stats: import("..").JournalStats;
    sequenceInfo: import("..").JournalSequenceInfo;
    loading: boolean;
    saving: boolean;
    error: string;
    create: (data: JournalCreate) => Promise<import("..").JournalDetail>;
    update: (data: JournalUpdate) => Promise<import("..").JournalDetail>;
    delete: () => Promise<void>;
    resetSequence: (data: JournalResetSequence) => Promise<import("..").JournalDetail>;
    loadStats: () => Promise<void>;
    loadSequenceInfo: () => Promise<void>;
    setJournal: (journal: import("..").JournalDetail | null) => void;
    clearError: () => void;
};
/**
 * Hook para opciones de journals (para selects)
 */
export declare function useJournalOptions(): {
    options: {
        value: string;
        label: string;
        type: import("..").JournalType;
        sequence_prefix: string;
        is_active: boolean;
    }[];
    loading: boolean;
    error: string;
};
/**
 * Hook para estadísticas de journals
 */
export declare function useJournalStats(id: string, autoFetch?: boolean): {
    stats: import("..").JournalStats;
    loading: boolean;
    error: string;
    refresh: () => Promise<void>;
    clearError: () => void;
};
/**
 * Hook para información de secuencia de journals
 */
export declare function useJournalSequence(id: string, autoFetch?: boolean): {
    sequenceInfo: import("..").JournalSequenceInfo;
    loading: boolean;
    error: string;
    resetSequence: (data: JournalResetSequence) => Promise<import("..").JournalDetail>;
    refresh: () => Promise<void>;
    clearError: () => void;
};
