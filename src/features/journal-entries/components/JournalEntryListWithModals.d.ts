import React from 'react';
import type { JournalEntry, JournalEntryFilters } from '../types';
interface JournalEntryListWithModalsProps {
    onEntrySelect?: (entry: JournalEntry) => void;
    onCreateEntry?: () => void;
    initialFilters?: JournalEntryFilters;
}
export declare const JournalEntryListWithModals: React.FC<JournalEntryListWithModalsProps>;
export {};
