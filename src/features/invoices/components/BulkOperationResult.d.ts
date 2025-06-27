import type { BulkOperationResult } from '../types';
interface BulkOperationResultDisplayProps {
    result: BulkOperationResult;
    operation: string;
    onClose: () => void;
}
export declare function BulkOperationResultDisplay({ result, operation, onClose }: BulkOperationResultDisplayProps): import("react").JSX.Element;
export {};
