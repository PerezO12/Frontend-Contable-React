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
 * Hook personalizado para operaciones bulk en facturas
 * Implementa la lógica completa de selección múltiple y operaciones masivas
 */
import { useState, useCallback, useMemo } from 'react';
import { InvoiceAPI } from '../api/invoiceAPI';
import { useToast } from '@/shared/contexts/ToastContext';
/**
 * Formatea errores de API para mostrar como string
 */
var formatApiError = function (error, fallbackMessage) {
    var _a;
    if (!((_a = error.response) === null || _a === void 0 ? void 0 : _a.data)) {
        return fallbackMessage;
    }
    var detail = error.response.data.detail;
    // Si detail es un string, usarlo directamente
    if (typeof detail === 'string') {
        return detail;
    }
    // Si detail es un array de errores de validación (como en FastAPI)
    if (Array.isArray(detail)) {
        var errorMessages = detail.map(function (err) {
            if (typeof err === 'string')
                return err;
            if (err.msg)
                return err.msg;
            if (err.message)
                return err.message;
            return JSON.stringify(err);
        });
        return errorMessages.join(', ');
    }
    // Si detail es un objeto
    if (typeof detail === 'object') {
        if (detail.message)
            return detail.message;
        if (detail.msg)
            return detail.msg;
        // Intentar stringify como último recurso
        try {
            return JSON.stringify(detail);
        }
        catch (_b) {
            return fallbackMessage;
        }
    }
    return fallbackMessage;
};
export function useBulkInvoiceOperations(_a) {
    var _this = this;
    var invoices = _a.invoices, onOperationComplete = _a.onOperationComplete;
    var showToast = useToast().showToast;
    // Estado de selección
    var _b = useState(new Set()), selectedIds = _b[0], setSelectedIds = _b[1];
    var _c = useState(false), isProcessing = _c[0], setIsProcessing = _c[1];
    var _d = useState(null), validationData = _d[0], setValidationData = _d[1];
    // Estado calculado de selección
    var selectionState = useMemo(function () {
        var totalInvoices = invoices.length;
        var selectedCount = selectedIds.size;
        return {
            selectedIds: selectedIds,
            isAllSelected: totalInvoices > 0 && selectedCount === totalInvoices,
            isIndeterminate: selectedCount > 0 && selectedCount < totalInvoices
        };
    }, [invoices.length, selectedIds]);
    // Manejar selección individual
    var toggleSelection = useCallback(function (invoiceId) {
        setSelectedIds(function (prev) {
            var newSet = new Set(prev);
            if (newSet.has(invoiceId)) {
                newSet.delete(invoiceId);
            }
            else {
                newSet.add(invoiceId);
            }
            return newSet;
        });
    }, []);
    // Manejar selección múltiple (todos/ninguno)
    var toggleSelectAll = useCallback(function () {
        if (selectionState.isAllSelected) {
            setSelectedIds(new Set());
        }
        else {
            setSelectedIds(new Set(invoices.map(function (inv) { return inv.id; })));
        }
    }, [invoices, selectionState.isAllSelected]);
    // Limpiar selección
    var clearSelection = useCallback(function () {
        setSelectedIds(new Set());
        setValidationData(null);
    }, []);
    // Validar operación antes de ejecutar
    var validateOperation = useCallback(function (operation) { return __awaiter(_this, void 0, void 0, function () {
        var validation, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedIds.size === 0) {
                        showToast('Debe seleccionar al menos una factura', 'warning');
                        return [2 /*return*/, null];
                    }
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, InvoiceAPI.validateBulkOperation(operation, Array.from(selectedIds))];
                case 2:
                    validation = _a.sent();
                    setValidationData(validation);
                    // Mostrar advertencias si hay facturas inválidas
                    if (validation.invalid_count > 0) {
                        showToast("".concat(validation.invalid_count, " facturas no pueden procesarse. Revise los detalles."), 'warning');
                    }
                    return [2 /*return*/, validation];
                case 3:
                    error_1 = _a.sent();
                    showToast(formatApiError(error_1, 'Error al validar la operación'), 'error');
                    return [2 /*return*/, null];
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [selectedIds, showToast]);
    // Ejecutar contabilización masiva
    var bulkPostInvoices = useCallback(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedIds.size === 0) {
                        showToast('Debe seleccionar al menos una factura', 'warning');
                        return [2 /*return*/];
                    }
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, InvoiceAPI.bulkPostInvoices(__assign(__assign({}, options), { invoice_ids: Array.from(selectedIds) }))];
                case 2:
                    result = _a.sent();
                    // Mostrar resultado
                    if (result.successful > 0) {
                        showToast("".concat(result.successful, " facturas contabilizadas exitosamente"), 'success');
                    }
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " facturas fallaron en la contabilizaci\u00F3n"), 'error');
                    }
                    if (result.skipped > 0) {
                        showToast("".concat(result.skipped, " facturas fueron omitidas"), 'warning');
                    }
                    // Limpiar selección y actualizar datos
                    clearSelection();
                    onOperationComplete === null || onOperationComplete === void 0 ? void 0 : onOperationComplete();
                    return [2 /*return*/, result];
                case 3:
                    error_2 = _a.sent();
                    showToast(formatApiError(error_2, 'Error en la contabilización masiva'), 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [selectedIds, showToast, clearSelection, onOperationComplete]);
    // Ejecutar cancelación masiva
    var bulkCancelInvoices = useCallback(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedIds.size === 0) {
                        showToast('Debe seleccionar al menos una factura', 'warning');
                        return [2 /*return*/];
                    }
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, InvoiceAPI.bulkCancelInvoices(__assign(__assign({}, options), { invoice_ids: Array.from(selectedIds) }))];
                case 2:
                    result = _a.sent();
                    if (result.successful > 0) {
                        showToast("".concat(result.successful, " facturas canceladas exitosamente"), 'success');
                    }
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " facturas fallaron en la cancelaci\u00F3n"), 'error');
                    }
                    clearSelection();
                    onOperationComplete === null || onOperationComplete === void 0 ? void 0 : onOperationComplete();
                    return [2 /*return*/, result];
                case 3:
                    error_3 = _a.sent();
                    showToast(formatApiError(error_3, 'Error en la cancelación masiva'), 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [selectedIds, showToast, clearSelection, onOperationComplete]);
    // Ejecutar reset masivo a borrador
    var bulkResetToDraftInvoices = useCallback(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var requestData, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedIds.size === 0) {
                        showToast('Debe seleccionar al menos una factura', 'warning');
                        return [2 /*return*/];
                    }
                    console.log('🔄 Iniciando bulk reset to draft con opciones:', options);
                    console.log('🔄 IDs seleccionados:', Array.from(selectedIds));
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    requestData = __assign(__assign({}, options), { invoice_ids: Array.from(selectedIds) });
                    console.log('🔄 Datos de request completos:', requestData);
                    return [4 /*yield*/, InvoiceAPI.bulkResetToDraftInvoices(requestData)];
                case 2:
                    result = _a.sent();
                    if (result.successful > 0) {
                        showToast("".concat(result.successful, " facturas restablecidas a borrador"), 'success');
                    }
                    if (result.failed > 0) {
                        showToast("".concat(result.failed, " facturas fallaron en el restablecimiento"), 'error');
                    }
                    clearSelection();
                    onOperationComplete === null || onOperationComplete === void 0 ? void 0 : onOperationComplete();
                    return [2 /*return*/, result];
                case 3:
                    error_4 = _a.sent();
                    console.error('❌ Error capturado en hook:', error_4);
                    showToast(formatApiError(error_4, 'Error en el restablecimiento masivo'), 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [selectedIds, showToast, clearSelection, onOperationComplete]);
    // Ejecutar eliminación masiva
    var bulkDeleteInvoices = useCallback(function (options) { return __awaiter(_this, void 0, void 0, function () {
        var selectedInvoices, nfeInvoices, result_1, successMessage, nfeDeletedCount, errorMessage, nfeErrors, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedIds.size === 0) {
                        showToast('Debe seleccionar al menos una factura', 'warning');
                        return [2 /*return*/];
                    }
                    setIsProcessing(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    selectedInvoices = invoices.filter(function (inv) { return selectedIds.has(inv.id); });
                    nfeInvoices = selectedInvoices.filter(function (inv) {
                        var _a, _b, _c;
                        return ((_a = inv.invoice_number) === null || _a === void 0 ? void 0 : _a.includes('NFe')) ||
                            ((_b = inv.description) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('nfe')) ||
                            ((_c = inv.notes) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes('nfe'));
                    });
                    return [4 /*yield*/, InvoiceAPI.bulkDeleteInvoices(__assign(__assign({}, options), { invoice_ids: Array.from(selectedIds) }))];
                case 2:
                    result_1 = _a.sent();
                    if (result_1.successful > 0) {
                        successMessage = "".concat(result_1.successful, " facturas eliminadas exitosamente");
                        // Si hay facturas NFE, agregar información adicional
                        if (nfeInvoices.length > 0) {
                            nfeDeletedCount = nfeInvoices.filter(function (inv) {
                                return result_1.successful_ids.includes(inv.id);
                            }).length;
                            if (nfeDeletedCount > 0) {
                                successMessage += " (incluyendo ".concat(nfeDeletedCount, " facturas de NFE que fueron desvinculadas)");
                            }
                        }
                        showToast(successMessage, 'success');
                    }
                    if (result_1.failed > 0) {
                        errorMessage = "".concat(result_1.failed, " facturas fallaron en la eliminaci\u00F3n");
                        nfeErrors = result_1.failed_items.filter(function (item) {
                            var _a, _b;
                            return ((_a = item.error) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('nfe')) ||
                                ((_b = item.error) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes('nota fiscal'));
                        });
                        if (nfeErrors.length > 0) {
                            errorMessage += ". ".concat(nfeErrors.length, " relacionadas con NFE - verifique las referencias");
                        }
                        showToast(errorMessage, 'error');
                    }
                    clearSelection();
                    onOperationComplete === null || onOperationComplete === void 0 ? void 0 : onOperationComplete();
                    return [2 /*return*/, result_1];
                case 3:
                    error_5 = _a.sent();
                    showToast(formatApiError(error_5, 'Error en la eliminación masiva'), 'error');
                    return [3 /*break*/, 5];
                case 4:
                    setIsProcessing(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [selectedIds, showToast, clearSelection, onOperationComplete]);
    // Filtrar facturas válidas para una operación específica
    var getValidInvoicesForOperation = useCallback(function (operation) {
        return invoices.filter(function (invoice) {
            switch (operation) {
                case 'post':
                    return invoice.status === 'DRAFT' && invoice.total_amount > 0;
                case 'cancel':
                    return invoice.status === 'POSTED' && invoice.outstanding_amount === invoice.total_amount;
                case 'reset':
                    return invoice.status === 'POSTED';
                case 'delete':
                    return invoice.status === 'DRAFT';
                default:
                    return false;
            }
        });
    }, [invoices]);
    return {
        // Estado de selección
        selectionState: selectionState,
        selectedIds: selectedIds,
        selectedCount: selectedIds.size,
        totalInvoices: invoices.length,
        // Estados de procesamiento
        isProcessing: isProcessing,
        validationData: validationData,
        // Acciones de selección
        toggleSelection: toggleSelection,
        toggleSelectAll: toggleSelectAll,
        clearSelection: clearSelection,
        // Operaciones bulk
        validateOperation: validateOperation,
        bulkPostInvoices: bulkPostInvoices,
        bulkCancelInvoices: bulkCancelInvoices,
        bulkResetToDraftInvoices: bulkResetToDraftInvoices,
        bulkDeleteInvoices: bulkDeleteInvoices,
        // Utilidades
        getValidInvoicesForOperation: getValidInvoicesForOperation
    };
}
