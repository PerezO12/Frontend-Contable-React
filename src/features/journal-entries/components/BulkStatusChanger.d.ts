import React from 'react';
import { JournalEntryStatus } from '../types';
interface BulkStatusChangerProps {
    selectedEntryIds: string[];
    onStatusChange: (entryIds: string[], newStatus: JournalEntryStatus | 'REVERSE', reason?: string, forceOperation?: boolean) => Promise<any>;
    onSuccess?: () => void;
}
export declare const BulkStatusChanger: React.FC<BulkStatusChangerProps>;
export {};
