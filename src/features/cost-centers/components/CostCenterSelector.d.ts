import React from 'react';
import type { CostCenter } from '../types';
interface CostCenterSelectorProps {
    value?: string;
    onChange: (costCenterId: string | null, costCenter?: CostCenter) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    showActiveOnly?: boolean;
    className?: string;
}
export declare const CostCenterSelector: React.FC<CostCenterSelectorProps>;
interface SimpleCostCenterSelectorProps {
    value?: string;
    onChange: (costCenterId: string) => void;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}
export declare const SimpleCostCenterSelector: React.FC<SimpleCostCenterSelectorProps>;
export declare const useCostCenterFilter: () => {
    selectedCostCenter: string;
    setSelectedCostCenter: React.Dispatch<React.SetStateAction<string>>;
    selectedCostCenterData: CostCenter;
    clearFilter: () => void;
    costCenters: CostCenter[];
};
export {};
