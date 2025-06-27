import React from 'react';
interface SimpleExportControlsProps {
    selectedAccountIds: string[];
    accountCount: number;
    onExportStart?: () => void;
    onExportEnd?: () => void;
}
export declare const SimpleExportControls: React.FC<SimpleExportControlsProps>;
export {};
