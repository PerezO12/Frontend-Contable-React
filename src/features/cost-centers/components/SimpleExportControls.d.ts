import React from 'react';
interface SimpleExportControlsProps {
    selectedCostCenterIds: string[];
    costCenterCount: number;
    onExportStart?: () => void;
    onExportEnd?: () => void;
}
export declare const SimpleExportControls: React.FC<SimpleExportControlsProps>;
export {};
