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
import { useState, useEffect, useCallback } from 'react';
import { CostCenterService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import { useCostCenterEventEmitter } from './useCostCenterEvents';
export var useCostCenters = function (initialFilters) {
    var _a = useState([]), costCenters = _a[0], setCostCenters = _a[1];
    var _b = useState(initialFilters), currentFilters = _b[0], setCurrentFilters = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useState(0), total = _e[0], setTotal = _e[1];
    var _f = useToast(), success = _f.success, showError = _f.error;
    var _g = useCostCenterEventEmitter(), emitCreated = _g.emitCreated, emitUpdated = _g.emitUpdated, emitDeleted = _g.emitDeleted, emitStatusChanged = _g.emitStatusChanged;
    var fetchCostCenters = useCallback(function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var filtersToUse, response, err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    filtersToUse = filters || currentFilters;
                    console.log('🏢📡 Obteniendo centros de costo con filtros:', filtersToUse);
                    return [4 /*yield*/, CostCenterService.getCostCenters(filtersToUse)];
                case 2:
                    response = _a.sent();
                    console.log('🏢📥 Respuesta del servicio getCostCenters:', response);
                    console.log('🏢📊 Datos recibidos:', response.data);
                    console.log('🏢🔢 Total:', response.total);
                    setCostCenters(response.data);
                    setTotal(response.total);
                    console.log('🏢✅ Estado actualizado - centros:', response.data.length, 'total:', response.total);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Error al cargar los centros de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [currentFilters, showError]);
    var refetchWithFilters = useCallback(function (newFilters) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCurrentFilters(newFilters);
                    return [4 /*yield*/, fetchCostCenters(newFilters)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [fetchCostCenters]);
    var refetch = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchCostCenters(currentFilters)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [fetchCostCenters, currentFilters]);
    var createCostCenter = useCallback(function (costCenterData) { return __awaiter(void 0, void 0, void 0, function () {
        var newCostCenter_1, err_2, errorMessage, details;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    console.log('🏢 Intentando crear centro de costo:', costCenterData);
                    return [4 /*yield*/, CostCenterService.createCostCenter(costCenterData)];
                case 2:
                    newCostCenter_1 = _c.sent();
                    console.log('🏢✅ Centro de costo creado exitosamente:', newCostCenter_1);
                    setCostCenters(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newCostCenter_1], false); });
                    // Emitir evento para notificar a otros componentes
                    emitCreated(newCostCenter_1.id, newCostCenter_1);
                    console.log('🏢📢 Evento "created" emitido para:', newCostCenter_1.id);
                    success('Centro de costo creado exitosamente');
                    return [2 /*return*/, newCostCenter_1];
                case 3:
                    err_2 = _c.sent();
                    console.log('🏢❌ Error al crear centro de costo:', err_2);
                    console.log('🏢📝 Datos enviados:', costCenterData);
                    errorMessage = 'Error al crear el centro de costo';
                    if (err_2 instanceof Error) {
                        errorMessage = err_2.message;
                        console.log('🏢📋 Mensaje de error:', err_2.message);
                    }
                    // Si hay response data del servidor, mostrarlo también
                    if ((_a = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _a === void 0 ? void 0 : _a.data) {
                        console.log('🏢🔍 Detalles del servidor:', JSON.stringify(err_2.response.data, null, 2));
                        // Si es un error 422, intentar extraer los detalles de validación
                        if (((_b = err_2 === null || err_2 === void 0 ? void 0 : err_2.response) === null || _b === void 0 ? void 0 : _b.status) === 422) {
                            details = err_2.response.data.detail;
                            if (Array.isArray(details)) {
                                console.log('🏢⚠️ Errores de validación:');
                                details.forEach(function (detail, index) {
                                    var _a;
                                    console.log("  ".concat(index + 1, ". Campo: ").concat((_a = detail.loc) === null || _a === void 0 ? void 0 : _a.join('.'), ", Error: ").concat(detail.msg));
                                });
                            }
                        }
                    }
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, null];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError]);
    var updateCostCenter = useCallback(function (id, updateData) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedCostCenter_1, err_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.updateCostCenter(id, updateData)];
                case 2:
                    updatedCostCenter_1 = _a.sent();
                    setCostCenters(function (prev) { return prev.map(function (costCenter) {
                        return costCenter.id === id ? updatedCostCenter_1 : costCenter;
                    }); });
                    // Emitir evento para notificar a otros componentes
                    emitUpdated(id, updatedCostCenter_1);
                    console.log('🏢📢 Evento "updated" emitido para:', id);
                    success('Centro de costo actualizado exitosamente');
                    return [2 /*return*/, updatedCostCenter_1];
                case 3:
                    err_3 = _a.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Error al actualizar el centro de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, null];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError]);
    var deleteCostCenter = useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var err_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.deleteCostCenter(id)];
                case 2:
                    _a.sent();
                    setCostCenters(function (prev) { return prev.filter(function (costCenter) { return costCenter.id !== id; }); });
                    // Emitir evento para notificar a otros componentes
                    emitDeleted(id);
                    console.log('🏢📢 Evento "deleted" emitido para:', id);
                    success('Centro de costo eliminado exitosamente');
                    return [2 /*return*/, true];
                case 3:
                    err_4 = _a.sent();
                    errorMessage = err_4 instanceof Error ? err_4.message : 'Error al eliminar el centro de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError]);
    var toggleCostCenterStatus = useCallback(function (id, isActive) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedCostCenter_2, err_5, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.toggleCostCenterStatus(id, isActive)];
                case 2:
                    updatedCostCenter_2 = _a.sent();
                    setCostCenters(function (prev) { return prev.map(function (costCenter) {
                        return costCenter.id === id ? updatedCostCenter_2 : costCenter;
                    }); });
                    // Emitir evento para notificar a otros componentes
                    emitStatusChanged(id, updatedCostCenter_2);
                    console.log('🏢📢 Evento "status_changed" emitido para:', id);
                    success("Centro de costo ".concat(isActive ? 'activado' : 'desactivado', " exitosamente"));
                    return [2 /*return*/, true];
                case 3:
                    err_5 = _a.sent();
                    errorMessage = err_5 instanceof Error ? err_5.message : 'Error al cambiar el estado del centro de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError]);
    useEffect(function () {
        // Ejecutar solo una vez al montar con los filtros iniciales
        if (initialFilters) {
            fetchCostCenters(initialFilters);
        }
        else {
            fetchCostCenters();
        }
    }, []); // Array vacío para ejecutar solo una vez
    return {
        costCenters: costCenters,
        total: total,
        loading: loading,
        error: error,
        refetch: refetch,
        refetchWithFilters: refetchWithFilters,
        createCostCenter: createCostCenter,
        updateCostCenter: updateCostCenter,
        deleteCostCenter: deleteCostCenter,
        toggleCostCenterStatus: toggleCostCenterStatus
    };
};
export var useCostCenterTree = function (activeOnly) {
    if (activeOnly === void 0) { activeOnly = true; }
    var _a = useState([]), costCenterTree = _a[0], setCostCenterTree = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchCostCenterTree = useCallback(function (active) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.getCostCenterTree(active !== null && active !== void 0 ? active : activeOnly)];
                case 2:
                    data = _a.sent();
                    setCostCenterTree(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_6 = _a.sent();
                    errorMessage = err_6 instanceof Error ? err_6.message : 'Error al cargar el árbol de centros de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError, activeOnly]);
    useEffect(function () {
        fetchCostCenterTree(activeOnly);
    }, []); // Array vacío para ejecutar solo una vez
    return {
        costCenterTree: costCenterTree,
        loading: loading,
        error: error,
        refetch: fetchCostCenterTree
    };
};
export var useCostCenter = function (id) {
    var _a = useState(null), costCenter = _a[0], setCostCenter = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchCostCenter = useCallback(function (costCenterId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_7, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.getCostCenterById(costCenterId)];
                case 2:
                    data = _a.sent();
                    setCostCenter(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_7 = _a.sent();
                    errorMessage = err_7 instanceof Error ? err_7.message : 'Error al cargar el centro de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    var fetchCostCenterByCode = useCallback(function (code) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_8, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.getCostCenterByCode(code)];
                case 2:
                    data = _a.sent();
                    setCostCenter(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_8 = _a.sent();
                    errorMessage = err_8 instanceof Error ? err_8.message : 'Error al cargar el centro de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    useEffect(function () {
        if (id) {
            fetchCostCenter(id);
        }
    }, [id]); // Solo depende del id
    return {
        costCenter: costCenter,
        loading: loading,
        error: error,
        fetchCostCenter: fetchCostCenter,
        fetchCostCenterByCode: fetchCostCenterByCode,
        setCostCenter: setCostCenter
    };
};
export var useCostCenterValidation = function () {
    var _a = useState(false), checking = _a[0], setChecking = _a[1];
    var checkCodeAvailability = useCallback(function (code, excludeId) { return __awaiter(void 0, void 0, void 0, function () {
        var isAvailable, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setChecking(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.checkCodeAvailability(code, excludeId)];
                case 2:
                    isAvailable = _a.sent();
                    return [2 /*return*/, isAvailable];
                case 3:
                    err_9 = _a.sent();
                    console.error('Error checking code availability:', err_9);
                    return [2 /*return*/, false];
                case 4:
                    setChecking(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    return {
        checking: checking,
        checkCodeAvailability: checkCodeAvailability
    };
};
export var useCostCenterMovements = function (costCenterId) {
    var _a = useState([]), movements = _a[0], setMovements = _a[1];
    var _b = useState(0), totalCount = _b[0], setTotalCount = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var showError = useToast().error;
    var fetchMovements = useCallback(function (id, filters) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_10, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.getCostCenterMovements(id, filters)];
                case 2:
                    data = _a.sent();
                    setMovements(data.movements);
                    setTotalCount(data.total_count);
                    return [3 /*break*/, 5];
                case 3:
                    err_10 = _a.sent();
                    errorMessage = err_10 instanceof Error ? err_10.message : 'Error al cargar los movimientos del centro de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    useEffect(function () {
        if (costCenterId) {
            fetchMovements(costCenterId);
        }
    }, [costCenterId]); // Solo depende del costCenterId
    return {
        movements: movements,
        totalCount: totalCount,
        loading: loading,
        error: error,
        refetch: fetchMovements
    };
};
export var useCostCenterAnalysis = function () {
    var _a = useState(null), analysis = _a[0], setAnalysis = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchAnalysis = useCallback(function (id, startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_11, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, CostCenterService.getCostCenterAnalysis(id, startDate, endDate)];
                case 2:
                    data = _a.sent();
                    setAnalysis(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_11 = _a.sent();
                    errorMessage = err_11 instanceof Error ? err_11.message : 'Error al cargar el análisis del centro de costo';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    return {
        analysis: analysis,
        loading: loading,
        error: error,
        fetchAnalysis: fetchAnalysis
    };
};
