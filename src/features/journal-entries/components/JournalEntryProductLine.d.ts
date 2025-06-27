import type { JournalEntryLineFormData } from '../types';
interface JournalEntryProductLineProps {
    line: JournalEntryLineFormData;
    lineIndex: number;
    onLineChange: (index: number, field: keyof JournalEntryLineFormData, value: string) => void;
    disabled?: boolean;
    showProductInfo?: boolean;
}
export declare function JournalEntryProductLine({ line, lineIndex, onLineChange, disabled, showProductInfo }: JournalEntryProductLineProps): import("react").JSX.Element;
export {};
