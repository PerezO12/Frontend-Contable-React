import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}
/**
 * Error Boundary para capturar errores en componentes de asientos contables
 * Proporciona una interfaz de usuario cuando ocurren errores inesperados
 */
export declare class JournalEntryErrorBoundary extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    handleRetry: () => void;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | React.ReactPortal | Iterable<React.ReactNode>> | React.JSX.Element;
}
/**
 * Hook para usar el error boundary de forma imperativa
 */
export declare const useJournalEntryErrorBoundary: () => {
    captureError: (error: Error) => void;
    resetError: () => void;
    hasError: boolean;
};
export default JournalEntryErrorBoundary;
