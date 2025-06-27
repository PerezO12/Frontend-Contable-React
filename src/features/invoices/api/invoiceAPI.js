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
 * API client para el módulo de facturas
 * Implementa todas las llamadas al backend siguiendo IMPLEMENTAR.md
 */
import { apiClient } from '@/shared/api/client';
var API_BASE = '/api/v1/invoices';
var InvoiceAPI = /** @class */ (function () {
    function InvoiceAPI() {
    }
    /**
     * PASO 2 DEL FLUJO ODOO: Crear factura completa con líneas (endpoint principal)
     * Usa InvoiceCreateWithLines según IMPLEMENTAR.md
     */
    InvoiceAPI.createInvoiceWithLines = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post(API_BASE, data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Crear solo encabezado de factura (para casos especiales)
     */
    InvoiceAPI.createInvoiceHeaderOnly = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/header-only"), data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener factura por ID
     */
    InvoiceAPI.getInvoice = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(API_BASE, "/").concat(id))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener factura con líneas completas
     */
    InvoiceAPI.getInvoiceWithLines = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(API_BASE, "/").concat(id, "/with-lines"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Listar facturas con filtros avanzados
     * Ahora incluye todas las nuevas capacidades de búsqueda del backend
     */
    InvoiceAPI.getInvoices = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters) {
                            // Filtros básicos
                            if (filters.status)
                                params.append('status', filters.status);
                            if (filters.invoice_type)
                                params.append('invoice_type', filters.invoice_type);
                            if (filters.third_party_id)
                                params.append('third_party_id', filters.third_party_id);
                            if (filters.currency_code)
                                params.append('currency_code', filters.currency_code);
                            if (filters.created_by_id)
                                params.append('created_by_id', filters.created_by_id);
                            // Filtros de fecha flexibles
                            if (filters.date_from)
                                params.append('date_from', filters.date_from);
                            if (filters.date_to)
                                params.append('date_to', filters.date_to);
                            // Búsquedas de texto parciales (nuevas)
                            if (filters.invoice_number)
                                params.append('invoice_number', filters.invoice_number);
                            if (filters.third_party_name)
                                params.append('third_party_name', filters.third_party_name);
                            if (filters.description)
                                params.append('description', filters.description);
                            if (filters.reference)
                                params.append('reference', filters.reference);
                            // Filtros de monto (nuevos)
                            if (filters.amount_from !== undefined)
                                params.append('amount_from', filters.amount_from.toString());
                            if (filters.amount_to !== undefined)
                                params.append('amount_to', filters.amount_to.toString());
                            // Ordenamiento (nuevos)
                            if (filters.sort_by)
                                params.append('sort_by', filters.sort_by);
                            if (filters.sort_order)
                                params.append('sort_order', filters.sort_order);
                            // Paginación
                            if (filters.page)
                                params.append('page', filters.page.toString());
                            if (filters.size)
                                params.append('size', filters.size.toString());
                            // Legacy search (mantener compatibilidad)
                            if (filters.search)
                                params.append('search', filters.search);
                        }
                        return [4 /*yield*/, apiClient.get("".concat(API_BASE, "?").concat(params.toString()))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Actualizar factura (solo en estado DRAFT)
     */
    InvoiceAPI.updateInvoice = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(API_BASE, "/").concat(id), data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Eliminar factura (solo en estado DRAFT)
     */
    InvoiceAPI.deleteInvoice = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.delete("".concat(API_BASE, "/").concat(id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // ===== BULK OPERATIONS =====
    /**
   * Validar operación bulk antes de ejecutar
   */
    InvoiceAPI.validateBulkOperation = function (operation, invoiceIds) {
        return __awaiter(this, void 0, void 0, function () {
            var params_1, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log('🔍 Validando operación bulk:', { operation: operation, invoiceIds: invoiceIds });
                        params_1 = new URLSearchParams();
                        params_1.append('operation', operation);
                        invoiceIds.forEach(function (id) { return params_1.append('invoice_ids', id); });
                        return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/bulk/validate?").concat(params_1.toString()))];
                    case 1:
                        response = _b.sent();
                        console.log('✅ Validación exitosa:', response.data);
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _b.sent();
                        console.error('❌ Error en validación bulk:');
                        console.error('Operation:', operation);
                        console.error('Invoice IDs:', invoiceIds);
                        console.error('Error completo:', error_1);
                        console.error('Error response:', error_1.response);
                        console.error('Error response data:', (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Contabilizar múltiples facturas en lote (DRAFT → POSTED)
     */
    InvoiceAPI.bulkPostInvoices = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/bulk/post"), data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Cancelar múltiples facturas en lote (POSTED → CANCELLED)
     */
    InvoiceAPI.bulkCancelInvoices = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/bulk/cancel"), data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Restablecer múltiples facturas a borrador (POSTED → DRAFT)
     */
    InvoiceAPI.bulkResetToDraftInvoices = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        console.log('🔄 Enviando request bulk reset-to-draft:', data);
                        return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/bulk/reset-to-draft"), data)];
                    case 1:
                        response = _d.sent();
                        console.log('✅ Respuesta exitosa bulk reset-to-draft:', response.data);
                        return [2 /*return*/, response.data];
                    case 2:
                        error_2 = _d.sent();
                        console.error('❌ Error en bulk reset-to-draft:');
                        console.error('Request data:', data);
                        console.error('Error completo:', error_2);
                        console.error('Error response:', error_2.response);
                        console.error('Error response data:', (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data);
                        console.error('Error response status:', (_b = error_2.response) === null || _b === void 0 ? void 0 : _b.status);
                        console.error('Error response headers:', (_c = error_2.response) === null || _c === void 0 ? void 0 : _c.headers);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Eliminar múltiples facturas en lote (solo DRAFT)
     */
    InvoiceAPI.bulkDeleteInvoices = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.delete("".concat(API_BASE, "/bulk/delete"), { data: data })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * PASO 3 DEL FLUJO ODOO: Contabilizar factura (DRAFT → POSTED)
     * Genera asiento contable automáticamente
     * Usa el endpoint específico POST /invoices/{id}/post
     */
    InvoiceAPI.postInvoice = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/").concat(id, "/post"), data || {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Cancelar factura (POSTED → CANCELLED)
     * Revierte el asiento contable
     * Usa el endpoint específico POST /invoices/{id}/cancel
     */
    InvoiceAPI.cancelInvoice = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/").concat(id, "/cancel"), data || {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Restablecer a borrador (ANY → DRAFT)
     * Usa el endpoint específico POST /invoices/{id}/reset-to-draft
     */
    InvoiceAPI.resetToDraft = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/").concat(id, "/reset-to-draft"), data || {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Ejecutar acción de workflow
     */
    InvoiceAPI.executeWorkflowAction = function (id, action) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (action.action) {
                    case 'post':
                        return [2 /*return*/, this.postInvoice(id, {
                                notes: action.notes,
                                posting_date: action.posting_date,
                                force_post: action.force_post
                            })];
                    case 'cancel':
                        return [2 /*return*/, this.cancelInvoice(id, { reason: action.notes })];
                    case 'reset_to_draft':
                        return [2 /*return*/, this.resetToDraft(id, { reason: action.notes })];
                    default:
                        throw new Error("Acci\u00F3n no v\u00E1lida: ".concat(action.action));
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Obtener resumen estadístico de facturas
     */
    InvoiceAPI.getInvoiceSummary = function (filters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams();
                        if (filters) {
                            Object.entries(filters).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined && value !== null && value !== '') {
                                    params.append(key, String(value));
                                }
                            });
                        }
                        return [4 /*yield*/, apiClient.get("".concat(API_BASE, "/summary/statistics?").concat(params.toString()))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener asiento contable de una factura contabilizada
     */
    InvoiceAPI.getInvoiceJournalEntry = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(API_BASE, "/").concat(id, "/journal-entry"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * NUEVO: Vista previa de cómo se dividirán los pagos según payment terms (Flujo Odoo)
     */
    InvoiceAPI.getPaymentSchedulePreview = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(API_BASE, "/").concat(id, "/payment-schedule-preview"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * NUEVO: Validar condiciones de pago para uso en facturas (Flujo Odoo)
     */
    InvoiceAPI.validatePaymentTerms = function (paymentTermsId) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(API_BASE, "/payment-terms/").concat(paymentTermsId, "/validate"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Obtener pagos aplicados a una factura
     */
    InvoiceAPI.getInvoicePayments = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.get("".concat(API_BASE, "/").concat(id, "/payments"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Duplicar factura
     */
    InvoiceAPI.duplicateInvoice = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/").concat(id, "/duplicate"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Métodos legacy para compatibilidad con el store existente
     */
    InvoiceAPI.createInvoice = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Alias para createInvoiceWithLines
                return [2 /*return*/, this.createInvoiceWithLines(data)];
            });
        });
    };
    /**
     * Confirmar factura (DRAFT → PENDING) - método legacy
     * Nota: En el flujo actual se usa directamente postInvoice
     */
    InvoiceAPI.confirmInvoice = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/").concat(id, "/confirm"), data || {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Marcar como pagada - método para marcar factura como pagada
     * Usa endpoint específico POST /invoices/{id}/mark-paid
     */
    InvoiceAPI.markAsPaid = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/").concat(id, "/mark-paid"), data || {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Validar datos de factura antes de crear/actualizar
     */
    InvoiceAPI.validateInvoiceData = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/validate"), data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Calcular totales de factura
     */
    InvoiceAPI.calculateInvoiceTotals = function (lines) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.post("".concat(API_BASE, "/calculate-totals"), { lines: lines })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return InvoiceAPI;
}());
export { InvoiceAPI };
// Alias para compatibilidad
export var invoiceAPI = InvoiceAPI;
