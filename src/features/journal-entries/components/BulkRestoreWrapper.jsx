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
import React from 'react';
import { BulkRestoreModal } from './BulkRestoreModal';
import { restoreToDraftHelper } from '../utils/restoreHelpers';
/**
 * Componente envoltorio para BulkRestoreModal que se encarga de manejar la lógica de restauración
 * sin depender directamente del hook useJournalEntries para evitar problemas de compilación
 */
export var BulkRestoreWrapper = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, selectedEntryIds = _a.selectedEntryIds, onSuccess = _a.onSuccess;
    var handleBulkRestore = function (entryIds_1, reason_1) {
        var args_1 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args_1[_i - 2] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([entryIds_1, reason_1], args_1, true), void 0, function (entryIds, reason, forceReset) {
            var validIds, invalidIds, result;
            var _a;
            if (forceReset === void 0) { forceReset = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('BulkRestoreWrapper - IDs recibidos:', entryIds, 'Force Reset:', forceReset);
                        // Nos aseguramos de que los IDs son un array válido
                        if (!Array.isArray(entryIds) || entryIds.length === 0) {
                            throw new Error('No se proporcionaron asientos válidos para restaurar');
                        }
                        validIds = [];
                        invalidIds = [];
                        entryIds.forEach(function (id) {
                            if (typeof id === 'string' && id.trim()) {
                                validIds.push(id.trim());
                            }
                            else {
                                console.error('ID inválido encontrado:', id);
                                invalidIds.push(String(id));
                            }
                        });
                        // Si hay IDs inválidos, reportar el problema
                        if (invalidIds.length > 0) {
                            console.warn("Se encontraron ".concat(invalidIds.length, " IDs inv\u00E1lidos que ser\u00E1n ignorados"));
                        }
                        // Si no quedan IDs válidos después del filtrado, lanzar un error
                        if (validIds.length === 0) {
                            throw new Error('Ningún ID válido para procesar');
                        }
                        console.log('BulkRestoreWrapper - IDs validados:', validIds);
                        return [4 /*yield*/, restoreToDraftHelper(validIds, reason, forceReset)];
                    case 1:
                        result = _b.sent();
                        // Transform the result to match the expected interface
                        return [2 /*return*/, {
                                total_requested: result.total_requested,
                                total_restored: result.total_reset,
                                total_failed: result.total_failed,
                                successful_entries: [], // Simplified to avoid type issues
                                failed_entries: ((_a = result.failed_entries) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                                    var _a;
                                    return ({
                                        id: item.journal_entry_id || 'unknown',
                                        error: ((_a = item.errors) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Error desconocido'
                                    });
                                })) || []
                            }];
                }
            });
        });
    };
    return (<BulkRestoreModal isOpen={isOpen} onClose={onClose} selectedEntryIds={selectedEntryIds} onBulkRestore={handleBulkRestore} onSuccess={onSuccess}/>);
};
