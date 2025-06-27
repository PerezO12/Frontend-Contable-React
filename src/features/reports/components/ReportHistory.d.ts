import React from 'react';
import type { ReportResponse } from '../types';
interface ReportHistoryProps {
    reports: ReportResponse[];
    onSelectReport?: (report: ReportResponse) => void;
    className?: string;
}
export declare const ReportHistory: React.FC<ReportHistoryProps>;
export {};
