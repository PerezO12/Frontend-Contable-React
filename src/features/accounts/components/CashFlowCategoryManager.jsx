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
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccounts } from '../hooks';
import { CashFlowCategory, CASH_FLOW_CATEGORY_LABELS, CASH_FLOW_CATEGORY_DESCRIPTIONS, getDefaultCashFlowCategory } from '../types';
export var CashFlowCategoryManager = function (_a) {
    var onClose = _a.onClose;
    var _b = useAccounts({ is_active: true }), accounts = _b.accounts, loading = _b.loading, updateAccount = _b.updateAccount, refetch = _b.refetch;
    var _c = useState(new Map()), pendingUpdates = _c[0], setPendingUpdates = _c[1];
    var _d = useState(false), processing = _d[0], setProcessing = _d[1];
    // Filter accounts without cash flow category
    var uncategorizedAccounts = accounts.filter(function (account) { return !account.cash_flow_category; });
    // Generate automatic suggestions
    var suggestions = uncategorizedAccounts.map(function (account) {
        var suggestedCategory = getDefaultCashFlowCategory(account.account_type, account.category);
        return {
            account: account,
            suggestedCategory: suggestedCategory,
            confidence: suggestedCategory ? 'alta' : 'baja'
        };
    });
    var handleCategoryChange = function (accountId, category) {
        var newPending = new Map(pendingUpdates);
        if (category === '') {
            newPending.delete(accountId);
        }
        else {
            newPending.set(accountId, category);
        }
        setPendingUpdates(newPending);
    };
    var handleApplyAutoSuggestions = function () {
        var newPending = new Map(pendingUpdates);
        suggestions.forEach(function (_a) {
            var account = _a.account, suggestedCategory = _a.suggestedCategory;
            if (suggestedCategory && !newPending.has(account.id)) {
                newPending.set(account.id, suggestedCategory);
            }
        });
        setPendingUpdates(newPending);
    };
    var handleSaveChanges = function () { return __awaiter(void 0, void 0, void 0, function () {
        var successCount, errorCount, _i, _a, _b, accountId, category, success, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (pendingUpdates.size === 0)
                        return [2 /*return*/];
                    setProcessing(true);
                    successCount = 0;
                    errorCount = 0;
                    _i = 0, _a = pendingUpdates.entries();
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    _b = _a[_i], accountId = _b[0], category = _b[1];
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, updateAccount(accountId, { cash_flow_category: category })];
                case 3:
                    success = _c.sent();
                    if (success) {
                        successCount++;
                    }
                    else {
                        errorCount++;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    console.error('Error updating account:', error_1);
                    errorCount++;
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    setProcessing(false);
                    setPendingUpdates(new Map());
                    // Show notification
                    if (successCount > 0) {
                        alert("\u2705 Se actualizaron ".concat(successCount, " cuenta").concat(successCount === 1 ? '' : 's', " exitosamente."));
                    }
                    if (errorCount > 0) {
                        alert("\u274C Error al actualizar ".concat(errorCount, " cuenta").concat(errorCount === 1 ? '' : 's', "."));
                    }
                    // Refresh data
                    return [4 /*yield*/, refetch()];
                case 7:
                    // Refresh data
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getCategoryColor = function (category) {
        var _a;
        var colors = (_a = {},
            _a[CashFlowCategory.OPERATING] = 'bg-blue-100 text-blue-800',
            _a[CashFlowCategory.INVESTING] = 'bg-orange-100 text-orange-800',
            _a[CashFlowCategory.FINANCING] = 'bg-purple-100 text-purple-800',
            _a[CashFlowCategory.CASH_EQUIVALENTS] = 'bg-green-100 text-green-800',
            _a);
        return colors[category] || 'bg-gray-100 text-gray-800';
    };
    if (loading) {
        return (<Card>
        <div className="card-body text-center py-8">
          <Spinner size="lg"/>
          <p className="text-gray-600 mt-2">Cargando cuentas...</p>
        </div>
      </Card>);
    }
    return (<div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                💧 Gestor de Categorías de Flujo de Efectivo
              </h2>
              <p className="text-gray-600 mt-1">
                Asigna categorías de flujo de efectivo a las cuentas para mejorar los reportes
              </p>
            </div>
            {onClose && (<Button variant="secondary" onClick={onClose}>
                Cerrar
              </Button>)}
          </div>
        </div>

        <div className="card-body">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Cuentas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Con Categoría Asignada</p>
              <p className="text-2xl font-bold text-green-700">
                {accounts.length - uncategorizedAccounts.length}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sin Categoría</p>
              <p className="text-2xl font-bold text-orange-700">
                {uncategorizedAccounts.length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cambios Pendientes</p>
              <p className="text-2xl font-bold text-blue-700">
                {pendingUpdates.size}
              </p>
            </div>
          </div>

          {/* Actions */}
          {uncategorizedAccounts.length > 0 && (<div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-medium text-blue-900">Sugerencias Automáticas</h3>
                <p className="text-sm text-blue-700">
                  Se pueden aplicar {suggestions.filter(function (s) { return s.suggestedCategory; }).length} sugerencias automáticas
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={handleApplyAutoSuggestions} disabled={processing}>
                  Aplicar Sugerencias
                </Button>
                <Button onClick={handleSaveChanges} disabled={pendingUpdates.size === 0 || processing}>
                  {processing ? <Spinner size="sm"/> : "Guardar ".concat(pendingUpdates.size, " Cambios")}
                </Button>
              </div>
            </div>)}
        </div>
      </Card>

      {/* Accounts list */}
      {uncategorizedAccounts.length === 0 ? (<Card>
          <div className="card-body text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Todas las cuentas están categorizadas!
            </h3>
            <p className="text-gray-600">
              Todas las cuentas activas tienen una categoría de flujo de efectivo asignada.
            </p>
          </div>
        </Card>) : (<Card>
          <div className="card-header">
            <h3 className="card-title">
              Cuentas Sin Categoría de Flujo ({uncategorizedAccounts.length})
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {suggestions.map(function (_a) {
                var account = _a.account, suggestedCategory = _a.suggestedCategory;
                var pendingCategory = pendingUpdates.get(account.id);
                var currentSelection = pendingCategory || suggestedCategory || '';
                return (<div key={account.id} className={"p-4 border rounded-lg ".concat(pendingUpdates.has(account.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200')}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {account.code}
                          </code>
                          <span className="font-medium text-gray-900">{account.name}</span>
                          {suggestedCategory && !pendingUpdates.has(account.id) && (<span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Sugerencia automática
                            </span>)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Tipo: {account.account_type} | Categoría: {account.category}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <select value={currentSelection} onChange={function (e) { return handleCategoryChange(account.id, e.target.value); }} className="form-select w-64">
                          <option value="">Seleccionar categoría...</option>
                          {Object.entries(CASH_FLOW_CATEGORY_LABELS).map(function (_a) {
                        var value = _a[0], label = _a[1];
                        return (<option key={value} value={value}>
                              {label}
                            </option>);
                    })}
                        </select>

                        {currentSelection && (<span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getCategoryColor(currentSelection))}>
                            {CASH_FLOW_CATEGORY_LABELS[currentSelection]}
                          </span>)}
                      </div>
                    </div>

                    {currentSelection && (<div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {CASH_FLOW_CATEGORY_DESCRIPTIONS[currentSelection]}
                      </div>)}
                  </div>);
            })}
            </div>
          </div>
        </Card>)}
    </div>);
};
