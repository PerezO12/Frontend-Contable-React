import React from 'react';
export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string | any;
    duration?: number;
}
interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}
export declare const ToastContainer: React.FC<ToastContainerProps>;
export {};
