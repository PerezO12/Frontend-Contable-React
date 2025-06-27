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
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { useBulkJournalEntryOperations } from '../hooks/useBulkJournalEntryOperations';
import { formatCurrency } from '../../../shared/utils';
export var BulkOperationsWithPaymentTerms = function (_a) {
    var selectedEntries = _a.selectedEntries, onSuccess = _a.onSuccess, onSelectionClear = _a.onSelectionClear, _b = _a.className, className = _b === void 0 ? "" : _b;
    var _c = useBulkJournalEntryOperations(), bulkApprove = _c.bulkApprove, bulkPost = _c.bulkPost, bulkCancel = _c.bulkCancel, bulkReverse = _c.bulkReverse, bulkResetToDraft = _c.bulkResetToDraft, loading = _c.loading, error = _c.error, clearError = _c.clearError;
    var _d = useState(''), reason = _d[0], setReason = _d[1];
    var _e = useState(false), showReasonModal = _e[0], setShowReasonModal = _e[1];
    var _f = useState(null), pendingOperation = _f[0], setPendingOperation = _f[1];
    // Calculate totals
    var totalEntries = selectedEntries.length;
    var totalDebit = selectedEntries.reduce(function (sum, entry) { return sum + parseFloat(entry.total_debit); }, 0);
    var totalCredit = selectedEntries.reduce(function (sum, entry) { return sum + parseFloat(entry.total_credit); }, 0);
    // Count entries by status
    var statusCounts = selectedEntries.reduce(function (counts, entry) {
        counts[entry.status] = (counts[entry.status] || 0) + 1;
        return counts;
    }, {});
    // Count entries with payment terms
    var entriesWithPaymentTerms = selectedEntries.filter(function (entry) {
        return entry.lines.some(function (line) { return line.payment_terms_id; });
    }).length;
    var handleBulkOperation = function (operation_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([operation_1], args_1, true), void 0, function (operation, requiresReason) {
            var entryIds, operationReason, _a, error_1;
            if (requiresReason === void 0) { requiresReason = false; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (requiresReason && !reason.trim()) {
                            setShowReasonModal(true);
                            setPendingOperation(operation);
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 13, , 14]);
                        clearError();
                        entryIds = selectedEntries.map(function (entry) { return entry.id; });
                        operationReason = requiresReason ? reason : undefined;
                        _a = operation;
                        switch (_a) {
                            case 'approve': return [3 /*break*/, 2];
                            case 'post': return [3 /*break*/, 4];
                            case 'cancel': return [3 /*break*/, 6];
                            case 'reverse': return [3 /*break*/, 8];
                            case 'reset-to-draft': return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 12];
                    case 2: return [4 /*yield*/, bulkApprove(entryIds, operationReason || '', false)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 4: return [4 /*yield*/, bulkPost(entryIds, operationReason || '', false)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 6: return [4 /*yield*/, bulkCancel(entryIds, operationReason || '', false)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 8: return [4 /*yield*/, bulkReverse(entryIds, operationReason || '', new Date().toISOString().split('T')[0], false)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 10: return [4 /*yield*/, bulkResetToDraft(entryIds, operationReason || '', false)];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        setReason('');
                        setShowReasonModal(false);
                        setPendingOperation(null);
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                        onSelectionClear === null || onSelectionClear === void 0 ? void 0 : onSelectionClear();
                        return [3 /*break*/, 14];
                    case 13:
                        error_1 = _b.sent();
                        console.error("Error in bulk ".concat(operation, ":"), error_1);
                        return [3 /*break*/, 14];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    var executeWithReason = function () {
        if (pendingOperation) {
            handleBulkOperation(pendingOperation, true);
        }
    };
    var canApprove = selectedEntries.some(function (entry) { return entry.status === 'draft'; });
    var canPost = selectedEntries.some(function (entry) { return ['draft', 'approved'].includes(entry.status); });
    var canCancel = selectedEntries.some(function (entry) { return ['draft', 'approved', 'posted'].includes(entry.status); });
    var canReverse = selectedEntries.some(function (entry) { return entry.status === 'posted'; });
    var canResetToDraft = selectedEntries.some(function (entry) { return ['approved', 'cancelled'].includes(entry.status); });
    if (totalEntries === 0) {
        return null;
    }
    return (<div className={"space-y-4 ".concat(className)}>
      {/* Selection Summary */}
      <Card>
        <div className="card-header">
          <h3 className="card-title text-sm">Operaciones Masivas</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{totalEntries}</div>
              <div className="text-gray-600">Asientos seleccionados</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{formatCurrency(totalDebit)}</div>
              <div className="text-gray-600">Total Débito</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{formatCurrency(totalCredit)}</div>
              <div className="text-gray-600">Total Crédito</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{entriesWithPaymentTerms}</div>
              <div className="text-gray-600">Con condiciones de pago</div>
            </div>
          </div>

          {/* Status breakdown */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(function (_a) {
            var status = _a[0], count = _a[1];
            return (<span key={status} className={"px-2 py-1 rounded text-xs font-medium ".concat(status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        status === 'posted' ? 'bg-green-100 text-green-800' :
                            status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800')}>
                {count} {status}
              </span>);
        })}
          </div>
        </div>
      </Card>

      {/* Bulk Operations */}
      <Card>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Button onClick={function () { return handleBulkOperation('approve'); }} disabled={!canApprove || loading} variant="secondary" size="sm" className="text-xs">
              {loading ? <Spinner size="sm"/> : 'Aprobar'}
            </Button>

            <Button onClick={function () { return handleBulkOperation('post'); }} disabled={!canPost || loading} variant="secondary" size="sm" className="text-xs">
              {loading ? <Spinner size="sm"/> : 'Contabilizar'}
            </Button>

            <Button onClick={function () { return handleBulkOperation('cancel', true); }} disabled={!canCancel || loading} variant="danger" size="sm" className="text-xs">
              {loading ? <Spinner size="sm"/> : 'Cancelar'}
            </Button>

            <Button onClick={function () { return handleBulkOperation('reverse', true); }} disabled={!canReverse || loading} variant="secondary" size="sm" className="text-xs">
              {loading ? <Spinner size="sm"/> : 'Reversar'}
            </Button>

            <Button onClick={function () { return handleBulkOperation('reset-to-draft', true); }} disabled={!canResetToDraft || loading} variant="secondary" size="sm" className="text-xs">
              {loading ? <Spinner size="sm"/> : 'A Borrador'}
            </Button>
          </div>

          {entriesWithPaymentTerms > 0 && (<div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
              <div className="font-medium">⚠ Atención:</div>
              <div>
                {entriesWithPaymentTerms} asiento{entriesWithPaymentTerms !== 1 ? 's' : ''} 
                {' '}contiene{entriesWithPaymentTerms === 1 ? '' : 'n'} condiciones de pago que se procesarán automáticamente.
              </div>
            </div>)}

          {error && (<div className="mt-3">
              <ValidationMessage type="error" message={error}/>
            </div>)}
        </div>
      </Card>

      {/* Reason Modal */}
      {showReasonModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              Motivo de la operación
            </h3>
            <textarea value={reason} onChange={function (e) { return setReason(e.target.value); }} placeholder="Ingrese el motivo de esta operación..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3}/>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={function () {
                setShowReasonModal(false);
                setPendingOperation(null);
                setReason('');
            }} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={executeWithReason} disabled={!reason.trim() || loading}>
                {loading ? <Spinner size="sm"/> : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>)}
    </div>);
};
