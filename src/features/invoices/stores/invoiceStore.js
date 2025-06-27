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
/**
 * Store para el manejo de estado de facturas usando Zustand
 * Implementa el flujo completo de Odoo para facturas
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { convertInvoiceResponseToLegacy, convertInvoiceListResponseToLegacy, convertInvoiceWithLinesToLegacy, convertInvoiceResponseToLegacyWithLines } from '../types';
import { InvoiceAPI } from '../api/invoiceAPI';
/**
 * Transforma datos del formato legacy del frontend al formato del backend
 */
function transformLegacyToBackendFormat(data) {
    // El tipo ya viene correcto del frontend, solo lo pasamos tal como está
    return {
        invoice_date: data.invoice_date,
        due_date: data.due_date,
        invoice_type: data.invoice_type, // Ya es del tipo correcto
        currency_code: data.currency_code || "USD",
        exchange_rate: data.exchange_rate || 1,
        description: data.description || "",
        notes: data.notes || "",
        invoice_number: "", // Se genera automáticamente en el backend
        third_party_id: data.third_party_id,
        journal_id: undefined, // Opcional, se puede configurar después
        payment_terms_id: data.payment_terms_id, third_party_account_id: undefined, // Opcional, se puede configurar después
        lines: data.lines.map(function (line, index) { return ({
            sequence: index,
            product_id: line.product_id,
            description: line.description,
            quantity: line.quantity,
            unit_price: line.unit_price,
            discount_percentage: line.discount_percentage || 0,
            account_id: line.account_id,
            cost_center_id: line.cost_center_id,
            // Convertir tax_rate a tax_ids si existe, sino usar tax_ids directamente
            tax_ids: line.tax_rate ? [] : (line.tax_ids || [])
        }); })
    };
}
var DEFAULT_FILTERS = {
    page: 1,
    page_size: 20
};
export var useInvoiceStore = create()(immer(function (set, get) { return ({
    // Estado inicial
    invoices: [],
    currentInvoice: null,
    summary: null,
    loading: false,
    saving: false,
    deleting: false,
    pagination: {
        page: 1,
        page_size: 20,
        total: 0,
        total_pages: 0
    },
    filters: DEFAULT_FILTERS,
    error: null,
    validationErrors: [],
    // Implementación de acciones
    fetchInvoices: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var response, converted_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.loading = true;
                        state.error = null;
                        if (filters) {
                            state.filters = __assign(__assign({}, state.filters), filters);
                        }
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.getInvoices(get().filters)];
                case 2:
                    response = _a.sent();
                    // Asegurar que response existe y tiene la estructura esperada
                    if (!response) {
                        throw new Error('Respuesta vacía del servidor');
                    }
                    converted_1 = convertInvoiceListResponseToLegacy(response);
                    set(function (state) {
                        state.invoices = converted_1.items || [];
                        state.pagination = {
                            page: converted_1.page || 1,
                            page_size: converted_1.page_size || 20,
                            total: converted_1.total || 0,
                            total_pages: converted_1.total_pages || 0
                        };
                        state.loading = false;
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    set(function (state) {
                        state.loading = false;
                        state.error = error_1 instanceof Error ? error_1.message : 'Error al cargar facturas';
                        // Mantener invoices como array vacío en caso de error
                        if (!state.invoices) {
                            state.invoices = [];
                        }
                    });
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    }); }, fetchInvoice: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response, invoice_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.loading = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.getInvoiceWithLines(id)];
                case 2:
                    response = _a.sent();
                    invoice_1 = convertInvoiceWithLinesToLegacy(response);
                    set(function (state) {
                        state.currentInvoice = invoice_1;
                        state.loading = false;
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    set(function (state) {
                        state.loading = false;
                        state.error = error_2 instanceof Error ? error_2.message : 'Error al cargar factura';
                    });
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    createInvoice: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var backendData, response, invoice_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.saving = true;
                        state.error = null;
                        state.validationErrors = [];
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    backendData = transformLegacyToBackendFormat(data);
                    return [4 /*yield*/, InvoiceAPI.createInvoiceWithLines(backendData)];
                case 2:
                    response = _a.sent();
                    invoice_2 = convertInvoiceWithLinesToLegacy(response);
                    set(function (state) {
                        state.invoices.unshift(invoice_2);
                        state.currentInvoice = invoice_2;
                        state.saving = false;
                    });
                    return [2 /*return*/, invoice_2];
                case 3:
                    error_3 = _a.sent();
                    set(function (state) {
                        state.saving = false;
                        state.error = error_3 instanceof Error ? error_3.message : 'Error al crear factura';
                    });
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    }); }, updateInvoice: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var id, response, invoice_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.saving = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    id = data.id;
                    if (!id)
                        throw new Error('ID de factura requerido para actualizar');
                    return [4 /*yield*/, InvoiceAPI.updateInvoice(id, data)];
                case 2:
                    response = _a.sent();
                    invoice_3 = __assign(__assign({}, convertInvoiceResponseToLegacy(__assign(__assign({}, response), { lines: [] }))), { lines: [] // Se puede cargar por separado si es necesario
                     });
                    set(function (state) {
                        var _a;
                        var index = state.invoices.findIndex(function (i) { return i.id === invoice_3.id; });
                        if (index !== -1) {
                            state.invoices[index] = invoice_3;
                        }
                        if (((_a = state.currentInvoice) === null || _a === void 0 ? void 0 : _a.id) === invoice_3.id) {
                            state.currentInvoice = invoice_3;
                        }
                        state.saving = false;
                    });
                    return [2 /*return*/, invoice_3];
                case 3:
                    error_4 = _a.sent();
                    set(function (state) {
                        state.saving = false;
                        state.error = error_4 instanceof Error ? error_4.message : 'Error al actualizar factura';
                    });
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    deleteInvoice: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.deleting = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.deleteInvoice(id)];
                case 2:
                    _a.sent();
                    set(function (state) {
                        var _a;
                        state.invoices = state.invoices.filter(function (i) { return i.id !== id; });
                        if (((_a = state.currentInvoice) === null || _a === void 0 ? void 0 : _a.id) === id) {
                            state.currentInvoice = null;
                        }
                        state.deleting = false;
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    set(function (state) {
                        state.deleting = false;
                        state.error = error_5 instanceof Error ? error_5.message : 'Error al eliminar factura';
                    });
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    }); }, duplicateInvoice: function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response, invoice_4, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.saving = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.duplicateInvoice(id)];
                case 2:
                    response = _a.sent();
                    invoice_4 = convertInvoiceResponseToLegacyWithLines(response);
                    set(function (state) {
                        state.invoices.unshift(invoice_4);
                        state.saving = false;
                    });
                    return [2 /*return*/, invoice_4];
                case 3:
                    error_6 = _a.sent();
                    set(function (state) {
                        state.saving = false;
                        state.error = error_6 instanceof Error ? error_6.message : 'Error al duplicar factura';
                    });
                    throw error_6;
                case 4: return [2 /*return*/];
            }
        });
    }); }, // Acciones de workflow (Flujo Odoo)
    confirmInvoice: function (id, notes) { return __awaiter(void 0, void 0, void 0, function () {
        var response, invoice_5, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.saving = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.confirmInvoice(id, { notes: notes })];
                case 2:
                    response = _a.sent();
                    invoice_5 = convertInvoiceResponseToLegacyWithLines(response);
                    set(function (state) {
                        var _a;
                        var index = state.invoices.findIndex(function (i) { return i.id === id; });
                        if (index !== -1) {
                            state.invoices[index] = invoice_5;
                        }
                        if (((_a = state.currentInvoice) === null || _a === void 0 ? void 0 : _a.id) === id) {
                            state.currentInvoice = invoice_5;
                        }
                        state.saving = false;
                    });
                    return [2 /*return*/, invoice_5];
                case 3:
                    error_7 = _a.sent();
                    set(function (state) {
                        state.saving = false;
                        state.error = error_7 instanceof Error ? error_7.message : 'Error al confirmar factura';
                    });
                    throw error_7;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    postInvoice: function (id, notes) { return __awaiter(void 0, void 0, void 0, function () {
        var response, invoice_6, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.saving = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.postInvoice(id, { notes: notes })];
                case 2:
                    response = _a.sent();
                    invoice_6 = convertInvoiceResponseToLegacyWithLines(response);
                    set(function (state) {
                        var _a;
                        var index = state.invoices.findIndex(function (i) { return i.id === id; });
                        if (index !== -1) {
                            state.invoices[index] = invoice_6;
                        }
                        if (((_a = state.currentInvoice) === null || _a === void 0 ? void 0 : _a.id) === id) {
                            state.currentInvoice = invoice_6;
                        }
                        state.saving = false;
                    });
                    return [2 /*return*/, invoice_6];
                case 3:
                    error_8 = _a.sent();
                    set(function (state) {
                        state.saving = false;
                        state.error = error_8 instanceof Error ? error_8.message : 'Error al emitir factura';
                    });
                    throw error_8;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    markAsPaid: function (id, notes) { return __awaiter(void 0, void 0, void 0, function () {
        var response, invoice_7, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.saving = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.markAsPaid(id, { notes: notes })];
                case 2:
                    response = _a.sent();
                    invoice_7 = convertInvoiceResponseToLegacyWithLines(response);
                    set(function (state) {
                        var _a;
                        var index = state.invoices.findIndex(function (i) { return i.id === id; });
                        if (index !== -1) {
                            state.invoices[index] = invoice_7;
                        }
                        if (((_a = state.currentInvoice) === null || _a === void 0 ? void 0 : _a.id) === id) {
                            state.currentInvoice = invoice_7;
                        }
                        state.saving = false;
                    });
                    return [2 /*return*/, invoice_7];
                case 3:
                    error_9 = _a.sent();
                    set(function (state) {
                        state.saving = false;
                        state.error = error_9 instanceof Error ? error_9.message : 'Error al marcar como pagada';
                    });
                    throw error_9;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    cancelInvoice: function (id, reason) { return __awaiter(void 0, void 0, void 0, function () {
        var response, invoice_8, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    set(function (state) {
                        state.saving = true;
                        state.error = null;
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, InvoiceAPI.cancelInvoice(id, { reason: reason })];
                case 2:
                    response = _a.sent();
                    invoice_8 = convertInvoiceResponseToLegacyWithLines(response);
                    set(function (state) {
                        var _a;
                        var index = state.invoices.findIndex(function (i) { return i.id === id; });
                        if (index !== -1) {
                            state.invoices[index] = invoice_8;
                        }
                        if (((_a = state.currentInvoice) === null || _a === void 0 ? void 0 : _a.id) === id) {
                            state.currentInvoice = invoice_8;
                        }
                        state.saving = false;
                    });
                    return [2 /*return*/, invoice_8];
                case 3:
                    error_10 = _a.sent();
                    set(function (state) {
                        state.saving = false;
                        state.error = error_10 instanceof Error ? error_10.message : 'Error al cancelar factura';
                    });
                    throw error_10;
                case 4: return [2 /*return*/];
            }
        });
    }); },
    executeWorkflowAction: function (id, action) { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, InvoiceAPI.executeWorkflowAction(id, action)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, convertInvoiceResponseToLegacyWithLines(response)];
            }
        });
    }); },
    // Acciones de UI
    setFilters: function (newFilters) {
        set(function (state) {
            state.filters = __assign(__assign({}, state.filters), newFilters);
        });
    },
    clearFilters: function () {
        set(function (state) {
            state.filters = DEFAULT_FILTERS;
        });
    },
    setCurrentInvoice: function (invoice) {
        set(function (state) {
            state.currentInvoice = invoice;
        });
    },
    clearError: function () {
        set(function (state) {
            state.error = null;
            state.validationErrors = [];
        });
    },
    // Acciones de utilidad
    fetchSummary: function (filters) { return __awaiter(void 0, void 0, void 0, function () {
        var summary_1, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, InvoiceAPI.getInvoiceSummary(filters)];
                case 1:
                    summary_1 = _a.sent();
                    set(function (state) {
                        state.summary = summary_1;
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _a.sent();
                    set(function (state) {
                        state.error = error_11 instanceof Error ? error_11.message : 'Error al cargar resumen';
                    });
                    throw error_11;
                case 3: return [2 /*return*/];
            }
        });
    }); }, validateInvoiceData: function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var validationData, result_1, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    validationData = __assign(__assign({}, data), { lines: data.lines || [] });
                    return [4 /*yield*/, InvoiceAPI.validateInvoiceData(validationData)];
                case 1:
                    result_1 = _a.sent();
                    set(function (state) {
                        state.validationErrors = result_1.errors;
                    });
                    return [2 /*return*/, result_1.is_valid];
                case 2:
                    error_12 = _a.sent();
                    set(function (state) {
                        state.error = error_12 instanceof Error ? error_12.message : 'Error al validar datos';
                    });
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); },
    // Getters computados
    getInvoicesByStatus: function (status) {
        return get().invoices.filter(function (invoice) { return invoice.status === status; });
    },
    getInvoicesByType: function (type) {
        return get().invoices.filter(function (invoice) { return invoice.invoice_type === type; });
    }, getOverdueInvoices: function () {
        // Facturas vencidas: POSTED con fecha vencimiento pasada
        var today = new Date();
        return get().invoices.filter(function (invoice) {
            return invoice.status === 'POSTED' &&
                invoice.due_date &&
                new Date(invoice.due_date) < today;
        });
    }
}); }));
