import React from 'react';
import { type JournalEntryFormData, type JournalEntry } from '../types';
interface JournalEntryFormProps {
    onSuccess?: (entry: JournalEntry) => void;
    onCancel?: () => void;
    initialData?: Partial<JournalEntryFormData>;
    isEditMode?: boolean;
    entryId?: string;
}
export declare const JournalEntryForm: React.FC<JournalEntryFormProps>;
export {};
