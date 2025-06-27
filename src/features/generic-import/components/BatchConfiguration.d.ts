import React from 'react';
interface BatchConfigurationProps {
    totalRows: number;
    onBatchSizeChange: (batchSize: number) => void;
    defaultBatchSize?: number;
    disabled?: boolean;
}
export declare const BatchConfiguration: React.FC<BatchConfigurationProps>;
export default BatchConfiguration;
