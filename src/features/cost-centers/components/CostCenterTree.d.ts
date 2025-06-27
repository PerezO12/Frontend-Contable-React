import React from 'react';
import type { CostCenter, CostCenterTree as CostCenterTreeType } from '../types';
interface CostCenterTreeProps {
    onCostCenterSelect?: (costCenter: CostCenterTreeType | CostCenter) => void;
    onCreateChild?: (parent: CostCenterTreeType | CostCenter) => void;
    activeOnly?: boolean;
}
export declare const CostCenterTreeComponent: React.FC<CostCenterTreeProps>;
export {};
