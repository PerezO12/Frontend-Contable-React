import type { ThirdParty, ThirdPartyType } from '@/features/third-parties/types';
interface UseThirdPartiesForInvoicesProps {
    type?: ThirdPartyType | 'all';
}
interface ThirdPartyOption {
    value: string;
    label: string;
    code?: string;
    type: ThirdPartyType;
}
export declare function useThirdPartiesForInvoices({ type }?: UseThirdPartiesForInvoicesProps): {
    thirdParties: ThirdParty[];
    options: ThirdPartyOption[];
    customerOptions: ThirdPartyOption[];
    supplierOptions: ThirdPartyOption[];
    loading: boolean;
    error: string;
    refetch: () => void;
};
export {};
