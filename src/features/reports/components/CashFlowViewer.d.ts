import React from 'react';
import type { CashFlowResponse } from '../types';
interface CashFlowViewerProps {
    report: CashFlowResponse;
    className?: string;
}
export declare const CashFlowViewer: React.FC<CashFlowViewerProps>;
export {};
