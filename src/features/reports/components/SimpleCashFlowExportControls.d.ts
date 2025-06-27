import React from 'react';
import type { CashFlowResponse } from '../types';
interface SimpleCashFlowExportControlsProps {
    report: CashFlowResponse;
    onExportStart?: () => void;
    onExportEnd?: () => void;
}
export declare const SimpleCashFlowExportControls: React.FC<SimpleCashFlowExportControlsProps>;
export {};
