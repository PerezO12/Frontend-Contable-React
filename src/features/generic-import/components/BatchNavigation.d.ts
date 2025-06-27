import React from 'react';
import type { BatchInfo } from '../types';
interface BatchNavigationProps {
    batchInfo: BatchInfo;
    onBatchChange: (batchNumber: number) => void;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
}
export declare const BatchNavigation: React.FC<BatchNavigationProps>;
export default BatchNavigation;
