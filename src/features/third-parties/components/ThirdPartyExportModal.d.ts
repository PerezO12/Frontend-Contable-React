import React from 'react';
import type { ThirdParty } from '../types';
interface ThirdPartyExportModalProps {
    thirdParties: ThirdParty[];
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}
export declare const ThirdPartyExportModal: React.FC<ThirdPartyExportModalProps>;
export {};
