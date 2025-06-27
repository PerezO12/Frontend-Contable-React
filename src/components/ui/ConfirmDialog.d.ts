export interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
    loading?: boolean;
}
export declare function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmText, cancelText, confirmButtonClass, loading }: ConfirmDialogProps): import("react").JSX.Element;
