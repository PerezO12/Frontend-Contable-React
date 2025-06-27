// ==========================================
// Store principal para el módulo de reportes
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { reportsAPI } from '../services/reportsAPI';
// Estado inicial
var initialState = {
    // Reports data
    currentReport: null,
    classicReport: null,
    reportHistory: [],
    // Loading states
    isGenerating: false,
    isExporting: false,
    // UI state
    selectedReportType: 'balance_general', currentFilters: {
        from_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        detail_level: 'medio',
        include_subaccounts: false,
        include_zero_balances: false,
        // Nuevos parámetros para flujo de efectivo
        cash_flow_method: 'indirect',
        enable_reconciliation: true,
        include_projections: false
    },
    availableReportTypes: [
        {
            type: 'balance_general',
            name: 'Balance General',
            description: 'Estado de la situación financiera a una fecha específica',
            endpoint: '/reports/balance-general',
            icon: 'balance-scale',
            category: 'financial'
        },
        {
            type: 'p_g',
            name: 'Estado de Pérdidas y Ganancias',
            description: 'Ingresos y gastos en un período específico',
            endpoint: '/reports/perdidas-ganancias',
            icon: 'trending-up',
            category: 'financial'
        },
        {
            type: 'flujo_efectivo',
            name: 'Estado de Flujo de Efectivo',
            description: 'Movimientos de efectivo en un período específico',
            endpoint: '/reports/flujo-efectivo',
            icon: 'dollar-sign',
            category: 'financial'
        }
    ],
    // Error handling
    error: null,
    validationErrors: {}
};
export var useReportsStore = create()(devtools(immer(function (set, get) { return (__assign(__assign({}, initialState), { 
    // ==========================================
    // Actions para generar reportes
    // ==========================================
    generateReport: function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var reportType, filters, _a, useClassicFormat, validation, result_1, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reportType = params.reportType, filters = params.filters, _a = params.useClassicFormat, useClassicFormat = _a === void 0 ? false : _a;
                    set(function (state) {
                        state.isGenerating = true;
                        state.error = null;
                        state.validationErrors = {};
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    validation = reportsAPI.validateFilters(filters);
                    if (!validation.isValid) {
                        throw new Error(validation.errors.join(', '));
                    }
                    return [4 /*yield*/, reportsAPI.generateReport(params)];
                case 2:
                    result_1 = _b.sent();
                    set(function (state) {
                        state.isGenerating = false;
                        if (useClassicFormat) {
                            state.classicReport = result_1;
                            state.currentReport = null;
                        }
                        else {
                            state.currentReport = result_1;
                            state.classicReport = null;
                            // Agregar al historial
                            state.reportHistory.unshift(result_1);
                            // Mantener solo los últimos 10 reportes
                            if (state.reportHistory.length > 10) {
                                state.reportHistory = state.reportHistory.slice(0, 10);
                            }
                        }
                        state.selectedReportType = reportType;
                        state.currentFilters = filters;
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    set(function (state) {
                        state.isGenerating = false;
                        state.error = error_1 instanceof Error ? error_1.message : 'Error al generar reporte';
                        state.currentReport = null;
                        state.classicReport = null;
                    });
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, generateBalanceGeneral: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get().generateReport({
                        reportType: 'balance_general',
                        filters: filters,
                        useClassicFormat: false
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, generatePerdidasGanancias: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get().generateReport({
                        reportType: 'p_g',
                        filters: filters,
                        useClassicFormat: false
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, generateFlujoEfectivo: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, get().generateReport({
                        reportType: 'flujo_efectivo',
                        filters: filters,
                        useClassicFormat: false
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 
    // ==========================================
    // Actions para gestión de filtros
    // ==========================================
    setFilters: function (newFilters) {
        set(function (state) {
            state.currentFilters = __assign(__assign({}, state.currentFilters), newFilters);
            state.validationErrors = {};
        });
    }, resetFilters: function () {
        set(function (state) {
            state.currentFilters = reportsAPI.getDefaultFilters(state.selectedReportType);
            state.validationErrors = {};
        });
    }, setReportType: function (reportType) {
        set(function (state) {
            state.selectedReportType = reportType;
            state.currentFilters = reportsAPI.getDefaultFilters(reportType);
            state.error = null;
        });
    }, setDetailLevel: function (level) {
        set(function (state) {
            state.currentFilters.detail_level = level;
        });
    }, setDateRange: function (from_date, to_date) {
        set(function (state) {
            state.currentFilters.from_date = from_date;
            state.currentFilters.to_date = to_date;
            state.validationErrors = {};
        });
    }, 
    // ==========================================
    // Actions para gestión de estado
    // ==========================================
    clearCurrentReport: function () {
        set(function (state) {
            state.currentReport = null;
            state.classicReport = null;
            state.error = null;
        });
    }, clearError: function () {
        set(function (state) {
            state.error = null;
            state.validationErrors = {};
        });
    }, setError: function (error) {
        set(function (state) {
            state.error = error;
        });
    }, addToHistory: function (report) {
        set(function (state) {
            state.reportHistory.unshift(report);
            if (state.reportHistory.length > 10) {
                state.reportHistory = state.reportHistory.slice(0, 10);
            }
        });
    }, 
    // ==========================================
    // Actions para exportación
    // ==========================================
    exportToPDF: function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (includeNarrative) {
            var _a, currentReport, classicReport, reportData, blob, url, a, error_2;
            if (includeNarrative === void 0) { includeNarrative = true; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = get(), currentReport = _a.currentReport, classicReport = _a.classicReport;
                        reportData = currentReport || classicReport;
                        if (!reportData) {
                            throw new Error('No hay reporte para exportar');
                        }
                        set(function (state) {
                            state.isExporting = true;
                            state.error = null;
                        });
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, reportsAPI.exportToPDF(reportData, { includeNarrative: includeNarrative })];
                    case 2:
                        blob = _b.sent();
                        url = window.URL.createObjectURL(blob);
                        a = document.createElement('a');
                        a.href = url;
                        a.download = "reporte-".concat(get().selectedReportType, "-").concat(new Date().toISOString().split('T')[0], ".pdf");
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _b.sent();
                        set(function (state) {
                            state.error = error_2 instanceof Error ? error_2.message : 'Error al exportar a PDF';
                        });
                        throw error_2;
                    case 4:
                        set(function (state) {
                            state.isExporting = false;
                        });
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, exportToExcel: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, currentReport, classicReport, reportData, blob, url, a, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = get(), currentReport = _a.currentReport, classicReport = _a.classicReport;
                    reportData = currentReport || classicReport;
                    if (!reportData) {
                        throw new Error('No hay reporte para exportar');
                    }
                    set(function (state) {
                        state.isExporting = true;
                        state.error = null;
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, reportsAPI.exportToExcel(reportData)];
                case 2:
                    blob = _b.sent();
                    url = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = "reporte-".concat(get().selectedReportType, "-").concat(new Date().toISOString().split('T')[0], ".xlsx");
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _b.sent();
                    set(function (state) {
                        state.error = error_3 instanceof Error ? error_3.message : 'Error al exportar a Excel';
                    });
                    throw error_3;
                case 4:
                    set(function (state) {
                        state.isExporting = false;
                    });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, exportToCSV: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, currentReport, classicReport, reportData, blob, url, a, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = get(), currentReport = _a.currentReport, classicReport = _a.classicReport;
                    reportData = currentReport || classicReport;
                    if (!reportData) {
                        throw new Error('No hay reporte para exportar');
                    }
                    set(function (state) {
                        state.isExporting = true;
                        state.error = null;
                    });
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, reportsAPI.exportToCSV(reportData)];
                case 2:
                    blob = _b.sent();
                    url = window.URL.createObjectURL(blob);
                    a = document.createElement('a');
                    a.href = url;
                    a.download = "reporte-".concat(get().selectedReportType, "-").concat(new Date().toISOString().split('T')[0], ".csv");
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _b.sent();
                    set(function (state) {
                        state.error = error_4 instanceof Error ? error_4.message : 'Error al exportar a CSV';
                    });
                    throw error_4;
                case 4:
                    set(function (state) {
                        state.isExporting = false;
                    });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, 
    // ==========================================
    // Actions para tipos de reportes
    // ==========================================
    loadReportTypes: function () { return __awaiter(void 0, void 0, void 0, function () {
        var types_1, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, reportsAPI.getReportTypes()];
                case 1:
                    types_1 = _a.sent();
                    set(function (state) {
                        state.availableReportTypes = types_1;
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error('Error cargando tipos de reportes:', error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, 
    // ==========================================
    // Actions de utilidad
    // ==========================================
    validateFilters: function () {
        var currentFilters = get().currentFilters;
        return reportsAPI.validateFilters(currentFilters);
    }, getDefaultFilters: function () {
        var selectedReportType = get().selectedReportType;
        return reportsAPI.getDefaultFilters(selectedReportType);
    } })); }), {
    name: 'reports-store',
    partialize: function (state) { return ({
        // Solo persistir configuraciones, no reportes generados
        selectedReportType: state.selectedReportType,
        currentFilters: state.currentFilters
    }); }
}));
// Selectores útiles
export var useReportsSelectors = function () {
    var store = useReportsStore();
    return {
        // Estado del reporte actual
        currentReport: store.currentReport,
        isGenerating: store.isGenerating,
        error: store.error,
        // Configuraciones
        filters: store.currentFilters,
        reportType: store.selectedReportType,
        reportTypes: store.availableReportTypes,
        // Historial
        history: store.reportHistory,
        // Estados de carga
        isExporting: store.isExporting,
        // Acciones principales
        generateReport: store.generateReport,
        setFilters: store.setFilters,
        exportToPDF: store.exportToPDF,
        exportToExcel: store.exportToExcel,
        clearError: store.clearError
    };
};
