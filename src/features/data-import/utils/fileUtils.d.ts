/**
 * Formatea el tamaño de archivo en una cadena legible
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Genera un nombre de archivo único con timestamp
 */
export declare function generateUniqueFilename(originalName: string, suffix?: string): string;
/**
 * Convierte un archivo a texto plano para visualización
 */
export declare function fileToText(file: File): Promise<string>;
/**
 * Descarga un blob como archivo
 */
export declare function downloadBlob(blob: Blob, filename: string): void;
/**
 * Convierte datos a CSV
 */
export declare function convertToCSV(data: any[], headers: string[]): string;
/**
 * Parsea CSV a objetos
 */
export declare function parseCSV(csvText: string, delimiter?: string): any[];
/**
 * Valida el formato MIME del archivo
 */
export declare function validateMimeType(file: File, allowedTypes: string[]): boolean;
/**
 * Detecta el formato de archivo basado en la extensión
 */
export declare function detectFileFormat(filename: string): 'csv' | 'xlsx' | 'json' | 'unknown';
/**
 * Obtiene el tipo MIME apropiado para un formato
 */
export declare function getMimeTypeForFormat(format: 'csv' | 'xlsx' | 'json'): string;
/**
 * Crea un objeto File desde contenido de texto
 */
export declare function createFileFromText(content: string, filename: string, type: string): File;
/**
 * Formatea tiempo en una cadena legible
 */
export declare function formatDuration(seconds: number): string;
/**
 * Debounce función para evitar llamadas excesivas
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
