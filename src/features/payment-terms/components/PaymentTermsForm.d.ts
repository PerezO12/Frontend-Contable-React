import React from 'react';
import type { PaymentTermsCreate, PaymentTerms } from '../types';
interface PaymentTermsFormProps {
    onSuccess?: (paymentTerms: any) => void;
    onError?: () => void;
    onLoadingChange?: (loading: boolean) => void;
    initialData?: Partial<PaymentTermsCreate>;
    editingPaymentTerms?: PaymentTerms | null;
    submitTrigger?: number;
}
export declare const PaymentTermsForm: React.FC<PaymentTermsFormProps>;
export {};
