import React from 'react';
interface BulkRestoreWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    selectedEntryIds: string[];
    onSuccess?: (result: any) => void;
}
/**
 * Componente envoltorio para BulkRestoreModal que se encarga de manejar la lógica de restauración
 * sin depender directamente del hook useJournalEntries para evitar problemas de compilación
 */
export declare const BulkRestoreWrapper: React.FC<BulkRestoreWrapperProps>;
export {};
