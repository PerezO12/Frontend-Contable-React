import type { AccountFilters } from '../types';
interface AccountAdvancedFiltersProps {
    filters: AccountFilters;
    onFiltersChange: (filters: AccountFilters) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    loading?: boolean;
}
export declare function AccountAdvancedFilters({ filters, onFiltersChange, onApplyFilters, onClearFilters, loading }: AccountAdvancedFiltersProps): import("react").JSX.Element;
export {};
