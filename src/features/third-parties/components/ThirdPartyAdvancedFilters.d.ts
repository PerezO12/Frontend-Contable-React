import type { ThirdPartyFilters } from '../types';
interface ThirdPartyAdvancedFiltersProps {
    filters: ThirdPartyFilters;
    onFiltersChange: (filters: ThirdPartyFilters) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    loading?: boolean;
}
export declare function ThirdPartyAdvancedFilters({ filters, onFiltersChange, onApplyFilters, onClearFilters, loading }: ThirdPartyAdvancedFiltersProps): import("react").JSX.Element;
export {};
