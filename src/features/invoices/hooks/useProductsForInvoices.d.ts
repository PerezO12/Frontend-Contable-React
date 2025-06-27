import type { Product, ProductType } from '@/features/products/types';
interface UseProductsForInvoicesProps {
    type?: ProductType | 'all';
}
interface ProductOption {
    value: string;
    label: string;
    code?: string;
    price?: number;
    tax_rate?: number;
    type: ProductType;
}
export declare function useProductsForInvoices({ type }?: UseProductsForInvoicesProps): {
    products: Product[];
    options: ProductOption[];
    productOptions: ProductOption[];
    serviceOptions: ProductOption[];
    loading: boolean;
    error: string;
    refetch: () => void;
};
export {};
