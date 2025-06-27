import type { JournalEntry } from '../types';
export type JournalEntryEventType = 'approved' | 'posted' | 'cancelled' | 'reversed' | 'updated' | 'deleted';
export interface JournalEntryEvent {
    type: JournalEntryEventType;
    entryId: string;
    entry?: JournalEntry;
    timestamp: number;
}
declare class JournalEntryEventEmitter {
    private listeners;
    emit(event: JournalEntryEvent): void;
    on(type: JournalEntryEventType, listener: (event: JournalEntryEvent) => void): () => void;
    off(type: JournalEntryEventType, listener: (event: JournalEntryEvent) => void): void;
    clear(): void;
}
export declare const journalEntryEventEmitter: JournalEntryEventEmitter;
/**
 * Hook para emitir eventos de asientos contables
 */
export declare const useJournalEntryEventEmitter: () => {
    emitApproved: (entryId: string, entry?: JournalEntry) => void;
    emitPosted: (entryId: string, entry?: JournalEntry) => void;
    emitCancelled: (entryId: string, entry?: JournalEntry) => void;
    emitReversed: (entryId: string, entry?: JournalEntry) => void;
    emitUpdated: (entryId: string, entry?: JournalEntry) => void;
    emitDeleted: (entryId: string) => void;
};
/**
 * Hook para escuchar eventos de asientos contables
 */
export declare const useJournalEntryEventListener: (eventTypes: JournalEntryEventType[], onEvent: (event: JournalEntryEvent) => void, dependencies?: unknown[]) => void;
/**
 * Hook para escuchar cambios específicos de un asiento contable
 */
export declare const useJournalEntryStatusListener: (entryId: string | undefined, onStatusChange: (event: JournalEntryEvent) => void) => void;
/**
 * Hook para escuchar todos los cambios en asientos contables (para listas)
 */
export declare const useJournalEntryListListener: (onEntryChange: (event: JournalEntryEvent) => void) => void;
export {};
