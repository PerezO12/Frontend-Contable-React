import React from 'react';
interface BulkStatusChangeWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    selectedEntryIds: string[];
    onSuccess?: (result: any) => void;
}
/**
 * Componente envoltorio para BulkStatusChangeModal que se encarga de manejar la lógica de cambio de estado
 * sin depender directamente del hook useJournalEntries para evitar problemas de compilación
 */
export declare const BulkStatusChangeWrapper: React.FC<BulkStatusChangeWrapperProps>;
export {};
