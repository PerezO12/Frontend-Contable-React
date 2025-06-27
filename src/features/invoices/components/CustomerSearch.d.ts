interface CustomerSearchProps {
    value?: string;
    onChange?: (customerId: string, customerInfo: {
        code?: string;
        name: string;
    }) => void;
    onSelect?: (thirdParty: {
        id: string;
        name: string;
        code?: string;
        document_number?: string;
        third_party_type?: string;
        default_account_id?: string;
    }) => void;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
    filterByType?: 'customer' | 'supplier';
}
export declare function CustomerSearch({ value, onChange, onSelect, disabled, placeholder, error, filterByType }: CustomerSearchProps): import("react").JSX.Element;
export {};
