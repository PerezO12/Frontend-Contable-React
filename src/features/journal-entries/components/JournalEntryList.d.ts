import React from 'react';
import { type JournalEntry, type JournalEntryFilters } from '../types';
interface JournalEntryListProps {
    onEntrySelect?: (entry: JournalEntry) => void;
    onCreateEntry?: () => void;
    initialFilters?: JournalEntryFilters;
}
export declare const JournalEntryList: React.FC<JournalEntryListProps>;
export {};
