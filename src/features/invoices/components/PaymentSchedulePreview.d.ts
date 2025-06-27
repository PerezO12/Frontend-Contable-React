interface PaymentSchedulePreviewProps {
    invoiceId?: string;
    invoiceAmount?: number;
    paymentTermsId?: string;
    invoiceDate?: string;
    onRefresh?: () => void;
    className?: string;
}
export declare function PaymentSchedulePreview({ invoiceId, invoiceAmount, paymentTermsId, invoiceDate: _invoiceDate, // Marked as unused with underscore prefix
onRefresh, className }: PaymentSchedulePreviewProps): import("react").JSX.Element;
export {};
