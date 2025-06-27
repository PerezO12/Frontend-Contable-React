import React from 'react';
interface ValidationMessageProps {
    type: 'error' | 'success' | 'warning' | 'info';
    message: string;
    className?: string;
}
export declare const ValidationMessage: React.FC<ValidationMessageProps>;
export {};
