interface ValidationError {
    row_number?: number | null;
    field_name?: string | null;
    error_type?: string;
    error_code?: string;
    message?: string;
    error_message?: string;
    severity?: string;
    current_value?: string | null;
}
interface ValidationErrorsDisplayProps {
    errors: ValidationError[];
    title?: string;
    showRowNumbers?: boolean;
    maxHeight?: string;
    className?: string;
}
export declare function ValidationErrorsDisplay({ errors, title, showRowNumbers, maxHeight, className }: ValidationErrorsDisplayProps): import("react").JSX.Element;
export {};
