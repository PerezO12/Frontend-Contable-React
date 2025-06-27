/**
 * Tipos TypeScript para el módulo de Journals (Diarios)
 * Basado en los esquemas del backend
 */
export type JournalType = 'sale' | 'purchase' | 'cash' | 'bank' | 'miscellaneous';
export declare const JournalTypeConst: {
    readonly SALE: "sale";
    readonly PURCHASE: "purchase";
    readonly CASH: "cash";
    readonly BANK: "bank";
    readonly MISCELLANEOUS: "miscellaneous";
};
export declare const JournalTypeLabels: Record<JournalType, string>;
export declare const JournalTypeColors: Record<JournalType, string>;
export interface JournalBase {
    name: string;
    code: string;
    type: JournalType;
    sequence_prefix: string;
    default_account_id?: string;
    sequence_padding: number;
    include_year_in_sequence: boolean;
    reset_sequence_yearly: boolean;
    requires_validation: boolean;
    allow_manual_entries: boolean;
    is_active: boolean;
    description?: string;
}
export interface JournalCreate extends JournalBase {
}
export interface JournalUpdate {
    name?: string;
    default_account_id?: string;
    sequence_padding?: number;
    include_year_in_sequence?: boolean;
    reset_sequence_yearly?: boolean;
    requires_validation?: boolean;
    allow_manual_entries?: boolean;
    is_active?: boolean;
    description?: string;
}
export interface JournalRead extends JournalBase {
    id: string;
    current_sequence_number: number;
    last_sequence_reset_year?: number;
    total_journal_entries: number;
    created_at: string;
    updated_at: string;
    created_by_id?: string;
}
export interface AccountRead {
    id: string;
    code: string;
    name: string;
    account_type: string;
}
export interface UserRead {
    id: string;
    name: string;
    email: string;
}
export interface JournalDetail extends JournalRead {
    default_account?: AccountRead;
    created_by?: UserRead;
}
export interface JournalListItem {
    id: string;
    name: string;
    code: string;
    type: JournalType;
    sequence_prefix: string;
    is_active: boolean;
    current_sequence_number: number;
    total_journal_entries: number;
    created_at: string;
    default_account?: AccountRead;
}
export interface JournalFilter {
    type?: JournalType;
    is_active?: boolean;
    search?: string;
}
export interface JournalSequenceInfo {
    id: string;
    name: string;
    code: string;
    sequence_prefix: string;
    current_sequence_number: number;
    next_sequence_number: string;
    include_year_in_sequence: boolean;
    reset_sequence_yearly: boolean;
    last_sequence_reset_year?: number;
}
export interface JournalResetSequence {
    confirm: boolean;
    reason?: string;
}
export interface JournalStats {
    id: string;
    name: string;
    code: string;
    type: JournalType;
    total_entries: number;
    total_entries_current_year: number;
    total_entries_current_month: number;
    last_entry_date?: string;
    avg_entries_per_month: number;
}
export interface JournalListResponse {
    items: JournalListItem[];
    total: number;
    skip: number;
    limit: number;
}
export interface JournalResponse extends JournalRead {
}
export interface JournalDetailResponse extends JournalDetail {
}
export interface JournalFormData extends Omit<JournalCreate, 'default_account_id'> {
    default_account_id?: string;
}
export interface JournalOption {
    value: string;
    label: string;
    type: JournalType;
    sequence_prefix: string;
    is_active: boolean;
}
export interface JournalOrderBy {
    field: 'name' | 'code' | 'type' | 'created_at' | 'total_journal_entries';
    direction: 'asc' | 'desc';
}
export interface JournalPagination {
    skip: number;
    limit: number;
    order_by?: string;
    order_dir?: 'asc' | 'desc';
}
export interface JournalState {
    journals: JournalListItem[];
    currentJournal: JournalDetail | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    total: number;
    skip: number;
    limit: number;
}
export interface UseJournalsReturn {
    journals: JournalListItem[];
    loading: boolean;
    error: string | null;
    total: number;
    fetchJournals: (filters?: JournalFilter, pagination?: JournalPagination) => Promise<void>;
    refresh: () => Promise<void>;
}
export interface UseJournalReturn {
    journal: JournalDetail | null;
    loading: boolean;
    error: string | null;
    fetchJournal: (id: string) => Promise<void>;
    createJournal: (data: JournalCreate) => Promise<JournalDetail>;
    updateJournal: (id: string, data: JournalUpdate) => Promise<JournalDetail>;
    deleteJournal: (id: string) => Promise<void>;
    resetSequence: (id: string, reason?: string) => Promise<JournalDetail>;
}
