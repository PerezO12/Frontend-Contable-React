export declare const validateEmail: (email: string) => boolean;
export declare const validatePassword: (password: string) => {
    isValid: boolean;
    errors: string[];
};
export declare const sanitizeHtml: (dirty: string) => string;
export declare const sanitizeInput: (input: string) => string;
export declare const validateRequired: (value: string, fieldName: string) => string | null;
export declare const validateMinLength: (value: string, minLength: number, fieldName: string) => string | null;
export declare const validateMaxLength: (value: string, maxLength: number, fieldName: string) => string | null;
export declare const validatePasswordMatch: (password: string, confirmPassword: string) => string | null;
