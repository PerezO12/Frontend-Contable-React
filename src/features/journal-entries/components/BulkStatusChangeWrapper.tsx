import React from 'react';
import { BulkStatusChangeModal } from './BulkStatusChangeModal';
import { JournalEntryService } from '../services/journalEntryService';
import { JournalEntryStatus } from '../types';

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
export const BulkStatusChangeWrapper: React.FC<BulkStatusChangeWrapperProps> = ({
  isOpen,
  onClose,
  selectedEntryIds,
  onSuccess
}) => {
  // Manejador para la operación de cambio de estado masivo
  const handleBulkStatusChange = async (entryIds: string[], newStatus: JournalEntryStatus, reason?: string) => {
    console.log('BulkStatusChangeWrapper - Cambiando estado:', { entryIds, newStatus, reason });
    
    // Validar que los IDs son un array válido
    if (!Array.isArray(entryIds) || entryIds.length === 0) {
      throw new Error('No se proporcionaron asientos válidos para cambiar estado');
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
    
    console.log('BulkStatusChangeWrapper - IDs validados:', validIds);
    
    // Llamar la función correspondiente según el estado
    switch (newStatus) {
      case JournalEntryStatus.DRAFT:
        if (!reason) {
          throw new Error('Se requiere una razón para restaurar a borrador');
        }
        return await JournalEntryService.bulkRestoreToDraft(validIds, reason);
      
      case JournalEntryStatus.PENDING:
        return await JournalEntryService.bulkMarkAsPending(validIds);
      
      case JournalEntryStatus.APPROVED:
        return await JournalEntryService.bulkApproveEntries(validIds);
      
      case JournalEntryStatus.POSTED:
        return await JournalEntryService.bulkPostEntries(validIds, reason);
      
      case JournalEntryStatus.CANCELLED:
        if (!reason) {
          throw new Error('Se requiere una razón para cancelar asientos');
        }
        return await JournalEntryService.bulkCancelEntries(validIds, reason);
      
      default:
        throw new Error(`Estado no válido: ${newStatus}`);
    }
  };

  return (
    <BulkStatusChangeModal
      isOpen={isOpen}
      onClose={onClose}
      selectedEntryIds={selectedEntryIds}
      onChangeStatus={handleBulkStatusChange}
      onSuccess={onSuccess}
    />
  );
};
