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
import { Button } from '@/components/ui';
import { CashFlowImportWizard } from './CashFlowImportWizard';
import { useClientExport } from '../hooks/useClientExport';
export var CashFlowImportExportControls = function (_a) {
    var report = _a.report, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState(false), showImportWizard = _c[0], setShowImportWizard = _c[1];
    var _d = useClientExport(), exportToPDF = _d.exportToPDF, exportToExcel = _d.exportToExcel, exportToCSV = _d.exportToCSV, isExporting = _d.isExporting;
    var handleExport = function (format) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!report)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 9, , 10]);
                    _a = format;
                    switch (_a) {
                        case 'pdf': return [3 /*break*/, 2];
                        case 'excel': return [3 /*break*/, 4];
                        case 'csv': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, exportToPDF(report, {
                        includeNarrative: true,
                        customFilename: 'flujo_efectivo'
                    })];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, exportToExcel(report, {
                        includeNarrative: true,
                        customFilename: 'flujo_efectivo'
                    })];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, exportToCSV(report, {
                        includeNarrative: false,
                        customFilename: 'flujo_efectivo'
                    })];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _b.sent();
                    console.error('Error exporting cash flow report:', error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    return (<div className={"space-y-4 ".concat(className)}>
      {/* Export Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📤 Exportar Flujo de Efectivo
            </h3>
            <p className="text-sm text-gray-600">
              Descarga el reporte en diferentes formatos
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={function () { return handleExport('pdf'); }} disabled={isExporting || !report} variant="primary" className="flex items-center space-x-2">
            {isExporting ? (<>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exportando...</span>
              </>) : (<>
                <span>📄</span>
                <span>Exportar PDF</span>
              </>)}
          </Button>

          <Button onClick={function () { return handleExport('excel'); }} disabled={isExporting || !report} variant="secondary" className="flex items-center space-x-2">
            {isExporting ? (<>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Exportando...</span>
              </>) : (<>
                <span>📊</span>
                <span>Exportar Excel</span>
              </>)}
          </Button>

          <Button onClick={function () { return handleExport('csv'); }} disabled={isExporting || !report} variant="secondary" className="flex items-center space-x-2">
            {isExporting ? (<>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span>Exportando...</span>
              </>) : (<>
                <span>📋</span>
                <span>Exportar CSV</span>
              </>)}
          </Button>
        </div>

        {!report && (<p className="text-sm text-gray-500 mt-2">
            💡 Genera un reporte de flujo de efectivo para habilitar las opciones de exportación
          </p>)}
      </div>      {/* Import Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              📥 Importar Datos de Flujo de Efectivo
            </h3>
            <p className="text-sm text-gray-600">
              Importa transacciones y ajustes para análisis de flujo de efectivo
            </p>
          </div>
          <Button onClick={function () { return setShowImportWizard(!showImportWizard); }} variant="secondary" size="sm">
            {showImportWizard ? 'Ocultar Importador' : 'Mostrar Importador'}
          </Button>
        </div>

        {showImportWizard && (<div className="mt-4">
            <CashFlowImportWizard onComplete={function (result) {
                console.log('Import completed:', result);
                setShowImportWizard(false);
            }}/>
          </div>)}

        {!showImportWizard && (<div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-600 mr-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  💡 Consejos para importar datos de flujo de efectivo:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Incluye todas las transacciones que afecten efectivo y equivalentes</li>
                  <li>• Clasifica correctamente las actividades: operativas, de inversión y financiamiento</li>
                  <li>• Asegúrate de que los asientos estén balanceados (débitos = créditos)</li>
                  <li>• Usa los códigos de cuenta correctos para cada tipo de actividad</li>
                  <li>• Incluye referencias claras para facilitar la auditoría</li>
                  <li>• Haz clic en "Mostrar Importador" para acceder al asistente completo</li>
                </ul>
              </div>
            </div>
          </div>)}
      </div>
    </div>);
};
