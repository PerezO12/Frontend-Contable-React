import React from 'react';
import { type JournalEntry } from '../types';
interface JournalEntryDetailProps {
    entryId: string;
    onEdit?: (entry: JournalEntry) => void;
    onClose?: () => void;
    onApprove?: (entry: JournalEntry) => void;
    onPost?: (entry: JournalEntry) => void;
    onCancel?: (entry: JournalEntry) => void;
    onReverse?: (entry: JournalEntry) => void;
    onRestore?: (entry: JournalEntry) => void;
}
export declare const JournalEntryDetail: React.FC<JournalEntryDetailProps>;
export {};
