import React from 'react';
interface ReasonPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, forceOperation?: boolean) => void;
    title: string;
    placeholder: string;
    showForceOption?: boolean;
    forceOptionLabel?: string;
    forceOptionDescription?: string;
}
export declare const ReasonPromptModal: React.FC<ReasonPromptModalProps>;
export {};
