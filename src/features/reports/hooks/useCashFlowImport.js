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
import { useState, useCallback } from 'react';
import { useToast } from '@/shared/hooks';
import { CashFlowImportService } from '../services/cashFlowImportService';
export var useCashFlowImport = function () {
    var _a = useState({
        isValidating: false,
        validationMetrics: null,
        importRecommendations: []
    }), state = _a[0], setState = _a[1];
    var _b = useToast(), success = _b.success, error = _b.error, warning = _b.warning;
    /**
     * Valida datos específicos para flujo de efectivo
     */
    var validateCashFlowData = useCallback(function (previewData) { return __awaiter(void 0, void 0, void 0, function () {
        var validatedData, metrics_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setState(function (prev) { return (__assign(__assign({}, prev), { isValidating: true })); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, CashFlowImportService.validateCashFlowData(previewData)];
                case 2:
                    validatedData = _a.sent();
                    metrics_1 = CashFlowImportService.getCashFlowValidationMetrics(validatedData);
                    setState(function (prev) { return (__assign(__assign({}, prev), { isValidating: false, validationMetrics: metrics_1, importRecommendations: metrics_1.recommendations })); });
                    // Mostrar advertencias si es necesario
                    if (metrics_1.cashAccountsPercentage < 80) {
                        warning('Validación de cuentas de efectivo', "Solo ".concat(metrics_1.cashAccountsPercentage, "% de las transacciones afectan cuentas de efectivo"));
                    }
                    if (metrics_1.activityClassificationPercentage < 90) {
                        warning('Clasificación de actividades', "".concat(metrics_1.activityClassificationPercentage, "% de las transacciones tienen clasificaci\u00F3n de actividad"));
                    }
                    // Mostrar éxito si todo está bien
                    if (metrics_1.cashAccountsPercentage >= 80 &&
                        metrics_1.activityClassificationPercentage >= 90 &&
                        metrics_1.validAmountsPercentage >= 95) {
                        success('Datos validados', 'Los datos están correctamente estructurados para flujo de efectivo');
                    }
                    return [2 /*return*/, validatedData];
                case 3:
                    err_1 = _a.sent();
                    setState(function (prev) { return (__assign(__assign({}, prev), { isValidating: false })); });
                    error('Error de validación', 'No se pudieron validar los datos de flujo de efectivo');
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [success, error, warning]);
    /**
     * Importa datos de flujo de efectivo con configuración específica
     */
    var importCashFlowData = useCallback(function (configuration) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, CashFlowImportService.importCashFlowData(configuration)];
                case 1:
                    result = _a.sent();
                    if (result.status === 'completed') {
                        success('Importación completada', "Se importaron ".concat(result.summary.successful_rows, " transacciones de flujo de efectivo"));
                    }
                    else if (result.status === 'partial') {
                        warning('Importación parcial', "Se importaron ".concat(result.summary.successful_rows, " de ").concat(result.summary.total_rows, " transacciones"));
                    }
                    else {
                        error('Error en importación', 'No se pudieron importar las transacciones de flujo de efectivo');
                    }
                    return [2 /*return*/, result];
                case 2:
                    err_2 = _a.sent();
                    error('Error de importación', 'Error al importar datos de flujo de efectivo');
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [success, error, warning]);
    /**
     * Obtiene métricas de validación para datos de vista previa
     */
    var getValidationMetrics = useCallback(function (previewData) {
        return CashFlowImportService.getCashFlowValidationMetrics(previewData);
    }, []);
    /**
     * Descarga plantilla específica de flujo de efectivo
     */ var downloadCashFlowTemplate = useCallback(function (format) { return __awaiter(void 0, void 0, void 0, function () {
        var blob, timestamp, filename, url, link, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, CashFlowImportService.downloadCashFlowTemplate(format)];
                case 1:
                    blob = _a.sent();
                    timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
                    filename = "plantilla_flujo_efectivo_".concat(timestamp, ".").concat(format);
                    url = URL.createObjectURL(blob);
                    link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    success('Plantilla descargada', "Plantilla de flujo de efectivo descargada en formato ".concat(format.toUpperCase()));
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    error('Error de descarga', 'No se pudo descargar la plantilla de flujo de efectivo');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [success, error]);
    /**
     * Resetea el estado de validación
     */
    var resetValidation = useCallback(function () {
        setState({
            isValidating: false,
            validationMetrics: null,
            importRecommendations: []
        });
    }, []);
    return __assign(__assign({}, state), { validateCashFlowData: validateCashFlowData, importCashFlowData: importCashFlowData, getValidationMetrics: getValidationMetrics, downloadCashFlowTemplate: downloadCashFlowTemplate, resetValidation: resetValidation });
};
