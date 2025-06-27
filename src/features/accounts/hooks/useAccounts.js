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
import { AccountService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
export var useAccounts = function (filters) {
    var _a = useState([]), accounts = _a[0], setAccounts = _a[1];
    var _b = useState(0), total = _b[0], setTotal = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var _e = useToast(), success = _e.success, showError = _e.error;
    // Estabilizar filters para evitar bucles infinitos
    var stableFilters = useMemo(function () { return filters; }, [
        filters === null || filters === void 0 ? void 0 : filters.search,
        filters === null || filters === void 0 ? void 0 : filters.account_type,
        filters === null || filters === void 0 ? void 0 : filters.category,
        filters === null || filters === void 0 ? void 0 : filters.cash_flow_category,
        filters === null || filters === void 0 ? void 0 : filters.is_active,
        filters === null || filters === void 0 ? void 0 : filters.skip,
        filters === null || filters === void 0 ? void 0 : filters.limit
    ]);
    // Ref para evitar fetch duplicado
    var lastFetchFilters = useRef('');
    var fetchAccounts = useCallback(function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var filtersKey, response, err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filtersKey = JSON.stringify(filters || {});
                    // Evitar petición duplicada si los filtros son los mismos
                    if (lastFetchFilters.current === filtersKey) {
                        return [2 /*return*/];
                    }
                    lastFetchFilters.current = filtersKey;
                    console.log('🔍 [useAccounts] fetchAccounts called with filters:', filters);
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.getAccounts(filters)];
                case 2:
                    response = _a.sent();
                    console.log('🔍 [useAccounts] Response from service:', response);
                    // Handle both array and paginated response formats
                    if (Array.isArray(response)) {
                        // Backend returned plain array
                        console.log('🔍 [useAccounts] Response is plain array, converting to paginated format');
                        setAccounts(response);
                        setTotal(response.length);
                        console.log('🔍 [useAccounts] Set accounts from array:', response.length, 'total:', response.length);
                    }
                    else {
                        // Backend returned paginated response
                        console.log('🔍 [useAccounts] Response is paginated object');
                        setAccounts(response.items);
                        setTotal(response.total);
                        console.log('🔍 [useAccounts] Set accounts from object:', response.items.length, 'total:', response.total);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error('❌ [useAccounts] Error fetching accounts:', err_1);
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Error al cargar las cuentas';
                    setError(errorMessage);
                    showError(errorMessage);
                    setAccounts([]);
                    setTotal(0);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    var refetch = useCallback(function () {
        fetchAccounts(stableFilters);
    }, [fetchAccounts, stableFilters]);
    var refetchWithFilters = useCallback(function (newFilters) {
        fetchAccounts(newFilters);
    }, [fetchAccounts]);
    // Función para forzar refetch ignorando cache
    var forceRefetch = useCallback(function (newFilters) {
        // Limpiar cache para forzar nueva petición
        lastFetchFilters.current = '';
        fetchAccounts(newFilters || stableFilters);
    }, [fetchAccounts, stableFilters]);
    useEffect(function () {
        fetchAccounts(stableFilters);
    }, [fetchAccounts, stableFilters]);
    var createAccount = useCallback(function (accountData) { return __awaiter(void 0, void 0, void 0, function () {
        var newAccount_1, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.createAccount(accountData)];
                case 2:
                    newAccount_1 = _a.sent();
                    setAccounts(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newAccount_1], false); });
                    success('Cuenta creada exitosamente');
                    return [2 /*return*/, newAccount_1];
                case 3:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Error al crear la cuenta';
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
    var updateAccount = useCallback(function (id, updateData) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedAccount_1, err_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.updateAccount(id, updateData)];
                case 2:
                    updatedAccount_1 = _a.sent();
                    setAccounts(function (prev) { return prev.map(function (account) {
                        return account.id === id ? updatedAccount_1 : account;
                    }); });
                    success('Cuenta actualizada exitosamente');
                    return [2 /*return*/, updatedAccount_1];
                case 3:
                    err_3 = _a.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Error al actualizar la cuenta';
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
    var deleteAccount = useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var err_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.deleteAccount(id)];
                case 2:
                    _a.sent();
                    setAccounts(function (prev) { return prev.filter(function (account) { return account.id !== id; }); });
                    success('Cuenta eliminada exitosamente');
                    return [2 /*return*/, true];
                case 3:
                    err_4 = _a.sent();
                    errorMessage = err_4 instanceof Error ? err_4.message : 'Error al eliminar la cuenta';
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
    var toggleAccountStatus = useCallback(function (id, isActive) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedAccount_2, err_5, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.toggleAccountStatus(id, isActive)];
                case 2:
                    updatedAccount_2 = _a.sent();
                    setAccounts(function (prev) { return prev.map(function (account) {
                        return account.id === id ? updatedAccount_2 : account;
                    }); });
                    success("Cuenta ".concat(isActive ? 'activada' : 'desactivada', " exitosamente"));
                    return [2 /*return*/, true];
                case 3:
                    err_5 = _a.sent();
                    errorMessage = err_5 instanceof Error ? err_5.message : 'Error al cambiar el estado de la cuenta';
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
    // Método para obtener cuentas potenciales padre por tipo
    var getParentAccountsByType = useCallback(function (accountType) { return __awaiter(void 0, void 0, void 0, function () {
        var filters_1, response, err_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    filters_1 = {
                        account_type: accountType,
                        is_active: true
                    };
                    return [4 /*yield*/, AccountService.getAccounts(filters_1)];
                case 1:
                    response = _a.sent();
                    // Handle both array and paginated response formats
                    if (Array.isArray(response)) {
                        console.log('Posibles cuentas padre encontradas:', response.length);
                        return [2 /*return*/, response];
                    }
                    else {
                        console.log('Posibles cuentas padre encontradas:', response.items.length);
                        return [2 /*return*/, response.items];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_6 = _a.sent();
                    errorMessage = err_6 instanceof Error ? err_6.message : 'Error al cargar las cuentas padre potenciales';
                    showError(errorMessage);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    // Validar eliminación masiva
    var validateBulkDeletion = useCallback(function (accountIds) { return __awaiter(void 0, void 0, void 0, function () {
        var err_7, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, AccountService.validateDeletion(accountIds)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    err_7 = _a.sent();
                    errorMessage = err_7 instanceof Error ? err_7.message : 'Error al validar la eliminación';
                    showError(errorMessage);
                    throw err_7;
                case 3: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    // Eliminar cuentas masivamente
    var bulkDeleteAccounts = useCallback(function (deleteData) { return __awaiter(void 0, void 0, void 0, function () {
        var result_1, err_8, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.bulkDeleteAccounts(deleteData)];
                case 2:
                    result_1 = _a.sent();
                    // Actualizar la lista removiendo las cuentas eliminadas exitosamente
                    if (result_1.successfully_deleted.length > 0) {
                        setAccounts(function (prev) { return prev.filter(function (account) {
                            return !result_1.successfully_deleted.includes(account.id);
                        }); });
                    }
                    return [2 /*return*/, result_1];
                case 3:
                    err_8 = _a.sent();
                    errorMessage = err_8 instanceof Error ? err_8.message : 'Error en la eliminación masiva';
                    setError(errorMessage);
                    showError(errorMessage);
                    throw err_8;
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    return {
        accounts: accounts,
        total: total,
        loading: loading,
        error: error,
        refetch: refetch,
        refetchWithFilters: refetchWithFilters,
        forceRefetch: forceRefetch,
        createAccount: createAccount,
        updateAccount: updateAccount,
        deleteAccount: deleteAccount,
        toggleAccountStatus: toggleAccountStatus,
        getParentAccountsByType: getParentAccountsByType,
        validateBulkDeletion: validateBulkDeletion,
        bulkDeleteAccounts: bulkDeleteAccounts
    };
};
export var useAccountTree = function (accountType, activeOnly) {
    if (activeOnly === void 0) { activeOnly = true; }
    var _a = useState([]), accountTree = _a[0], setAccountTree = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchAccountTree = useCallback(function (type, active) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_9, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.getAccountTree(type, active)];
                case 2:
                    data = _a.sent();
                    setAccountTree(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_9 = _a.sent();
                    errorMessage = err_9 instanceof Error ? err_9.message : 'Error al cargar el árbol de cuentas';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError]); // Solo showError como dependencia
    useEffect(function () {
        fetchAccountTree(accountType, activeOnly);
    }, []); // Array vacío para ejecutar solo una vez
    return {
        accountTree: accountTree,
        loading: loading,
        error: error,
        refetch: fetchAccountTree
    };
};
export var useAccount = function (id) {
    var _a = useState(null), account = _a[0], setAccount = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchAccount = useCallback(function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_10, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.getAccountById(accountId)];
                case 2:
                    data = _a.sent();
                    setAccount(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_10 = _a.sent();
                    errorMessage = err_10 instanceof Error ? err_10.message : 'Error al cargar la cuenta';
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
    var fetchAccountByCode = useCallback(function (code) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_11, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.getAccountByCode(code)];
                case 2:
                    data = _a.sent();
                    setAccount(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_11 = _a.sent();
                    errorMessage = err_11 instanceof Error ? err_11.message : 'Error al cargar la cuenta';
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
            fetchAccount(id);
        }
    }, [id]); // Solo depende del id
    return {
        account: account,
        loading: loading,
        error: error,
        fetchAccount: fetchAccount,
        fetchAccountByCode: fetchAccountByCode,
        setAccount: setAccount
    };
};
export var useAccountValidation = function () {
    var _a = useState(false), checking = _a[0], setChecking = _a[1];
    var checkCodeAvailability = useCallback(function (code, excludeId) { return __awaiter(void 0, void 0, void 0, function () {
        var isAvailable, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setChecking(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.checkCodeAvailability(code, excludeId)];
                case 2:
                    isAvailable = _a.sent();
                    return [2 /*return*/, isAvailable];
                case 3:
                    err_12 = _a.sent();
                    console.error('Error checking code availability:', err_12);
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
export var useAccountBalance = function (accountId) {
    var _a = useState(null), balance = _a[0], setBalance = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchBalance = useCallback(function (id, asOfDate) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_13, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.getAccountBalance(id, asOfDate)];
                case 2:
                    data = _a.sent();
                    setBalance(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_13 = _a.sent();
                    errorMessage = err_13 instanceof Error ? err_13.message : 'Error al cargar el saldo de la cuenta';
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
        if (accountId) {
            fetchBalance(accountId);
        }
    }, [accountId]); // Solo depende del accountId
    return {
        balance: balance,
        loading: loading,
        error: error,
        refetch: fetchBalance
    };
};
export var useAccountMovements = function (accountId) {
    var _a = useState([]), movements = _a[0], setMovements = _a[1];
    var _b = useState(0), totalCount = _b[0], setTotalCount = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    var showError = useToast().error;
    var fetchMovements = useCallback(function (id, filters) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_14, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, AccountService.getAccountMovements(id, filters)];
                case 2:
                    data = _a.sent();
                    setMovements(data.movements);
                    setTotalCount(data.total_count);
                    return [3 /*break*/, 5];
                case 3:
                    err_14 = _a.sent();
                    errorMessage = err_14 instanceof Error ? err_14.message : 'Error al cargar los movimientos de la cuenta';
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
        if (accountId) {
            fetchMovements(accountId);
        }
    }, [accountId]); // Solo depende del accountId
    return {
        movements: movements,
        totalCount: totalCount,
        loading: loading,
        error: error,
        refetch: fetchMovements
    };
};
