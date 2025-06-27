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
/**
 * Store Zustand para gestión de estado de Journals
 * Maneja el estado global del módulo de journals
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { JournalAPI } from '../api/journalAPI';
export var useJournalStore = create()(devtools(function (set, get) { return ({
    // Estado inicial
    journals: [],
    currentJournal: null,
    currentStats: null,
    currentSequenceInfo: null,
    loading: false,
    saving: false,
    error: null,
    total: 0,
    skip: 0,
    limit: 50,
    currentFilters: {},
    currentPagination: { skip: 0, limit: 50, order_by: 'name', order_dir: 'asc' },
    // Acciones de datos
    fetchJournals: function (filters, pagination) { return __awaiter(void 0, void 0, void 0, function () {
        var finalFilters, finalPagination, response, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    set({ loading: true, error: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    finalFilters = filters || get().currentFilters;
                    finalPagination = pagination || get().currentPagination;
                    return [4 /*yield*/, JournalAPI.getJournals(finalFilters, finalPagination)];
                case 2:
                    response = _c.sent();
                    set({
                        journals: response.items,
                        total: response.total,
                        skip: response.skip,
                        limit: response.limit,
                        currentFilters: finalFilters,
                        currentPagination: finalPagination,
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    set({
                        error: ((_b = (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Error al cargar journals',
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchJournal: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var journal, error_2;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    set({ loading: true, error: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, JournalAPI.getJournal(id)];
                case 2:
                    journal = _c.sent();
                    set({
                        currentJournal: journal,
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _c.sent();
                    set({
                        error: ((_b = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Error al cargar journal',
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    createJournal: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var journal, currentJournals, updatedJournals, error_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    set({ saving: true, error: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, JournalAPI.createJournal(data)];
                case 2:
                    journal = _c.sent();
                    currentJournals = get().journals;
                    updatedJournals = __spreadArray([journal], currentJournals, true);
                    set({
                        journals: updatedJournals,
                        currentJournal: journal,
                        total: get().total + 1,
                        saving: false,
                    });
                    return [2 /*return*/, journal];
                case 3:
                    error_3 = _c.sent();
                    set({
                        error: ((_b = (_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Error al crear journal',
                        saving: false,
                    });
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    updateJournal: function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        var journal_1, currentJournals, updatedJournals, error_4;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    set({ saving: true, error: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, JournalAPI.updateJournal(id, data)];
                case 2:
                    journal_1 = _c.sent();
                    currentJournals = get().journals;
                    updatedJournals = currentJournals.map(function (j) {
                        return j.id === id ? __assign(__assign({}, j), journal_1) : j;
                    });
                    set({
                        journals: updatedJournals,
                        currentJournal: journal_1,
                        saving: false,
                    });
                    return [2 /*return*/, journal_1];
                case 3:
                    error_4 = _c.sent();
                    set({
                        error: ((_b = (_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Error al actualizar journal',
                        saving: false,
                    });
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deleteJournal: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var currentJournals, updatedJournals, error_5;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    set({ saving: true, error: null });
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, JournalAPI.deleteJournal(id)];
                case 2:
                    _d.sent();
                    currentJournals = get().journals;
                    updatedJournals = currentJournals.filter(function (j) { return j.id !== id; });
                    set({
                        journals: updatedJournals,
                        currentJournal: ((_a = get().currentJournal) === null || _a === void 0 ? void 0 : _a.id) === id ? null : get().currentJournal,
                        total: get().total - 1,
                        saving: false,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _d.sent();
                    set({
                        error: ((_c = (_b = error_5.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.detail) || 'Error al eliminar journal',
                        saving: false,
                    });
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchJournalStats: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var stats, error_6;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    set({ loading: true, error: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, JournalAPI.getJournalStats(id)];
                case 2:
                    stats = _c.sent();
                    set({
                        currentStats: stats,
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _c.sent();
                    set({
                        error: ((_b = (_a = error_6.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Error al cargar estadísticas',
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    fetchJournalSequenceInfo: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var sequenceInfo, error_7;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    set({ loading: true, error: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, JournalAPI.getJournalSequenceInfo(id)];
                case 2:
                    sequenceInfo = _c.sent();
                    set({
                        currentSequenceInfo: sequenceInfo,
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _c.sent();
                    set({
                        error: ((_b = (_a = error_7.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Error al cargar información de secuencia',
                        loading: false,
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); },
    resetJournalSequence: function (id, data) { return __awaiter(void 0, void 0, void 0, function () {
        var journal, error_8;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    set({ saving: true, error: null });
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, JournalAPI.resetJournalSequence(id, data)];
                case 2:
                    journal = _c.sent();
                    set({
                        currentJournal: journal,
                        saving: false,
                    });
                    // Refrescar información de secuencia
                    return [4 /*yield*/, get().fetchJournalSequenceInfo(id)];
                case 3:
                    // Refrescar información de secuencia
                    _c.sent();
                    return [2 /*return*/, journal];
                case 4:
                    error_8 = _c.sent();
                    set({
                        error: ((_b = (_a = error_8.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.detail) || 'Error al resetear secuencia',
                        saving: false,
                    });
                    throw error_8;
                case 5: return [2 /*return*/];
            }
        });
    }); },
    // Acciones de UI
    setCurrentJournal: function (journal) {
        set({ currentJournal: journal });
    },
    clearError: function () {
        set({ error: null });
    },
    setError: function (error) {
        set({ error: error });
    },
    setLoading: function (loading) {
        set({ loading: loading });
    },
    setSaving: function (saving) {
        set({ saving: saving });
    },
    // Utilidades
    refresh: function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, currentFilters, currentPagination;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = get(), currentFilters = _a.currentFilters, currentPagination = _a.currentPagination;
                    return [4 /*yield*/, get().fetchJournals(currentFilters, currentPagination)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); },
    reset: function () {
        set({
            journals: [],
            currentJournal: null,
            currentStats: null,
            currentSequenceInfo: null,
            loading: false,
            saving: false,
            error: null,
            total: 0,
            skip: 0,
            limit: 50,
            currentFilters: {},
            currentPagination: { skip: 0, limit: 50, order_by: 'name', order_dir: 'asc' },
        });
    },
}); }, {
    name: 'journal-store',
}));
export default useJournalStore;
