interface UseTemplateDownloadState {
    isDownloading: boolean;
    error: string | null;
    lastDownloadedModel: string | null;
}
interface UseTemplateDownloadReturn extends UseTemplateDownloadState {
    downloadTemplate: (modelName: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}
export declare function useTemplateDownload(): UseTemplateDownloadReturn;
export {};
