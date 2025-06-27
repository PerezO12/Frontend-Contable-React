import React from 'react';
import type { PaymentTerms } from '../types';
interface PaymentTermsSelectorProps {
    value?: string;
    onChange: (paymentTermsId: string | undefined) => void;
    onPaymentTermsSelect?: (paymentTerms: PaymentTerms | null) => void;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
}
export declare const PaymentTermsSelector: React.FC<PaymentTermsSelectorProps>;
export {};
