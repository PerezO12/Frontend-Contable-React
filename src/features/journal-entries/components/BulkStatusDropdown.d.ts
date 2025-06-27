import React from 'react';
import { JournalEntryStatus } from '../types';
interface BulkStatusDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onStatusSelect: (status: JournalEntryStatus | 'REVERSE', requiresReason: boolean) => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
}
export declare const BulkStatusDropdown: React.FC<BulkStatusDropdownProps>;
export {};
