import React from 'react';
import type { ThirdPartyFilters } from '../types';
interface AdvancedExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters?: ThirdPartyFilters;
    selectedIds?: string[];
}
export declare const AdvancedExportModal: React.FC<AdvancedExportModalProps>;
export {};
