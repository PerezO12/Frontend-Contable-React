/**
 * Función auxiliar para restaurar múltiples asientos contables a estado borrador
 * Esta es una solución temporal para resolver errores de TypeScript en el componente JournalEntryList
 */
export declare const restoreToDraftHelper: (entryIds: string[], reason: string, forceReset?: boolean) => Promise<import("..").BulkJournalEntryResetResult>;
