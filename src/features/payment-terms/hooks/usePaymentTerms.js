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
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PaymentTermsService } from '../services/paymentTermsService';
export function usePaymentTermsList(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var _a = options.initialFilters, initialFilters = _a === void 0 ? {} : _a, _b = options.autoLoad, autoLoad = _b === void 0 ? true : _b;
    var _c = useState([]), paymentTerms = _c[0], setPaymentTerms = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var _f = useState(0), total = _f[0], setTotal = _f[1];
    var _g = useState(initialFilters), filters = _g[0], setFilters = _g[1];
    // Estabilizar options para evitar bucles infinitos
    var stableOptions = useMemo(function () { return ({
        initialFilters: initialFilters,
        autoLoad: autoLoad
    }); }, [
        JSON.stringify(initialFilters), // Comparar contenido, no referencia
        autoLoad
    ]);
    // Ref para evitar fetch duplicado
    var lastFetchFilters = useRef('');
    var isFirstLoad = useRef(true);
    var loadPaymentTerms = useCallback(function (newFilters) { return __awaiter(_this, void 0, void 0, function () {
        var filtersToUse, filtersKey, response, err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filtersToUse = newFilters || filters;
                    filtersKey = JSON.stringify(filtersToUse);
                    // Evitar petición duplicada si los filtros son los mismos
                    if (lastFetchFilters.current === filtersKey && !isFirstLoad.current) {
                        console.log('🔄 [usePaymentTermsList] Evitando fetch duplicado:', filtersToUse);
                        return [2 /*return*/];
                    }
                    lastFetchFilters.current = filtersKey;
                    isFirstLoad.current = false;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    console.log('🔍 [usePaymentTermsList] Fetching with filters:', filtersToUse);
                    return [4 /*yield*/, PaymentTermsService.getPaymentTermsList(filtersToUse)];
                case 2:
                    response = _a.sent();
                    setPaymentTerms(response.items);
                    setTotal(response.total);
                    if (newFilters) {
                        setFilters(newFilters);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Error al cargar condiciones de pago';
                    console.error('❌ [usePaymentTermsList] Error:', err_1);
                    setError(errorMessage);
                    setPaymentTerms([]);
                    setTotal(0);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [filters]);
    var refreshPaymentTerms = useCallback(function () {
        return loadPaymentTerms();
    }, [loadPaymentTerms]);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    var removePaymentTermsLocal = useCallback(function (id) {
        setPaymentTerms(function (prev) { return prev.filter(function (pt) { return pt.id !== id; }); });
    }, []);
    var updatePaymentTermsLocal = useCallback(function (updatedPaymentTerms) {
        setPaymentTerms(function (prev) {
            return prev.map(function (pt) { return pt.id === updatedPaymentTerms.id ? updatedPaymentTerms : pt; });
        });
    }, []);
    var addPaymentTermsLocal = useCallback(function (newPaymentTerms) {
        setPaymentTerms(function (prev) { return __spreadArray([newPaymentTerms], prev, true); });
    }, []);
    useEffect(function () {
        if (stableOptions.autoLoad) {
            loadPaymentTerms(stableOptions.initialFilters);
        }
    }, [stableOptions, loadPaymentTerms]);
    return {
        paymentTerms: paymentTerms,
        loading: loading,
        error: error,
        total: total,
        filters: filters,
        loadPaymentTerms: loadPaymentTerms,
        refreshPaymentTerms: refreshPaymentTerms,
        setFilters: setFilters,
        clearError: clearError,
        removePaymentTermsLocal: removePaymentTermsLocal,
        updatePaymentTermsLocal: updatePaymentTermsLocal,
        addPaymentTermsLocal: addPaymentTermsLocal
    };
}
export function useActivePaymentTerms() {
    var _this = this;
    var _a = useState([]), activePaymentTerms = _a[0], setActivePaymentTerms = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var loadActivePaymentTerms = useCallback(function () { return __awaiter(_this, void 0, void 0, function () {
        var response, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.getActivePaymentTerms()];
                case 1:
                    response = _a.sent();
                    setActivePaymentTerms(response);
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Error al cargar condiciones de pago activas';
                    setError(errorMessage);
                    setActivePaymentTerms([]);
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    useEffect(function () {
        loadActivePaymentTerms();
    }, [loadActivePaymentTerms]);
    return {
        activePaymentTerms: activePaymentTerms,
        loading: loading,
        error: error,
        refreshActivePaymentTerms: loadActivePaymentTerms,
        clearError: clearError
    };
}
export function usePaymentTerm(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var id = options.id, code = options.code, _a = options.autoLoad, autoLoad = _a === void 0 ? true : _a;
    var _b = useState(null), paymentTerm = _b[0], setPaymentTerm = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var loadPaymentTerm = useCallback(function (idOrCode_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(_this, __spreadArray([idOrCode_1], args_1, true), void 0, function (idOrCode, byCode) {
            var response, _a, err_3, errorMessage;
            if (byCode === void 0) { byCode = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        setLoading(true);
                        setError(null);
                        if (!byCode) return [3 /*break*/, 2];
                        return [4 /*yield*/, PaymentTermsService.getPaymentTermsByCode(idOrCode)];
                    case 1:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, PaymentTermsService.getPaymentTermsById(idOrCode)];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        response = _a;
                        setPaymentTerm(response);
                        return [3 /*break*/, 7];
                    case 5:
                        err_3 = _b.sent();
                        errorMessage = err_3 instanceof Error ? err_3.message : 'Error al cargar condición de pago';
                        setError(errorMessage);
                        setPaymentTerm(null);
                        return [3 /*break*/, 7];
                    case 6:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    }, []);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    useEffect(function () {
        if (autoLoad && (id || code)) {
            loadPaymentTerm(id || code, !!code);
        }
    }, [autoLoad, id, code, loadPaymentTerm]);
    return {
        paymentTerm: paymentTerm,
        loading: loading,
        error: error,
        loadPaymentTerm: loadPaymentTerm,
        clearError: clearError
    };
}
export function usePaymentTermById() {
    var _this = this;
    var _a = useState(null), paymentTerm = _a[0], setPaymentTerm = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var getPaymentTermById = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id) {
                        throw new Error('ID de payment term requerido');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    console.log('🔍 [usePaymentTermById] Obteniendo payment term por ID:', id);
                    return [4 /*yield*/, PaymentTermsService.getPaymentTermsById(id)];
                case 2:
                    response = _a.sent();
                    console.log('✅ [usePaymentTermById] Payment term obtenido:', response);
                    console.log('📋 [usePaymentTermById] Payment schedules:', response.payment_schedules);
                    setPaymentTerm(response);
                    return [2 /*return*/, response];
                case 3:
                    err_4 = _a.sent();
                    errorMessage = err_4 instanceof Error ? err_4.message : 'Error al obtener condiciones de pago';
                    console.error('❌ [usePaymentTermById] Error:', err_4);
                    setError(errorMessage);
                    setPaymentTerm(null);
                    throw err_4;
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    var clearPaymentTerm = useCallback(function () {
        setPaymentTerm(null);
        setError(null);
    }, []);
    return {
        paymentTerm: paymentTerm,
        loading: loading,
        error: error,
        getPaymentTermById: getPaymentTermById,
        clearError: clearError,
        clearPaymentTerm: clearPaymentTerm
    };
}
export function usePaymentTermsMutations() {
    var _this = this;
    var _a = useState(false), creating = _a[0], setCreating = _a[1];
    var _b = useState(false), updating = _b[0], setUpdating = _b[1];
    var _c = useState(false), deleting = _c[0], setDeleting = _c[1];
    var _d = useState(false), toggling = _d[0], setToggling = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var createPaymentTerms = useCallback(function (data) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_5, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setCreating(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.createPaymentTerms(data)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    err_5 = _a.sent();
                    errorMessage = err_5 instanceof Error ? err_5.message : 'Error al crear condiciones de pago';
                    setError(errorMessage);
                    throw err_5;
                case 3:
                    setCreating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var updatePaymentTerms = useCallback(function (id, data) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setUpdating(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.updatePaymentTerms(id, data)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    err_6 = _a.sent();
                    errorMessage = err_6 instanceof Error ? err_6.message : 'Error al actualizar condiciones de pago';
                    setError(errorMessage);
                    throw err_6;
                case 3:
                    setUpdating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var deletePaymentTerms = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var err_7, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setDeleting(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.deletePaymentTerms(id)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    err_7 = _a.sent();
                    errorMessage = err_7 instanceof Error ? err_7.message : 'Error al eliminar condiciones de pago';
                    setError(errorMessage);
                    throw err_7;
                case 3:
                    setDeleting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var toggleActiveStatus = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_8, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setToggling(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.toggleActiveStatus(id)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    err_8 = _a.sent();
                    errorMessage = err_8 instanceof Error ? err_8.message : 'Error al cambiar estado de condiciones de pago';
                    setError(errorMessage);
                    throw err_8;
                case 3:
                    setToggling(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    return {
        creating: creating,
        updating: updating,
        deleting: deleting,
        toggling: toggling,
        error: error,
        createPaymentTerms: createPaymentTerms,
        updatePaymentTerms: updatePaymentTerms,
        deletePaymentTerms: deletePaymentTerms,
        toggleActiveStatus: toggleActiveStatus,
        clearError: clearError
    };
}
export function usePaymentCalculation() {
    var _this = this;
    var _a = useState(false), calculating = _a[0], setCalculating = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var calculatePaymentSchedule = useCallback(function (request) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_9, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setCalculating(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.calculatePaymentSchedule(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    err_9 = _a.sent();
                    errorMessage = err_9 instanceof Error ? err_9.message : 'Error al calcular cronograma de pagos';
                    setError(errorMessage);
                    throw err_9;
                case 3:
                    setCalculating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    return {
        calculating: calculating,
        error: error,
        calculatePaymentSchedule: calculatePaymentSchedule,
        clearError: clearError
    };
}
export function usePaymentTermsValidation() {
    var _this = this;
    var _a = useState(false), validating = _a[0], setValidating = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var validatePaymentTerms = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_10, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setValidating(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.validatePaymentTerms(id)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    err_10 = _a.sent();
                    errorMessage = err_10 instanceof Error ? err_10.message : 'Error al validar condiciones de pago';
                    setError(errorMessage);
                    throw err_10;
                case 3:
                    setValidating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    return {
        validating: validating,
        error: error,
        validatePaymentTerms: validatePaymentTerms,
        clearError: clearError
    };
}
