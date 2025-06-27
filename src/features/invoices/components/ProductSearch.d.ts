interface ProductSearchProps {
    value?: string;
    onChange?: (productId: string, productInfo: {
        code?: string;
        name: string;
        price?: number;
        description?: string;
    }) => void;
    onSelect?: (product: {
        id: string;
        code: string;
        name: string;
        sale_price: number;
        purchase_price: number;
        income_account_id?: string;
        expense_account_id?: string;
        tax_ids?: string[];
    }) => void;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
}
export declare function ProductSearch({ value, onChange, onSelect, disabled, placeholder, error }: ProductSearchProps): import("react").JSX.Element;
export {};
