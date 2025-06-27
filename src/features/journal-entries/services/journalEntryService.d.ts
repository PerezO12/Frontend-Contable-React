import type { JournalEntry, JournalEntryCreate, JournalEntryUpdate, JournalEntryFilters, JournalEntryListResponse, JournalEntryStatistics, BulkJournalEntryDelete, JournalEntryDeleteValidation, BulkJournalEntryDeleteResult, BulkJournalEntryPost, BulkJournalEntryCancel, BulkJournalEntryReverse, BulkJournalEntryResetToDraft, JournalEntryApproveValidation, JournalEntryPostValidation, JournalEntryCancelValidation, JournalEntryReverseValidation, JournalEntryResetToDraftValidation, BulkJournalEntryPostResult, BulkJournalEntryCancelResult, BulkJournalEntryReverseResult, BulkJournalEntryResetResult } from '../types';
import { JournalEntryStatus } from '../types';
/**
 * Servicio para operaciones relacionadas con asientos contables
 * Maneja todas las interacciones con el API backend
 *
 * VERIFICADO: Los endpoints bulk están alineados con la documentación actualizada:
 * - POST /api/v1/journal-entries/bulk-approve (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-post (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-cancel (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-reverse (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-reset-to-draft (usa 'journal_entry_ids')
 *
 * Fecha de última verificación: 2025-06-13
 */
