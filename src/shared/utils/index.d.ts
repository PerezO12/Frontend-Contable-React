export declare const formatDate: (date: string | Date, format?: "short" | "long" | "time") => string;
/**
 * Formatea una fecha de string "YYYY-MM-DD" sin problemas de zona horaria
 * Esta función evita el problema donde new Date("2025-08-29") puede mostrar un día anterior
 * debido a la conversión de UTC a zona horaria local
 */
export declare const formatDateSafe: (dateString: string) => string;
export declare const formatCurrency: (amount: number, currency?: string) => string;
export declare const capitalize: (str: string) => string;
export declare const truncateText: (text: string, maxLength: number) => string;
export declare const sleep: (ms: number) => Promise<void>;
export declare const debounce: <T extends (...args: any[]) => any>(func: T, delay: number) => ((...args: Parameters<T>) => void);
export declare const generateId: () => string;
export declare const copyToClipboard: (text: string) => Promise<void>;
