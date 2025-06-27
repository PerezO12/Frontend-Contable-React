import React from 'react';
import type { JournalEntry } from '../types';
interface BulkOperationsWithPaymentTermsProps {
    selectedEntries: JournalEntry[];
    onSuccess?: () => void;
    onSelectionClear?: () => void;
    className?: string;
}
export declare const BulkOperationsWithPaymentTerms: React.FC<BulkOperationsWithPaymentTermsProps>;
export {};
