var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import { useDataImport } from '../hooks';
import { formatDuration } from '../utils';
export function ImportProgress(_a) {
    var _this = this;
    var importId = _a.importId, onComplete = _a.onComplete, onCancel = _a.onCancel, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useDataImport(), getImportStatus = _c.getImportStatus, cancelImport = _c.cancelImport;
    var _d = useState(null), status = _d[0], setStatus = _d[1];
    var _e = useState(true), isPolling = _e[0], setIsPolling = _e[1];
    useEffect(function () {
        var intervalId;
        var pollStatus = function () { return __awaiter(_this, void 0, void 0, function () {
            var currentStatus, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, getImportStatus(importId)];
                    case 1:
                        currentStatus = _a.sent();
                        setStatus(currentStatus);
                        if (currentStatus.status === 'completed' ||
                            currentStatus.status === 'failed' ||
                            currentStatus.status === 'cancelled') {
                            setIsPolling(false);
                            onComplete(currentStatus);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error polling import status:', error_1);
                        setIsPolling(false);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        if (isPolling) {
            // Poll immediately
            pollStatus();
            // Then poll every 2 seconds
            intervalId = setInterval(pollStatus, 2000);
        }
        return function () {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [importId, getImportStatus, onComplete, isPolling]);
    var handleCancel = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, cancelImport(importId)];
                case 1:
                    _a.sent();
                    setIsPolling(false);
                    onCancel();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error canceling import:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var getStatusLabel = function (status) {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'processing':
                return 'Procesando';
            case 'completed':
                return 'Completado';
            case 'failed':
                return 'Fallido';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Desconocido';
        }
    };
    if (!status) {
        return (<Card className={"p-6 ".concat(className)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Iniciando importación...</p>
        </div>
      </Card>);
    }
    return (<Card className={"p-6 ".concat(className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Progreso de Importación
            </h3>
            <p className="text-sm text-gray-600">
              ID: {importId}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ".concat(status.status === 'completed' ? 'bg-green-100 text-green-800' :
            status.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                status.status === 'failed' ? 'bg-red-100 text-red-800' :
                    status.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800')}>
              {getStatusLabel(status.status)}
            </span>
            
            {status.status === 'processing' && (<button onClick={handleCancel} className="text-sm text-red-600 hover:text-red-700 font-medium">
                Cancelar
              </button>)}
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{status.progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className={"h-3 rounded-full transition-all duration-300 ".concat(status.status === 'completed' ? 'bg-green-500' :
            status.status === 'failed' ? 'bg-red-500' :
                status.status === 'cancelled' ? 'bg-gray-500' :
                    'bg-blue-500')} style={{ width: "".concat(status.progress, "%") }}>
              {status.status === 'processing' && (<div className="h-full bg-blue-600 rounded-full animate-pulse"></div>)}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-semibold text-blue-600">
              {status.processed_rows.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Procesadas</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900">
              {status.total_rows.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-red-600">
              {status.errors.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Errores</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-semibold text-yellow-600">
              {status.warnings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Advertencias</p>
          </div>
        </div>

        {/* Batch Progress */}
        {status.total_batches > 1 && (<div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Lotes procesados</span>
              <span>{status.current_batch} de {status.total_batches}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gray-600 h-2 rounded-full transition-all duration-300" style={{ width: "".concat((status.current_batch / status.total_batches) * 100, "%") }}></div>
            </div>
          </div>)}

        {/* Time Information */}
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Iniciado:</span>{' '}
            {new Date(status.started_at).toLocaleTimeString()}
          </div>
          
          {status.estimated_remaining_time && status.status === 'processing' && (<div>
              <span className="font-medium">Tiempo estimado restante:</span>{' '}
              {formatDuration(status.estimated_remaining_time)}
            </div>)}
        </div>

        {/* Status Messages */}
        {status.status === 'processing' && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 text-sm">
                Procesando datos... Se están validando e importando los registros.
              </p>
            </div>
          </div>)}

        {status.status === 'completed' && (<div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <p className="text-green-800 text-sm">
                ¡Importación completada exitosamente! Todos los datos han sido procesados.
              </p>
            </div>
          </div>)}

        {status.status === 'failed' && (<div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-red-800 text-sm">
                La importación ha fallado. Revise los errores y vuelva a intentar.
              </p>
            </div>
          </div>)}

        {status.status === 'cancelled' && (<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-gray-700 text-sm">
                La importación ha sido cancelada por el usuario.
              </p>
            </div>
          </div>)}
      </div>
    </Card>);
}
