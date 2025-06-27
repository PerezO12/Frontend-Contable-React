import React from 'react';
interface ExportFormatModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedAccountIds: string[];
    accountCount: number;
}
export declare const ExportFormatModal: React.FC<ExportFormatModalProps>;
export {};
