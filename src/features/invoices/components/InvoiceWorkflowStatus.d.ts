/**
 * Componente para mostrar el estado del workflow de facturas estilo Odoo
 * Muestra los 3 estados principales: DRAFT → POSTED → CANCELLED
 */
import { type InvoiceStatus } from '../types';
interface InvoiceWorkflowStatusProps {
    status: InvoiceStatus;
    onPost?: () => void;
    onCancel?: () => void;
    onResetToDraft?: () => void;
    isLoading?: boolean;
    className?: string;
}
export declare function InvoiceWorkflowStatus({ status, onPost, onCancel, onResetToDraft, isLoading, className }: InvoiceWorkflowStatusProps): import("react").JSX.Element;
export {};
