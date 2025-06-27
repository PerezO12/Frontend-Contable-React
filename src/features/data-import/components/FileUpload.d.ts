import React from 'react';
interface FileUploadProps {
    onFileUploaded: (file: File, previewData: any) => void;
    dataType: 'accounts' | 'journal_entries';
    validationLevel?: 'strict' | 'tolerant' | 'preview';
    className?: string;
}
export declare function FileUpload({ onFileUploaded, dataType, validationLevel, className }: FileUploadProps): React.JSX.Element;
export {};
