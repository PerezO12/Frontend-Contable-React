import React from 'react';
import type { CostCenter } from '../types';
interface CostCenterMovementsProps {
    costCenter: CostCenter;
    onClose?: () => void;
}
export declare const CostCenterMovements: React.FC<CostCenterMovementsProps>;
export {};