export declare class JournalEntryService {
    private static readonly BASE_URL;
    /**
     * Obtener lista de asientos contables con filtros
     */ static getJournalEntries(filters?: JournalEntryFilters): Promise<JournalEntryListResponse>;
    /**
     * Obtener un asiento contable por ID
     * Incluye información expandida de cuentas, terceros, productos y términos de pago
     */
    static getJournalEntryById(id: string): Promise<JournalEntry>;
    /**
     * Obtener un asiento contable por número
     */
    static getJournalEntryByNumber(number: string): Promise<JournalEntry>;
    /**
     * Transforma los datos del formulario a la estructura que espera el backend
     */
    private static transformFormDataToBackend;
    /**
     * Crear un nuevo asiento contable
     */
    static createJournalEntry(data: JournalEntryCreate): Promise<JournalEntry>;
    /**
     * Actualizar un asiento contable existente
     */
    static updateJournalEntry(id: string, data: JournalEntryUpdate): Promise<JournalEntry>;
    /**
     * Eliminar un asiento contable
     */
    static deleteJournalEntry(id: string, reason?: string): Promise<void>;
    /**
     * Aprobar un asiento contable
     */
    static approveJournalEntry(id: string, reason?: string): Promise<JournalEntry>;
    /**
     * Contabilizar un asiento contable
     */
    static postJournalEntry(id: string, reason?: string): Promise<JournalEntry>;
    /**
     * Cancelar un asiento contable
     */
    static cancelJournalEntry(id: string, reason: string): Promise<JournalEntry>;
    /**
     * Revertir un asiento contable
     */
    static reverseJournalEntry(id: string, reason: string): Promise<JournalEntry>;
    /**
     * Restablecer un asiento contable a borrador
     */
    static resetJournalEntryToDraft(id: string, reason: string): Promise<JournalEntry>;
    /**
     * Obtener estadísticas de asientos contables
     */
    static getJournalEntryStatistics(): Promise<JournalEntryStatistics>;
    /**
     * Validar eliminación masiva de asientos contables
     */
    static validateBulkDelete(data: BulkJournalEntryDelete): Promise<JournalEntryDeleteValidation[]>;
    /**
     * Eliminar múltiples asientos contables
     */
    static bulkDeleteJournalEntries(data: BulkJournalEntryDelete): Promise<BulkJournalEntryDeleteResult>;
    /**
     * Aprobar múltiples asientos contables
     */
    static bulkApproveEntries(entryIds: string[], reason?: string, forceApprove?: boolean): Promise<{
        total_requested: number;
        total_approved: number;
        total_failed: number;
        successful_entries: JournalEntry[];
        failed_entries: {
            id: string;
            error: string;
        }[];
    }>;
    /**
     * Validar aprobación masiva de asientos contables
     */
    static validateBulkApprove(entryIds: string[]): Promise<JournalEntryApproveValidation>;
    /**
     * Contabilizar múltiples asientos contables (nuevo formato con objeto)
     */
    static bulkPostEntries(data: BulkJournalEntryPost): Promise<BulkJournalEntryPostResult>;
    /**
     * Validar contabilización masiva de asientos contables
     */
    static validateBulkPost(data: BulkJournalEntryPost): Promise<JournalEntryPostValidation>;
    /**
     * Cancelar múltiples asientos contables (nuevo formato con objeto)
     */
    static bulkCancelEntries(data: BulkJournalEntryCancel): Promise<BulkJournalEntryCancelResult>;
    /**
     * Validar cancelación masiva de asientos contables
     */
    static validateBulkCancel(data: BulkJournalEntryCancel): Promise<JournalEntryCancelValidation>;
    /**
     * Revertir múltiples asientos contables (nuevo formato con objeto)
     */
    static bulkReverseEntries(data: BulkJournalEntryReverse): Promise<BulkJournalEntryReverseResult>;
    /**
     * Validar reversión masiva de asientos contables
     */
    static validateBulkReverse(data: BulkJournalEntryReverse): Promise<JournalEntryReverseValidation>;
    /**
     * Restablecer múltiples asientos contables a borrador (nuevo formato con objeto)
     */
    static bulkResetToDraftEntries(data: BulkJournalEntryResetToDraft): Promise<BulkJournalEntryResetResult>;
    /**
     * Validar restablecimiento masivo a borrador de asientos contables
     */
    static validateBulkResetToDraft(data: BulkJournalEntryResetToDraft): Promise<JournalEntryResetToDraftValidation>;
    /**
     * Alias para bulkResetToDraftEntries con sintaxis legacy
     */
    static bulkRestoreToDraft(entryIds: string[], reason: string, forceReset?: boolean): Promise<{
        total_requested: number;
        total_restored: number;
        total_failed: number;
        successful_entries: JournalEntry[];
        failed_entries: {
            id: string;
            error: string;
        }[];
    }>;
    /**
     * Función unificada para cambio de estado masivo
     */
    static bulkChangeStatus(entryIds: string[], newStatus: JournalEntryStatus, reason?: string, forceOperation?: boolean): Promise<{
        total_requested: number;
        total_updated: number;
        total_failed: number;
        successful_entries: JournalEntry[];
        failed_entries: {
            id: string;
            error: string;
        }[];
    }>;
    /**
     * Exportar asientos contables específicos por IDs usando sistema genérico
     */
    static exportJournalEntries(entryIds: string[], format?: 'xlsx' | 'csv' | 'json'): Promise<Blob>;
    /**
     * Exportar asientos contables a Excel
     */ static exportToExcel(filters?: JournalEntryFilters): Promise<void>;
    /**
     * Exportar asientos contables a PDF
     */ static exportToPDF(filters?: JournalEntryFilters): Promise<void>;
    /**
     * Obtiene los detalles completos de términos de pago para un asiento contable
     * Incluye cronogramas de pago calculados
     */
    static getEnrichedPaymentTermsForEntry(journalEntry: JournalEntry): Promise<Map<string, any>>;
    /**
     * Extrae información de productos de las líneas de un asiento contable
     */
    static extractProductInfo(journalEntry: JournalEntry): any[];
    /**
     * Extrae información de terceros de las líneas de un asiento contable
     */
    static extractThirdPartyInfo(journalEntry: JournalEntry): any[];
    /**
     * Extrae información de términos de pago de las líneas de un asiento contable
     * Versión básica - para información completa usar getEnrichedPaymentTermsForEntry
     */
    static extractPaymentTermsInfo(journalEntry: JournalEntry): any[];
    /**
     * Obtiene un resumen de cálculos de las líneas de un asiento contable
     */
    static getCalculationSummary(journalEntry: JournalEntry): {
        total_discount: string;
        total_taxes: string;
        total_net: string;
        total_gross: string;
        lines_with_products: number;
        total_lines: number;
    };
    /**
     * Valida si un asiento contable está completo y listo para ser contabilizado
     */
    static validateJournalEntryCompleteness(journalEntry: JournalEntry): {
        is_valid: boolean;
        issues: any[];
        can_be_posted: boolean;
        can_be_edited: boolean;
    };
    /**
     * Calcula las fechas de vencimiento correctas para una línea de asiento
     * considerando los cronogramas de términos de pago que ya vienen en la respuesta del API
     */ static calculateCorrectDueDatesForLine(line: any): {
        finalDueDate: string | null;
        paymentSchedule: any[];
        isCalculated: boolean;
    };
    /**
     * Obtiene un resumen de las fechas de vencimiento para todas las líneas de un asiento
     */
    static getDueDatesSummaryForEntry(entry: JournalEntry): {
        hasScheduledPayments: boolean;
        earliestDueDate: string | null;
        latestDueDate: string | null;
        totalScheduledPayments: number;
    };
}
