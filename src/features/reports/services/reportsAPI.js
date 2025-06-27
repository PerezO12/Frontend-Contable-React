// ==========================================
// API Client para Reportes Financieros
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
import { apiClient } from '@/shared/api/client';
// Base endpoints
var REPORTS_BASE = '/api/v1/reports';
var ReportsAPIService = /** @class */ (function () {
    function ReportsAPIService() {
    }
    // ==========================================
    // API de Reportes Unificados
    // ==========================================
    /**
     * Genera Balance General con formato unificado
     */
    ReportsAPIService.prototype.generateBalanceGeneral = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams(__assign(__assign(__assign({ from_date: filters.from_date, to_date: filters.to_date }, (filters.project_context && { project_context: filters.project_context })), (filters.detail_level && { detail_level: filters.detail_level })), (filters.include_subaccounts !== undefined && {
                            include_subaccounts: filters.include_subaccounts.toString()
                        })));
                        return [4 /*yield*/, apiClient.get("".concat(REPORTS_BASE, "/balance-general?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Genera Estado de Pérdidas y Ganancias
     */
    ReportsAPIService.prototype.generatePerdidasGanancias = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams(__assign(__assign(__assign({ from_date: filters.from_date, to_date: filters.to_date }, (filters.project_context && { project_context: filters.project_context })), (filters.detail_level && { detail_level: filters.detail_level })), (filters.include_subaccounts !== undefined && {
                            include_subaccounts: filters.include_subaccounts.toString()
                        })));
                        return [4 /*yield*/, apiClient.get("".concat(REPORTS_BASE, "/perdidas-ganancias?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Genera Estado de Flujo de Efectivo
     */
    ReportsAPIService.prototype.generateFlujoEfectivo = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams(__assign(__assign(__assign(__assign(__assign(__assign({ from_date: filters.from_date, to_date: filters.to_date }, (filters.project_context && { project_context: filters.project_context })), (filters.detail_level && { detail_level: filters.detail_level })), (filters.include_subaccounts !== undefined && {
                            include_subaccounts: filters.include_subaccounts.toString()
                        })), (filters.cash_flow_method && { method: filters.cash_flow_method })), (filters.enable_reconciliation !== undefined && {
                            enable_reconciliation: filters.enable_reconciliation.toString()
                        })), (filters.include_projections !== undefined && {
                            include_projections: filters.include_projections.toString()
                        })));
                        return [4 /*yield*/, apiClient.get("".concat(REPORTS_BASE, "/flujo-efectivo?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // ==========================================
    // API de Reportes Clásicos
    // ==========================================
    /**
     * Genera Balance General clásico
     */
    ReportsAPIService.prototype.generateClassicBalanceSheet = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams(__assign(__assign(__assign({}, (filters.to_date && { as_of_date: filters.to_date })), (filters.include_zero_balances !== undefined && {
                            include_zero_balances: filters.include_zero_balances.toString()
                        })), (filters.company_name && { company_name: filters.company_name })));
                        return [4 /*yield*/, apiClient.get("".concat(REPORTS_BASE, "/balance-sheet?").concat(params))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    // ==========================================
    // Gestión de Tipos de Reportes
    // ==========================================
    /**
     * Obtiene todos los tipos de reportes disponibles - IMPLEMENTADO
     */
    ReportsAPIService.prototype.getReportTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.get("".concat(REPORTS_BASE, "/types"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.report_types];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error al obtener tipos de reportes:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // Método unificado para generar reportes
    // ==========================================
    /**
     * Genera cualquier tipo de reporte basado en los parámetros
     */
    ReportsAPIService.prototype.generateReport = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var reportType, filters, _a, useClassicFormat;
            return __generator(this, function (_b) {
                reportType = params.reportType, filters = params.filters, _a = params.useClassicFormat, useClassicFormat = _a === void 0 ? false : _a;
                // Si se especifica formato clásico, usar API clásica
                if (useClassicFormat) {
                    switch (reportType) {
                        case 'balance_general':
                            return [2 /*return*/, this.generateClassicBalanceSheet(filters)];
                        default:
                            throw new Error("Formato cl\u00E1sico no disponible para ".concat(reportType));
                    }
                }
                // Usar API unificada
                switch (reportType) {
                    case 'balance_general':
                        return [2 /*return*/, this.generateBalanceGeneral(filters)];
                    case 'p_g':
                        return [2 /*return*/, this.generatePerdidasGanancias(filters)];
                    case 'flujo_efectivo':
                        return [2 /*return*/, this.generateFlujoEfectivo(filters)];
                    default:
                        throw new Error("Tipo de reporte no soportado: ".concat(reportType));
                }
                return [2 /*return*/];
            });
        });
    };
    // ==========================================
    // Utilidades y validaciones
    // ==========================================
    /**
     * Valida los filtros antes de generar reporte
     */
    ReportsAPIService.prototype.validateFilters = function (filters) {
        var errors = [];
        // Validar fechas requeridas
        if (!filters.from_date) {
            errors.push('La fecha de inicio es requerida');
        }
        if (!filters.to_date) {
            errors.push('La fecha de fin es requerida');
        }
        // Validar que la fecha de inicio no sea mayor que la de fin
        if (filters.from_date && filters.to_date) {
            if (new Date(filters.from_date) > new Date(filters.to_date)) {
                errors.push('La fecha de inicio no puede ser mayor que la fecha de fin');
            }
        }
        // Validar período no mayor a 2 años para reportes detallados
        if (filters.from_date && filters.to_date && filters.detail_level === 'alto') {
            var diffTime = Math.abs(new Date(filters.to_date).getTime() - new Date(filters.from_date).getTime());
            var diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
            if (diffYears > 2) {
                errors.push('El período no puede ser mayor a 2 años para reportes detallados');
            }
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };
    /**
     * Genera filtros por defecto basados en el tipo de reporte
     */
    ReportsAPIService.prototype.getDefaultFilters = function (reportType) {
        var today = new Date();
        var startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        var endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        var baseFilters = {
            from_date: startOfMonth.toISOString().split('T')[0],
            to_date: endOfMonth.toISOString().split('T')[0],
            detail_level: 'medio',
            include_subaccounts: false,
            include_zero_balances: false
        };
        // Agregar configuraciones específicas por tipo de reporte
        if (reportType === 'flujo_efectivo') {
            return __assign(__assign({}, baseFilters), { cash_flow_method: 'indirect', enable_reconciliation: true, include_projections: false });
        }
        return baseFilters;
    };
    // ==========================================  // ==========================================
    // Exportación de reportes - NO DISPONIBLE EN BACKEND
    // ==========================================
    /**
     * Exporta reporte a PDF - IMPLEMENTADO
     */
    ReportsAPIService.prototype.exportToPDF = function (reportData_1) {
        return __awaiter(this, arguments, void 0, function (reportData, options) {
            var response, error_2;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post("".concat(REPORTS_BASE, "/export/pdf"), {
                                report_data: reportData,
                                options: options
                            }, {
                                responseType: 'blob'
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error al exportar a PDF:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exporta reporte a Excel - IMPLEMENTADO
     */
    ReportsAPIService.prototype.exportToExcel = function (reportData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post("".concat(REPORTS_BASE, "/export/excel"), {
                                report_data: reportData
                            }, {
                                responseType: 'blob'
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error al exportar a Excel:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exporta reporte a CSV - IMPLEMENTADO
     */
    ReportsAPIService.prototype.exportToCSV = function (reportData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, apiClient.post("".concat(REPORTS_BASE, "/export/csv"), {
                                report_data: reportData
                            }, {
                                responseType: 'blob'
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error al exportar a CSV:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ReportsAPIService;
}());
// Exportar instancia única
export var reportsAPI = new ReportsAPIService();
export default reportsAPI;
