export interface SearchInputProps {
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}
export declare function SearchInput({ placeholder, value, onChange, className, disabled }: SearchInputProps): import("react").JSX.Element;
