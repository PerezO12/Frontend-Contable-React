/**
 * Label component
 */
import type { ComponentProps } from 'react';
interface LabelProps extends ComponentProps<'label'> {
    children: React.ReactNode;
}
export declare function Label({ children, className, ...props }: LabelProps): import("react").JSX.Element;
export {};
