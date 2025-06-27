import React from 'react';
import type { Account, BulkAccountDeleteResult } from '../types';
interface BulkDeleteModalProps {
    selectedAccounts: Account[];
    onClose: () => void;
    onSuccess: (result: BulkAccountDeleteResult) => void;
}
export declare const BulkDeleteModal: React.FC<BulkDeleteModalProps>;
export {};
