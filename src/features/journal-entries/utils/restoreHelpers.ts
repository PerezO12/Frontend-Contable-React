import { JournalEntryService } from '../services/journalEntryService';

/**
 * Función auxiliar para restaurar múltiples asientos contables a estado borrador
 * Esta es una solución temporal para resolver errores de TypeScript en el componente JournalEntryList
 */
export const restoreToDraftHelper = async (entryIds: string[], reason: string) => {
  return await JournalEntryService.bulkRestoreToDraft(entryIds, reason);
};
