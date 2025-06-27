var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import React, { Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
/**
 * Error Boundary para capturar errores en componentes de asientos contables
 * Proporciona una interfaz de usuario cuando ocurren errores inesperados
 */
var JournalEntryErrorBoundary = /** @class */ (function (_super) {
    __extends(JournalEntryErrorBoundary, _super);
    function JournalEntryErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.handleRetry = function () {
            _this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        };
        _this.state = { hasError: false };
        return _this;
    }
    JournalEntryErrorBoundary.getDerivedStateFromError = function (error) {
        return {
            hasError: true,
            error: error
        };
    };
    JournalEntryErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        console.error('JournalEntryErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
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
    };
    JournalEntryErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            // Si se proporciona un fallback personalizado, usarlo
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Interfaz de error por defecto
            return (<Card className="m-4 p-6 border-red-200 bg-red-50">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
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
            {process.env.NODE_ENV === 'development' && this.state.error && (<details className="text-left mb-4 p-3 bg-red-100 rounded border">
                <summary className="font-medium text-red-800 cursor-pointer">
                  Detalles del error (desarrollo)
                </summary>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {(_a = this.state.errorInfo) === null || _a === void 0 ? void 0 : _a.componentStack}
                </pre>
              </details>)}

            <div className="flex justify-center space-x-3">
              <Button onClick={this.handleRetry} variant="primary" className="bg-red-600 hover:bg-red-700">
                Reintentar
              </Button>
              
              <Button onClick={function () { return window.location.reload(); }} variant="secondary">
                Recargar Página
              </Button>
            </div>
          </div>
        </Card>);
        }
        return this.props.children;
    };
    return JournalEntryErrorBoundary;
}(Component));
export { JournalEntryErrorBoundary };
/**
 * Hook para usar el error boundary de forma imperativa
 */
export var useJournalEntryErrorBoundary = function () {
    var _a = React.useState(null), error = _a[0], setError = _a[1];
    var resetError = React.useCallback(function () {
        setError(null);
    }, []);
    var captureError = React.useCallback(function (error) {
        setError(error);
    }, []);
    React.useEffect(function () {
        if (error) {
            throw error;
        }
    }, [error]);
    return {
        captureError: captureError,
        resetError: resetError,
        hasError: !!error
    };
};
export default JournalEntryErrorBoundary;
