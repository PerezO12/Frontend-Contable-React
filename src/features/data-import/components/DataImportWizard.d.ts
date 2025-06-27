interface DataImportWizardProps {
    dataType: 'accounts' | 'journal_entries';
    onComplete?: (result: any) => void;
    className?: string;
}
export declare function DataImportWizard({ dataType, onComplete, className }: DataImportWizardProps): import("react").JSX.Element;
export {};
