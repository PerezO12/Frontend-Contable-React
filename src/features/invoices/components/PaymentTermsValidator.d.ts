interface PaymentTermsValidatorProps {
    paymentTermsId?: string;
    onValidationChange?: (isValid: boolean, errors: string[]) => void;
    className?: string;
}
export declare function PaymentTermsValidator({ paymentTermsId, onValidationChange, className }: PaymentTermsValidatorProps): import("react").JSX.Element;
export {};
