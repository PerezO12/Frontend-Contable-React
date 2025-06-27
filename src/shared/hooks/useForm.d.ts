import type { ValidationError } from '@/shared/types';
interface UseFormOptions<T> {
    initialData: T;
    validate?: (data: T) => ValidationError[];
    onSubmit?: (data: T) => Promise<void> | void;
}
export declare const useForm: <T extends Record<string, any>>({ initialData, validate, onSubmit }: UseFormOptions<T>) => {
    data: T;
    errors: ValidationError[];
    isSubmitting: boolean;
    isDirty: boolean;
    hasErrors: boolean;
    canSubmit: boolean;
    updateField: (field: keyof T, value: any) => void;
    setErrors: (errors: ValidationError[]) => void;
    clearErrors: () => void;
    reset: () => void;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
    getFieldError: (field: string) => string | undefined;
};
export {};
