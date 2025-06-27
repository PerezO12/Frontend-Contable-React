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
import { useState, useEffect, useCallback } from 'react';
import { JournalEntryService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
import { useJournalEntryEventEmitter } from './useJournalEntryEvents';
import { JournalEntryStatus } from '../types';
/**
 * Hook principal para gestión de asientos contables
 * Maneja el estado, loading, errores y operaciones CRUD
 */
export var useJournalEntries = function (initialFilters) {
    var _a = useState([]), entries = _a[0], setEntries = _a[1];
    var _b = useState(initialFilters), currentFilters = _b[0], setCurrentFilters = _b[1];
    var _c = useState({
        total: 0,
        page: 1,
        pages: 1,
        has_next: false,
        has_prev: false
    }), pagination = _c[0], setPagination = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var _f = useToast(), success = _f.success, showError = _f.error;
    var _g = useJournalEntryEventEmitter(), emitApproved = _g.emitApproved, emitPosted = _g.emitPosted, emitCancelled = _g.emitCancelled, emitReversed = _g.emitReversed, emitDeleted = _g.emitDeleted;
    var fetchEntries = useCallback(function (filters) { return __awaiter(void 0, void 0, void 0, function () {
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
                    return [4 /*yield*/, JournalEntryService.getJournalEntries(filtersToUse)];
                case 2:
                    response = _a.sent();
                    setEntries(response.items);
                    setPagination({
                        total: response.total,
                        page: response.page,
                        pages: response.pages,
                        has_next: response.has_next,
                        has_prev: response.has_prev
                    });
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Error al cargar los asientos contables';
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
                    return [4 /*yield*/, fetchEntries(newFilters)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [fetchEntries]);
    var refetch = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchEntries(currentFilters)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [fetchEntries]);
    var createEntry = useCallback(function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var newEntry_1, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.createJournalEntry(data)];
                case 2:
                    newEntry_1 = _a.sent();
                    setEntries(function (prev) { return __spreadArray([newEntry_1], prev, true); });
                    success('Asiento contable creado exitosamente');
                    // No emitimos evento 'updated' para evitar bucles infinitos
                    // emitUpdated(newEntry.id, newEntry);
                    return [2 /*return*/, newEntry_1];
                case 3:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Error al crear el asiento contable';
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
    var updateEntry = useCallback(function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedEntry_1, err_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.updateJournalEntry(id, data)];
                case 2:
                    updatedEntry_1 = _a.sent();
                    setEntries(function (prev) { return prev.map(function (entry) {
                        return entry.id === id ? updatedEntry_1 : entry;
                    }); });
                    success('Asiento contable actualizado exitosamente');
                    // Solo emitimos eventos para operaciones que afectan el estado, no para updates simples
                    // emitUpdated(id, updatedEntry);
                    return [2 /*return*/, updatedEntry_1];
                case 3:
                    err_3 = _a.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Error al actualizar el asiento contable';
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
    var deleteEntry = useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var err_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.deleteJournalEntry(id)];
                case 2:
                    _a.sent();
                    setEntries(function (prev) { return prev.filter(function (entry) { return entry.id !== id; }); });
                    success('Asiento contable eliminado exitosamente');
                    emitDeleted(id);
                    return [2 /*return*/, true];
                case 3:
                    err_4 = _a.sent();
                    errorMessage = err_4 instanceof Error ? err_4.message : 'Error al eliminar el asiento contable';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError, emitDeleted]);
    var approveEntry = useCallback(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedEntry_2, err_5, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.approveJournalEntry(id)];
                case 2:
                    updatedEntry_2 = _a.sent();
                    // Actualizar estado local inmediatamente
                    setEntries(function (prev) { return prev.map(function (entry) {
                        return entry.id === id ? updatedEntry_2 : entry;
                    }); });
                    success('Asiento contable aprobado exitosamente');
                    // Emitir evento de aprobación para actualización en tiempo real
                    emitApproved(id, updatedEntry_2);
                    return [2 /*return*/, true];
                case 3:
                    err_5 = _a.sent();
                    errorMessage = err_5 instanceof Error ? err_5.message : 'Error al aprobar el asiento contable';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError, emitApproved]);
    var postEntry = useCallback(function (id, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedEntry_3, err_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.postJournalEntry(id, reason)];
                case 2:
                    updatedEntry_3 = _a.sent();
                    // Actualizar estado local inmediatamente
                    setEntries(function (prev) { return prev.map(function (entry) {
                        return entry.id === id ? updatedEntry_3 : entry;
                    }); });
                    success('Asiento contable contabilizado exitosamente');
                    // Emitir evento de contabilización para actualización en tiempo real
                    emitPosted(id, updatedEntry_3);
                    return [2 /*return*/, true];
                case 3:
                    err_6 = _a.sent();
                    errorMessage = err_6 instanceof Error ? err_6.message : 'Error al contabilizar el asiento contable';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError, emitPosted]);
    var cancelEntry = useCallback(function (id, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedEntry_4, err_7, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.cancelJournalEntry(id, reason)];
                case 2:
                    updatedEntry_4 = _a.sent();
                    // Actualizar estado local inmediatamente
                    setEntries(function (prev) { return prev.map(function (entry) {
                        return entry.id === id ? updatedEntry_4 : entry;
                    }); });
                    success('Asiento contable cancelado exitosamente');
                    // Emitir evento de cancelación para actualización en tiempo real
                    emitCancelled(id, updatedEntry_4);
                    return [2 /*return*/, true];
                case 3:
                    err_7 = _a.sent();
                    errorMessage = err_7 instanceof Error ? err_7.message : 'Error al cancelar el asiento contable';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError, emitCancelled]);
    var reverseEntry = useCallback(function (id, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var reversalEntry, err_8, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.reverseJournalEntry(id, reason)];
                case 2:
                    reversalEntry = _a.sent();
                    // En lugar de refrescar toda la lista, simplemente emitimos el evento
                    // y dejamos que el sistema de eventos maneje la actualización
                    success('Asiento de reversión creado exitosamente');
                    // Emitir evento de reversión
                    emitReversed(id, reversalEntry);
                    return [2 /*return*/, true];
                case 3:
                    err_8 = _a.sent();
                    errorMessage = err_8 instanceof Error ? err_8.message : 'Error al crear la reversión';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [success, showError, emitReversed]);
    var searchEntries = useCallback(function (query, filters) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_9, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.getJournalEntries(__assign(__assign({}, filters), { search: query }))];
                case 2:
                    response = _a.sent();
                    setEntries(response.items);
                    setPagination({
                        total: response.total,
                        page: response.page,
                        pages: response.pages,
                        has_next: response.has_next,
                        has_prev: response.has_prev
                    });
                    return [3 /*break*/, 5];
                case 3:
                    err_9 = _a.sent();
                    errorMessage = err_9 instanceof Error ? err_9.message : 'Error en la búsqueda';
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
    // Validar eliminación masiva
    var validateDeletion = useCallback(function (entryIds) { return __awaiter(void 0, void 0, void 0, function () {
        var validations, err_10, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, JournalEntryService.validateBulkDelete({ journal_entry_ids: entryIds })];
                case 1:
                    validations = _a.sent();
                    return [2 /*return*/, validations];
                case 2:
                    err_10 = _a.sent();
                    errorMessage = err_10 instanceof Error ? err_10.message : 'Error al validar la eliminación';
                    showError(errorMessage);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [showError]);
    // Eliminar asientos masivamente
    var bulkDeleteEntries = useCallback(function (deleteData) { return __awaiter(void 0, void 0, void 0, function () {
        var result, deletedIds_1, err_11, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.bulkDeleteJournalEntries(deleteData)];
                case 2:
                    result = _a.sent();
                    // Actualizar la lista removiendo los asientos eliminados exitosamente
                    if (result.deleted_entries.length > 0) {
                        deletedIds_1 = result.deleted_entries.map(function (entry) { return entry.journal_entry_id; });
                        setEntries(function (prev) { return prev.filter(function (entry) { return !deletedIds_1.includes(entry.id); }); });
                        // Emitir eventos de eliminación para cada asiento eliminado
                        deletedIds_1.forEach(function (id) { return emitDeleted(id); });
                    }
                    return [2 /*return*/, result];
                case 3:
                    err_11 = _a.sent();
                    errorMessage = err_11 instanceof Error ? err_11.message : 'Error en la eliminación masiva';
                    setError(errorMessage);
                    showError(errorMessage);
                    throw err_11;
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError, emitDeleted]); // Restaurar un asiento contable a borrador
    var restoreEntryToDraft = useCallback(function (id, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var err_12, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.resetJournalEntryToDraft(id, reason)];
                case 2:
                    _a.sent();
                    // Actualizar el estado del asiento en la lista local
                    setEntries(function (prev) {
                        return prev.map(function (entry) {
                            return entry.id === id ? __assign(__assign({}, entry), { status: JournalEntryStatus.DRAFT }) : entry;
                        });
                    });
                    success("Asiento ".concat(id, " restaurado a borrador exitosamente"));
                    return [2 /*return*/, true];
                case 3:
                    err_12 = _a.sent();
                    errorMessage = err_12 instanceof Error ? err_12.message : 'Error al restaurar asiento a borrador';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [2 /*return*/, false];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError, success]);
    // Restaurar múltiples asientos contables a borrador
    var bulkRestoreToDraft = useCallback(function (entryIds, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var resetData, result, restoredIds_1, err_13, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    resetData = {
                        journal_entry_ids: entryIds,
                        reason: reason,
                        force_reset: false
                    };
                    return [4 /*yield*/, JournalEntryService.bulkResetToDraftEntries(resetData)];
                case 2:
                    result = _a.sent();
                    // Actualizar la lista actualizando el estado de los asientos restaurados exitosamente
                    if (result.reset_entries && result.reset_entries.length > 0) {
                        restoredIds_1 = result.reset_entries.map(function (entry) { return entry.journal_entry_id; });
                        setEntries(function (prev) {
                            return prev.map(function (entry) {
                                return restoredIds_1.includes(entry.id)
                                    ? __assign(__assign({}, entry), { status: JournalEntryStatus.DRAFT }) : entry;
                            });
                        });
                        // Podríamos añadir un evento de restauración si fuera necesario
                    }
                    success("".concat(result.total_reset, " de ").concat(result.total_requested, " asientos restaurados a borrador"));
                    return [2 /*return*/, result];
                case 3:
                    err_13 = _a.sent();
                    errorMessage = err_13 instanceof Error ? err_13.message : 'Error en la restauración masiva a borrador';
                    setError(errorMessage);
                    showError(errorMessage);
                    throw err_13;
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [showError, success]);
    useEffect(function () {
        // Ejecutar solo una vez al montar con los filtros iniciales
        fetchEntries(initialFilters);
    }, []); // Array vacío para ejecutar solo una vez
    // No agregamos fetchEntries porque eso causaría re-ejecución innecesaria
    return {
        entries: entries,
        pagination: pagination,
        loading: loading,
        error: error,
        refetch: refetch,
        refetchWithFilters: refetchWithFilters,
        createEntry: createEntry,
        updateEntry: updateEntry,
        deleteEntry: deleteEntry,
        approveEntry: approveEntry,
        postEntry: postEntry,
        cancelEntry: cancelEntry,
        reverseEntry: reverseEntry,
        searchEntries: searchEntries,
        validateDeletion: validateDeletion,
        bulkDeleteEntries: bulkDeleteEntries,
        restoreEntryToDraft: restoreEntryToDraft,
        bulkRestoreToDraft: bulkRestoreToDraft
    };
};
/**
 * Hook para gestionar un asiento contable individual
 */
export var useJournalEntry = function (id) {
    var _a = useState(null), entry = _a[0], setEntry = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchEntry = useCallback(function (entryId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_14, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.getJournalEntryById(entryId)];
                case 2:
                    data = _a.sent();
                    setEntry(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_14 = _a.sent();
                    errorMessage = err_14 instanceof Error ? err_14.message : 'Error al cargar el asiento contable';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []); // Removemos showError de las dependencias
    var fetchByNumber = useCallback(function (number) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_15, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.getJournalEntryByNumber(number)];
                case 2:
                    data = _a.sent();
                    setEntry(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_15 = _a.sent();
                    errorMessage = err_15 instanceof Error ? err_15.message : 'Error al cargar el asiento contable';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []); // Removemos showError de las dependencias
    useEffect(function () {
        if (id) {
            fetchEntry(id);
        }
    }, [id]); // Solo depende del id, no de fetchEntry
    // Función para actualizar el entry localmente (para actualizaciones en tiempo real)
    var updateLocalEntry = useCallback(function (updatedEntry) {
        setEntry(updatedEntry);
    }, []);
    // Función para refrescar solo si el ID coincide
    var refetchIfMatches = useCallback(function (entryId) {
        if (id === entryId) {
            fetchEntry(entryId);
        }
    }, [id]); // Solo depende del id
    return {
        entry: entry,
        loading: loading,
        error: error,
        refetch: fetchEntry,
        fetchByNumber: fetchByNumber,
        updateLocalEntry: updateLocalEntry,
        refetchIfMatches: refetchIfMatches
    };
};
/**
 * Hook para estadísticas de asientos contables
 */
export var useJournalEntryStatistics = function (filters) {
    var _a = useState(null), statistics = _a[0], setStatistics = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var showError = useToast().error;
    var fetchStatistics = useCallback(function (_statsFilters) { return __awaiter(void 0, void 0, void 0, function () {
        var data, err_16, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, JournalEntryService.getJournalEntryStatistics()];
                case 2:
                    data = _a.sent();
                    setStatistics(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_16 = _a.sent();
                    errorMessage = err_16 instanceof Error ? err_16.message : 'Error al cargar estadísticas';
                    setError(errorMessage);
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []); // Removemos las dependencias para evitar bucle infinito
    useEffect(function () {
        fetchStatistics(filters);
    }, []); // Solo ejecutar una vez al montar
    return {
        statistics: statistics,
        loading: loading,
        error: error,
        refetch: fetchStatistics
    };
};
/**
 * Hook para validación de balance en tiempo real
 */
export var useJournalEntryBalance = function (lines) {
    var _a = useState({
        total_debit: 0,
        total_credit: 0,
        difference: 0,
        is_balanced: false
    }), balance = _a[0], setBalance = _a[1];
    useEffect(function () {
        var totalDebits = lines.reduce(function (sum, line) { return sum + parseFloat(line.debit_amount || '0'); }, 0);
        var totalCredits = lines.reduce(function (sum, line) { return sum + parseFloat(line.credit_amount || '0'); }, 0);
        var newBalance = {
            total_debit: totalDebits,
            total_credit: totalCredits,
            difference: totalDebits - totalCredits,
            is_balanced: Math.abs(totalDebits - totalCredits) < 0.01
        };
        setBalance(newBalance);
    }, [lines]);
    return balance;
};
