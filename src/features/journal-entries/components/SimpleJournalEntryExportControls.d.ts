import React from 'react';
interface SimpleJournalEntryExportControlsProps {
    selectedEntryIds: string[];
    entryCount: number;
    onExportStart?: () => void;
    onExportEnd?: () => void;
}
export declare const SimpleJournalEntryExportControls: React.FC<SimpleJournalEntryExportControlsProps>;
export {};
