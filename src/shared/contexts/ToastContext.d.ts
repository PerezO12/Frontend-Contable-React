import React from 'react';
interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}
interface ToastContextType {
    showToast: (message: string | any, type: ToastMessage['type'], duration?: number) => void;
    showSuccess: (message: string | any, duration?: number) => void;
    showError: (message: string | any, duration?: number) => void;
    showWarning: (message: string | any, duration?: number) => void;
    showInfo: (message: string | any, duration?: number) => void;
}
export declare const useToast: () => ToastContextType;
interface ToastProviderProps {
    children: React.ReactNode;
}
export declare const ToastProvider: React.FC<ToastProviderProps>;
export {};
