/**
 * Componente de tabla simple y elegante
 */
import { type ReactNode } from 'react';
export interface TableColumn<T = any> {
    key: string;
    label: string;
    render?: (item: T) => ReactNode;
    className?: string;
}
export interface TableProps<T = any> {
    columns: TableColumn<T>[];
    data: T[];
    loading?: boolean;
    className?: string;
    emptyMessage?: string;
}
export declare function Table<T extends Record<string, any>>({ columns, data, loading, className, emptyMessage }: TableProps<T>): import("react").JSX.Element;
