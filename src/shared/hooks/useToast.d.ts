import type { Toast } from '@/components/ui/Toast';
export declare const useToast: () => {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
    success: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
};
