import React from 'react';
import type { CostCenter, BulkCostCenterDeleteResult } from '../types';
interface BulkDeleteModalProps {
    selectedCostCenters: CostCenter[];
    onClose: () => void;
    onSuccess: (result: BulkCostCenterDeleteResult) => void;
}
export declare const BulkDeleteModal: React.FC<BulkDeleteModalProps>;
export {};
