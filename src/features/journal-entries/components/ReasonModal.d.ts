import React from 'react';
interface ReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    title: string;
    description: string;
    reasonLabel?: string;
    confirmButtonText?: string;
    confirmButtonVariant?: 'primary' | 'danger' | 'warning';
    isRequired?: boolean;
}
export declare const ReasonModal: React.FC<ReasonModalProps>;
export {};
