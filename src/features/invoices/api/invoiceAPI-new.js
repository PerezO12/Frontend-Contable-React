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
     * Listar facturas con filtros
     */
    InvoiceAPI.getInvoices = function (filters) {
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
    /**
     * PASO 3 DEL FLUJO ODOO: Contabilizar factura (DRAFT → POSTED)
     * Genera asiento contable automáticamente
     */
    InvoiceAPI.postInvoice = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(API_BASE, "/").concat(id, "/post"), data || {})];
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
     */
    InvoiceAPI.cancelInvoice = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(API_BASE, "/").concat(id, "/cancel"), data || {})];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Restablecer a borrador (ANY → DRAFT)
     */
    InvoiceAPI.resetToDraft = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(API_BASE, "/").concat(id, "/reset-to-draft"), data || {})];
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
     * Operaciones masivas - Contabilizar múltiples facturas
     */
    InvoiceAPI.bulkPostInvoices = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(API_BASE, "/bulk/post"), { invoice_ids: ids })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * Operaciones masivas - Cancelar múltiples facturas
     */
    InvoiceAPI.bulkCancelInvoices = function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, apiClient.put("".concat(API_BASE, "/bulk/cancel"), { invoice_ids: ids })];
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
