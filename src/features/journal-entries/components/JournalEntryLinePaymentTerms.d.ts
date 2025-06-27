import React from 'react';
import type { JournalEntryLineFormData, PaymentScheduleItem } from '../types';
interface JournalEntryLinePaymentTermsProps {
    lineIndex: number;
    line: JournalEntryLineFormData;
    onLineChange: (index: number, field: keyof JournalEntryLineFormData, value: string) => void;
    onPaymentScheduleChange?: (lineIndex: number, schedule: PaymentScheduleItem[]) => void;
    className?: string;
}
export declare const JournalEntryLinePaymentTerms: React.FC<JournalEntryLinePaymentTermsProps>;
export {};
