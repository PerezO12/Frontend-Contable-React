// ==========================================
// Dashboard principal para el módulo de reportes
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
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ReportFilters } from '../components/ReportFilters';
import { ReportViewer } from '../components/ReportViewer';
import { ReportHistory } from '../components/ReportHistory';
import { FinancialSummary } from '../components/FinancialSummary';
import { ExportDemo } from '../components/ExportDemo';
import { PDFTestComponent } from '../components/PDFTestComponent';
import { CashFlowDemo } from '../components/CashFlowDemo';
import { CashFlowTest } from '../components/CashFlowTest';
import { useReports, useReportHistory, useFinancialAnalysis } from '../hooks/useReports';
export var ReportsDashboard = function () {
    var _a = useReports(), reportsState = _a.reportsState, generateReport = _a.generateReport, clearCurrentReport = _a.clearCurrentReport;
    var getRecentReports = useReportHistory().getRecentReports;
    var getFinancialHealth = useFinancialAnalysis().getFinancialHealth;
    var _b = useState('generator'), activeTab = _b[0], setActiveTab = _b[1];
    // ==========================================
    // Handlers
    // ==========================================
    var handleGenerateReport = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var params, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        reportType: reportsState.selectedReportType,
                        filters: reportsState.currentFilters,
                        useClassicFormat: false
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, generateReport(params)];
                case 2:
                    _a.sent();
                    setActiveTab('generator'); // Asegurar que estamos en la pestaña correcta para ver el reporte
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error generando reporte:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [reportsState.selectedReportType, reportsState.currentFilters, generateReport]);
    var handleClearReport = useCallback(function () {
        clearCurrentReport();
    }, [clearCurrentReport]);
    // ==========================================
    // Computed values
    // ==========================================
    var recentReports = getRecentReports(5);
    var financialHealth = getFinancialHealth();
    var hasCurrentReport = !!reportsState.currentReport;
    return (<div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Centro de Reportes Financieros
          </h1>
          <p className="text-gray-600">
            Genera y analiza reportes financieros de manera profesional y detallada
          </p>
        </div>

        {/* Error Display */}
        {reportsState.error && (<Card className="mb-6 p-4 border-red-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <p className="text-red-700">{reportsState.error}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={function () { }} className="text-red-600 border-red-300 hover:bg-red-100">
                Cerrar
              </Button>
            </div>
          </Card>)}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Reportes Generados</p>
                <p className="text-xl font-bold text-gray-900">
                  {reportsState.reportHistory.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado Actual</p>
                <p className="text-xl font-bold text-gray-900">
                  {hasCurrentReport ? 'Disponible' : 'Sin Reporte'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <span className="text-yellow-600 text-xl">📈</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Salud Financiera</p>
                <p className="text-xl font-bold text-gray-900">
                  {(financialHealth === null || financialHealth === void 0 ? void 0 : financialHealth.level) || 'N/A'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <span className="text-purple-600 text-xl">⚡</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Último Reporte</p>
                <p className="text-xl font-bold text-gray-900">
                  {recentReports[0] ?
            new Date(recentReports[0].generated_at).toLocaleDateString('es-CO', {
                month: 'short',
                day: 'numeric'
            }) : 'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button onClick={function () { return setActiveTab('generator'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'generator'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700')}>
              🔧 Generador
            </button>
            <button onClick={function () { return setActiveTab('history'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'history'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700')}>
              📋 Historial
            </button>
            <button onClick={function () { return setActiveTab('analysis'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'analysis'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700')}>
              📊 Análisis
            </button>            <button onClick={function () { return setActiveTab('demo'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'demo'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700')}>
              🧪 Demo Exportación
            </button>            <button onClick={function () { return setActiveTab('cashflow'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'cashflow'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700')}>
              💧 Demo Cash Flow
            </button>
            <button onClick={function () { return setActiveTab('cashtest'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'cashtest'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700')}>
              🧪 Test Cash Flow
            </button>
            <button onClick={function () { return setActiveTab('pdftest'); }} className={"px-4 py-2 rounded-md text-sm font-medium transition-colors ".concat(activeTab === 'pdftest'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700')}>
              🔧 Test PDF
            </button>
          </nav>
        </div>

        {/* Main Content */}
        {activeTab === 'generator' && (<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Filters */}
            <div className="lg:col-span-1">
              <ReportFilters onGenerate={handleGenerateReport} isGenerating={reportsState.isGenerating}/>
            </div>

            {/* Right Column - Report Display */}
            <div className="lg:col-span-2">
              {reportsState.isGenerating ? (<Card className="p-12 text-center">
                  <Spinner size="lg" className="mx-auto mb-4"/>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Generando Reporte
                  </h3>
                  <p className="text-gray-600">
                    Por favor espera mientras procesamos tu solicitud...
                  </p>
                </Card>) : hasCurrentReport ? (<div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Reporte Generado
                    </h2>
                    <Button variant="secondary" onClick={handleClearReport} size="sm">
                      Limpiar
                    </Button>
                  </div>
                  <ReportViewer report={reportsState.currentReport}/>
                </div>) : (<Card className="p-12 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Listo para Generar Reporte
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Configura los filtros en el panel izquierdo y haz clic en "Generar Reporte" para comenzar.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Consejos:</h4>
                    <ul className="text-sm text-blue-800 text-left space-y-1">
                      <li>• Selecciona el tipo de reporte apropiado para tu análisis</li>
                      <li>• Usa los atajos de fecha para períodos comunes</li>
                      <li>• El nivel "Intermedio" es ideal para la mayoría de casos</li>
                      <li>• Puedes exportar en PDF, Excel o CSV después de generar</li>
                    </ul>
                  </div>
                </Card>)}
            </div>
          </div>)}

        {activeTab === 'history' && (<ReportHistory reports={reportsState.reportHistory}/>)}

        {activeTab === 'analysis' && (<div className="space-y-6">
            {financialHealth ? (<FinancialSummary health={financialHealth} currentReport={reportsState.currentReport}/>) : (<Card className="p-12 text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Análisis No Disponible
                </h3>
                <p className="text-gray-600 mb-6">
                  Genera un Balance General para ver el análisis financiero detallado.
                </p>
                <Button onClick={function () { return setActiveTab('generator'); }} className="mx-auto">
                  Ir al Generador
                </Button>              </Card>)}
          </div>)}        {activeTab === 'demo' && (<ExportDemo />)}        {activeTab === 'cashflow' && (<CashFlowDemo />)}

        {activeTab === 'cashtest' && (<CashFlowTest />)}

        {activeTab === 'pdftest' && (<PDFTestComponent />)}
      </div>
    </div>);
};
