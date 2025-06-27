import type { JournalType } from '@/features/journals/types';
import type { InvoiceType } from '../types';
interface JournalOption {
    id: string;
    name: string;
    code: string;
    type: JournalType;
    default_account_id?: string;
    default_account?: {
        id: string;
        code: string;
        name: string;
    };
}
interface JournalSearchProps {
    value?: string;
    onSelect: (journal: JournalOption | null) => void;
    invoiceType: InvoiceType;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}
export declare function JournalSearch({ value, onSelect, invoiceType, placeholder, required, disabled, className }: JournalSearchProps): import("react").JSX.Element;
export {};
