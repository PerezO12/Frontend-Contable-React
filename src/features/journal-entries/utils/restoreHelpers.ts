import { JournalEntryService } from '../services/journalEntryService';

/**
 * Función auxiliar para restaurar múltiples asientos contables a estado borrador
 * Esta es una solución temporal para resolver errores de TypeScript en el componente JournalEntryList
 */
export const restoreToDraftHelper = async (entryIds: string[], reason: string, forceReset: boolean = false) => {
  const resetData = {
    journal_entry_ids: entryIds,
    reason,
    force_reset: forceReset
  };
  return await JournalEntryService.bulkResetToDraftEntries(resetData);
};
