export interface ExportRequest {
    table: string;
    format: 'csv' | 'json' | 'xlsx';
    ids: string[];
    file_name?: string;
}
/**
 * Servicio genérico de exportación siguiendo la documentación del sistema
 */
export declare class ExportService {
    private static readonly BASE_URL;
    /**
     * Exportación simple por IDs - Endpoint principal según documentación
     */
    static exportByIds(request: ExportRequest): Promise<Blob>;
    /**
     * Obtener tablas disponibles para exportación
     */
    static getAvailableTables(): Promise<{
        tables: Array<{
            table_name: string;
            display_name: string;
            description: string;
            available_columns: Array<{
                name: string;
                data_type: string;
                include: boolean;
            }>;
            total_records: number;
        }>;
        total_tables: number;
    }>;
    /**
     * Obtener esquema de una tabla específica
     */
    static getTableSchema(tableName: string): Promise<{
        table_name: string;
        display_name: string;
        description: string;
        columns: Array<{
            name: string;
            data_type: string;
            nullable: boolean;
            description?: string;
        }>;
        total_records: number;
    }>;
    /**
     * Generar nombre de archivo único para exportación
     */
    static generateFileName(tableName: string, format: string, date?: Date): string;
    /**
     * Obtener tipo MIME según formato
     */
    static getContentType(format: string): string;
    /**
     * Descargar blob como archivo
     */
    static downloadBlob(blob: Blob, fileName: string): void;
}
