var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { Modal } from '../../../components/ui/Modal';
import { useToast } from '../../../shared/hooks';
import { ThirdPartyService } from '../services';
import { ExportService } from '../../../shared/services/exportService';
export var AdvancedExportModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, _b = _a.currentFilters, currentFilters = _b === void 0 ? {} : _b, _c = _a.selectedIds, selectedIds = _c === void 0 ? [] : _c;
    var _d = useState('csv'), exportFormat = _d[0], setExportFormat = _d[1];
    var _e = useState(''), fileName = _e[0], setFileName = _e[1];
    var _f = useState(false), includeInactive = _f[0], setIncludeInactive = _f[1];
    var _g = useState(true), includeMetadata = _g[0], setIncludeMetadata = _g[1];
    var _h = useState(''), dateFrom = _h[0], setDateFrom = _h[1];
    var _j = useState(''), dateTo = _j[0], setDateTo = _j[1];
    var _k = useState(false), isExporting = _k[0], setIsExporting = _k[1];
    var _l = useState('selected'), exportMode = _l[0], setExportMode = _l[1];
    var _m = useToast(), success = _m.success, showError = _m.error;
    var handleAdvancedExport = function () { return __awaiter(void 0, void 0, void 0, function () {
        var combinedFilters, request, response, downloadResponse, blob, finalFileName, downloadError_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsExporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, 11, 12]);
                    combinedFilters = __assign({}, currentFilters);
                    // Agregar filtros específicos del modal
                    // Nota: Los filtros de fecha no son soportados por el backend actual
                    // if (dateFrom) {
                    //   combinedFilters.created_after = dateFrom;
                    // }
                    // if (dateTo) {
                    //   combinedFilters.created_before = dateTo;
                    // }
                    if (!includeInactive) {
                        combinedFilters.is_active = true;
                    }
                    request = {
                        format: exportFormat,
                        filters: combinedFilters,
                        include_balances: includeMetadata,
                        include_aging: includeMetadata
                    };
                    console.log('🚀 Iniciando exportación avanzada:', request);
                    return [4 /*yield*/, ThirdPartyService.exportThirdPartiesAdvanced(request)];
                case 2:
                    response = _a.sent();
                    if (!(response.status === 'ready' && response.download_url)) return [3 /*break*/, 8];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, fetch(response.download_url)];
                case 4:
                    downloadResponse = _a.sent();
                    return [4 /*yield*/, downloadResponse.blob()];
                case 5:
                    blob = _a.sent();
                    finalFileName = fileName || "terceros_avanzado_".concat(new Date().toISOString().slice(0, 19).replace(/[:-]/g, ''), ".").concat(exportFormat);
                    ExportService.downloadBlob(blob, finalFileName);
                    success("\u2705 Exportaci\u00F3n completada: ".concat(finalFileName));
                    return [3 /*break*/, 7];
                case 6:
                    downloadError_1 = _a.sent();
                    console.error('Error en descarga:', downloadError_1);
                    success("\u2705 Exportaci\u00F3n completada. ID: ".concat(response.export_id, " - Usar URL de descarga proporcionada."));
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    // Exportación en proceso
                    success("\uD83D\uDE80 Exportaci\u00F3n iniciada. ID: ".concat(response.export_id, ". Estado: ").concat(response.status));
                    _a.label = 9;
                case 9:
                    onClose();
                    return [3 /*break*/, 12];
                case 10:
                    error_1 = _a.sent();
                    console.error('❌ Error en exportación avanzada:', error_1);
                    showError('❌ Error en la exportación avanzada. Verifique los parámetros e inténtelo nuevamente.');
                    return [3 /*break*/, 12];
                case 11:
                    setIsExporting(false);
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    var isValidExport = true; // La exportación avanzada siempre es válida
    return (<Modal isOpen={isOpen} onClose={onClose} title="Exportación Avanzada de Terceros" size="lg">
      <div className="space-y-6">
        {/* Modo de exportación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datos a exportar
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" value="selected" checked={exportMode === 'selected'} onChange={function (e) { return setExportMode(e.target.value); }} className="mr-2" disabled={selectedIds.length === 0}/>
              <span className={selectedIds.length === 0 ? 'text-gray-400' : ''}>
                Registros seleccionados ({selectedIds.length})
              </span>
            </label>
            <label className="flex items-center">
              <input type="radio" value="filtered" checked={exportMode === 'filtered'} onChange={function (e) { return setExportMode(e.target.value); }} className="mr-2"/>
              <span>Registros con filtros actuales</span>
            </label>
            <label className="flex items-center">
              <input type="radio" value="all" checked={exportMode === 'all'} onChange={function (e) { return setExportMode(e.target.value); }} className="mr-2"/>
              <span>Todos los registros</span>
            </label>
          </div>
        </div>

        {/* Formato y nombre de archivo */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de exportación
            </label>            <select value={exportFormat} onChange={function (e) { return setExportFormat(e.target.value); }} disabled={isExporting} className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="csv">📊 CSV (Excel)</option>
              <option value="xlsx">� XLSX (Excel)</option>
              <option value="pdf">� PDF (Reporte)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de archivo (opcional)
            </label>
            <input type="text" value={fileName} onChange={function (e) { return setFileName(e.target.value); }} placeholder="terceros_exportacion" disabled={isExporting} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        {/* Filtros de fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha desde (opcional)
            </label>
            <input type="date" value={dateFrom} onChange={function (e) { return setDateFrom(e.target.value); }} disabled={isExporting} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha hasta (opcional)
            </label>
            <input type="date" value={dateTo} onChange={function (e) { return setDateTo(e.target.value); }} disabled={isExporting} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        </div>

        {/* Opciones adicionales */}
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" checked={!includeInactive} onChange={function (e) { return setIncludeInactive(!e.target.checked); }} disabled={isExporting} className="mr-2"/>
            <span className="text-sm text-gray-700">Solo terceros activos</span>
          </label>
          
          <label className="flex items-center">
            <input type="checkbox" checked={includeMetadata} onChange={function (e) { return setIncludeMetadata(e.target.checked); }} disabled={isExporting} className="mr-2"/>
            <span className="text-sm text-gray-700">Incluir metadatos (fechas de creación/modificación)</span>
          </label>
        </div>        {/* Información de estado */}
        {exportMode === 'selected' && selectedIds.length === 0 && (<div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Modo de registros seleccionados no disponible con la exportación avanzada. Se exportarán todos los registros que coincidan con los filtros aplicados.
            </p>
          </div>)}

        {exportMode === 'selected' && selectedIds.length > 0 && (<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              ℹ️ La exportación avanzada aplicará los filtros de la tabla. Para exportar solo registros específicos, use la exportación básica.
            </p>
          </div>)}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose} disabled={isExporting}>
            Cancelar
          </Button>
          
          <Button variant="primary" onClick={handleAdvancedExport} disabled={isExporting || !isValidExport} className="flex items-center space-x-2">
            {isExporting ? (<>
                <Spinner size="sm"/>
                <span>Exportando...</span>
              </>) : (<>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
                <span>Exportar</span>
              </>)}
          </Button>
        </div>
      </div>
    </Modal>);
};
