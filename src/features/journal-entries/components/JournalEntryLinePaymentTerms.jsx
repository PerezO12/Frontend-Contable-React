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
import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { PaymentTermsSelector } from '../../payment-terms/components/PaymentTermsSelector';
import { PaymentScheduleDisplay } from '../../payment-terms/components/PaymentScheduleDisplay';
import { useJournalEntryPaymentTerms } from '../hooks/useJournalEntryPaymentTerms';
import { useThirdParties } from '../../third-parties/hooks';
import { formatCurrency } from '../../../shared/utils';
export var JournalEntryLinePaymentTerms = function (_a) {
    var lineIndex = _a.lineIndex, line = _a.line, onLineChange = _a.onLineChange, onPaymentScheduleChange = _a.onPaymentScheduleChange, _b = _a.className, className = _b === void 0 ? "" : _b;
    var _c = useJournalEntryPaymentTerms(), calculatePaymentSchedule = _c.calculatePaymentSchedule, calculating = _c.calculating, _error = _c.error, clearError = _c.clearError;
    var thirdParties = useThirdParties({ is_active: true }).thirdParties;
    var _d = useState(null), selectedPaymentTerms = _d[0], setSelectedPaymentTerms = _d[1];
    var _e = useState([]), calculatedSchedule = _e[0], setCalculatedSchedule = _e[1];
    var _f = useState(''), validationMessage = _f[0], setValidationMessage = _f[1];
    var _g = useState(false), showSchedule = _g[0], setShowSchedule = _g[1];
    // Calculate line amount (debit or credit)
    var lineAmount = Math.max(parseFloat(line.debit_amount || '0'), parseFloat(line.credit_amount || '0'));
    // Effect to recalculate schedule when payment terms, amount, or invoice date changes
    useEffect(function () {
        var calculateSchedule = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, scheduleItems, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(selectedPaymentTerms && line.invoice_date && lineAmount > 0)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        clearError();
                        setValidationMessage('');
                        return [4 /*yield*/, calculatePaymentSchedule({
                                payment_terms_id: selectedPaymentTerms.id,
                                invoice_date: line.invoice_date,
                                amount: lineAmount
                            })];
                    case 2:
                        result = _a.sent();
                        scheduleItems = result.schedule.map(function (item) { return ({
                            sequence: item.sequence,
                            days: item.days,
                            percentage: item.percentage,
                            amount: item.amount,
                            payment_date: item.payment_date,
                            description: item.description || ''
                        }); });
                        setCalculatedSchedule(scheduleItems);
                        onPaymentScheduleChange === null || onPaymentScheduleChange === void 0 ? void 0 : onPaymentScheduleChange(lineIndex, scheduleItems);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error calculating payment schedule:', error_1);
                        setValidationMessage('Error al calcular el cronograma de pagos');
                        setCalculatedSchedule([]);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        setCalculatedSchedule([]);
                        onPaymentScheduleChange === null || onPaymentScheduleChange === void 0 ? void 0 : onPaymentScheduleChange(lineIndex, []);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        calculateSchedule();
    }, [selectedPaymentTerms, line.invoice_date, lineAmount, calculatePaymentSchedule, lineIndex, onPaymentScheduleChange, clearError]);
    // Simple validation for payment terms fields
    useEffect(function () {
        if (line.payment_terms_id && !line.invoice_date) {
            setValidationMessage('Se requiere fecha de factura para las condiciones de pago');
        }
        else if (line.invoice_date && line.due_date) {
            var invoiceDate = new Date(line.invoice_date);
            var dueDate = new Date(line.due_date);
            if (dueDate < invoiceDate) {
                setValidationMessage('La fecha de vencimiento no puede ser anterior a la fecha de factura');
            }
            else {
                setValidationMessage('');
            }
        }
        else {
            setValidationMessage('');
        }
    }, [line.payment_terms_id, line.invoice_date, line.due_date]);
    var handlePaymentTermsChange = function (paymentTermsId) {
        onLineChange(lineIndex, 'payment_terms_id', paymentTermsId || '');
        // Clear due date when payment terms change
        if (line.due_date) {
            onLineChange(lineIndex, 'due_date', '');
        }
    };
    var handlePaymentTermsSelect = function (paymentTerms) {
        setSelectedPaymentTerms(paymentTerms);
    };
    var handleInvoiceDateChange = function (e) {
        var newInvoiceDate = e.target.value;
        onLineChange(lineIndex, 'invoice_date', newInvoiceDate);
        // Clear due date when invoice date changes
        if (line.due_date) {
            onLineChange(lineIndex, 'due_date', '');
        }
    };
    var handleDueDateChange = function (e) {
        onLineChange(lineIndex, 'due_date', e.target.value);
    };
    var toggleScheduleDisplay = function () {
        setShowSchedule(!showSchedule);
    };
    // Don't show payment terms for lines with zero amount
    if (lineAmount === 0) {
        return null;
    }
    return (<div className={"space-y-3 ".concat(className)}>
      {/* Third Party and Payment Terms Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="form-label text-xs">
            Tercero
          </label>
          <select value={line.third_party_id || ''} onChange={function (e) { return onLineChange(lineIndex, 'third_party_id', e.target.value); }} className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Seleccionar tercero...</option>
            {thirdParties.map(function (thirdParty) { return (<option key={thirdParty.id} value={thirdParty.id}>
                {thirdParty.code ? "".concat(thirdParty.code, " - ").concat(thirdParty.name) : "".concat(thirdParty.document_number, " - ").concat(thirdParty.name)}
              </option>); })}
          </select>
        </div>

        <div>
          <label className="form-label text-xs">
            Condiciones de Pago
          </label>
          <PaymentTermsSelector value={line.payment_terms_id} onChange={handlePaymentTermsChange} onPaymentTermsSelect={handlePaymentTermsSelect} placeholder="Seleccionar..." className="text-xs"/>
        </div>

        <div>
          <label className="form-label text-xs">
            Fecha Factura
            {line.payment_terms_id && <span className="text-red-500">*</span>}
          </label>
          <Input type="date" value={line.invoice_date || ''} onChange={handleInvoiceDateChange} className="text-xs"/>
        </div>

        <div>
          <label className="form-label text-xs">
            Fecha Vencimiento
          </label>
          <Input type="date" value={line.due_date || ''} onChange={handleDueDateChange} className="text-xs"/>
        </div>
      </div>

      {/* Payment Schedule Summary */}
      {selectedPaymentTerms && calculatedSchedule.length > 0 && (<div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-xs text-blue-800">
              <span className="font-medium">{selectedPaymentTerms.name}</span>
              <span className="ml-2 text-blue-600">
                {calculatedSchedule.length} cuota{calculatedSchedule.length !== 1 ? 's' : ''} • 
                Monto: {formatCurrency(lineAmount)}
              </span>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={toggleScheduleDisplay} className="text-xs">
              {showSchedule ? 'Ocultar' : 'Ver'} Cronograma
            </Button>
          </div>
            {calculating && (<div className="flex items-center justify-center mt-2">
              <Spinner size="sm"/>
              <span className="ml-2 text-xs text-blue-600">Calculando cronograma...</span>
            </div>)}
        </div>)}

      {/* Validation Messages */}
      {validationMessage && (<ValidationMessage type="error" message={validationMessage}/>)}

      {/* Payment Schedule Display */}
      {showSchedule && calculatedSchedule.length > 0 && (<PaymentScheduleDisplay schedule={calculatedSchedule} invoiceAmount={lineAmount} invoiceDate={line.invoice_date || ''} className="mt-3"/>)}
    </div>);
};
