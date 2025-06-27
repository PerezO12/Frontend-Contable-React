interface AccountOption {
    id: string;
    code: string;
    name: string;
    type: string;
    level: number;
}
interface AccountSearchProps {
    value?: string;
    onChange: (accountId: string, accountInfo: AccountOption) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    allowedTypes?: string[];
}
export declare function AccountSearch({ value, onChange, placeholder, disabled, className, allowedTypes }: AccountSearchProps): import("react").JSX.Element;
export {};
