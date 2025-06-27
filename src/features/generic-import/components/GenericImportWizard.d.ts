import './GenericImportWizard.css';
interface GenericImportWizardProps {
    onComplete?: () => void;
    onCancel?: () => void;
}
export declare function GenericImportWizard({ onComplete, onCancel }: GenericImportWizardProps): import("react").JSX.Element;
export {};
