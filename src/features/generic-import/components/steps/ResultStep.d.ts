import type { ImportResult } from '../../types';
interface ResultStepProps {
    importResult?: ImportResult;
    error?: string;
    onComplete: () => void;
    onRetry: () => void;
    onStartNew: () => void;
}
export declare function ResultStep({ importResult, error, onComplete, onRetry, onStartNew, }: ResultStepProps): import("react").JSX.Element;
export {};
