import type { ValidationError, AccountImportData, JournalEntryImportData } from '../types';
/**
 * Valida los campos obligatorios para cuentas contables
 */
export declare function validateAccountData(data: Partial<AccountImportData>, rowNumber: number): ValidationError[];
/**
 * Valida los campos obligatorios para asientos contables
 */
export declare function validateJournalEntryData(data: Partial<JournalEntryImportData>, rowNumber: number): ValidationError[];
/**
 * Valida que los asientos contables estén balanceados
 */
export declare function validateJournalEntriesBalance(entries: JournalEntryImportData[]): ValidationError[];
/**
 * Valida el formato de archivo
 */
export declare function validateFileFormat(file: File, allowedFormats: string[]): ValidationError[];
/**
 * Obtiene las categorías válidas para un tipo de cuenta
 */
export declare function getValidCategoriesForAccountType(accountType: string): string[];
/**
 * Agrupa asientos contables por número
 */
export declare function groupEntriesByNumber(entries: JournalEntryImportData[]): Record<string, JournalEntryImportData[]>;
/**
 * Valida si una fecha está en formato válido YYYY-MM-DD
 */
export declare function isValidDate(dateString: string): boolean;
/**
 * Obtiene la extensión de un archivo
 */
export declare function getFileExtension(filename: string): string;
/**
 * Valida que no haya códigos duplicados en cuentas
 */
export declare function validateNoDuplicateCodes(accounts: AccountImportData[]): ValidationError[];
