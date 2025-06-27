import type { WizardState } from '../types';
interface ImportStepperProps {
    currentStep: WizardState['currentStep'];
    isStepValid: (step: WizardState['currentStep']) => boolean;
    getStepIndex: (step: WizardState['currentStep']) => number;
    onStepClick: (step: WizardState['currentStep']) => void;
    isLoading: boolean;
}
export declare function ImportStepper({ currentStep, isStepValid, getStepIndex, onStepClick, isLoading, }: ImportStepperProps): import("react").JSX.Element;
export {};
