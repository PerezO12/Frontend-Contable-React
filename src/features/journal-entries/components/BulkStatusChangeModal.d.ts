import React from 'react';
import { JournalEntryStatus } from '../types';
interface BulkStatusChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedEntryIds: string[];
    onChangeStatus: (entryIds: string[], newStatus: JournalEntryStatus, reason?: string) => Promise<any>;
    onSuccess?: (result: any) => void;
}
export declare const BulkStatusChangeModal: React.FC<BulkStatusChangeModalProps>;
export {};
