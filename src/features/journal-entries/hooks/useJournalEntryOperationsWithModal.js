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
import { useState } from 'react';
import { useJournalEntries } from './useJournalEntries';
export var useJournalEntryOperationsWithModal = function () {
    var _a = useState({
        isOpen: false,
        entry: null,
        type: null
    }), modalState = _a[0], setModalState = _a[1];
    var _b = useJournalEntries(), approveEntry = _b.approveEntry, postEntry = _b.postEntry, cancelEntry = _b.cancelEntry, reverseEntry = _b.reverseEntry;
    var handleApprove = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var confirmed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmed = window.confirm("\u00BFEst\u00E1 seguro de que desea aprobar el asiento contable ".concat(entry.number, "?"));
                    if (!confirmed) return [3 /*break*/, 2];
                    return [4 /*yield*/, approveEntry(entry.id)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [2 /*return*/, false];
            }
        });
    }); };
    var handlePost = function (entry) {
        setModalState({
            isOpen: true,
            entry: entry,
            type: 'post'
        });
    };
    var handleCancel = function (entry) {
        setModalState({
            isOpen: true,
            entry: entry,
            type: 'cancel'
        });
    };
    var handleReverse = function (entry) {
        setModalState({
            isOpen: true,
            entry: entry,
            type: 'reverse'
        });
    };
    var handleModalConfirm = function (reason) { return __awaiter(void 0, void 0, void 0, function () {
        var entry, type, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    entry = modalState.entry, type = modalState.type;
                    if (!entry || !type)
                        return [2 /*return*/, false];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, , 10, 11]);
                    _a = type;
                    switch (_a) {
                        case 'post': return [3 /*break*/, 2];
                        case 'cancel': return [3 /*break*/, 4];
                        case 'reverse': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, postEntry(entry.id, reason || undefined)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4: return [4 /*yield*/, cancelEntry(entry.id, reason)];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [4 /*yield*/, reverseEntry(entry.id, reason)];
                case 7: return [2 /*return*/, _b.sent()];
                case 8: return [2 /*return*/, false];
                case 9: return [3 /*break*/, 11];
                case 10:
                    setModalState({ isOpen: false, entry: null, type: null });
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var handleModalClose = function () {
        setModalState({ isOpen: false, entry: null, type: null });
    };
    var getModalConfig = function () {
        var entry = modalState.entry, type = modalState.type;
        if (!entry || !type)
            return null;
        var configs = {
            post: {
                title: 'Contabilizar Asiento',
                description: "\u00BFEst\u00E1 seguro de que desea contabilizar el asiento ".concat(entry.number, "? Esta acci\u00F3n afectar\u00E1 los saldos de las cuentas contables."),
                reasonLabel: 'Razón (opcional)',
                confirmButtonText: 'Contabilizar',
                confirmButtonVariant: 'primary',
                isRequired: false
            },
            cancel: {
                title: 'Cancelar Asiento',
                description: "\u00BFEst\u00E1 seguro de que desea cancelar el asiento ".concat(entry.number, "?"),
                reasonLabel: 'Razón para cancelar',
                confirmButtonText: 'Cancelar Asiento',
                confirmButtonVariant: 'danger',
                isRequired: true
            },
            reverse: {
                title: 'Revertir Asiento',
                description: "\u00BFEst\u00E1 seguro de que desea crear una reversi\u00F3n del asiento ".concat(entry.number, "?"),
                reasonLabel: 'Razón para reversión',
                confirmButtonText: 'Crear Reversión',
                confirmButtonVariant: 'warning',
                isRequired: true
            }
        };
        return configs[type];
    };
    return {
        modalState: modalState.isOpen ? modalState : null,
        modalConfig: getModalConfig(),
        handleApprove: handleApprove,
        handlePost: handlePost,
        handleCancel: handleCancel,
        handleReverse: handleReverse,
        handleModalConfirm: handleModalConfirm,
        handleModalClose: handleModalClose
    };
};
