import type { JournalCreate, JournalUpdate, JournalDetail, JournalListItem, JournalFilter, JournalSequenceInfo, JournalResetSequence, JournalStats, JournalType, JournalPagination } from '../types';
interface PagedResponse<T> {
    items: T[];
    total: number;
    skip: number;
    limit: number;
}
/**
 * Cliente API para operaciones con journals
 */
export declare class JournalAPI {
    private static readonly BASE_URL;
    /**
     * Crear un nuevo journal
     */
    static createJournal(data: JournalCreate): Promise<JournalDetail>;
    /**
     * Obtener lista de journals con filtros y paginación
     */
    static getJournals(filters?: JournalFilter, pagination?: JournalPagination): Promise<PagedResponse<JournalListItem>>;
    /**
     * Obtener un journal por ID
     */
    static getJournal(id: string): Promise<JournalDetail>;
    /**
     * Actualizar un journal
     */
    static updateJournal(id: string, data: JournalUpdate): Promise<JournalDetail>;
    /**
     * Eliminar un journal
     */
    static deleteJournal(id: string): Promise<void>;
    /**
     * Obtener estadísticas de un journal
     */
    static getJournalStats(id: string): Promise<JournalStats>;
    /**
     * Obtener información de secuencia de un journal
     */
    static getJournalSequenceInfo(id: string): Promise<JournalSequenceInfo>;
    /**
     * Resetear secuencia de un journal
     */
    static resetJournalSequence(id: string, data: JournalResetSequence): Promise<JournalDetail>;
    /**
     * Obtener journals por tipo
     */
    static getJournalsByType(type: JournalType): Promise<JournalListItem[]>;
    /**
     * Obtener journal por defecto para un tipo
     */
    static getDefaultJournalForType(type: JournalType): Promise<JournalDetail | null>;
    /**
     * Obtener todos los journals activos (para selects)
     */
    static getActiveJournals(): Promise<JournalListItem[]>;
    /**
     * Buscar journals (para componentes de búsqueda)
     */
    static searchJournals(query: string, limit?: number): Promise<JournalListItem[]>;
}
export default JournalAPI;
