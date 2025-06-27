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
/**
 * Hook personalizado para gestión de journals
 * Proporciona una interfaz simplificada para operaciones con journals
 */
import { useEffect, useCallback } from 'react';
import { useJournalStore } from '../stores/journalStore';
/**
 * Hook para listado de journals con filtros y paginación
 */
export function useJournals(initialFilters, initialPagination, autoFetch) {
    if (autoFetch === void 0) { autoFetch = true; }
    var _a = useJournalStore(), journals = _a.journals, loading = _a.loading, error = _a.error, total = _a.total, skip = _a.skip, limit = _a.limit, storeFetchJournals = _a.fetchJournals, clearError = _a.clearError, refresh = _a.refresh;
    // Memoizar la función fetchJournals para evitar dependencias cambiantes
    var fetchJournals = useCallback(function (filters, pagination) {
        return storeFetchJournals(filters, pagination);
    }, [storeFetchJournals]);
    // Solo ejecutar autoFetch si está habilitado
    useEffect(function () {
        if (autoFetch) {
            fetchJournals(initialFilters, initialPagination);
        }
    }, []); // Array vacío - solo ejecutar una vez al montar
    return {
        journals: journals,
        loading: loading,
        error: error,
        total: total,
        skip: skip,
        limit: limit,
        fetchJournals: fetchJournals,
        clearError: clearError,
        refresh: refresh,
    };
}
/**
 * Hook para operaciones con un journal específico
 */
export function useJournal(id, autoFetch) {
    var _this = this;
    if (autoFetch === void 0) { autoFetch = true; }
    var _a = useJournalStore(), currentJournal = _a.currentJournal, currentStats = _a.currentStats, currentSequenceInfo = _a.currentSequenceInfo, loading = _a.loading, saving = _a.saving, error = _a.error, storeFetchJournal = _a.fetchJournal, createJournal = _a.createJournal, updateJournal = _a.updateJournal, deleteJournal = _a.deleteJournal, fetchJournalStats = _a.fetchJournalStats, fetchJournalSequenceInfo = _a.fetchJournalSequenceInfo, resetJournalSequence = _a.resetJournalSequence, setCurrentJournal = _a.setCurrentJournal, clearError = _a.clearError;
    // Memoizar función fetchJournal
    var fetchJournal = useCallback(function (journalId) {
        return storeFetchJournal(journalId);
    }, [storeFetchJournal]);
    useEffect(function () {
        if (id && autoFetch) {
            fetchJournal(id);
        }
    }, [id]); // Solo depender del id, no del fetchJournal
    var handleCreate = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var journal, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, createJournal(data)];
                case 1:
                    journal = _a.sent();
                    return [2 /*return*/, journal];
                case 2:
                    error_1 = _a.sent();
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleUpdate = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var journal, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        throw new Error('ID de journal requerido para actualizar');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateJournal(id, data)];
                case 2:
                    journal = _a.sent();
                    return [2 /*return*/, journal];
                case 3:
                    error_2 = _a.sent();
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        throw new Error('ID de journal requerido para eliminar');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteJournal(id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleResetSequence = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var journal, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        throw new Error('ID de journal requerido para resetear secuencia');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, resetJournalSequence(id, data)];
                case 2:
                    journal = _a.sent();
                    return [2 /*return*/, journal];
                case 3:
                    error_4 = _a.sent();
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var loadStats = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        throw new Error('ID de journal requerido para cargar estadísticas');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchJournalStats(id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var loadSequenceInfo = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        throw new Error('ID de journal requerido para cargar información de secuencia');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetchJournalSequenceInfo(id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    throw error_6;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return {
        journal: currentJournal,
        stats: currentStats,
        sequenceInfo: currentSequenceInfo,
        loading: loading,
        saving: saving,
        error: error,
        create: handleCreate,
        update: handleUpdate,
        delete: handleDelete,
        resetSequence: handleResetSequence,
        loadStats: loadStats,
        loadSequenceInfo: loadSequenceInfo,
        setJournal: setCurrentJournal,
        clearError: clearError,
    };
}
/**
 * Hook para opciones de journals (para selects)
 */
export function useJournalOptions() {
    var _a = useJournalStore(), journals = _a.journals, loading = _a.loading, error = _a.error, fetchJournals = _a.fetchJournals;
    // Función memoizada para cargar opciones
    var loadOptions = useCallback(function () {
        return fetchJournals({ is_active: true }, { skip: 0, limit: 1000, order_by: 'name', order_dir: 'asc' });
    }, [fetchJournals]);
    useEffect(function () {
        loadOptions();
    }, []); // Solo ejecutar una vez al montar
    var options = journals.map(function (journal) { return ({
        value: journal.id,
        label: "".concat(journal.name, " (").concat(journal.code, ")"),
        type: journal.type,
        sequence_prefix: journal.sequence_prefix,
        is_active: journal.is_active,
    }); });
    return {
        options: options,
        loading: loading,
        error: error,
    };
}
/**
 * Hook para estadísticas de journals
 */
export function useJournalStats(id, autoFetch) {
    if (autoFetch === void 0) { autoFetch = true; }
    var _a = useJournalStore(), currentStats = _a.currentStats, loading = _a.loading, error = _a.error, storeFetchJournalStats = _a.fetchJournalStats, clearError = _a.clearError;
    // Memoizar función fetchJournalStats
    var fetchJournalStats = useCallback(function (statsId) {
        return storeFetchJournalStats(statsId);
    }, [storeFetchJournalStats]);
    useEffect(function () {
        if (id && autoFetch) {
            fetchJournalStats(id);
        }
    }, [id]); // Solo depender del id
    return {
        stats: currentStats,
        loading: loading,
        error: error,
        refresh: function () { return fetchJournalStats(id); },
        clearError: clearError,
    };
}
/**
 * Hook para información de secuencia de journals
 */
export function useJournalSequence(id, autoFetch) {
    var _this = this;
    if (autoFetch === void 0) { autoFetch = true; }
    var _a = useJournalStore(), currentSequenceInfo = _a.currentSequenceInfo, loading = _a.loading, error = _a.error, storeFetchJournalSequenceInfo = _a.fetchJournalSequenceInfo, resetJournalSequence = _a.resetJournalSequence, clearError = _a.clearError;
    // Memoizar función fetchJournalSequenceInfo
    var fetchJournalSequenceInfo = useCallback(function (sequenceId) {
        return storeFetchJournalSequenceInfo(sequenceId);
    }, [storeFetchJournalSequenceInfo]);
    useEffect(function () {
        if (id && autoFetch) {
            fetchJournalSequenceInfo(id);
        }
    }, [id]); // Solo depender del id
    var handleReset = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var journal, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, resetJournalSequence(id, data)];
                case 1:
                    journal = _a.sent();
                    return [2 /*return*/, journal];
                case 2:
                    error_7 = _a.sent();
                    throw error_7;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return {
        sequenceInfo: currentSequenceInfo,
        loading: loading,
        error: error,
        resetSequence: handleReset,
        refresh: function () { return fetchJournalSequenceInfo(id); },
        clearError: clearError,
    };
}
