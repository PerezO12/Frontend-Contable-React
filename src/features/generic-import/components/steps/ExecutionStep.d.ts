import type { ImportSessionResponse } from '../../types';
interface ExecutionStepProps {
    isLoading: boolean;
    importSession: ImportSessionResponse;
    batchSize?: number;
}
export declare function ExecutionStep({ importSession, batchSize, }: ExecutionStepProps): import("react").JSX.Element;
export {};
