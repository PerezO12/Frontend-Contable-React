interface FileUploadStepProps {
    onFileUpload: (file: File) => Promise<void>;
    isLoading: boolean;
    selectedModel: string;
}
export declare function FileUploadStep({ onFileUpload, isLoading, selectedModel, }: FileUploadStepProps): import("react").JSX.Element;
export {};
