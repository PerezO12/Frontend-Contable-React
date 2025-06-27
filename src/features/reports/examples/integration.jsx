// ==========================================
// Ejemplo de integración del módulo de reportes
// ==========================================
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
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ReportsDashboard, ReportsRoutes, useReports, REPORT_TYPES } from '@/features/reports';
// ==========================================
// 1. Ejemplo básico - Página principal de reportes
// ==========================================
export var ReportsMainPage = function () {
    return (<div className="container mx-auto px-4 py-6">
      <ReportsDashboard />
    </div>);
};
// ==========================================
// 2. Ejemplo - Widget de reporte rápido
// ==========================================
export var QuickReportWidget = function () {
    var _a = useReports(), generateReport = _a.generateReport, reportsState = _a.reportsState;
    var generateBalanceGeneral = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateReport({
                        reportType: REPORT_TYPES.BALANCE_GENERAL,
                        filters: {
                            from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                            to_date: new Date().toISOString().split('T')[0],
                            detail_level: 'medio'
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Reporte Rápido</h3>
      
      <button onClick={generateBalanceGeneral} disabled={reportsState.isGenerating} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
        {reportsState.isGenerating ? 'Generando...' : 'Balance General Este Mes'}
      </button>

      {reportsState.currentReport && (<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">
            ✅ Reporte generado exitosamente
          </p>
        </div>)}

      {reportsState.error && (<div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800">
            ❌ {reportsState.error}
          </p>
        </div>)}
    </div>);
};
// ==========================================
// 3. Ejemplo - Configuración de rutas en App.tsx
// ==========================================
export var AppRoutesExample = function () {
    return (<Routes>
      {/* Ruta principal de reportes */}
      <Route path="/reportes/*" element={<ReportsRoutes />}/>
      
      {/* Página específica usando el dashboard */}
      <Route path="/dashboard/reportes" element={<ReportsMainPage />}/>
      
      {/* Redirección por defecto */}
      <Route path="/reportes" element={<Navigate to="/reportes/dashboard" replace/>}/>
      
      {/* Otras rutas de la aplicación */}
      <Route path="/cuentas/*" element={<div>Módulo de Cuentas</div>}/>
      <Route path="/asientos/*" element={<div>Módulo de Asientos</div>}/>
    </Routes>);
};
// ==========================================
// 4. Ejemplo - Hook personalizado para dashboard ejecutivo
// ==========================================
export var useExecutiveDashboard = function () {
    var _a = useReports(), generateReport = _a.generateReport, reportsState = _a.reportsState;
    var generateMonthlyReports = function () { return __awaiter(void 0, void 0, void 0, function () {
        var thisMonth, reports;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    thisMonth = {
                        from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                        to_date: new Date().toISOString().split('T')[0],
                        detail_level: 'bajo',
                        project_context: 'Dashboard Ejecutivo'
                    };
                    return [4 /*yield*/, Promise.allSettled([
                            generateReport({
                                reportType: REPORT_TYPES.BALANCE_GENERAL,
                                filters: thisMonth
                            }),
                            generateReport({
                                reportType: REPORT_TYPES.PERDIDAS_GANANCIAS,
                                filters: thisMonth
                            }),
                            generateReport({
                                reportType: REPORT_TYPES.FLUJO_EFECTIVO,
                                filters: thisMonth
                            })
                        ])];
                case 1:
                    reports = _a.sent();
                    return [2 /*return*/, reports];
            }
        });
    }); };
    return {
        generateMonthlyReports: generateMonthlyReports,
        isLoading: reportsState.isGenerating,
        currentReport: reportsState.currentReport,
        error: reportsState.error
    };
};
// ==========================================
// 5. Ejemplo - Componente de navegación con reportes
// ==========================================
export var NavigationWithReports = function () {
    return (<nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex space-x-6">
          <a href="/dashboard" className="hover:text-blue-300">
            Dashboard
          </a>
          <a href="/cuentas" className="hover:text-blue-300">
            Cuentas
          </a>
          <a href="/asientos" className="hover:text-blue-300">
            Asientos
          </a>
          <a href="/reportes" className="hover:text-blue-300">
            📊 Reportes
          </a>
          <a href="/importar" className="hover:text-blue-300">
            Importar
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <QuickReportWidget />
        </div>
      </div>
    </nav>);
};
// ==========================================
// 6. Ejemplo - Provider/Context personalizado (opcional)
// ==========================================
import { createContext, useContext } from 'react';
var ReportsContext = createContext(null);
export var ReportsProvider = function (_a) {
    var children = _a.children, companyName = _a.companyName, _b = _a.permissions, permissions = _b === void 0 ? {} : _b;
    var value = {
        companyName: companyName,
        defaultFilters: {
            project_context: companyName,
            detail_level: 'medio'
        },
        permissions: __assign({ canExport: true, canViewDetails: true }, permissions)
    };
    return (<ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>);
};
export var useReportsContext = function () {
    var context = useContext(ReportsContext);
    if (!context) {
        throw new Error('useReportsContext debe usarse dentro de ReportsProvider');
    }
    return context;
};
// ==========================================
// 7. Ejemplo de uso en App.tsx principal
// ==========================================
export var ExampleApp = function () {
    return (<ReportsProvider companyName="Mi Empresa S.A." permissions={{ canExport: true, canViewDetails: true }}>
      <div className="min-h-screen bg-gray-50">
        <NavigationWithReports />
        
        <main className="container mx-auto px-4 py-8">
          <AppRoutesExample />
        </main>
      </div>
    </ReportsProvider>);
};
// ==========================================
// 8. Ejemplo - Tests básicos
// ==========================================
/*
// reports.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useReports } from '@/features/reports';

describe('Reports Module', () => {
  test('should generate balance general report', async () => {
    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.generateReport({
        reportType: 'balance_general',
        filters: {
          from_date: '2025-01-01',
          to_date: '2025-06-10',
          detail_level: 'medio'
        }
      });
    });

    expect(result.current.reportsState.currentReport).toBeTruthy();
    expect(result.current.reportsState.error).toBeNull();
  });

  test('should validate filters correctly', () => {
    const { result } = renderHook(() => useReports());
    
    const validation = result.current.validateFilters({
      from_date: '',
      to_date: '2025-06-10'
    });

    expect(validation.isValid).toBe(false);
    expect(validation.errors).toContain('La fecha de inicio es requerida');
  });
});
*/
