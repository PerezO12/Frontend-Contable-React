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
import { DataImportService } from '@/features/data-import/services/DataImportService';
/**
 * Servicio especializado para importación de datos de flujo de efectivo
 * Extiende la funcionalidad base del DataImportService con validaciones
 * específicas para transacciones de efectivo
 */
var CashFlowImportService = /** @class */ (function () {
    function CashFlowImportService() {
    }
    /**
     * Valida datos específicos de flujo de efectivo antes de la importación
     */
    CashFlowImportService.validateCashFlowData = function (previewData) {
        return __awaiter(this, void 0, void 0, function () {
            var cashFlowValidations, allErrors;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    cashFlowValidations = previewData.preview_data.map(function (row, index) {
                        var validationErrors = [];
                        // Validar que sea una cuenta de efectivo
                        if (!_this.isCashAccount(row.account_code || row.codigo_cuenta || '')) {
                            validationErrors.push({
                                field: 'account_code',
                                message: 'Esta cuenta no parece ser una cuenta de efectivo',
                                severity: 'warning'
                            });
                        }
                        // Validar clasificación de actividad
                        if (!_this.hasActivityClassification(row)) {
                            validationErrors.push({
                                field: 'activity_type',
                                message: 'Falta clasificar la actividad (operación, inversión, financiamiento)',
                                severity: 'error'
                            });
                        }
                        // Validar montos
                        if (!_this.validateCashFlowAmounts(row)) {
                            validationErrors.push({
                                field: 'amount',
                                message: 'Los montos no están correctamente configurados',
                                severity: 'error'
                            });
                        }
                        return __assign(__assign({}, row), { row_index: index, validation_errors: validationErrors });
                    });
                    allErrors = __spreadArray(__spreadArray([], previewData.validation_errors, true), cashFlowValidations.flatMap(function (row) { return row.validation_errors || []; }), true);
                    return [2 /*return*/, __assign(__assign({}, previewData), { preview_data: cashFlowValidations, validation_errors: allErrors })];
                }
                catch (error) {
                    console.error('Error validating cash flow data:', error);
                    return [2 /*return*/, previewData];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
   * Importa datos de flujo de efectivo con validaciones específicas
   */
    CashFlowImportService.importCashFlowData = function (configuration) {
        return __awaiter(this, void 0, void 0, function () {
            var cashFlowConfig, tempFile;
            return __generator(this, function (_a) {
                cashFlowConfig = __assign(__assign({}, configuration), { validation_level: 'strict', continue_on_error: false, batch_size: Math.min(configuration.batch_size || 50, 50) // Lotes más pequeños
                 });
                tempFile = new File([], 'cash-flow-data.csv');
                return [2 /*return*/, DataImportService.importFromFile(tempFile, cashFlowConfig)];
            });
        });
    };
    /**
     * Genera plantilla específica para flujo de efectivo
     */
    CashFlowImportService.downloadCashFlowTemplate = function (_format) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Por ahora usar el servicio base, pero se puede extender (sin parámetros)
                // El parámetro format se ignorará hasta que el servicio base lo soporte
                return [2 /*return*/, DataImportService.downloadTemplate()];
            });
        });
    };
    /**
     * Obtiene configuración predeterminada para importación de flujo de efectivo
     */
    CashFlowImportService.getDefaultCashFlowConfiguration = function () {
        return {
            data_type: 'journal_entries',
            validation_level: 'strict',
            batch_size: 50,
            skip_duplicates: true,
            update_existing: false,
            continue_on_error: false,
            csv_delimiter: ',',
            csv_encoding: 'utf-8',
            xlsx_sheet_name: null,
            xlsx_header_row: 1
        };
    };
    /**
     * Verifica si una cuenta es de efectivo o equivalentes
     */
    CashFlowImportService.isCashAccount = function (accountCode) {
        // Códigos típicos de cuentas de efectivo (ajustar según plan de cuentas)
        var cashAccountPrefixes = ['1105', '1110', '1115', '1120']; // Caja, Bancos, etc.
        return cashAccountPrefixes.some(function (prefix) { return accountCode.startsWith(prefix); });
    };
    /**
     * Verifica si la transacción tiene clasificación de actividad
     */
    CashFlowImportService.hasActivityClassification = function (row) {
        // Verificar en descripción o campo específico
        var description = (row.description || '').toLowerCase();
        var lineDescription = (row.line_description || '').toLowerCase();
        var activityKeywords = [
            'operativ', 'operacion', 'venta', 'cobro', 'pago', // Operativas
            'inversion', 'activo', 'maquinaria', 'equipo', // Inversión
            'financ', 'prestamo', 'credito', 'dividendo' // Financiamiento
        ];
        return activityKeywords.some(function (keyword) {
            return description.includes(keyword) || lineDescription.includes(keyword);
        });
    };
    /**
     * Valida que los montos sean consistentes para flujo de efectivo
     */
    CashFlowImportService.validateCashFlowAmounts = function (row) {
        var debit = parseFloat(row.debit_amount || '0');
        var credit = parseFloat(row.credit_amount || '0');
        // Debe haber un monto (débito o crédito) pero no ambos
        return (debit > 0 && credit === 0) || (credit > 0 && debit === 0);
    };
    /**
   * Obtiene métricas de validación específicas para flujo de efectivo
   */
    CashFlowImportService.getCashFlowValidationMetrics = function (previewData) {
        var _this = this;
        var totalRows = previewData.preview_data.length;
        var cashAccounts = previewData.preview_data.filter(function (row) {
            return _this.isCashAccount(row.account_code || row.codigo_cuenta || '');
        }).length;
        var withActivityClassification = previewData.preview_data.filter(function (row) {
            return _this.hasActivityClassification(row);
        }).length;
        var validAmounts = previewData.preview_data.filter(function (row) {
            return _this.validateCashFlowAmounts(row);
        }).length;
        return {
            totalRows: totalRows,
            cashAccountsPercentage: Math.round((cashAccounts / totalRows) * 100),
            activityClassificationPercentage: Math.round((withActivityClassification / totalRows) * 100),
            validAmountsPercentage: Math.round((validAmounts / totalRows) * 100),
            recommendations: this.generateRecommendations({
                cashAccounts: cashAccounts,
                withActivityClassification: withActivityClassification,
                validAmounts: validAmounts,
                totalRows: totalRows
            })
        };
    };
    /**
     * Genera recomendaciones basadas en las métricas de validación
     */
    CashFlowImportService.generateRecommendations = function (metrics) {
        var recommendations = [];
        if (metrics.cashAccounts / metrics.totalRows < 0.8) {
            recommendations.push('Asegúrate de que la mayoría de transacciones afecten cuentas de efectivo');
        }
        if (metrics.withActivityClassification / metrics.totalRows < 0.9) {
            recommendations.push('Incluye palabras clave para clasificar actividades (operativa, inversión, financiamiento)');
        }
        if (metrics.validAmounts / metrics.totalRows < 0.95) {
            recommendations.push('Verifica que cada línea tenga solo débito o crédito, no ambos');
        }
        if (recommendations.length === 0) {
            recommendations.push('Los datos parecen estar bien estructurados para flujo de efectivo');
        }
        return recommendations;
    };
    return CashFlowImportService;
}());
export { CashFlowImportService };
