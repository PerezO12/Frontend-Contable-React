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
import { apiClient } from '../../../shared/api/client';
import { ExportService } from '../../../shared/services/exportService';
import { JournalEntryStatus } from '../types';
/**
 * Servicio para operaciones relacionadas con asientos contables
 * Maneja todas las interacciones con el API backend
 *
 * VERIFICADO: Los endpoints bulk están alineados con la documentación actualizada:
 * - POST /api/v1/journal-entries/bulk-approve (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-post (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-cancel (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-reverse (usa 'journal_entry_ids')
 * - POST /api/v1/journal-entries/bulk-reset-to-draft (usa 'journal_entry_ids')
 *
 * Fecha de última verificación: 2025-06-13
 */
var JournalEntryService = /** @class */ (function () {
    function JournalEntryService() {
    }
    /**
     * Obtener lista de asientos contables con filtros
     */ JournalEntryService.getJournalEntries = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, url, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo asientos contables con filtros:', filters);
                        params = new URLSearchParams();
                        // Siempre incluir campos adicionales necesarios
                        params.append('include_earliest_due_date', 'true');
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    // Manejar arrays (como transaction_origin)
                                    if (Array.isArray(value)) {
                                        value.forEach(function (item) {
                                            params.append(key, String(item));
                                        });
                                    }
                                    else {
                                        params.append(key, String(value));
                                    }
                                }
                            });
                        }
                        url = "".concat(this.BASE_URL, "?").concat(params);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get(url)];
                    case 2:
                        response = _a.sent();
                        console.log('Respuesta del servidor:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error al obtener asientos contables:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener un asiento contable por ID
     * Incluye información expandida de cuentas, terceros, productos y términos de pago
     */
    JournalEntryService.getJournalEntryById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, journalEntry, error_2;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Obteniendo asiento contable por ID:', id);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/").concat(id))];
                    case 2:
                        response = _b.sent();
                        journalEntry = response.data;
                        console.log('Asiento contable obtenido:', {
                            id: journalEntry.id,
                            number: journalEntry.number,
                            status: journalEntry.status,
                            is_balanced: journalEntry.is_balanced,
                            can_be_posted: journalEntry.can_be_posted,
                            can_be_edited: journalEntry.can_be_edited,
                            lines_count: ((_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.length) || 0
                        });
                        // Procesar las líneas para agregar información calculada
                        if (journalEntry.lines) {
                            journalEntry.lines = journalEntry.lines.map(function (line) { return (__assign(__assign({}, line), { 
                                // Asegurar que movement_type esté definido
                                movement_type: line.movement_type || (parseFloat(line.debit_amount) > 0 ? 'debit' : 'credit'), 
                                // Asegurar que amount esté definido
                                amount: line.amount || (parseFloat(line.debit_amount) > 0 ? line.debit_amount : line.credit_amount) })); });
                        }
                        return [2 /*return*/, journalEntry];
                    case 3:
                        error_2 = _b.sent();
                        console.error('Error al obtener asiento contable:', error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener un asiento contable por número
     */
    JournalEntryService.getJournalEntryByNumber = function (number) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo asiento contable por número:', number);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/by-number/").concat(encodeURIComponent(number)))];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable obtenido:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_3 = _a.sent();
                        console.error('Error al obtener asiento contable por número:', error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Transforma los datos del formulario a la estructura que espera el backend
     */
    JournalEntryService.transformFormDataToBackend = function (data) {
        console.log('Transformando datos del formulario al formato del backend:', data);
        // Transformar líneas para incluir todos los campos opcionales
        var transformedLines = data.lines.map(function (line) {
            var transformedLine = {
                account_id: line.account_id,
                debit_amount: typeof line.debit_amount === 'string' ? parseFloat(line.debit_amount) || 0 : line.debit_amount,
                credit_amount: typeof line.credit_amount === 'string' ? parseFloat(line.credit_amount) || 0 : line.credit_amount
            }; // Campos opcionales - solo incluir si tienen valor
            if (line.third_party_id)
                transformedLine.third_party_id = line.third_party_id;
            if (line.cost_center_id)
                transformedLine.cost_center_id = line.cost_center_id;
            if (line.reference)
                transformedLine.reference = line.reference;
            if (line.product_id)
                transformedLine.product_id = line.product_id;
            if (line.quantity)
                transformedLine.quantity = typeof line.quantity === 'string' ? parseFloat(line.quantity) : line.quantity;
            if (line.unit_price)
                transformedLine.unit_price = typeof line.unit_price === 'string' ? parseFloat(line.unit_price) : line.unit_price;
            if (line.discount_percentage)
                transformedLine.discount_percentage = typeof line.discount_percentage === 'string' ? parseFloat(line.discount_percentage) : line.discount_percentage;
            if (line.discount_amount)
                transformedLine.discount_amount = typeof line.discount_amount === 'string' ? parseFloat(line.discount_amount) : line.discount_amount;
            if (line.tax_percentage)
                transformedLine.tax_percentage = typeof line.tax_percentage === 'string' ? parseFloat(line.tax_percentage) : line.tax_percentage;
            if (line.tax_amount)
                transformedLine.tax_amount = typeof line.tax_amount === 'string' ? parseFloat(line.tax_amount) : line.tax_amount;
            if (line.invoice_date)
                transformedLine.invoice_date = line.invoice_date;
            // IMPORTANTE: Solo incluir payment_terms_id O due_date, nunca ambos
            if (line.payment_terms_id) {
                transformedLine.payment_terms_id = line.payment_terms_id;
                // Si hay payment_terms_id, NO incluir due_date (se calcula automáticamente)
            }
            else if (line.due_date) {
                transformedLine.due_date = line.due_date;
                // Solo incluir due_date si NO hay payment_terms_id
            }
            return transformedLine;
        });
        // Estructura principal del asiento
        var transformedData = {
            entry_date: data.entry_date,
            reference: data.reference,
            description: data.description,
            entry_type: data.entry_type || 'manual',
            lines: transformedLines
        };
        // Campos opcionales del asiento principal
        if (data.transaction_origin)
            transformedData.transaction_origin = data.transaction_origin;
        if (data.notes)
            transformedData.notes = data.notes;
        if (data.external_reference)
            transformedData.external_reference = data.external_reference;
        console.log('Datos transformados para el backend:', JSON.stringify(transformedData, null, 2));
        return transformedData;
    };
    /**
     * Crear un nuevo asiento contable
     */
    JournalEntryService.createJournalEntry = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var transformedData, response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Creando asiento contable:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        transformedData = this.transformFormDataToBackend(data);
                        return [4 /*yield*/, apiClient.post(this.BASE_URL, transformedData)];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable creado:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error al crear asiento contable:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Actualizar un asiento contable existente
     */
    JournalEntryService.updateJournalEntry = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var transformedData, response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Actualizando asiento contable:', id, data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        transformedData = this.transformFormDataToBackend(data);
                        return [4 /*yield*/, apiClient.put("".concat(this.BASE_URL, "/").concat(id), transformedData)];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable actualizado:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_5 = _a.sent();
                        console.error('Error al actualizar asiento contable:', error_5);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Eliminar un asiento contable
     */
    JournalEntryService.deleteJournalEntry = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Eliminando asiento contable:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        data = reason ? { reason: reason } : {};
                        return [4 /*yield*/, apiClient.delete("".concat(this.BASE_URL, "/").concat(id), { data: data })];
                    case 2:
                        _a.sent();
                        console.log('Asiento contable eliminado exitosamente');
                        return [3 /*break*/, 4];
                    case 3:
                        error_6 = _a.sent();
                        console.error('Error al eliminar asiento contable:', error_6);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Aprobar un asiento contable
     */
    JournalEntryService.approveJournalEntry = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Aprobando asiento contable:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        data = reason ? { reason: reason } : {};
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/").concat(id, "/approve"), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable aprobado:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_7 = _a.sent();
                        console.error('Error al aprobar asiento contable:', error_7);
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Contabilizar un asiento contable
     */
    JournalEntryService.postJournalEntry = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var data, response, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Contabilizando asiento contable:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        data = reason ? { reason: reason } : {};
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/").concat(id, "/post"), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable contabilizado:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_8 = _a.sent();
                        console.error('Error al contabilizar asiento contable:', error_8);
                        throw error_8;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancelar un asiento contable
     */
    JournalEntryService.cancelJournalEntry = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Cancelando asiento contable:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/").concat(id, "/cancel"), { reason: reason })];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable cancelado:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_9 = _a.sent();
                        console.error('Error al cancelar asiento contable:', error_9);
                        throw error_9;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Revertir un asiento contable
     */
    JournalEntryService.reverseJournalEntry = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Revirtiendo asiento contable:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/").concat(id, "/reverse"), { reason: reason })];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable revertido:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_10 = _a.sent();
                        console.error('Error al revertir asiento contable:', error_10);
                        throw error_10;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Restablecer un asiento contable a borrador
     */
    JournalEntryService.resetJournalEntryToDraft = function (id, reason) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Restableciendo asiento contable a borrador:', id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/").concat(id, "/reset-to-draft"), { reason: reason })];
                    case 2:
                        response = _a.sent();
                        console.log('Asiento contable restablecido a borrador:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_11 = _a.sent();
                        console.error('Error al restablecer asiento contable a borrador:', error_11);
                        throw error_11;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener estadísticas de asientos contables
     */
    JournalEntryService.getJournalEntryStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Obteniendo estadísticas de asientos contables');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.get("".concat(this.BASE_URL, "/statistics"))];
                    case 2:
                        response = _a.sent();
                        console.log('Estadísticas obtenidas:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_12 = _a.sent();
                        console.error('Error al obtener estadísticas:', error_12);
                        throw error_12;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // OPERACIONES MASIVAS (BULK)
    // ===============================
    /**
     * Validar eliminación masiva de asientos contables
     */
    JournalEntryService.validateBulkDelete = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando eliminación masiva:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/validate-deletion"), data.journal_entry_ids)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación de eliminación masiva:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_13 = _a.sent();
                        console.error('Error al validar eliminación masiva:', error_13);
                        throw error_13;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Eliminar múltiples asientos contables
     */
    JournalEntryService.bulkDeleteJournalEntries = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Eliminando múltiples asientos contables:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-delete"), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Eliminación masiva completada:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_14 = _a.sent();
                        console.error('Error en eliminación masiva:', error_14);
                        throw error_14;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Aprobar múltiples asientos contables
     */
    JournalEntryService.bulkApproveEntries = function (entryIds, reason, forceApprove) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData, response, error_15;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        console.log('Aprobando múltiples asientos:', entryIds, 'Razón:', reason, 'Force Approve:', forceApprove);
                        if (!entryIds || entryIds.length === 0) {
                            throw new Error('No se proporcionaron asientos para aprobar');
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        requestData = {
                            journal_entry_ids: entryIds,
                            reason: reason || 'Aprobación masiva',
                            force_approve: forceApprove || false
                        };
                        console.log('Datos enviados al endpoint:', requestData);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-approve"), requestData)];
                    case 2:
                        response = _g.sent();
                        console.log('Respuesta del endpoint de aprobación:', response.data);
                        return [2 /*return*/, {
                                total_requested: response.data.total_requested || entryIds.length,
                                total_approved: response.data.total_approved || 0,
                                total_failed: response.data.total_failed || 0,
                                successful_entries: response.data.approved_entries || [],
                                failed_entries: ((_a = response.data.failed_entries) === null || _a === void 0 ? void 0 : _a.map(function (item) {
                                    var _a;
                                    return ({
                                        id: item.journal_entry_id,
                                        error: ((_a = item.errors) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Error desconocido'
                                    });
                                })) || []
                            }];
                    case 3:
                        error_15 = _g.sent();
                        console.error('Error en aprobación masiva:', error_15);
                        console.error('Status:', (_b = error_15.response) === null || _b === void 0 ? void 0 : _b.status);
                        console.error('URL:', (_c = error_15.config) === null || _c === void 0 ? void 0 : _c.url);
                        console.error('Método:', (_d = error_15.config) === null || _d === void 0 ? void 0 : _d.method);
                        console.error('Datos enviados:', (_e = error_15.config) === null || _e === void 0 ? void 0 : _e.data);
                        console.error('Respuesta del servidor:', (_f = error_15.response) === null || _f === void 0 ? void 0 : _f.data);
                        throw error_15;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validar aprobación masiva de asientos contables
     */
    JournalEntryService.validateBulkApprove = function (entryIds) {
        return __awaiter(this, void 0, void 0, function () {
            var requestData, response, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando aprobación masiva:', entryIds);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        requestData = { journal_entry_ids: entryIds };
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-approve/validate"), requestData)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación de aprobación masiva:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_16 = _a.sent();
                        console.error('Error al validar aprobación masiva:', error_16);
                        throw error_16;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Contabilizar múltiples asientos contables (nuevo formato con objeto)
     */
    JournalEntryService.bulkPostEntries = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_17;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log('Contabilizando múltiples asientos con endpoint bulk:', data);
                        console.log('URL completa del endpoint:', "".concat(this.BASE_URL, "/bulk-post"));
                        if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
                            throw new Error('No se proporcionaron asientos para contabilizar');
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        console.log('Datos enviados al endpoint:', data);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-post"), data)];
                    case 2:
                        response = _f.sent();
                        console.log('Respuesta del endpoint de contabilización:', response.data);
                        return [2 /*return*/, {
                                operation_id: response.data.operation_id || 'unknown',
                                total_requested: response.data.total_requested || data.journal_entry_ids.length,
                                total_processed: response.data.total_processed || 0,
                                total_posted: response.data.total_posted || 0,
                                total_failed: response.data.total_failed || 0,
                                execution_time_ms: response.data.execution_time_ms || 0,
                                posted_entries: response.data.posted_entries || [],
                                processed_entries: response.data.processed_entries || [],
                                failed_entries: response.data.failed_entries || [],
                                operation_summary: response.data.operation_summary || {
                                    reason: data.reason || 'Contabilización masiva',
                                    executed_by: 'unknown',
                                    executed_at: new Date().toISOString()
                                }
                            }];
                    case 3:
                        error_17 = _f.sent();
                        console.error('Error en contabilización masiva:', error_17);
                        console.error('Status:', (_a = error_17.response) === null || _a === void 0 ? void 0 : _a.status);
                        console.error('URL:', (_b = error_17.config) === null || _b === void 0 ? void 0 : _b.url);
                        console.error('Método:', (_c = error_17.config) === null || _c === void 0 ? void 0 : _c.method);
                        console.error('Datos enviados:', (_d = error_17.config) === null || _d === void 0 ? void 0 : _d.data);
                        console.error('Respuesta del servidor:', (_e = error_17.response) === null || _e === void 0 ? void 0 : _e.data);
                        throw error_17;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validar contabilización masiva de asientos contables
     */
    JournalEntryService.validateBulkPost = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando contabilización masiva:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-post/validate"), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación de contabilización masiva:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_18 = _a.sent();
                        console.error('Error al validar contabilización masiva:', error_18);
                        throw error_18;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Cancelar múltiples asientos contables (nuevo formato con objeto)
     */
    JournalEntryService.bulkCancelEntries = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_19;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log('Cancelando múltiples asientos con endpoint bulk:', data);
                        console.log('URL completa del endpoint:', "".concat(this.BASE_URL, "/bulk-cancel"));
                        if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
                            throw new Error('No se proporcionaron asientos para cancelar');
                        }
                        if (!data.reason || !data.reason.trim()) {
                            throw new Error('La razón es requerida para cancelar asientos');
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        console.log('Datos enviados al endpoint:', data);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-cancel"), data)];
                    case 2:
                        response = _f.sent();
                        console.log('Respuesta del endpoint de cancelación:', response.data);
                        return [2 /*return*/, {
                                operation_id: response.data.operation_id || 'unknown',
                                total_requested: response.data.total_requested || data.journal_entry_ids.length,
                                total_processed: response.data.total_processed || 0,
                                total_cancelled: response.data.total_cancelled || 0,
                                total_failed: response.data.total_failed || 0,
                                execution_time_ms: response.data.execution_time_ms || 0,
                                cancelled_entries: response.data.cancelled_entries || [],
                                processed_entries: response.data.processed_entries || [],
                                failed_entries: response.data.failed_entries || [],
                                operation_summary: response.data.operation_summary || {
                                    reason: data.reason,
                                    executed_by: 'unknown',
                                    executed_at: new Date().toISOString()
                                }
                            }];
                    case 3:
                        error_19 = _f.sent();
                        console.error('Error en cancelación masiva:', error_19);
                        console.error('Status:', (_a = error_19.response) === null || _a === void 0 ? void 0 : _a.status);
                        console.error('URL:', (_b = error_19.config) === null || _b === void 0 ? void 0 : _b.url);
                        console.error('Método:', (_c = error_19.config) === null || _c === void 0 ? void 0 : _c.method);
                        console.error('Datos enviados:', (_d = error_19.config) === null || _d === void 0 ? void 0 : _d.data);
                        console.error('Respuesta del servidor:', (_e = error_19.response) === null || _e === void 0 ? void 0 : _e.data);
                        throw error_19;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validar cancelación masiva de asientos contables
     */
    JournalEntryService.validateBulkCancel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando cancelación masiva:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-cancel/validate"), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación de cancelación masiva:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_20 = _a.sent();
                        console.error('Error al validar cancelación masiva:', error_20);
                        throw error_20;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Revertir múltiples asientos contables (nuevo formato con objeto)
     */
    JournalEntryService.bulkReverseEntries = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_21;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log('Revirtiendo múltiples asientos con endpoint bulk:', data);
                        console.log('URL completa del endpoint:', "".concat(this.BASE_URL, "/bulk-reverse"));
                        if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
                            throw new Error('No se proporcionaron asientos para revertir');
                        }
                        if (!data.reason || !data.reason.trim()) {
                            throw new Error('La razón es requerida para revertir asientos');
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        console.log('Datos enviados al endpoint:', data);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-reverse"), data)];
                    case 2:
                        response = _f.sent();
                        console.log('Respuesta del endpoint de reversión:', response.data);
                        return [2 /*return*/, {
                                operation_id: response.data.operation_id || 'unknown',
                                total_requested: response.data.total_requested || data.journal_entry_ids.length,
                                total_processed: response.data.total_processed || 0,
                                total_reversed: response.data.total_reversed || 0,
                                total_failed: response.data.total_failed || 0,
                                execution_time_ms: response.data.execution_time_ms || 0,
                                reversed_entries: response.data.reversed_entries || [],
                                created_reversal_entries: response.data.created_reversal_entries || [],
                                processed_entries: response.data.processed_entries || [],
                                failed_entries: response.data.failed_entries || [],
                                operation_summary: response.data.operation_summary || {
                                    reason: data.reason,
                                    executed_by: 'unknown',
                                    executed_at: new Date().toISOString()
                                }
                            }];
                    case 3:
                        error_21 = _f.sent();
                        console.error('Error en reversión masiva:', error_21);
                        console.error('Status:', (_a = error_21.response) === null || _a === void 0 ? void 0 : _a.status);
                        console.error('URL:', (_b = error_21.config) === null || _b === void 0 ? void 0 : _b.url);
                        console.error('Método:', (_c = error_21.config) === null || _c === void 0 ? void 0 : _c.method);
                        console.error('Datos enviados:', (_d = error_21.config) === null || _d === void 0 ? void 0 : _d.data);
                        console.error('Respuesta del servidor:', (_e = error_21.response) === null || _e === void 0 ? void 0 : _e.data);
                        throw error_21;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validar reversión masiva de asientos contables
     */
    JournalEntryService.validateBulkReverse = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando reversión masiva:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-reverse/validate"), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación de reversión masiva:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_22 = _a.sent();
                        console.error('Error al validar reversión masiva:', error_22);
                        throw error_22;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Restablecer múltiples asientos contables a borrador (nuevo formato con objeto)
     */
    JournalEntryService.bulkResetToDraftEntries = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_23;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        console.log('Restableciendo múltiples asientos a borrador con endpoint bulk:', data);
                        console.log('URL completa del endpoint:', "".concat(this.BASE_URL, "/bulk-reset-to-draft"));
                        if (!data.journal_entry_ids || data.journal_entry_ids.length === 0) {
                            throw new Error('No se proporcionaron asientos para restablecer');
                        }
                        if (!data.reason || !data.reason.trim()) {
                            throw new Error('La razón es requerida para restablecer asientos a borrador');
                        }
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        console.log('Datos enviados al endpoint:', data);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-reset-to-draft"), data)];
                    case 2:
                        response = _f.sent();
                        console.log('Respuesta del endpoint de restablecimiento:', response.data);
                        return [2 /*return*/, {
                                operation_id: response.data.operation_id || 'unknown',
                                total_requested: response.data.total_requested || data.journal_entry_ids.length,
                                total_processed: response.data.total_processed || 0,
                                total_reset: response.data.total_reset || 0,
                                total_failed: response.data.total_failed || 0,
                                execution_time_ms: response.data.execution_time_ms || 0,
                                reset_entries: response.data.reset_entries || [],
                                processed_entries: response.data.processed_entries || [],
                                failed_entries: response.data.failed_entries || [],
                                operation_summary: response.data.operation_summary || {
                                    reason: data.reason,
                                    executed_by: 'unknown',
                                    executed_at: new Date().toISOString()
                                }
                            }];
                    case 3:
                        error_23 = _f.sent();
                        console.error('Error en restablecimiento masivo a borrador:', error_23);
                        console.error('Status:', (_a = error_23.response) === null || _a === void 0 ? void 0 : _a.status);
                        console.error('URL:', (_b = error_23.config) === null || _b === void 0 ? void 0 : _b.url);
                        console.error('Método:', (_c = error_23.config) === null || _c === void 0 ? void 0 : _c.method);
                        console.error('Datos enviados:', (_d = error_23.config) === null || _d === void 0 ? void 0 : _d.data);
                        console.error('Respuesta del servidor:', (_e = error_23.response) === null || _e === void 0 ? void 0 : _e.data);
                        throw error_23;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Validar restablecimiento masivo a borrador de asientos contables
     */
    JournalEntryService.validateBulkResetToDraft = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Validando restablecimiento masivo a borrador:', data);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, apiClient.post("".concat(this.BASE_URL, "/bulk-reset-to-draft/validate"), data)];
                    case 2:
                        response = _a.sent();
                        console.log('Validación de restablecimiento masivo a borrador:', response.data);
                        return [2 /*return*/, response.data];
                    case 3:
                        error_24 = _a.sent();
                        console.error('Error al validar restablecimiento masivo a borrador:', error_24);
                        throw error_24;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ===============================
    // MÉTODOS DE COMPATIBILIDAD (LEGACY)
    // ===============================
    /**
     * Alias para bulkResetToDraftEntries con sintaxis legacy
     */
    JournalEntryService.bulkRestoreToDraft = function (entryIds, reason, forceReset) {
        return __awaiter(this, void 0, void 0, function () {
            var data, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        data = {
                            journal_entry_ids: entryIds,
                            reason: reason,
                            force_reset: forceReset || false
                        };
                        return [4 /*yield*/, this.bulkResetToDraftEntries(data)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, {
                                total_requested: result.total_requested,
                                total_restored: result.total_reset,
                                total_failed: result.total_failed,
                                successful_entries: [], // Simplificado para evitar errores de tipo
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
    /**
     * Función unificada para cambio de estado masivo
     */
    JournalEntryService.bulkChangeStatus = function (entryIds, newStatus, reason, forceOperation) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, draftData, draftResult, approveResult, postData, postResult, cancelData, cancelResult;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("Cambiando estado masivo a ".concat(newStatus, ":"), entryIds, 'Force Operation:', forceOperation);
                        _a = newStatus;
                        switch (_a) {
                            case JournalEntryStatus.DRAFT: return [3 /*break*/, 1];
                            case JournalEntryStatus.APPROVED: return [3 /*break*/, 3];
                            case JournalEntryStatus.POSTED: return [3 /*break*/, 5];
                            case JournalEntryStatus.CANCELLED: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 1:
                        if (!reason) {
                            throw new Error('Se requiere una razón para restaurar a borrador');
                        }
                        draftData = {
                            journal_entry_ids: entryIds,
                            reason: reason,
                            force_reset: forceOperation || false
                        };
                        return [4 /*yield*/, this.bulkResetToDraftEntries(draftData)];
                    case 2:
                        draftResult = _e.sent();
                        return [2 /*return*/, {
                                total_requested: draftResult.total_requested,
                                total_updated: draftResult.total_reset,
                                total_failed: draftResult.total_failed,
                                successful_entries: [], // Simplificado para evitar errores de tipo
                                failed_entries: ((_b = draftResult.failed_entries) === null || _b === void 0 ? void 0 : _b.map(function (item) {
                                    var _a;
                                    return ({
                                        id: item.journal_entry_id || 'unknown',
                                        error: ((_a = item.errors) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Error desconocido'
                                    });
                                })) || []
                            }];
                    case 3: return [4 /*yield*/, this.bulkApproveEntries(entryIds, reason, forceOperation || false)];
                    case 4:
                        approveResult = _e.sent();
                        return [2 /*return*/, {
                                total_requested: approveResult.total_requested,
                                total_updated: approveResult.total_approved,
                                total_failed: approveResult.total_failed,
                                successful_entries: approveResult.successful_entries,
                                failed_entries: approveResult.failed_entries
                            }];
                    case 5:
                        postData = {
                            journal_entry_ids: entryIds,
                            reason: reason || 'Contabilización masiva',
                            force_post: forceOperation || false
                        };
                        return [4 /*yield*/, this.bulkPostEntries(postData)];
                    case 6:
                        postResult = _e.sent();
                        return [2 /*return*/, {
                                total_requested: postResult.total_requested,
                                total_updated: postResult.total_posted,
                                total_failed: postResult.total_failed,
                                successful_entries: [], // Simplificado para evitar errores de tipo
                                failed_entries: ((_c = postResult.failed_entries) === null || _c === void 0 ? void 0 : _c.map(function (item) {
                                    var _a;
                                    return ({
                                        id: item.journal_entry_id || 'unknown',
                                        error: ((_a = item.errors) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Error desconocido'
                                    });
                                })) || []
                            }];
                    case 7:
                        if (!reason) {
                            throw new Error('Se requiere una razón para cancelar');
                        }
                        cancelData = {
                            journal_entry_ids: entryIds,
                            reason: reason,
                            force_cancel: forceOperation || false
                        };
                        return [4 /*yield*/, this.bulkCancelEntries(cancelData)];
                    case 8:
                        cancelResult = _e.sent();
                        return [2 /*return*/, {
                                total_requested: cancelResult.total_requested,
                                total_updated: cancelResult.total_cancelled,
                                total_failed: cancelResult.total_failed,
                                successful_entries: [], // Simplificado para evitar errores de tipo
                                failed_entries: ((_d = cancelResult.failed_entries) === null || _d === void 0 ? void 0 : _d.map(function (item) {
                                    var _a;
                                    return ({
                                        id: item.journal_entry_id || 'unknown',
                                        error: ((_a = item.errors) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Error desconocido'
                                    });
                                })) || []
                            }];
                    case 9: throw new Error("Estado no soportado para operaci\u00F3n masiva: ".concat(newStatus));
                }
            });
        });
    };
    // ===============================
    // MÉTODOS DE EXPORTACIÓN
    // ===============================
    /**
     * Exportar asientos contables específicos por IDs usando sistema genérico
     */
    JournalEntryService.exportJournalEntries = function (entryIds_1) {
        return __awaiter(this, arguments, void 0, function (entryIds, format) {
            var exportFormat, blob, error_25;
            if (format === void 0) { format = 'xlsx'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Exportando asientos contables con sistema genérico:', entryIds, 'en formato:', format);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        exportFormat = format === 'xlsx' ? 'xlsx' : format;
                        return [4 /*yield*/, ExportService.exportByIds({
                                table: 'journal_entries',
                                format: exportFormat,
                                ids: entryIds,
                                file_name: ExportService.generateFileName('journal_entries', exportFormat)
                            })];
                    case 2:
                        blob = _a.sent();
                        console.log("Exportaci\u00F3n a ".concat(format.toUpperCase(), " completada con sistema gen\u00E9rico"));
                        return [2 /*return*/, blob];
                    case 3:
                        error_25 = _a.sent();
                        console.error("Error al exportar a ".concat(format.toUpperCase(), ":"), error_25);
                        throw error_25;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exportar asientos contables a Excel
     */ JournalEntryService.exportToExcel = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params_1, url, response, fileName, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Exportando asientos contables a Excel con filtros:', filters);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        params_1 = new URLSearchParams();
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    // Manejar arrays (como transaction_origin)
                                    if (Array.isArray(value)) {
                                        value.forEach(function (item) {
                                            params_1.append(key, String(item));
                                        });
                                    }
                                    else {
                                        params_1.append(key, String(value));
                                    }
                                }
                            });
                        }
                        url = params_1.toString()
                            ? "".concat(this.BASE_URL, "/export/excel?").concat(params_1)
                            : "".concat(this.BASE_URL, "/export/excel");
                        return [4 /*yield*/, apiClient.get(url, { responseType: 'blob' })];
                    case 2:
                        response = _a.sent();
                        fileName = ExportService.generateFileName('asientos-contables', 'xlsx');
                        ExportService.downloadBlob(response.data, fileName);
                        console.log('Exportación a Excel completada');
                        return [3 /*break*/, 4];
                    case 3:
                        error_26 = _a.sent();
                        console.error('Error al exportar a Excel:', error_26);
                        throw error_26;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Exportar asientos contables a PDF
     */ JournalEntryService.exportToPDF = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params_2, url, response, fileName, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Exportando asientos contables a PDF con filtros:', filters);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        params_2 = new URLSearchParams();
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    // Manejar arrays (como transaction_origin)
                                    if (Array.isArray(value)) {
                                        value.forEach(function (item) {
                                            params_2.append(key, String(item));
                                        });
                                    }
                                    else {
                                        params_2.append(key, String(value));
                                    }
                                }
                            });
                        }
                        url = params_2.toString()
                            ? "".concat(this.BASE_URL, "/export/pdf?").concat(params_2)
                            : "".concat(this.BASE_URL, "/export/pdf");
                        return [4 /*yield*/, apiClient.get(url, { responseType: 'blob' })];
                    case 2:
                        response = _a.sent();
                        fileName = ExportService.generateFileName('asientos-contables', 'pdf');
                        ExportService.downloadBlob(response.data, fileName);
                        console.log('Exportación a PDF completada');
                        return [3 /*break*/, 4];
                    case 3:
                        error_27 = _a.sent();
                        console.error('Error al exportar a PDF:', error_27);
                        throw error_27;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ===== MÉTODOS DE UTILIDAD PARA DATOS ENRIQUECIDOS =====
    /**
     * Obtiene los detalles completos de términos de pago para un asiento contable
     * Incluye cronogramas de pago calculados
     */
    JournalEntryService.getEnrichedPaymentTermsForEntry = function (journalEntry) {
        return __awaiter(this, void 0, void 0, function () {
            var paymentTermsMap, PaymentTermsService, paymentTermsIds, _loop_1, this_1, _i, paymentTermsIds_1, paymentTermsId;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        paymentTermsMap = new Map();
                        return [4 /*yield*/, import('../../payment-terms/services/paymentTermsService')];
                    case 1:
                        PaymentTermsService = _c.sent();
                        paymentTermsIds = new Set();
                        (_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.forEach(function (line) {
                            if (line.payment_terms_id) {
                                paymentTermsIds.add(line.payment_terms_id);
                            }
                        });
                        _loop_1 = function (paymentTermsId) {
                            var paymentTerms, sampleLine, calculationRequest, paymentCalculation, error_28, basicInfo;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        _d.trys.push([0, 5, , 6]);
                                        return [4 /*yield*/, PaymentTermsService.PaymentTermsService.getPaymentTermsById(paymentTermsId)];
                                    case 1:
                                        paymentTerms = _d.sent();
                                        sampleLine = (_b = journalEntry.lines) === null || _b === void 0 ? void 0 : _b.find(function (line) { return line.payment_terms_id === paymentTermsId; });
                                        if (!(sampleLine && sampleLine.invoice_date)) return [3 /*break*/, 3];
                                        calculationRequest = {
                                            payment_terms_id: paymentTermsId,
                                            invoice_date: sampleLine.effective_invoice_date || sampleLine.invoice_date,
                                            amount: parseFloat(sampleLine.debit_amount || sampleLine.credit_amount || '0')
                                        };
                                        return [4 /*yield*/, PaymentTermsService.PaymentTermsService.calculatePaymentSchedule(calculationRequest)];
                                    case 2:
                                        paymentCalculation = _d.sent();
                                        paymentTermsMap.set(paymentTermsId, __assign(__assign({}, paymentTerms), { calculation: paymentCalculation, invoice_date: calculationRequest.invoice_date, calculated_final_due_date: paymentCalculation.final_due_date, payment_schedule: paymentCalculation.schedule }));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        // Solo agregar el payment terms sin cálculo si no hay fecha de factura
                                        paymentTermsMap.set(paymentTermsId, __assign(__assign({}, paymentTerms), { calculation: null, invoice_date: null, calculated_final_due_date: null, payment_schedule: [] }));
                                        _d.label = 4;
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        error_28 = _d.sent();
                                        console.error("Error al obtener payment terms ".concat(paymentTermsId, ":"), error_28);
                                        basicInfo = this_1.extractPaymentTermsInfo(journalEntry)
                                            .find(function (pt) { return pt.id === paymentTermsId; });
                                        if (basicInfo) {
                                            paymentTermsMap.set(paymentTermsId, __assign(__assign({}, basicInfo), { calculation: null, error: 'No se pudieron obtener los detalles completos' }));
                                        }
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, paymentTermsIds_1 = paymentTermsIds;
                        _c.label = 2;
                    case 2:
                        if (!(_i < paymentTermsIds_1.length)) return [3 /*break*/, 5];
                        paymentTermsId = paymentTermsIds_1[_i];
                        return [5 /*yield**/, _loop_1(paymentTermsId)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, paymentTermsMap];
                }
            });
        });
    };
    /**
     * Extrae información de productos de las líneas de un asiento contable
     */
    JournalEntryService.extractProductInfo = function (journalEntry) {
        var _a;
        var products = new Map();
        (_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.forEach(function (line) {
            if (line.product_id && line.product_code) {
                products.set(line.product_id, {
                    id: line.product_id,
                    code: line.product_code,
                    name: line.product_name,
                    type: line.product_type,
                    measurement_unit: line.product_measurement_unit,
                    quantity: line.quantity,
                    unit_price: line.unit_price,
                    effective_unit_price: line.effective_unit_price,
                    total_amount: line.gross_amount || line.net_amount
                });
            }
        });
        return Array.from(products.values());
    };
    /**
     * Extrae información de terceros de las líneas de un asiento contable
     */
    JournalEntryService.extractThirdPartyInfo = function (journalEntry) {
        var _a;
        var thirdParties = new Map();
        (_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.forEach(function (line) {
            if (line.third_party_id && line.third_party_code) {
                thirdParties.set(line.third_party_id, {
                    id: line.third_party_id,
                    code: line.third_party_code,
                    name: line.third_party_name,
                    document_type: line.third_party_document_type,
                    document_number: line.third_party_document_number,
                    tax_id: line.third_party_tax_id,
                    email: line.third_party_email,
                    phone: line.third_party_phone,
                    address: line.third_party_address,
                    city: line.third_party_city,
                    type: line.third_party_type
                });
            }
        });
        return Array.from(thirdParties.values());
    };
    /**
     * Extrae información de términos de pago de las líneas de un asiento contable
     * Versión básica - para información completa usar getEnrichedPaymentTermsForEntry
     */
    JournalEntryService.extractPaymentTermsInfo = function (journalEntry) {
        var _a;
        var paymentTerms = new Map();
        (_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.forEach(function (line) {
            if (line.payment_terms_id && line.payment_terms_code) {
                paymentTerms.set(line.payment_terms_id, {
                    id: line.payment_terms_id,
                    code: line.payment_terms_code,
                    name: line.payment_terms_name,
                    description: line.payment_terms_description,
                    invoice_date: line.effective_invoice_date || line.invoice_date,
                    due_date: line.effective_due_date || line.due_date,
                    // Indicar que estos son datos básicos
                    is_basic_info: true,
                    needs_detailed_calculation: true
                });
            }
        });
        return Array.from(paymentTerms.values());
    };
    /**
     * Obtiene un resumen de cálculos de las líneas de un asiento contable
     */
    JournalEntryService.getCalculationSummary = function (journalEntry) {
        var _a, _b;
        var totalDiscount = 0;
        var totalTaxes = 0;
        var totalNet = 0;
        var totalGross = 0;
        var linesWithProducts = 0;
        (_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.forEach(function (line) {
            if (line.product_id) {
                linesWithProducts++;
                if (line.total_discount) {
                    totalDiscount += parseFloat(line.total_discount);
                }
                if (line.tax_amount) {
                    totalTaxes += parseFloat(line.tax_amount);
                }
                if (line.net_amount) {
                    totalNet += parseFloat(line.net_amount);
                }
                if (line.gross_amount) {
                    totalGross += parseFloat(line.gross_amount);
                }
            }
        });
        return {
            total_discount: totalDiscount.toFixed(2),
            total_taxes: totalTaxes.toFixed(2),
            total_net: totalNet.toFixed(2),
            total_gross: totalGross.toFixed(2),
            lines_with_products: linesWithProducts,
            total_lines: ((_b = journalEntry.lines) === null || _b === void 0 ? void 0 : _b.length) || 0
        };
    };
    /**
     * Valida si un asiento contable está completo y listo para ser contabilizado
     */
    JournalEntryService.validateJournalEntryCompleteness = function (journalEntry) {
        var _a, _b;
        var issues = [];
        // Validar balance
        if (!journalEntry.is_balanced) {
            issues.push('El asiento no está balanceado');
        }
        // Validar que tenga líneas
        if (!journalEntry.lines || journalEntry.lines.length === 0) {
            issues.push('El asiento no tiene líneas');
        }
        // Validar que todas las líneas tengan cuenta
        var linesWithoutAccount = ((_a = journalEntry.lines) === null || _a === void 0 ? void 0 : _a.filter(function (line) { return !line.account_id; })) || [];
        if (linesWithoutAccount.length > 0) {
            issues.push("".concat(linesWithoutAccount.length, " l\u00EDneas sin cuenta asignada"));
        }
        // Validar montos
        var invalidAmounts = ((_b = journalEntry.lines) === null || _b === void 0 ? void 0 : _b.filter(function (line) {
            return parseFloat(line.debit_amount) === 0 && parseFloat(line.credit_amount) === 0;
        })) || [];
        if (invalidAmounts.length > 0) {
            issues.push("".concat(invalidAmounts.length, " l\u00EDneas con montos en cero"));
        }
        return {
            is_valid: issues.length === 0,
            issues: issues,
            can_be_posted: journalEntry.can_be_posted,
            can_be_edited: journalEntry.can_be_edited
        };
    };
    /**
     * Calcula las fechas de vencimiento correctas para una línea de asiento
     * considerando los cronogramas de términos de pago que ya vienen en la respuesta del API
     */ JournalEntryService.calculateCorrectDueDatesForLine = function (line) {
        var _a;
        console.log('🔍 calculateCorrectDueDatesForLine:', {
            line_id: line.id,
            account_code: line.account_code,
            has_payment_schedule: !!line.payment_schedule,
            payment_schedule_length: (_a = line.payment_schedule) === null || _a === void 0 ? void 0 : _a.length,
            payment_schedule: line.payment_schedule,
            due_date: line.due_date,
            effective_due_date: line.effective_due_date,
            payment_terms_id: line.payment_terms_id
        });
        // Solo considerar como "calculado" si hay payment_terms_id Y payment_schedule
        // Si NO hay payment_terms_id, significa que es una fecha manual aunque tenga schedule
        var hasPaymentTerms = line.payment_terms_id && line.payment_terms_id !== null;
        var hasPaymentSchedule = line.payment_schedule && line.payment_schedule.length > 0;
        if (hasPaymentTerms && hasPaymentSchedule) {
            // Fecha calculada usando términos de pago
            var lastPayment = line.payment_schedule[line.payment_schedule.length - 1];
            console.log('✅ Usando cronograma calculado - última fecha:', lastPayment.payment_date);
            return {
                finalDueDate: lastPayment.payment_date,
                paymentSchedule: line.payment_schedule,
                isCalculated: true
            };
        }
        console.log('⚠️ Fecha manual - usando fecha básica');
        // Si no tiene términos de pago, es fecha manual
        return {
            finalDueDate: line.effective_due_date || line.due_date,
            paymentSchedule: hasPaymentSchedule ? line.payment_schedule : [],
            isCalculated: false
        };
    };
    /**
     * Obtiene un resumen de las fechas de vencimiento para todas las líneas de un asiento
     */
    JournalEntryService.getDueDatesSummaryForEntry = function (entry) {
        var _this = this;
        var hasScheduledPayments = false;
        var earliestDueDate = null;
        var latestDueDate = null;
        var totalScheduledPayments = 0;
        entry.lines.forEach(function (line) {
            var dueDateInfo = _this.calculateCorrectDueDatesForLine(line);
            if (dueDateInfo.isCalculated) {
                hasScheduledPayments = true;
                totalScheduledPayments += dueDateInfo.paymentSchedule.length;
            }
            if (dueDateInfo.finalDueDate) {
                if (!earliestDueDate || dueDateInfo.finalDueDate < earliestDueDate) {
                    earliestDueDate = dueDateInfo.finalDueDate;
                }
                if (!latestDueDate || dueDateInfo.finalDueDate > latestDueDate) {
                    latestDueDate = dueDateInfo.finalDueDate;
                }
            }
        });
        return {
            hasScheduledPayments: hasScheduledPayments,
            earliestDueDate: earliestDueDate,
            latestDueDate: latestDueDate,
            totalScheduledPayments: totalScheduledPayments
        };
    };
    JournalEntryService.BASE_URL = '/api/v1/journal-entries';
    return JournalEntryService;
}());
export { JournalEntryService };
