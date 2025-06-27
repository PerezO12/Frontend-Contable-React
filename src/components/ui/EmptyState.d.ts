/**
 * Componente de estado vacío
 */
import { type ReactNode } from 'react';
export interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
    className?: string;
}
export declare function EmptyState({ title, description, icon, action, className }: EmptyStateProps): import("react").JSX.Element;
