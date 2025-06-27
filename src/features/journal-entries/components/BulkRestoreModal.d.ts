import React from 'react';
import type { JournalEntry } from '../types';
interface BulkRestoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedEntryIds: string[];
    onBulkRestore: (entryIds: string[], reason: string, forceReset?: boolean) => Promise<{
        total_requested: number;
        total_restored: number;
        total_failed: number;
        successful_entries: JournalEntry[];
        failed_entries: {
            id: string;
            error: string;
        }[];
    }>;
    onSuccess?: (result: any) => void;
}
export declare const BulkRestoreModal: React.FC<BulkRestoreModalProps>;
export {};
