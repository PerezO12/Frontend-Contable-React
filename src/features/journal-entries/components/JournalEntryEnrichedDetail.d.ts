import React from 'react';
import { type JournalEntry } from '../types';
interface JournalEntryEnrichedDetailProps {
    entryId: string;
    onEdit?: (entry: JournalEntry) => void;
    className?: string;
}
export declare const JournalEntryEnrichedDetail: React.FC<JournalEntryEnrichedDetailProps>;
export {};
