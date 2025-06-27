import React from 'react';
import { type CostCenterCreateForm, type CostCenter } from '../types';
interface CostCenterFormProps {
    onSuccess?: (costCenter: CostCenter) => void;
    onCancel?: () => void;
    initialData?: Partial<CostCenterCreateForm>;
    isEditMode?: boolean;
    costCenterId?: string;
}
export declare const CostCenterForm: React.FC<CostCenterFormProps>;
export {};
