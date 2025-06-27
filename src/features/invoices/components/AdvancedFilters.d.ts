import type { InvoiceFilters } from '../types';
interface AdvancedFiltersProps {
    filters: InvoiceFilters;
    onFiltersChange: (filters: InvoiceFilters) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    loading?: boolean;
}
export declare function AdvancedFilters({ filters, onFiltersChange, onApplyFilters, onClearFilters, loading }: AdvancedFiltersProps): import("react").JSX.Element;
export {};
