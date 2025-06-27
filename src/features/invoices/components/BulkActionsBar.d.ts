/**
 * Componente de barra de acciones para operaciones bulk en facturas
 * Incluye validación, confirmación y feedback de resultados
 */
import React from 'react';
import type { BulkOperationValidation, BulkPostRequest, BulkCancelRequest, BulkResetToDraftRequest, BulkDeleteRequest } from '../types';
interface BulkActionsBarProps {
    selectedCount: number;
    selectedInvoices: Array<{
        id: string;
        invoice_number: string;
        description?: string;
        notes?: string;
    }>;
    isProcessing: boolean;
    validationData: BulkOperationValidation | null;
    onValidateOperation: (operation: 'post' | 'cancel' | 'reset' | 'delete') => Promise<BulkOperationValidation | null>;
    onBulkPost: (options: Omit<BulkPostRequest, 'invoice_ids'>) => void;
    onBulkCancel: (options: Omit<BulkCancelRequest, 'invoice_ids'>) => void;
    onBulkResetToDraft: (options: Omit<BulkResetToDraftRequest, 'invoice_ids'>) => void;
    onBulkDelete: (options: Omit<BulkDeleteRequest, 'invoice_ids'>) => void;
    onClearSelection: () => void;
}
export declare function BulkActionsBar({ selectedCount, selectedInvoices, isProcessing, validationData, onValidateOperation, onBulkPost, onBulkCancel, onBulkResetToDraft, onBulkDelete, onClearSelection }: BulkActionsBarProps): React.JSX.Element;
export {};
