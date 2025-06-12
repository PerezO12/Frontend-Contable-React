import React from 'react';
import { BulkRestoreModal } from './BulkRestoreModal';
import { restoreToDraftHelper } from '../utils/restoreHelpers';


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
export const BulkRestoreWrapper: React.FC<BulkRestoreWrapperProps> = ({
  isOpen,
  onClose,
  selectedEntryIds,
  onSuccess
}) => {
  // Manejador para la operación de restauración masiva
  const handleBulkRestore = async (entryIds: string[], reason: string) => {
    return await restoreToDraftHelper(entryIds, reason);
  };

  return (
    <BulkRestoreModal
      isOpen={isOpen}
      onClose={onClose}
      selectedEntryIds={selectedEntryIds}
      onBulkRestore={handleBulkRestore}
      onSuccess={onSuccess}
    />
  );
};
