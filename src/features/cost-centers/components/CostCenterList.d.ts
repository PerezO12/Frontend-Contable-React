import React from 'react';
import type { CostCenter, CostCenterFilters } from '../types';
interface CostCenterListProps {
    onCostCenterSelect?: (costCenter: CostCenter) => void;
    onCreateCostCenter?: () => void;
    initialFilters?: CostCenterFilters;
    showActions?: boolean;
}
export declare const CostCenterList: React.FC<CostCenterListProps>;
export {};
