export interface ExportFormatModalProps {
    open: boolean;
    onClose: () => void;
    onExport: (format: 'csv' | 'xlsx' | 'json') => void;
    title?: string;
    description?: string;
    loading?: boolean;
}
export declare function ExportFormatModal({ open, onClose, onExport, title, description, loading }: ExportFormatModalProps): import("react").JSX.Element;
