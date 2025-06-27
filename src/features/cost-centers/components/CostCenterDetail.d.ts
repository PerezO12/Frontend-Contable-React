import React from 'react';
import type { CostCenter } from '../types';
interface CostCenterDetailProps {
    costCenterId: string;
    onEdit?: (costCenter: CostCenter) => void;
    onClose?: () => void;
    onDelete?: (costCenter: CostCenter) => void;
    onViewMovements?: (costCenter: CostCenter) => void;
    onViewAnalysis?: (costCenter: CostCenter) => void;
}
export declare const CostCenterDetail: React.FC<CostCenterDetailProps>;
export {};
