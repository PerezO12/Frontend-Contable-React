// ==========================================
// Componente de demostración para exportación de reportes
// ==========================================
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
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useClientExport } from '../hooks/useClientExport';
// Datos de ejemplo para demostrar la exportación
var mockReport = {
    success: true,
    project_context: "Empresa Demo - Sistema Contable",
    report_type: "balance_general",
    period: {
        from_date: "2024-01-01",
        to_date: "2024-12-31"
    },
    generated_at: new Date().toISOString(), table: {
        summary: {
            description: "Balance General consolidado con activos totales de $8.5M distribuidos principalmente en efectivo y bancos.",
            total_accounts: 4,
            balance_verified: true
        },
        sections: [
            {
                section_name: "ACTIVOS",
                items: [{
                        account_code: "1100",
                        account_name: "Caja",
                        account_group: "ACTIVOS",
                        opening_balance: "1,000,000",
                        movements: "500,000",
                        closing_balance: "1,500,000",
                        level: 0,
                        children: []
                    },
                    {
                        account_code: "1200",
                        account_name: "Bancos",
                        account_group: "ACTIVOS",
                        opening_balance: "5,000,000",
                        movements: "2,000,000",
                        closing_balance: "7,000,000",
                        level: 0,
                        children: []
                    }
                ],
                total: "8,500,000"
            },
            {
                section_name: "PASIVOS",
                items: [{
                        account_code: "2100",
                        account_name: "Proveedores",
                        account_group: "PASIVOS",
                        opening_balance: "2,000,000",
                        movements: "500,000",
                        closing_balance: "2,500,000",
                        level: 0,
                        children: []
                    }
                ],
                total: "2,500,000"
            },
            {
                section_name: "PATRIMONIO",
                items: [{
                        account_code: "3100",
                        account_name: "Capital Social",
                        account_group: "PATRIMONIO",
                        opening_balance: "6,000,000",
                        movements: "0",
                        closing_balance: "6,000,000",
                        level: 0,
                        children: []
                    }
                ],
                total: "6,000,000"
            }
        ],
        totals: {
            total_activos: "8,500,000",
            total_pasivos: "2,500,000",
            total_patrimonio: "6,000,000"
        }
    },
    narrative: {
        executive_summary: "La empresa muestra una posición financiera saludable con activos totales de $8.5M, donde el efectivo y equivalentes representan el 100% de los activos líquidos.",
        key_insights: [
            "Los activos líquidos (caja y bancos) representan el 100% del total de activos",
            "La empresa mantiene un bajo nivel de endeudamiento (29.4%)",
            "El patrimonio representa el 70.6% del total de activos"
        ],
        recommendations: [
            "Considerar diversificar las inversiones más allá del efectivo",
            "Evaluar oportunidades de crecimiento con el exceso de liquidez",
            "Mantener el control sobre el nivel de endeudamiento"
        ],
        financial_highlights: {
            debt_ratio: "0.294",
            equity_ratio: "0.706",
            liquidity_ratio: "3.40"
        }
    }
};
export var ExportDemo = function () {
    var _a = useClientExport(), exportToPDF = _a.exportToPDF, exportToExcel = _a.exportToExcel, exportToCSV = _a.exportToCSV, isExporting = _a.isExporting;
    var _b = useState(true), includeNarrative = _b[0], setIncludeNarrative = _b[1];
    var handleExport = function (format) { return __awaiter(void 0, void 0, void 0, function () {
        var options, _a, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = {
                        includeNarrative: includeNarrative,
                        customFilename: "demo-reporte-".concat(format, "-").concat(new Date().toISOString().split('T')[0], ".").concat(format === 'excel' ? 'xlsx' : format)
                    };
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
                case 2: return [4 /*yield*/, exportToPDF(mockReport, options)];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 4: return [4 /*yield*/, exportToExcel(mockReport, options)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, exportToCSV(mockReport, options)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    error_1 = _b.sent();
                    console.error('Error en exportación:', error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    return (<Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        🧪 Demo de Exportación de Reportes
      </h2>
      
      <p className="text-gray-600 mb-6">
        Prueba la nueva funcionalidad de exportación desde el frontend. 
        Los archivos se generan completamente en el navegador sin necesidad del backend.
      </p>

      <div className="space-y-4">
        {/* Toggle para narrativa */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="includeNarrative" checked={includeNarrative} onChange={function (e) { return setIncludeNarrative(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
          <label htmlFor="includeNarrative" className="text-sm font-medium text-gray-700">
            Incluir análisis y narrativa en la exportación
          </label>
        </div>

        {/* Botones de exportación */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={function () { return handleExport('pdf'); }} disabled={isExporting} className="flex items-center space-x-2">
            <span>📄</span>
            <span>Exportar PDF</span>
          </Button>

          <Button onClick={function () { return handleExport('excel'); }} disabled={isExporting} variant="secondary" className="flex items-center space-x-2">
            <span>📊</span>
            <span>Exportar Excel</span>
          </Button>

          <Button onClick={function () { return handleExport('csv'); }} disabled={isExporting} variant="secondary" className="flex items-center space-x-2">
            <span>📋</span>
            <span>Exportar CSV</span>
          </Button>
        </div>

        {isExporting && (<div className="flex items-center space-x-2 text-blue-600">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span className="text-sm">Generando archivo...</span>
          </div>)}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">✨ Características:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Exportación completa desde el frontend</li>
          <li>• No requiere conexión al backend</li>
          <li>• Incluye datos tabulares y narrativa</li>
          <li>• Formateo profesional automático</li>
          <li>• Múltiples formatos: PDF, Excel, CSV</li>
        </ul>
      </div>
    </Card>);
};
