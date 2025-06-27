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
import { useState, useCallback } from 'react';
import { PaymentTermsService } from '../../payment-terms/services/paymentTermsService';
export function useJournalEntryPaymentTerms() {
    var _this = this;
    var _a = useState(false), calculating = _a[0], setCalculating = _a[1];
    var _b = useState(null), error = _b[0], setError = _b[1];
    var calculateLinePaymentSchedule = useCallback(function (paymentTermsId, invoiceDate, amount) { return __awaiter(_this, void 0, void 0, function () {
        var request, response, err_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setCalculating(true);
                    setError(null);
                    request = {
                        payment_terms_id: paymentTermsId,
                        invoice_date: invoiceDate,
                        amount: amount
                    };
                    return [4 /*yield*/, PaymentTermsService.calculatePaymentSchedule(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.schedule];
                case 2:
                    err_1 = _a.sent();
                    errorMessage = err_1 instanceof Error ? err_1.message : 'Error al calcular cronograma de pagos para la línea';
                    setError(errorMessage);
                    throw err_1;
                case 3:
                    setCalculating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var calculateDueDate = useCallback(function (paymentTermsId, invoiceDate) { return __awaiter(_this, void 0, void 0, function () {
        var request, response, err_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setCalculating(true);
                    setError(null);
                    request = {
                        payment_terms_id: paymentTermsId,
                        invoice_date: invoiceDate,
                        amount: 1 // Amount doesn't matter for due date calculation
                    };
                    return [4 /*yield*/, PaymentTermsService.calculatePaymentSchedule(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.final_due_date];
                case 2:
                    err_2 = _a.sent();
                    errorMessage = err_2 instanceof Error ? err_2.message : 'Error al calcular fecha de vencimiento';
                    setError(errorMessage);
                    throw err_2;
                case 3:
                    setCalculating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var calculatePaymentSchedule = useCallback(function (request) { return __awaiter(_this, void 0, void 0, function () {
        var response, err_3, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setCalculating(true);
                    setError(null);
                    return [4 /*yield*/, PaymentTermsService.calculatePaymentSchedule(request)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    err_3 = _a.sent();
                    errorMessage = err_3 instanceof Error ? err_3.message : 'Error al calcular cronograma de pagos';
                    setError(errorMessage);
                    throw err_3;
                case 3:
                    setCalculating(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var clearError = useCallback(function () {
        setError(null);
    }, []);
    return {
        calculating: calculating,
        error: error,
        calculateLinePaymentSchedule: calculateLinePaymentSchedule,
        calculateDueDate: calculateDueDate,
        calculatePaymentSchedule: calculatePaymentSchedule,
        clearError: clearError
    };
}
export function validateJournalEntryLinePaymentTerms(paymentTermsId, invoiceDate, dueDate) {
    var errors = [];
    var warnings = [];
    // Validar que si hay payment_terms_id también hay invoice_date
    if (paymentTermsId && !invoiceDate) {
        errors.push('Si especifica condiciones de pago, debe incluir fecha de factura');
    }
    // Validar que la fecha de vencimiento no sea anterior a la fecha de factura
    if (invoiceDate && dueDate) {
        var invoiceDateObj = new Date(invoiceDate);
        var dueDateObj = new Date(dueDate);
        if (dueDateObj < invoiceDateObj) {
            errors.push('La fecha de vencimiento no puede ser anterior a la fecha de factura');
        }
    }
    // Warning si hay due_date manual con payment_terms (prioridad a manual)
    if (paymentTermsId && dueDate) {
        warnings.push('La fecha de vencimiento manual tiene prioridad sobre las condiciones de pago');
    }
    return {
        isValid: errors.length === 0,
        errors: errors,
        warnings: warnings
    };
}
// ==========================================
// UTILIDADES PARA FORMATEO Y VISUALIZACIÓN
// ==========================================
export function formatPaymentScheduleForDisplay(schedule) {
    if (!schedule || schedule.length === 0) {
        return 'Sin cronograma';
    }
    if (schedule.length === 1) {
        var item = schedule[0];
        if (item.days === 0) {
            return 'Contado';
        }
        return "".concat(item.days, " d\u00EDas (").concat(item.percentage, "%)");
    }
    return schedule
        .map(function (item) { return "".concat(item.days, "d (").concat(item.percentage, "%)"); })
        .join(', ');
}
export function formatPaymentScheduleTooltip(schedule) {
    if (!schedule || schedule.length === 0) {
        return 'Sin cronograma de pagos';
    }
    return schedule
        .map(function (item) {
        return "Pago ".concat(item.sequence, ": ").concat(item.payment_date, " - $").concat(item.amount.toLocaleString(), " (").concat(item.percentage, "%)");
    })
        .join('\n');
}
export function calculateEffectiveDueDate(invoiceDate, manualDueDate, paymentSchedule) {
    // Prioridad 1: Fecha manual de vencimiento
    if (manualDueDate) {
        return manualDueDate;
    }
    // Prioridad 2: Fecha más tardía del cronograma de pagos
    if (paymentSchedule && paymentSchedule.length > 0) {
        var latestPayment = paymentSchedule
            .sort(function (a, b) { return new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime(); })[0];
        return latestPayment.payment_date;
    }
    // Fallback: Fecha de factura
    return invoiceDate;
}
export function calculateEffectiveInvoiceDate(entryDate, manualInvoiceDate) {
    // Prioridad 1: Fecha manual de factura
    if (manualInvoiceDate) {
        return manualInvoiceDate;
    }
    // Fallback: Fecha del asiento
    return entryDate;
}
