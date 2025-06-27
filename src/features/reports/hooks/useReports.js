// ==========================================
// Hook principal para gestión de reportes
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useCallback, useEffect, useMemo } from 'react';
import { useReportsStore } from '../stores/reportsStore';
import { useToast } from '@/shared/hooks/useToast';
export var useReports = function () {
    var store = useReportsStore();
    var _a = useToast(), success = _a.success, showError = _a.error;
    // ==========================================
    // Effects
    // ==========================================
    // Cargar tipos de reportes al montar
    useEffect(function () {
        store.loadReportTypes();
    }, []); // Solo ejecutar una vez al montar
    // ==========================================
    // Memoized values
    // ==========================================
    var reportsState = useMemo(function () { return ({
        currentReport: store.currentReport,
        classicReport: store.classicReport,
        reportHistory: store.reportHistory,
        isGenerating: store.isGenerating,
        isExporting: store.isExporting,
        selectedReportType: store.selectedReportType,
        currentFilters: store.currentFilters,
        availableReportTypes: store.availableReportTypes,
        error: store.error,
        validationErrors: store.validationErrors
    }); }, [
        store.currentReport,
        store.classicReport,
        store.reportHistory,
        store.isGenerating,
        store.isExporting,
        store.selectedReportType,
        store.currentFilters,
        store.availableReportTypes,
        store.error,
        store.validationErrors
    ]);
    // ==========================================
    // Actions con manejo de errores y toast
    // ==========================================
    var generateReport = useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, store.generateReport(params)];
                case 1:
                    _a.sent();
                    success('Reporte generado exitosamente');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    message = error_1 instanceof Error ? error_1.message : 'Error al generar reporte';
                    showError(message);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [store.generateReport, success, showError]);
    var exportReport = useCallback(function (params) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, error_2, message;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    _a = params.format;
                    switch (_a) {
                        case 'pdf': return [3 /*break*/, 1];
                        case 'excel': return [3 /*break*/, 3];
                        case 'csv': return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, store.exportToPDF(params.includeNarrative)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 3: return [4 /*yield*/, store.exportToExcel()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, store.exportToCSV()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 7:
                    success("Reporte exportado a ".concat(params.format.toUpperCase(), " exitosamente"));
                    return [3 /*break*/, 9];
                case 8:
                    error_2 = _b.sent();
                    message = error_2 instanceof Error ? error_2.message : "Error al exportar a ".concat(params.format.toUpperCase());
                    showError(message);
                    throw error_2;
                case 9: return [2 /*return*/];
            }
        });
    }); }, [store.exportToPDF, store.exportToExcel, store.exportToCSV, success, showError]);
    var setFilters = useCallback(function (filters) {
        store.setFilters(filters);
    }, [store.setFilters]);
    var clearCurrentReport = useCallback(function () {
        store.clearCurrentReport();
    }, [store.clearCurrentReport]);
    // ==========================================
    // Utility functions
    // ==========================================
    var isValidDateRange = useCallback(function (dateRange) {
        if (!dateRange.from_date || !dateRange.to_date)
            return false;
        return new Date(dateRange.from_date) <= new Date(dateRange.to_date);
    }, []);
    var getDefaultFilters = useCallback(function () {
        return store.getDefaultFilters();
    }, [store.getDefaultFilters]);
    var formatCurrency = useCallback(function (amount) {
        var numAmount = parseFloat(amount.replace(/,/g, ''));
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numAmount);
    }, []);
    return {
        reportsState: reportsState,
        generateReport: generateReport,
        exportReport: exportReport,
        clearCurrentReport: clearCurrentReport,
        setFilters: setFilters,
        isValidDateRange: isValidDateRange,
        getDefaultFilters: getDefaultFilters,
        formatCurrency: formatCurrency
    };
};
// ==========================================
// Hook especializado para filtros de reportes
// ==========================================
export var useReportFilters = function () {
    var store = useReportsStore();
    var setReportType = useCallback(function (reportType) {
        store.setReportType(reportType);
    }, [store.setReportType]);
    var setDetailLevel = useCallback(function (level) {
        store.setDetailLevel(level);
    }, [store.setDetailLevel]);
    var setDateRange = useCallback(function (fromDate, toDate) {
        store.setDateRange(fromDate, toDate);
    }, [store.setDateRange]);
    var resetFilters = useCallback(function () {
        store.resetFilters();
    }, [store.resetFilters]);
    var validateFilters = useCallback(function () {
        return store.validateFilters();
    }, [store.validateFilters]);
    return {
        filters: store.currentFilters,
        reportType: store.selectedReportType,
        validationErrors: store.validationErrors,
        setReportType: setReportType,
        setDetailLevel: setDetailLevel,
        setDateRange: setDateRange,
        resetFilters: resetFilters,
        validateFilters: validateFilters,
        setFilters: store.setFilters
    };
};
// ==========================================
// Hook para exportación de reportes
// ==========================================
export var useReportExport = function () {
    var store = useReportsStore();
    var _a = useToast(), success = _a.success, showError = _a.error;
    var exportToPDF = useCallback(function () {
        var args_1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args_1[_i] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (includeNarrative) {
            var error_3, message;
            if (includeNarrative === void 0) { includeNarrative = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, store.exportToPDF(includeNarrative)];
                    case 1:
                        _a.sent();
                        success('Reporte exportado a PDF exitosamente');
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        message = error_3 instanceof Error ? error_3.message : 'Error al exportar a PDF';
                        showError(message);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    }, [store.exportToPDF, success, showError]);
    var exportToExcel = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, store.exportToExcel()];
                case 1:
                    _a.sent();
                    success('Reporte exportado a Excel exitosamente');
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    message = error_4 instanceof Error ? error_4.message : 'Error al exportar a Excel';
                    showError(message);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [store.exportToExcel, success, showError]);
    var exportToCSV = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_5, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, store.exportToCSV()];
                case 1:
                    _a.sent();
                    success('Reporte exportado a CSV exitosamente');
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    message = error_5 instanceof Error ? error_5.message : 'Error al exportar a CSV';
                    showError(message);
                    throw error_5;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [store.exportToCSV, success, showError]);
    return {
        exportToPDF: exportToPDF,
        exportToExcel: exportToExcel,
        exportToCSV: exportToCSV,
        isExporting: store.isExporting,
        exportError: store.error
    };
};
// ==========================================
// Hook para análisis financiero
// ==========================================
export var useFinancialAnalysis = function () {
    var currentReport = useReportsStore().currentReport;
    var calculateRatios = useCallback(function () {
        if (!currentReport || currentReport.report_type !== 'balance_general') {
            return null;
        }
        // Calcular ratios básicos del balance general
        var table = currentReport.table;
        var assets = table.sections.find(function (s) { return s.section_name === 'ACTIVOS'; });
        var liabilities = table.sections.find(function (s) { return s.section_name === 'PASIVOS'; });
        var equity = table.sections.find(function (s) { return s.section_name === 'PATRIMONIO'; });
        if (!assets || !liabilities || !equity)
            return null;
        var totalAssets = parseFloat(assets.total.replace(/,/g, ''));
        var totalLiabilities = parseFloat(liabilities.total.replace(/,/g, ''));
        var totalEquity = parseFloat(equity.total.replace(/,/g, ''));
        return {
            debtToEquityRatio: totalLiabilities / totalEquity,
            equityRatio: totalEquity / totalAssets,
            debtRatio: totalLiabilities / totalAssets
        };
    }, [currentReport]);
    var getFinancialHealth = useCallback(function () {
        var ratios = calculateRatios();
        if (!ratios)
            return null;
        var score = 0;
        var alerts = [];
        // Evaluar ratio de deuda sobre patrimonio
        if (ratios.debtToEquityRatio < 0.5) {
            score += 30;
        }
        else if (ratios.debtToEquityRatio < 1) {
            score += 20;
        }
        else {
            alerts.push('Alto nivel de endeudamiento');
        }
        // Evaluar ratio de patrimonio
        if (ratios.equityRatio > 0.5) {
            score += 30;
        }
        else if (ratios.equityRatio > 0.3) {
            score += 20;
        }
        else {
            alerts.push('Bajo nivel de patrimonio');
        }
        return {
            score: score,
            level: score >= 50 ? 'Bueno' : score >= 30 ? 'Regular' : 'Preocupante',
            ratios: ratios,
            alerts: alerts
        };
    }, [calculateRatios]);
    return {
        calculateRatios: calculateRatios,
        getFinancialHealth: getFinancialHealth,
        hasAnalysisData: !!currentReport
    };
};
// ==========================================
// Hook para gestión de historial
// ==========================================
export var useReportHistory = function () {
    var _a = useReportsStore(), reportHistory = _a.reportHistory, addToHistory = _a.addToHistory;
    var getReportsByType = useCallback(function (reportType) {
        return reportHistory.filter(function (report) { return report.report_type === reportType; });
    }, [reportHistory]);
    var getRecentReports = useCallback(function (limit) {
        if (limit === void 0) { limit = 5; }
        return reportHistory.slice(0, limit);
    }, [reportHistory]);
    var findReportByFilters = useCallback(function (filters) {
        return reportHistory.find(function (report) {
            return report.period.from_date === filters.from_date &&
                report.period.to_date === filters.to_date;
        });
    }, [reportHistory]);
    return {
        history: reportHistory,
        getReportsByType: getReportsByType,
        getRecentReports: getRecentReports,
        findReportByFilters: findReportByFilters,
        addToHistory: addToHistory
    };
};
