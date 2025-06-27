import type { JournalEntryLineFormData, JournalEntryFormData } from '../types';
interface JournalEntryProductIntegrationProps {
    formData: JournalEntryFormData;
    onFormDataChange: (data: Partial<JournalEntryFormData>) => void;
    onLineChange: (index: number, field: keyof JournalEntryLineFormData, value: string) => void;
    disabled?: boolean;
}
export declare function JournalEntryProductIntegration({ formData, onFormDataChange, onLineChange, disabled }: JournalEntryProductIntegrationProps): import("react").JSX.Element;
export {};
