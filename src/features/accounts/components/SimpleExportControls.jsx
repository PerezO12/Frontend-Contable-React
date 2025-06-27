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
export var SimpleExportControls = function (_a) {
    var selectedAccountIds = _a.selectedAccountIds, accountCount = _a.accountCount, onExportStart = _a.onExportStart, onExportEnd = _a.onExportEnd;
    var _b = useState('csv'), exportFormat = _b[0], setExportFormat = _b[1];
    var _c = useState(false), isExporting = _c[0], setIsExporting = _c[1];
    var _d = useToast(), success = _d.success, showError = _d.error;
    // Manejar exportación directa
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
                    onExportStart === null || onExportStart === void 0 ? void 0 : onExportStart();
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
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Error al exportar cuentas:', error_1);
                    showError('❌ Error al exportar las cuentas. Verifique su conexión e inténtelo nuevamente.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsExporting(false);
                    onExportEnd === null || onExportEnd === void 0 ? void 0 : onExportEnd();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="flex items-center space-x-3">
      {/* Selector de formato */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Formato:</label>
        <select value={exportFormat} onChange={function (e) { return setExportFormat(e.target.value); }} disabled={isExporting} className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="csv">📊 CSV (Excel)</option>
          <option value="json">🔧 JSON (APIs)</option>
          <option value="xlsx">📗 XLSX (Excel)</option>
        </select>
      </div>

      {/* Botón de exportar */}
      <Button onClick={handleExport} disabled={isExporting || selectedAccountIds.length === 0} variant="primary" className="flex items-center space-x-2">
        {isExporting ? (<>
            <Spinner size="sm"/>
            <span>Exportando...</span>
          </>) : (<>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
            <span>Exportar {exportFormat.toUpperCase()}</span>
          </>)}
      </Button>
      
      {selectedAccountIds.length > 0 && (<span className="text-sm text-gray-600">
          ({accountCount} seleccionada{accountCount === 1 ? '' : 's'})
        </span>)}
    </div>);
};
