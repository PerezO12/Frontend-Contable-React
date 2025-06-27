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
 * Hook personalizado para manejar el flujo de facturas estilo Odoo
 * Encapsula la lógica de estados, transiciones y validaciones
 */
import { useState, useCallback } from 'react';
import { InvoiceAPI } from '../api/invoiceAPI';
import { useToast } from '@/shared/contexts/ToastContext';
export function useInvoiceWorkflow(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    var showToast = useToast().showToast;
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(false), actionLoading = _b[0], setActionLoading = _b[1];
    // Cargar factura con líneas
    var loadInvoice = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var invoice, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, InvoiceAPI.getInvoiceWithLines(id)];
                case 1:
                    invoice = _a.sent();
                    return [2 /*return*/, invoice];
                case 2:
                    error_1 = _a.sent();
                    showToast(error_1.message || 'Error al cargar la factura', 'error');
                    return [2 /*return*/, null];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [showToast]);
    // Cargar vista previa de payment schedule
    var loadPaymentSchedule = useCallback(function (invoiceId) { return __awaiter(_this, void 0, void 0, function () {
        var schedule, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, InvoiceAPI.getPaymentSchedulePreview(invoiceId)];
                case 1:
                    schedule = _a.sent();
                    return [2 /*return*/, schedule];
                case 2:
                    error_2 = _a.sent();
                    showToast(error_2.message || 'Error al cargar vencimientos', 'error');
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [showToast]);
    // Validar payment terms
    var validatePaymentTerms = useCallback(function (paymentTermsId) { return __awaiter(_this, void 0, void 0, function () {
        var validation, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, InvoiceAPI.validatePaymentTerms(paymentTermsId)];
                case 1:
                    validation = _a.sent();
                    if (!validation.is_valid) {
                        showToast("T\u00E9rminos de pago inv\u00E1lidos: ".concat(validation.errors.join(', ')), 'warning');
                    }
                    return [2 /*return*/, validation.is_valid];
                case 2:
                    error_3 = _a.sent();
                    showToast(error_3.message || 'Error al validar términos de pago', 'error');
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); }, [showToast]);
    // Contabilizar factura (DRAFT → POSTED)
    var postInvoice = useCallback(function (id, postOptions) { return __awaiter(_this, void 0, void 0, function () {
        var updatedInvoice, error_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setActionLoading(true);
                    return [4 /*yield*/, InvoiceAPI.postInvoice(id, postOptions)];
                case 1:
                    updatedInvoice = _b.sent();
                    showToast('Factura contabilizada exitosamente', 'success');
                    (_a = options === null || options === void 0 ? void 0 : options.onStatusChange) === null || _a === void 0 ? void 0 : _a.call(options, updatedInvoice.status);
                    return [2 /*return*/, updatedInvoice];
                case 2:
                    error_4 = _b.sent();
                    showToast(error_4.message || 'Error al contabilizar la factura', 'error');
                    return [2 /*return*/, null];
                case 3:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [showToast, options]);
    // Cancelar factura (POSTED → CANCELLED)
    var cancelInvoice = useCallback(function (id, reason) { return __awaiter(_this, void 0, void 0, function () {
        var updatedInvoice, error_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setActionLoading(true);
                    return [4 /*yield*/, InvoiceAPI.cancelInvoice(id, { reason: reason })];
                case 1:
                    updatedInvoice = _b.sent();
                    showToast('Factura cancelada exitosamente', 'success');
                    (_a = options === null || options === void 0 ? void 0 : options.onStatusChange) === null || _a === void 0 ? void 0 : _a.call(options, updatedInvoice.status);
                    return [2 /*return*/, updatedInvoice];
                case 2:
                    error_5 = _b.sent();
                    showToast(error_5.message || 'Error al cancelar la factura', 'error');
                    return [2 /*return*/, null];
                case 3:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [showToast, options]);
    // Restablecer a borrador (ANY → DRAFT)
    var resetToDraft = useCallback(function (id, reason) { return __awaiter(_this, void 0, void 0, function () {
        var updatedInvoice, error_6;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, 3, 4]);
                    setActionLoading(true);
                    return [4 /*yield*/, InvoiceAPI.resetToDraft(id, { reason: reason })];
                case 1:
                    updatedInvoice = _b.sent();
                    showToast('Factura restablecida a borrador', 'success');
                    (_a = options === null || options === void 0 ? void 0 : options.onStatusChange) === null || _a === void 0 ? void 0 : _a.call(options, updatedInvoice.status);
                    return [2 /*return*/, updatedInvoice];
                case 2:
                    error_6 = _b.sent();
                    showToast(error_6.message || 'Error al restablecer la factura', 'error');
                    return [2 /*return*/, null];
                case 3:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [showToast, options]);
    // Duplicar factura
    var duplicateInvoice = useCallback(function (id) { return __awaiter(_this, void 0, void 0, function () {
        var duplicatedInvoice, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setActionLoading(true);
                    return [4 /*yield*/, InvoiceAPI.duplicateInvoice(id)];
                case 1:
                    duplicatedInvoice = _a.sent();
                    showToast('Factura duplicada exitosamente', 'success');
                    return [2 /*return*/, duplicatedInvoice];
                case 2:
                    error_7 = _a.sent();
                    showToast(error_7.message || 'Error al duplicar la factura', 'error');
                    return [2 /*return*/, null];
                case 3:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [showToast]);
    // Operaciones masivas
    var bulkPostInvoices = useCallback(function (invoiceIds) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setActionLoading(true);
                    return [4 /*yield*/, InvoiceAPI.bulkPostInvoices({
                            invoice_ids: invoiceIds
                        })];
                case 1:
                    result = _a.sent();
                    showToast("".concat(result.successful, " factura").concat(result.successful !== 1 ? 's' : '', " contabilizada").concat(result.successful !== 1 ? 's' : ''), 'success');
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " factura").concat(result.failed !== 1 ? 's' : '', " fallaron"), 'warning');
                    }
                    return [2 /*return*/, result];
                case 2:
                    error_8 = _a.sent();
                    showToast(error_8.message || 'Error en la operación masiva', 'error');
                    return [2 /*return*/, { successful: [], failed: [] }];
                case 3:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [showToast]);
    var bulkCancelInvoices = useCallback(function (invoiceIds) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setActionLoading(true);
                    return [4 /*yield*/, InvoiceAPI.bulkCancelInvoices({
                            invoice_ids: invoiceIds
                        })];
                case 1:
                    result = _a.sent();
                    showToast("".concat(result.successful, " factura").concat(result.successful !== 1 ? 's' : '', " cancelada").concat(result.successful !== 1 ? 's' : ''), 'success');
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " factura").concat(result.failed !== 1 ? 's' : '', " fallaron"), 'warning');
                    }
                    return [2 /*return*/, result];
                case 2:
                    error_9 = _a.sent();
                    showToast(error_9.message || 'Error en la operación masiva', 'error');
                    return [2 /*return*/, { successful: 0, failed: 0, failed_items: [], successful_ids: [] }];
                case 3:
                    setActionLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [showToast]);
    // Helpers para validar transiciones de estado
    var canPost = useCallback(function (status) {
        return status === 'DRAFT';
    }, []);
    var canCancel = useCallback(function (status) {
        return status === 'POSTED';
    }, []);
    var canEdit = useCallback(function (status) {
        return status === 'DRAFT';
    }, []);
    var canResetToDraft = useCallback(function (status) {
        return status === 'POSTED' || status === 'CANCELLED';
    }, []);
    return {
        // Estado
        loading: loading,
        actionLoading: actionLoading,
        // Operaciones básicas
        loadInvoice: loadInvoice,
        loadPaymentSchedule: loadPaymentSchedule,
        validatePaymentTerms: validatePaymentTerms,
        // Transiciones de estado
        postInvoice: postInvoice,
        cancelInvoice: cancelInvoice,
        resetToDraft: resetToDraft,
        // Otras operaciones
        duplicateInvoice: duplicateInvoice,
        // Operaciones masivas
        bulkPostInvoices: bulkPostInvoices,
        bulkCancelInvoices: bulkCancelInvoices,
        // Helpers de validación
        canPost: canPost,
        canCancel: canCancel,
        canEdit: canEdit,
        canResetToDraft: canResetToDraft
    };
}
export default useInvoiceWorkflow;
