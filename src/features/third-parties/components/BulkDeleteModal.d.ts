import React from 'react';
import type { ThirdParty, BulkDeleteResult } from '../types';
interface BulkDeleteModalProps {
    onClose: () => void;
    onSuccess: (result: BulkDeleteResult) => void;
    selectedThirdParties: ThirdParty[];
}
export declare const BulkDeleteModal: React.FC<BulkDeleteModalProps>;
export {};
