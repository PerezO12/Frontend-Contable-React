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
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { AccountService } from '../services';
import { ExportService } from '../../../shared/services/exportService';
export var ExportFormatModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, selectedAccountIds = _a.selectedAccountIds, accountCount = _a.accountCount;
    var _b = useState('csv'), exportFormat = _b[0], setExportFormat = _b[1];
    var _c = useState(false), isExporting = _c[0], setIsExporting = _c[1];
    var _d = useToast(), success = _d.success, showError = _d.error;
    // Obtener información del formato
    var getFormatInfo = function (format) {
        var formats = {
            csv: {
                icon: '📊',
                name: 'CSV',
                description: 'Compatible con Excel',
                detail: 'Archivo separado por comas, ideal para análisis'
            },
            json: {
                icon: '🔧',
                name: 'JSON',
                description: 'Para APIs y sistemas',
                detail: 'Formato estructurado para integraciones'
            },
            xlsx: {
                icon: '📗',
                name: 'Excel',
                description: 'Archivo nativo de Excel',
                detail: 'Mantiene formato y fórmulas'
            }
        };
        return formats[format];
    };
    // Exportar cuentas seleccionadas
    var handleExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var blob, timestamp, fileName, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Iniciando exportación...', { selectedAccountIds: selectedAccountIds, accountCount: accountCount, exportFormat: exportFormat });
                    if (selectedAccountIds.length === 0) {
                        showError('No hay cuentas seleccionadas para exportar');
                        return [2 /*return*/];
                    }
                    setIsExporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    console.log('📤 Llamando al servicio de exportación...');
                    return [4 /*yield*/, AccountService.exportAccounts(selectedAccountIds, exportFormat)];
                case 2:
                    blob = _a.sent();
                    timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
                    fileName = "cuentas_".concat(accountCount, "_registros_").concat(timestamp, ".").concat(exportFormat);
                    console.log('💾 Iniciando descarga del archivo:', fileName);
                    // Descargar archivo
                    ExportService.downloadBlob(blob, fileName);
                    success("\u2705 Se exportaron ".concat(accountCount, " cuenta").concat(accountCount === 1 ? '' : 's', " exitosamente en formato ").concat(exportFormat.toUpperCase()));
                    onClose();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Error al exportar cuentas:', error_1);
                    showError('❌ Error al exportar las cuentas. Verifique su conexión e inténtelo nuevamente.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsExporting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }}>
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose}/>

      {/* Modal */}
      <div className="relative w-full max-w-md transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Exportar Cuentas Seleccionadas
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {accountCount} cuenta{accountCount === 1 ? '' : 's'} seleccionada{accountCount === 1 ? '' : 's'}
            </p>
          </div>
          <Button onClick={onClose} disabled={isExporting} variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Selecciona el formato de exportación:
              </label>
              <div className="space-y-3">
                {['csv', 'json', 'xlsx'].map(function (format) {
            var formatInfo = getFormatInfo(format);
            return (<label key={format} className={"flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ".concat(exportFormat === format
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300')}>
                      <input type="radio" name="format" value={format} checked={exportFormat === format} onChange={function (e) { return setExportFormat(e.target.value); }} disabled={isExporting} className="sr-only"/>
                      <div className="flex items-center w-full">
                        <div className="text-2xl mr-4">{formatInfo.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{formatInfo.name}</div>
                          <div className="text-sm text-gray-600">{formatInfo.description}</div>
                          <div className="text-xs text-gray-500 mt-1">{formatInfo.detail}</div>
                        </div>
                        {exportFormat === format && (<div className="text-blue-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          </div>)}
                      </div>
                    </label>);
        })}
              </div>
            </div>

            {/* Info del formato seleccionado */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-blue-600 mr-2">💡</div>
                <span className="text-sm text-blue-800">
                  {exportFormat === 'csv' && 'Ideal para análisis en Excel o importar en otros sistemas.'}
                  {exportFormat === 'json' && 'Perfecto para integraciones con APIs y sistemas externos.'}
                  {exportFormat === 'xlsx' && 'Mantiene el formato original y permite fórmulas avanzadas.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <Button onClick={onClose} disabled={isExporting} variant="secondary" className="px-4 py-2">
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting} variant="primary" className="px-4 py-2">
            {isExporting ? (<div className="flex items-center">
                <Spinner size="sm"/>
                <span className="ml-2">Exportando...</span>
              </div>) : (<div className="flex items-center">
                <span>{getFormatInfo(exportFormat).icon}</span>
                <span className="ml-2">Exportar {exportFormat.toUpperCase()}</span>
              </div>)}
          </Button>        </div>
        </div>
      </div>
    </div>);
};
