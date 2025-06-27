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
import { ThirdPartyService } from '../services';
// Hook para listar terceros con filtros
export var useThirdParties = function (filters) {
    var _a = useState([]), thirdParties = _a[0], setThirdParties = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(0), total = _d[0], setTotal = _d[1];
    // Estabilizar filters para evitar bucles infinitos - Solo campos soportados por el backend
    var stableFilters = useMemo(function () { return filters; }, [
        filters === null || filters === void 0 ? void 0 : filters.search,
        filters === null || filters === void 0 ? void 0 : filters.third_party_type,
        filters === null || filters === void 0 ? void 0 : filters.document_type,
        filters === null || filters === void 0 ? void 0 : filters.is_active,
        filters === null || filters === void 0 ? void 0 : filters.city,
        filters === null || filters === void 0 ? void 0 : filters.country,
        filters === null || filters === void 0 ? void 0 : filters.skip,
        filters === null || filters === void 0 ? void 0 : filters.limit
    ]);
    // Ref para evitar fetch duplicado
    var lastFetchFilters = useRef('');
    var fetchThirdParties = useCallback(function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var filtersKey, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filtersKey = JSON.stringify(filters || {});
                    // Evitar petición duplicada si los filtros son los mismos
                    if (lastFetchFilters.current === filtersKey) {
                        return [2 /*return*/];
                    }
                    lastFetchFilters.current = filtersKey;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.getThirdParties(filters)];
                case 2:
                    response = _a.sent();
                    setThirdParties(response.items || []);
                    setTotal(response.total || 0);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error('❌ [useThirdParties] Error:', err_1);
                    setError(err_1 instanceof Error ? err_1.message : 'Error al cargar terceros');
                    setThirdParties([]);
                    setTotal(0);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var refetch = useCallback(function () {
        fetchThirdParties(stableFilters);
    }, [fetchThirdParties, stableFilters]);
    var refetchWithFilters = useCallback(function (filters) {
        fetchThirdParties(filters);
    }, [fetchThirdParties]);
    // Función para forzar refetch ignorando cache
    var forceRefetch = useCallback(function (newFilters) {
        // Limpiar cache para forzar nueva petición
        lastFetchFilters.current = '';
        fetchThirdParties(newFilters || stableFilters);
    }, [fetchThirdParties, stableFilters]);
    useEffect(function () {
        fetchThirdParties(stableFilters);
    }, [fetchThirdParties, stableFilters]);
    return {
        thirdParties: thirdParties,
        loading: loading,
        error: error,
        total: total,
        refetch: refetch,
        refetchWithFilters: refetchWithFilters,
        forceRefetch: forceRefetch
    };
};
// Hook para un tercero específico
export var useThirdParty = function (id) {
    var _a = useState(null), thirdParty = _a[0], setThirdParty = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var fetchThirdParty = useCallback(function (thirdPartyId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    console.log('🔍 [useThirdParty] Fetching third party with ID:', thirdPartyId);
                    return [4 /*yield*/, ThirdPartyService.getThirdParty(thirdPartyId)];
                case 1:
                    data = _a.sent();
                    console.log('✅ [useThirdParty] Successfully fetched third party:', data.id);
                    setThirdParty(data);
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    console.error('❌ [useThirdParty] Error fetching third party:', err_2);
                    setError(err_2 instanceof Error ? err_2.message : 'Error al cargar tercero');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var refetch = useCallback(function () {
        if (id) {
            fetchThirdParty(id);
        }
    }, [fetchThirdParty, id]);
    useEffect(function () {
        if (id) {
            fetchThirdParty(id);
        }
    }, [fetchThirdParty, id]);
    return {
        thirdParty: thirdParty,
        loading: loading,
        error: error,
        refetch: refetch
    };
};
// Hook para crear tercero
export var useCreateThirdParty = function () {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var createThirdParty = useCallback(function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🎯 [useCreateThirdParty] Recibiendo datos del formulario:');
                    console.log('📝 Datos del formulario:', JSON.stringify(data, null, 2));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.createThirdParty(data)];
                case 2:
                    result = _a.sent();
                    console.log('✅ [useCreateThirdParty] Tercero creado exitosamente:', result);
                    return [2 /*return*/, result];
                case 3:
                    err_3 = _a.sent();
                    console.error('❌ [useCreateThirdParty] Error al crear tercero:', err_3);
                    setError(err_3 instanceof Error ? err_3.message : 'Error al crear tercero');
                    return [2 /*return*/, null];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    return {
        createThirdParty: createThirdParty,
        loading: loading,
        error: error
    };
};
// Hook para actualizar tercero
export var useUpdateThirdParty = function () {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var updateThirdParty = useCallback(function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.updateThirdParty(id, data)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_4 = _a.sent();
                    setError(err_4 instanceof Error ? err_4.message : 'Error al actualizar tercero');
                    return [2 /*return*/, null];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    return {
        updateThirdParty: updateThirdParty,
        loading: loading,
        error: error
    };
};
// Hook para eliminar tercero
export var useDeleteThirdParty = function () {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var deleteThirdParty = useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.deleteThirdParty(id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, true];
                case 2:
                    err_5 = _a.sent();
                    setError(err_5 instanceof Error ? err_5.message : 'Error al eliminar tercero');
                    return [2 /*return*/, false];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    return {
        deleteThirdParty: deleteThirdParty,
        loading: loading,
        error: error
    };
};
// Hook para estado de cuenta
export var useThirdPartyStatement = function (id) {
    var _a = useState(null), statement = _a[0], setStatement = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var fetchStatement = useCallback(function (thirdPartyId, startDate, endDate) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.getThirdPartyStatement(thirdPartyId, startDate, endDate)];
                case 1:
                    data = _a.sent();
                    setStatement(data);
                    return [3 /*break*/, 4];
                case 2:
                    err_6 = _a.sent();
                    setError(err_6 instanceof Error ? err_6.message : 'Error al cargar estado de cuenta');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var refetch = useCallback(function (startDate, endDate) {
        if (id) {
            fetchStatement(id, startDate, endDate);
        }
    }, [fetchStatement, id]);
    return {
        statement: statement,
        loading: loading,
        error: error,
        fetchStatement: fetchStatement,
        refetch: refetch
    };
};
// Hook para balance
export var useThirdPartyBalance = function (id) {
    var _a = useState(null), balance = _a[0], setBalance = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var fetchBalance = useCallback(function (thirdPartyId, asOfDate) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.getThirdPartyBalance(thirdPartyId, asOfDate)];
                case 1:
                    data = _a.sent();
                    setBalance(data);
                    return [3 /*break*/, 4];
                case 2:
                    err_7 = _a.sent();
                    setError(err_7 instanceof Error ? err_7.message : 'Error al cargar balance');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var refetch = useCallback(function (asOfDate) {
        if (id) {
            fetchBalance(id, asOfDate);
        }
    }, [fetchBalance, id]);
    useEffect(function () {
        if (id) {
            fetchBalance(id);
        }
    }, [fetchBalance, id]);
    return {
        balance: balance,
        loading: loading,
        error: error,
        fetchBalance: fetchBalance,
        refetch: refetch
    };
};
// Hook para búsqueda
export var useThirdPartySearch = function () {
    var _a = useState([]), results = _a[0], setResults = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var search = useCallback(function (query, filters) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!query.trim()) {
                        setResults([]);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.searchThirdParties(query, filters)];
                case 2:
                    response = _a.sent();
                    setResults(response.data);
                    return [3 /*break*/, 5];
                case 3:
                    err_8 = _a.sent();
                    setError(err_8 instanceof Error ? err_8.message : 'Error en la búsqueda');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var clearResults = useCallback(function () {
        setResults([]);
    }, []);
    return {
        results: results,
        loading: loading,
        error: error,
        search: search,
        clearResults: clearResults
    };
};
// Hook para operaciones masivas
export var useBulkThirdPartyOperations = function () {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var bulkDelete = useCallback(function (thirdPartyIds) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.bulkDelete(thirdPartyIds)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_9 = _a.sent();
                    setError(err_9 instanceof Error ? err_9.message : 'Error en eliminación masiva');
                    return [2 /*return*/, null];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkUpdate = useCallback(function (thirdPartyIds, updates) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.bulkUpdate(thirdPartyIds, updates)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_10 = _a.sent();
                    setError(err_10 instanceof Error ? err_10.message : 'Error en actualización masiva');
                    return [2 /*return*/, null];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkActivate = useCallback(function (thirdPartyIds) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.bulkActivate(thirdPartyIds)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_11 = _a.sent();
                    setError(err_11 instanceof Error ? err_11.message : 'Error en activación masiva');
                    return [2 /*return*/, null];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkDeactivate = useCallback(function (thirdPartyIds) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.bulkDeactivate(thirdPartyIds)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 2:
                    err_12 = _a.sent();
                    setError(err_12 instanceof Error ? err_12.message : 'Error en desactivación masiva');
                    return [2 /*return*/, null];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    return {
        bulkDelete: bulkDelete,
        bulkUpdate: bulkUpdate,
        bulkActivate: bulkActivate,
        bulkDeactivate: bulkDeactivate,
        loading: loading,
        error: error
    };
};
// Hook para validación y eliminación masiva real
export var useBulkDeleteValidation = function () {
    var _a = useState([]), validationData = _a[0], setValidationData = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var validateDeletion = useCallback(function (thirdPartyIds) { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, ThirdPartyService.validateDeletion(thirdPartyIds)];
                case 1:
                    result = _a.sent();
                    setValidationData(result);
                    return [2 /*return*/, result];
                case 2:
                    err_13 = _a.sent();
                    setError(err_13 instanceof Error ? err_13.message : 'Error en validación de eliminación');
                    return [2 /*return*/, null];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkDeleteReal = useCallback(function (thirdPartyIds_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([thirdPartyIds_1], args_1, true), void 0, function (thirdPartyIds, forceDelete, deleteReason) {
            var result, err_14;
            if (forceDelete === void 0) { forceDelete = false; }
            if (deleteReason === void 0) { deleteReason = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, ThirdPartyService.bulkDeleteReal(thirdPartyIds, forceDelete, deleteReason)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 2:
                        err_14 = _a.sent();
                        setError(err_14 instanceof Error ? err_14.message : 'Error en eliminación masiva');
                        return [2 /*return*/, null];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, []);
    return {
        validationData: validationData,
        validateDeletion: validateDeletion,
        bulkDeleteReal: bulkDeleteReal,
        loading: loading,
        error: error
    };
};
