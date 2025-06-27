interface PaymentTermsSearchProps {
    value?: string;
    onChange?: (paymentTermId: string, paymentTermInfo: {
        name: string;
        days?: number;
        code?: string;
    }) => void;
    onSelect?: (paymentTerms: {
        id: string;
        name: string;
        code?: string;
        days: number;
    }) => void;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
}
export declare function PaymentTermsSearch({ value, onChange, onSelect, disabled, placeholder, error }: PaymentTermsSearchProps): import("react").JSX.Element;
export {};
