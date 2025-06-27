interface TemplateDownloadButtonProps {
    modelName: string;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}
export declare function TemplateDownloadButton({ modelName, className, variant, size, disabled, }: TemplateDownloadButtonProps): import("react").JSX.Element;
export {};
