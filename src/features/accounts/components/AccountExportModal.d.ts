import React from 'react';
import type { Account } from '../types';
interface AccountExportModalProps {
    accounts: Account[];
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}
export declare const AccountExportModal: React.FC<AccountExportModalProps>;
export {};
