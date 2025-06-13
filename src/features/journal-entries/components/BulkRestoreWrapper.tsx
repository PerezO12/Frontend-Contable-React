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
}) => {  // Manejador para la operación de restauración masiva
  const handleBulkRestore = async (entryIds: string[], reason: string, forceReset: boolean = false) => {
    console.log('BulkRestoreWrapper - IDs recibidos:', entryIds, 'Force Reset:', forceReset);
    // Nos aseguramos de que los IDs son un array válido
    if (!Array.isArray(entryIds) || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos válidos para restaurar');
    }
    
    // Filtrar IDs inválidos
    const validIds: string[] = [];
    const invalidIds: string[] = [];
    
    entryIds.forEach((id: string) => {
      if (typeof id === 'string' && id.trim()) {
        validIds.push(id.trim());
      } else {
        console.error('ID inválido encontrado:', id);
        invalidIds.push(String(id));
      }
    });
    
    // Si hay IDs inválidos, reportar el problema
    if (invalidIds.length > 0) {
      console.warn(`Se encontraron ${invalidIds.length} IDs inválidos que serán ignorados`);
    }
    
    // Si no quedan IDs válidos después del filtrado, lanzar un error
    if (validIds.length === 0) {
      throw new Error('Ningún ID válido para procesar');
    }
      console.log('BulkRestoreWrapper - IDs validados:', validIds);
    return await restoreToDraftHelper(validIds, reason, forceReset);
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
