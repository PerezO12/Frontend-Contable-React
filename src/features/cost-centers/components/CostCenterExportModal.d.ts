import React from 'react';
import type { CostCenter } from '../types';
interface CostCenterExportModalProps {
    costCenters: CostCenter[];
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}
export declare const CostCenterExportModal: React.FC<CostCenterExportModalProps>;
export {};
