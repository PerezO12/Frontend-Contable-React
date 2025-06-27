import type { ImportConfiguration } from '../types';
interface ImportConfigurationProps {
    configuration: ImportConfiguration;
    onConfigurationChange: (config: ImportConfiguration) => void;
    onImport: () => void;
    canImport: boolean;
    isLoading: boolean;
    className?: string;
}
export declare function ImportConfigurationPanel({ configuration, onConfigurationChange, onImport, canImport, isLoading, className }: ImportConfigurationProps): import("react").JSX.Element;
export {};
