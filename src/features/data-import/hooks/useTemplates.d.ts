import type { TemplateDownload } from '../types';
export declare function useTemplates(): {
    getAvailableTemplates: () => Promise<{
        available_templates: Record<string, any>;
    }>;
    downloadTemplate: (templateData: TemplateDownload) => Promise<void>;
    getTemplateInfo: (dataType: "accounts" | "journal_entries", format: "csv" | "xlsx" | "json") => Promise<import("../types").TemplateInfo>;
    downloadAllTemplatesForType: (dataType: "accounts" | "journal_entries") => Promise<void>;
    generateCustomTemplate: (dataType: "accounts" | "journal_entries", format: "csv" | "json", sampleData?: any[]) => void;
    isLoading: boolean;
    availableTemplates: any;
    isDownloading: boolean;
};
