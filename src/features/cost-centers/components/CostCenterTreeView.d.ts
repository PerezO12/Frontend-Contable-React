import React from 'react';
import type { CostCenter } from '../types';
interface CostCenterTreeViewProps {
    onCostCenterSelect?: (costCenter: CostCenter) => void;
    activeOnly?: boolean;
    className?: string;
}
export declare const CostCenterTreeView: React.FC<CostCenterTreeViewProps>;
export {};
