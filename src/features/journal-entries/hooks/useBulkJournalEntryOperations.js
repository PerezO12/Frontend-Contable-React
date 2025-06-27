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
import { useState, useCallback } from 'react';
import { JournalEntryService } from '../services';
import { useToast } from '../../../shared/hooks/useToast';
/**
 * Hook especializado para operaciones masivas de asientos contables
 * Implementa las 5 operaciones principales documentadas en el backend
 */
export var useBulkJournalEntryOperations = function () {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var _c = useToast(), success = _c.success, showError = _c.error;
    // ==========================================
    // APROBACIÓN MASIVA
    // ==========================================
    var validateBulkApprove = useCallback(function (entryIds) { return __awaiter(void 0, void 0, void 0, function () {
        var errorMessage;
        return __generator(this, function (_a) {
            try {
                setError(null);
                // Por ahora usar un placeholder hasta que se implemente el endpoint de validación
                // TODO: Implementar JournalEntryService.validateBulkApprove(entryIds)
                return [2 /*return*/, entryIds.map(function (id) { return ({
                        journal_entry_id: id,
                        journal_entry_number: "JE-".concat(id.slice(0, 8)),
                        journal_entry_description: 'Asiento contable',
                        current_status: 'DRAFT',
                        can_approve: true,
                        errors: [],
                        warnings: []
                    }); })];
            }
            catch (err) {
                errorMessage = err instanceof Error ? err.message : 'Error al validar aprobación masiva';
                setError(errorMessage);
                throw err;
            }
            return [2 /*return*/];
        });
    }); }, []);
    var bulkApprove = useCallback(function (entryIds_1, reason_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([entryIds_1, reason_1], args_1, true), void 0, function (entryIds, reason, force) {
            var result, err_1, errorMessage;
            if (force === void 0) { force = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, JournalEntryService.bulkApproveEntries(entryIds, reason, force)];
                    case 2:
                        result = _a.sent();
                        success("".concat(result.total_approved, " de ").concat(result.total_requested, " asientos aprobados exitosamente"));
                        if (result.total_failed > 0) {
                            showError("".concat(result.total_failed, " asientos no pudieron ser aprobados"));
                        }
                        // Adaptar la respuesta al tipo esperado
                        return [2 /*return*/, {
                                operation_id: crypto.randomUUID(),
                                total_requested: result.total_requested,
                                total_processed: result.total_approved,
                                total_failed: result.total_failed,
                                execution_time_ms: 0,
                                processed_entries: [],
                                failed_entries: [],
                                operation_summary: {
                                    reason: reason,
                                    executed_by: 'current_user',
                                    executed_at: new Date().toISOString()
                                },
                                total_approved: result.total_approved,
                                approved_entries: []
                            }];
                    case 3:
                        err_1 = _a.sent();
                        errorMessage = err_1 instanceof Error ? err_1.message : 'Error en la aprobación masiva';
                        setError(errorMessage);
                        showError(errorMessage);
                        throw err_1;
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [success, showError]);
    // ==========================================
    // CONTABILIZACIÓN MASIVA
    // ==========================================
    var validateBulkPost = useCallback(function (entryIds) { return __awaiter(void 0, void 0, void 0, function () {
        var validations, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    return [4 /*yield*/, JournalEntryService.validateBulkPost({
                            journal_entry_ids: entryIds,
                            reason: 'Validación para contabilización masiva'
                        })];
                case 1:
                    validations = _a.sent();
                    return [2 /*return*/, [validations]]; // Wrap single validation in array
                case 2:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Error al validar contabilización masiva';
                    setError(errorMessage);
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkPost = useCallback(function (entryIds_1, reason_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([entryIds_1, reason_1], args_1, true), void 0, function (entryIds, reason, force) {
            var data, result, err_3, errorMessage;
            if (force === void 0) { force = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        data = {
                            journal_entry_ids: entryIds,
                            reason: reason,
                            force_post: force
                        };
                        return [4 /*yield*/, JournalEntryService.bulkPostEntries(data)];
                    case 2:
                        result = _a.sent();
                        success("".concat(result.total_posted, " de ").concat(result.total_requested, " asientos contabilizados exitosamente"));
                        if (result.total_failed > 0) {
                            showError("".concat(result.total_failed, " asientos no pudieron ser contabilizados"));
                        }
                        return [2 /*return*/, result];
                    case 3:
                        err_3 = _a.sent();
                        errorMessage = err_3 instanceof Error ? err_3.message : 'Error en la contabilización masiva';
                        setError(errorMessage);
                        showError(errorMessage);
                        throw err_3;
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [success, showError]);
    // ==========================================
    // CANCELACIÓN MASIVA
    // ==========================================
    var validateBulkCancel = useCallback(function (entryIds) { return __awaiter(void 0, void 0, void 0, function () {
        var validations, err_4, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    return [4 /*yield*/, JournalEntryService.validateBulkCancel({
                            journal_entry_ids: entryIds,
                            reason: 'Validación para cancelación masiva'
                        })];
                case 1:
                    validations = _a.sent();
                    return [2 /*return*/, [validations]]; // Wrap single validation in array
                case 2:
                    err_4 = _a.sent();
                    errorMessage = err_4 instanceof Error ? err_4.message : 'Error al validar cancelación masiva';
                    setError(errorMessage);
                    throw err_4;
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkCancel = useCallback(function (entryIds_1, reason_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([entryIds_1, reason_1], args_1, true), void 0, function (entryIds, reason, force) {
            var data, result, err_5, errorMessage;
            if (force === void 0) { force = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        data = {
                            journal_entry_ids: entryIds,
                            reason: reason,
                            force_cancel: force
                        };
                        return [4 /*yield*/, JournalEntryService.bulkCancelEntries(data)];
                    case 2:
                        result = _a.sent();
                        success("".concat(result.total_cancelled, " de ").concat(result.total_requested, " asientos cancelados exitosamente"));
                        if (result.total_failed > 0) {
                            showError("".concat(result.total_failed, " asientos no pudieron ser cancelados"));
                        }
                        return [2 /*return*/, result];
                    case 3:
                        err_5 = _a.sent();
                        errorMessage = err_5 instanceof Error ? err_5.message : 'Error en la cancelación masiva';
                        setError(errorMessage);
                        showError(errorMessage);
                        throw err_5;
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [success, showError]);
    // ==========================================
    // REVERSIÓN MASIVA
    // ==========================================
    var validateBulkReverse = useCallback(function (entryIds, reversalDate) { return __awaiter(void 0, void 0, void 0, function () {
        var validations, err_6, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    return [4 /*yield*/, JournalEntryService.validateBulkReverse({
                            journal_entry_ids: entryIds,
                            reason: 'Validación para reversión masiva',
                            reversal_date: reversalDate
                        })];
                case 1:
                    validations = _a.sent();
                    return [2 /*return*/, [validations]]; // Wrap single validation in array
                case 2:
                    err_6 = _a.sent();
                    errorMessage = err_6 instanceof Error ? err_6.message : 'Error al validar reversión masiva';
                    setError(errorMessage);
                    throw err_6;
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkReverse = useCallback(function (entryIds_1, reason_1, reversalDate_1) {
        var args_1 = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args_1[_i - 3] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([entryIds_1, reason_1, reversalDate_1], args_1, true), void 0, function (entryIds, reason, reversalDate, force) {
            var data, result, err_7, errorMessage;
            if (force === void 0) { force = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        data = {
                            journal_entry_ids: entryIds,
                            reason: reason,
                            reversal_date: reversalDate,
                            force_reverse: force
                        };
                        return [4 /*yield*/, JournalEntryService.bulkReverseEntries(data)];
                    case 2:
                        result = _a.sent();
                        success("".concat(result.total_reversed, " de ").concat(result.total_requested, " asientos revertidos exitosamente"));
                        if (result.total_failed > 0) {
                            showError("".concat(result.total_failed, " asientos no pudieron ser revertidos"));
                        }
                        if (result.created_reversal_entries && result.created_reversal_entries.length > 0) {
                            success("Se crearon ".concat(result.created_reversal_entries.length, " asientos de reversi\u00F3n"));
                        }
                        return [2 /*return*/, result];
                    case 3:
                        err_7 = _a.sent();
                        errorMessage = err_7 instanceof Error ? err_7.message : 'Error en la reversión masiva';
                        setError(errorMessage);
                        showError(errorMessage);
                        throw err_7;
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [success, showError]);
    // ==========================================
    // RESTABLECIMIENTO A BORRADOR MASIVO
    // ==========================================
    var validateBulkResetToDraft = useCallback(function (entryIds) { return __awaiter(void 0, void 0, void 0, function () {
        var validations, err_8, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setError(null);
                    return [4 /*yield*/, JournalEntryService.validateBulkResetToDraft({
                            journal_entry_ids: entryIds,
                            reason: 'Validación para restablecimiento masivo a borrador'
                        })];
                case 1:
                    validations = _a.sent();
                    return [2 /*return*/, [validations]]; // Wrap single validation in array
                case 2:
                    err_8 = _a.sent();
                    errorMessage = err_8 instanceof Error ? err_8.message : 'Error al validar restablecimiento masivo';
                    setError(errorMessage);
                    throw err_8;
                case 3: return [2 /*return*/];
            }
        });
    }); }, []);
    var bulkResetToDraft = useCallback(function (entryIds_1, reason_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([entryIds_1, reason_1], args_1, true), void 0, function (entryIds, reason, force) {
            var data, result, err_9, errorMessage;
            if (force === void 0) { force = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        data = {
                            journal_entry_ids: entryIds,
                            reason: reason,
                            force_reset: force
                        };
                        return [4 /*yield*/, JournalEntryService.bulkResetToDraftEntries(data)];
                    case 2:
                        result = _a.sent();
                        success("".concat(result.total_reset, " de ").concat(result.total_requested, " asientos restablecidos a borrador exitosamente"));
                        if (result.total_failed > 0) {
                            showError("".concat(result.total_failed, " asientos no pudieron ser restablecidos"));
                        }
                        return [2 /*return*/, result];
                    case 3:
                        err_9 = _a.sent();
                        errorMessage = err_9 instanceof Error ? err_9.message : 'Error en el restablecimiento masivo';
                        setError(errorMessage);
                        showError(errorMessage);
                        throw err_9;
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }, [success, showError]);
    // ==========================================
    // UTILIDADES Y ESTADOS
    // ==========================================
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    // Calcular resumen de validaciones
    var getValidationSummary = useCallback(function (validations) {
        var valid = validations.filter(function (v) {
            return ('can_approve' in v && v.can_approve) ||
                ('can_post' in v && v.can_post) ||
                ('can_cancel' in v && v.can_cancel) ||
                ('can_reverse' in v && v.can_reverse) ||
                ('can_reset' in v && v.can_reset);
        }).length;
        var invalid = validations.length - valid;
        var totalErrors = validations.reduce(function (sum, v) { return sum + v.errors.length; }, 0);
        var totalWarnings = validations.reduce(function (sum, v) { return sum + v.warnings.length; }, 0);
        return {
            total: validations.length,
            valid: valid,
            invalid: invalid,
            canProceed: valid > 0,
            totalErrors: totalErrors,
            totalWarnings: totalWarnings
        };
    }, []);
    return {
        // Estados
        loading: loading,
        error: error,
        clearError: clearError,
        // Operaciones de aprobación
        validateBulkApprove: validateBulkApprove,
        bulkApprove: bulkApprove,
        // Operaciones de contabilización
        validateBulkPost: validateBulkPost,
        bulkPost: bulkPost,
        // Operaciones de cancelación
        validateBulkCancel: validateBulkCancel,
        bulkCancel: bulkCancel,
        // Operaciones de reversión
        validateBulkReverse: validateBulkReverse,
        bulkReverse: bulkReverse,
        // Operaciones de restablecimiento
        validateBulkResetToDraft: validateBulkResetToDraft,
        bulkResetToDraft: bulkResetToDraft,
        // Utilidades
        getValidationSummary: getValidationSummary
    };
};
export var BULK_OPERATION_CONFIGS = {
    'approve': {
        type: 'approve',
        label: 'Aprobar',
        description: 'Aprobar asientos seleccionados',
        icon: 'check-circle',
        confirmMessage: '¿Está seguro de aprobar los asientos seleccionados?',
        requiresReason: true,
        buttonColor: 'success'
    },
    'post': {
        type: 'post',
        label: 'Contabilizar',
        description: 'Contabilizar asientos aprobados',
        icon: 'save',
        confirmMessage: '¿Está seguro de contabilizar los asientos seleccionados? Esta acción afectará los saldos de las cuentas.',
        requiresReason: true,
        buttonColor: 'primary'
    },
    'cancel': {
        type: 'cancel',
        label: 'Cancelar',
        description: 'Cancelar asientos seleccionados',
        icon: 'x-circle',
        confirmMessage: '¿Está seguro de cancelar los asientos seleccionados?',
        requiresReason: true,
        buttonColor: 'warning'
    },
    'reverse': {
        type: 'reverse',
        label: 'Revertir',
        description: 'Revertir asientos contabilizados',
        icon: 'rotate-ccw',
        confirmMessage: '¿Está seguro de revertir los asientos seleccionados? Se crearán asientos de reversión.',
        requiresReason: true,
        requiresDate: true,
        buttonColor: 'danger'
    },
    'reset-to-draft': {
        type: 'reset-to-draft',
        label: 'Restablecer a Borrador',
        description: 'Restablecer asientos a estado borrador',
        icon: 'refresh-cw',
        confirmMessage: '¿Está seguro de restablecer los asientos seleccionados a borrador?',
        requiresReason: true,
        buttonColor: 'warning'
    }
};
