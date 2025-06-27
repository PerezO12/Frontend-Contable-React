import React from 'react';
interface SimpleCostCenterExportControlsProps {
    selectedCostCenterIds: string[];
    costCenterCount: number;
    onExportStart?: () => void;
    onExportEnd?: () => void;
}
export declare const SimpleCostCenterExportControls: React.FC<SimpleCostCenterExportControlsProps>;
export {};
