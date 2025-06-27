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
import { apiClient } from '../../../shared/api/client';
/**
 * Servicio para operaciones relacionadas con condiciones de pago
 * Maneja todas las interacciones con el API backend para payment terms
 *
 * Basado en la documentación del backend actualizada:
 * - Base URL: /api/v1/payment-terms
 * - Soporte completo para cronogramas de pago
 * - Validaciones de negocio integradas
 * - Cálculos de fechas y montos
 */
var PaymentTermsService = /** @class */ (function () {
    function PaymentTermsService() {
    }
    // ==========================================
    // OPERACIONES CRUD BÁSICAS
    // ==========================================
    /**
     * Crear nuevas condiciones de pago
     */
    PaymentTermsService.createPaymentTerms = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Creando condiciones de pago:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post(this.BASE_URL, data)];
                    case 2:
                        response = _a.sent();
                        console.log('Condiciones de pago creadas:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error al crear condiciones de pago:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener lista de condiciones de pago con filtros
     */
    PaymentTermsService.getPaymentTermsList = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo lista de condiciones de pago con filtros:', filters);
                        params = new URLSearchParams();
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    params.append(key, String(value));
                                }
                            });
                        }
                        url = params.toString() ? "".concat(this.BASE_URL, "?").concat(params) : this.BASE_URL;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get(url)];
                    case 2:
                        response = _a.sent();
                        console.log('Lista de condiciones de pago obtenida:', response.data);
                        // Normalizar la respuesta en caso de que el backend devuelva un array directo
                        if (Array.isArray(response.data)) {
                            console.warn('El backend devolvió un array directo en lugar de PaymentTermsListResponse. Normalizando...');
                            return [2 /*return*/, {
                                    items: response.data,
                                    total: response.data.length,
                                    skip: 0,
                                    limit: response.data.length
                                }];
                        }
                        return [2 /*return*/, response.data];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error al obtener lista de condiciones de pago:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener condiciones de pago activas (para selects)
     */
    PaymentTermsService.getActivePaymentTerms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo condiciones de pago activas');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/active"))];
                    case 2:
                        response = _a.sent();
                        console.log('Condiciones de pago activas obtenidas:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error al obtener condiciones de pago activas:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener condiciones de pago por ID
     */
    PaymentTermsService.getPaymentTermsById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo condiciones de pago por ID:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id))];
                    case 2:
                        response = _a.sent();
                        console.log('Condiciones de pago obtenidas:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error al obtener condiciones de pago por ID:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener condiciones de pago por código
     */
    PaymentTermsService.getPaymentTermsByCode = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo condiciones de pago por código:', code);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/code/").concat(encodeURIComponent(code)))];
                    case 2:
                        response = _a.sent();
                        console.log('Condiciones de pago obtenidas por código:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error al obtener condiciones de pago por código:', error_5);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Actualizar condiciones de pago
     */
    PaymentTermsService.updatePaymentTerms = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Actualizando condiciones de pago:', id, data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.put("".concat(this.BASE_URL, "/").concat(id), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Condiciones de pago actualizadas:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error al actualizar condiciones de pago:', error_6);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Activar/Desactivar condiciones de pago
     */
    PaymentTermsService.toggleActiveStatus = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Cambiando estado activo de condiciones de pago:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.patch("".concat(this.BASE_URL, "/").concat(id, "/toggle-active"))];
                    case 2:
                        response = _a.sent();
                        console.log('Estado activo cambiado:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error al cambiar estado activo:', error_7);
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Eliminar condiciones de pago
     */
    PaymentTermsService.deletePaymentTerms = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Eliminando condiciones de pago:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.delete("".concat(this.BASE_URL, "/").concat(id))];
                    case 2:
                        _a.sent();
                        console.log('Condiciones de pago eliminadas');
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        console.error('Error al eliminar condiciones de pago:', error_8);
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Verificar si las condiciones de pago se pueden eliminar
     */
    PaymentTermsService.checkCanDeletePaymentTerms = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Verificando si se puede eliminar condiciones de pago:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id, "/can-delete"))];
                    case 2:
                        response = _a.sent();
                        console.log('Verificación completada:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_9 = _a.sent();
                        console.error('Error al verificar eliminación:', error_9);
                        throw error_9;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // OPERACIONES DE CÁLCULO Y VALIDACIÓN
    // ==========================================
    /**
     * Calcular cronograma de pagos
     */
    PaymentTermsService.calculatePaymentSchedule = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Calculando cronograma de pagos:', request);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/calculate"), request)];
                    case 2:
                        response = _a.sent();
                        console.log('Cronograma de pagos calculado:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_10 = _a.sent();
                        console.error('Error al calcular cronograma de pagos:', error_10);
                        throw error_10;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validar condiciones de pago
     */
    PaymentTermsService.validatePaymentTerms = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando condiciones de pago:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id, "/validate"))];
                    case 2:
                        response = _a.sent();
                        console.log('Resultado de validación:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_11 = _a.sent();
                        console.error('Error al validar condiciones de pago:', error_11);
                        throw error_11;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // OPERACIONES DE ESTADÍSTICAS Y REPORTES
    // ==========================================
    /**
     * Obtener estadísticas de condiciones de pago
     */
    PaymentTermsService.getPaymentTermsStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo estadísticas de condiciones de pago');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/statistics"))];
                    case 2:
                        response = _a.sent();
                        console.log('Estadísticas obtenidas:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_12 = _a.sent();
                        console.error('Error al obtener estadísticas:', error_12);
                        throw error_12;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ==========================================
    // MÉTODOS UTILITARIOS
    // ==========================================
    /**
     * Verificar si un código de condición de pago está disponible
     */
    PaymentTermsService.isCodeAvailable = function (code, excludeId) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, response, existingTerm, isAvailable, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Verificando disponibilidad de código:', code);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        filters = {
                            search: code,
                            limit: 1
                        };
                        return [4 /*yield*/, this.getPaymentTermsList(filters)];
                    case 2:
                        response = _a.sent();
                        existingTerm = response.items.find(function (term) {
                            return term.code.toLowerCase() === code.toLowerCase() &&
                                (!excludeId || term.id !== excludeId);
                        });
                        isAvailable = !existingTerm;
                        console.log('Código disponible:', isAvailable);
                        return [2 /*return*/, isAvailable];
                    case 3:
                        error_13 = _a.sent();
                        console.error('Error al verificar disponibilidad de código:', error_13);
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener condiciones de pago más utilizadas
     */
    PaymentTermsService.getMostUsedPaymentTerms = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var filters, response, error_14;
            if (limit === void 0) { limit = 5; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo condiciones de pago más utilizadas');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        filters = {
                            is_active: true,
                            sort_by: 'name', // Backend debería soportar ordenamiento por uso
                            limit: limit
                        };
                        return [4 /*yield*/, this.getPaymentTermsList(filters)];
                    case 2:
                        response = _a.sent();
                        console.log('Condiciones de pago más utilizadas:', response.items);
                        return [2 /*return*/, response.items];
                    case 3:
                        error_14 = _a.sent();
                        console.error('Error al obtener condiciones de pago más utilizadas:', error_14);
                        throw error_14;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validar cronograma de pagos antes de enviar
     */
    PaymentTermsService.validatePaymentSchedules = function (schedules) {
        var errors = [];
        // Validar que existan cronogramas
        if (!schedules || schedules.length === 0) {
            errors.push('Debe incluir al menos un cronograma de pago');
            return { isValid: false, errors: errors };
        }
        // Validar secuencias únicas
        var sequences = schedules.map(function (s) { return s.sequence; });
        if (new Set(sequences).size !== sequences.length) {
            errors.push('Las secuencias deben ser únicas');
        } // Validar que los porcentajes sumen exactamente 100% (hasta 6 decimales)
        var totalPercentage = schedules.reduce(function (sum, s) { return sum + s.percentage; }, 0);
        if (Math.abs(totalPercentage - 100) >= 0.000001) {
            errors.push('Los porcentajes deben sumar exactamente 100.000000%');
        }
        // Validar que los días estén en orden ascendente por secuencia
        var sortedBySequence = __spreadArray([], schedules, true).sort(function (a, b) { return a.sequence - b.sequence; });
        for (var i = 1; i < sortedBySequence.length; i++) {
            if (sortedBySequence[i].days < sortedBySequence[i - 1].days) {
                errors.push('Los días deben estar en orden ascendente por secuencia');
                break;
            }
        }
        // Validar valores individuales
        schedules.forEach(function (schedule, index) {
            if (schedule.sequence < 1) {
                errors.push("Cronograma ".concat(index + 1, ": La secuencia debe ser mayor a 0"));
            }
            if (schedule.days < 0) {
                errors.push("Cronograma ".concat(index + 1, ": Los d\u00EDas deben ser mayor o igual a 0"));
            }
            if (schedule.percentage <= 0 || schedule.percentage > 100) {
                errors.push("Cronograma ".concat(index + 1, ": El porcentaje debe estar entre 0.01 y 100"));
            }
        });
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };
    /**
     * Formatear condiciones de pago para mostrar
     */
    PaymentTermsService.formatPaymentTermsDisplay = function (paymentTerms) {
        if (!paymentTerms.payment_schedules || paymentTerms.payment_schedules.length === 0) {
            return paymentTerms.name;
        }
        if (paymentTerms.payment_schedules.length === 1) {
            var schedule = paymentTerms.payment_schedules[0];
            if (schedule.days === 0) {
                return "".concat(paymentTerms.name, " (Contado)");
            }
            return "".concat(paymentTerms.name, " (").concat(schedule.days, " d\u00EDas)");
        }
        var daysRange = paymentTerms.payment_schedules.map(function (s) { return s.days; }).join('-');
        return "".concat(paymentTerms.name, " (").concat(daysRange, " d\u00EDas)");
    };
    /**
     * Calcular fecha de vencimiento basada en condiciones de pago
     */
    PaymentTermsService.calculateDueDate = function (invoiceDate, paymentTerms) {
        if (!paymentTerms.payment_schedules || paymentTerms.payment_schedules.length === 0) {
            return invoiceDate;
        }
        // Usar la fecha más tardía como fecha de vencimiento final
        var maxDays = Math.max.apply(Math, paymentTerms.payment_schedules.map(function (s) { return s.days; }));
        var invoice = new Date(invoiceDate);
        var dueDate = new Date(invoice);
        dueDate.setDate(dueDate.getDate() + maxDays);
        return dueDate.toISOString().split('T')[0];
    };
    PaymentTermsService.BASE_URL = '/api/v1/payment-terms';
    return PaymentTermsService;
}());
export { PaymentTermsService };
