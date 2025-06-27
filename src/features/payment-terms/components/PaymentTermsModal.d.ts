import React from 'react';
import type { PaymentTerms, PaymentTermsCreate } from '../types';
interface PaymentTermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (paymentTerms: PaymentTerms) => void;
    initialData?: Partial<PaymentTermsCreate>;
    editingPaymentTerms?: PaymentTerms | null;
    title?: string;
}
export declare const PaymentTermsModal: React.FC<PaymentTermsModalProps>;
export {};
