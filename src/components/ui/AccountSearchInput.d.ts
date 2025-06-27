import type { Account } from '@/features/accounts/types';
interface AccountSearchInputProps {
    value?: string;
    onChange: (accountId: string | undefined, account?: Account) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    className?: string;
    limit?: number;
}
export declare function AccountSearchInput({ value, onChange, placeholder, disabled, error, className, limit }: AccountSearchInputProps): import("react").JSX.Element;
export {};
