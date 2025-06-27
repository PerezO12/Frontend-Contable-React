import React from 'react';
import { type JournalEntry } from '../types';
interface JournalEntryEditFormProps {
    entryId: string;
    onSuccess?: (entry: JournalEntry) => void;
    onCancel?: () => void;
}
export declare const JournalEntryEditForm: React.FC<JournalEntryEditFormProps>;
export {};
