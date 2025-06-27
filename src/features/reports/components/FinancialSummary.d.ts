import React from 'react';
import type { ReportResponse } from '../types';
interface FinancialHealth {
    score: number;
    level: string;
    ratios: {
        debtToEquityRatio: number;
        equityRatio: number;
        debtRatio: number;
    };
    alerts: string[];
}
interface FinancialSummaryProps {
    health: FinancialHealth;
    currentReport: ReportResponse | null;
    className?: string;
}
export declare const FinancialSummary: React.FC<FinancialSummaryProps>;
export {};
