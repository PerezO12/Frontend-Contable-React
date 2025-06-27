import React from 'react';
interface SimpleExportControlsProps {
    selectedThirdPartyIds: string[];
    thirdPartyCount: number;
    onExportStart?: () => void;
    onExportEnd?: () => void;
}
export declare const SimpleExportControls: React.FC<SimpleExportControlsProps>;
export {};
