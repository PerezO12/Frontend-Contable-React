import type { ImportPreviewResponse } from '../../types';
interface PreviewStepProps {
    previewData: ImportPreviewResponse;
    onNext: () => Promise<void>;
    onNextWithSkipErrors: () => Promise<void>;
    onBack: () => void;
    isLoading: boolean;
    batchSize: number;
    onBatchSizeChange: (batchSize: number) => void;
    onBatchChange?: (batchNumber: number) => Promise<void>;
}
export declare function PreviewStep({ previewData, onNext, onNextWithSkipErrors, onBack, isLoading, batchSize, onBatchSizeChange, onBatchChange, }: PreviewStepProps): import("react").JSX.Element;
export {};
