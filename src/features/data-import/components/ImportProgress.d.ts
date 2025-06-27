interface ImportProgressProps {
    importId: string;
    onComplete: (result: any) => void;
    onCancel: () => void;
    className?: string;
}
export declare function ImportProgress({ importId, onComplete, onCancel, className }: ImportProgressProps): import("react").JSX.Element;
export {};
