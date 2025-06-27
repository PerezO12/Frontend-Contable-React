import type { JournalEntry } from '../types';
interface ModalState {
    isOpen: boolean;
    entry: JournalEntry | null;
    type: 'post' | 'cancel' | 'reverse' | null;
}
export declare const useJournalEntryOperationsWithModal: () => {
    modalState: ModalState;
    modalConfig: {
        title: string;
        description: string;
        reasonLabel: string;
        confirmButtonText: string;
        confirmButtonVariant: "primary";
        isRequired: boolean;
    } | {
        title: string;
        description: string;
        reasonLabel: string;
        confirmButtonText: string;
        confirmButtonVariant: "danger";
        isRequired: boolean;
    } | {
        title: string;
        description: string;
        reasonLabel: string;
        confirmButtonText: string;
        confirmButtonVariant: "warning";
        isRequired: boolean;
    };
    handleApprove: (entry: JournalEntry) => Promise<boolean>;
    handlePost: (entry: JournalEntry) => void;
    handleCancel: (entry: JournalEntry) => void;
    handleReverse: (entry: JournalEntry) => void;
    handleModalConfirm: (reason: string) => Promise<boolean>;
    handleModalClose: () => void;
};
export {};
