export interface SelectOption {
    value: string;
    label: string;
}
export interface SelectProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    className?: string;
    disabled?: boolean;
    error?: string;
}
export declare function Select({ placeholder, value, onChange, options, className, disabled, error }: SelectProps): import("react").JSX.Element;
