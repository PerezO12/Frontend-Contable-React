/**
 * Componente para mostrar información específica sobre facturas NFE en operaciones bulk
 */
import React from 'react';
interface NFEBulkInfoProps {
    selectedInvoices: Array<{
        id: string;
        invoice_number: string;
        description?: string;
        notes?: string;
    }>;
    operation: 'delete' | 'post' | 'cancel' | 'reset';
}
export declare const NFEBulkInfo: React.FC<NFEBulkInfoProps>;
export default NFEBulkInfo;
