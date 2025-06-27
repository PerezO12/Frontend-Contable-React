import type { JournalDetail, JournalListItem, JournalCreate, JournalUpdate, JournalFilter, JournalPagination, JournalStats, JournalSequenceInfo, JournalResetSequence } from '../types';
interface JournalStore {
    journals: JournalListItem[];
    currentJournal: JournalDetail | null;
    currentStats: JournalStats | null;
    currentSequenceInfo: JournalSequenceInfo | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    total: number;
    skip: number;
    limit: number;
    currentFilters: JournalFilter;
    currentPagination: JournalPagination;
    fetchJournals: (filters?: JournalFilter, pagination?: JournalPagination) => Promise<void>;
    fetchJournal: (id: string) => Promise<void>;
    createJournal: (data: JournalCreate) => Promise<JournalDetail>;
    updateJournal: (id: string, data: JournalUpdate) => Promise<JournalDetail>;
    deleteJournal: (id: string) => Promise<void>;
    fetchJournalStats: (id: string) => Promise<void>;
    fetchJournalSequenceInfo: (id: string) => Promise<void>;
    resetJournalSequence: (id: string, data: JournalResetSequence) => Promise<JournalDetail>;
    setCurrentJournal: (journal: JournalDetail | null) => void;
    clearError: () => void;
    setError: (error: string) => void;
    setLoading: (loading: boolean) => void;
    setSaving: (saving: boolean) => void;
    refresh: () => Promise<void>;
    reset: () => void;
}
export declare const useJournalStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<JournalStore>, "setState" | "devtools"> & {
    setState(partial: JournalStore | Partial<JournalStore> | ((state: JournalStore) => JournalStore | Partial<JournalStore>), replace?: false, action?: string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }): void;
    setState(state: JournalStore | ((state: JournalStore) => JournalStore), replace: true, action?: string | {
        [x: string]: unknown;
        [x: number]: unknown;
        [x: symbol]: unknown;
        type: string;
    }): void;
    devtools: {
        cleanup: () => void;
    };
}>;
export default useJournalStore;
