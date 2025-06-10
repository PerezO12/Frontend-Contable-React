import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

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
export class JournalEntryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('JournalEntryErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Llamar callback opcional para reportar errores
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // En producción, aquí se podría enviar el error a un servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con servicio de monitoreo de errores
      // reportErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado, usarlo
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interfaz de error por defecto
      return (
        <Card className="m-4 p-6 border-red-200 bg-red-50">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error en Asientos Contables
            </h3>
            
            <p className="text-red-600 mb-4">
              Ha ocurrido un error inesperado al procesar los asientos contables.
              Por favor, intente nuevamente.
            </p>

            {/* Mostrar detalles del error solo en desarrollo */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-4 p-3 bg-red-100 rounded border">
                <summary className="font-medium text-red-800 cursor-pointer">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex justify-center space-x-3">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
              >
                Reintentar
              </Button>
              
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
              >
                Recargar Página
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook para usar el error boundary de forma imperativa
 */
export const useJournalEntryErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureError,
    resetError,
    hasError: !!error
  };
};

export default JournalEntryErrorBoundary;
