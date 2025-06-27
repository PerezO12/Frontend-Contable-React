import React from 'react';
import type { CostCenter } from '../types';
interface CostCenterAnalysisProps {
    costCenter: CostCenter;
    onClose?: () => void;
}
export declare const CostCenterAnalysis: React.FC<CostCenterAnalysisProps>;
export {};
