/**
 * Componente Badge para mostrar etiquetas de estado
 */
import { type ReactNode } from 'react';
export interface BadgeProps {
    children: ReactNode;
    variant?: 'subtle' | 'solid';
    color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'orange' | 'emerald';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}
export declare function Badge({ children, variant, color, size, className }: BadgeProps): import("react").JSX.Element;
