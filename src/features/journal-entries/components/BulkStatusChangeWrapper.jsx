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
import React from 'react';
import { BulkStatusChangeModal } from './BulkStatusChangeModal';
import { JournalEntryService } from '../services/journalEntryService';
import { JournalEntryStatus } from '../types';
/**
 * Componente envoltorio para BulkStatusChangeModal que se encarga de manejar la lógica de cambio de estado
 * sin depender directamente del hook useJournalEntries para evitar problemas de compilación
 */
export var BulkStatusChangeWrapper = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, selectedEntryIds = _a.selectedEntryIds, onSuccess = _a.onSuccess;
    // Manejador para la operación de cambio de estado masivo
    var handleBulkStatusChange = function (entryIds, newStatus, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var validIds, invalidIds, _a, resetData, postData, cancelData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('BulkStatusChangeWrapper - Cambiando estado:', { entryIds: entryIds, newStatus: newStatus, reason: reason });
                    // Validar que los IDs son un array válido
                    if (!Array.isArray(entryIds) || entryIds.length === 0) {
                        throw new Error('No se proporcionaron asientos válidos para cambiar estado');
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
                    console.log('BulkStatusChangeWrapper - IDs validados:', validIds);
                    _a = newStatus;
                    switch (_a) {
                        case JournalEntryStatus.DRAFT: return [3 /*break*/, 1];
                        case JournalEntryStatus.PENDING: return [3 /*break*/, 3];
                        case JournalEntryStatus.APPROVED: return [3 /*break*/, 5];
                        case JournalEntryStatus.POSTED: return [3 /*break*/, 7];
                        case JournalEntryStatus.CANCELLED: return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 11];
                case 1:
                    if (!reason) {
                        throw new Error('Se requiere una razón para restaurar a borrador');
                    }
                    resetData = {
                        journal_entry_ids: validIds,
                        reason: reason,
                        force_reset: false
                    };
                    return [4 /*yield*/, JournalEntryService.bulkResetToDraftEntries(resetData)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, JournalEntryService.bulkChangeStatus(validIds, JournalEntryStatus.PENDING)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, JournalEntryService.bulkApproveEntries(validIds)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7:
                    postData = {
                        journal_entry_ids: validIds,
                        reason: reason || 'Contabilización masiva',
                        force_post: false
                    };
                    return [4 /*yield*/, JournalEntryService.bulkPostEntries(postData)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9:
                    if (!reason) {
                        throw new Error('Se requiere una razón para cancelar asientos');
                    }
                    cancelData = {
                        journal_entry_ids: validIds,
                        reason: reason,
                        force_cancel: false
                    };
                    return [4 /*yield*/, JournalEntryService.bulkCancelEntries(cancelData)];
                case 10: return [2 /*return*/, _b.sent()];
                case 11: throw new Error("Estado no v\u00E1lido: ".concat(newStatus));
            }
        });
    }); };
    return (<BulkStatusChangeModal isOpen={isOpen} onClose={onClose} selectedEntryIds={selectedEntryIds} onChangeStatus={handleBulkStatusChange} onSuccess={onSuccess}/>);
};
