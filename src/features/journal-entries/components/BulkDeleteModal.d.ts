import React from 'react';
import type { JournalEntryDeleteValidation, BulkJournalEntryDelete, BulkJournalEntryDeleteResult } from '../types';
interface BulkDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedEntryIds: string[];
    onValidate: (entryIds: string[]) => Promise<JournalEntryDeleteValidation[]>;
    onBulkDelete: (deleteData: BulkJournalEntryDelete) => Promise<BulkJournalEntryDeleteResult>;
    onSuccess?: (result: BulkJournalEntryDeleteResult) => void;
}
export declare const BulkDeleteModal: React.FC<BulkDeleteModalProps>;
export {};
