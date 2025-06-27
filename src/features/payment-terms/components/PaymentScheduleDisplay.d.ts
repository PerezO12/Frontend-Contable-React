import React from 'react';
import type { PaymentCalculationItem } from '../types';
interface PaymentScheduleDisplayProps {
    schedule: PaymentCalculationItem[];
    invoiceAmount: number;
    invoiceDate: string;
    className?: string;
}
export declare const PaymentScheduleDisplay: React.FC<PaymentScheduleDisplayProps>;
export {};
