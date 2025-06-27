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
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks/useToast';
import { AccountService } from '../services/accountService';
export var BulkDeleteModal = function (_a) {
    var selectedAccounts = _a.selectedAccounts, onClose = _a.onClose, onSuccess = _a.onSuccess;
    var _b = useState(false), validating = _b[0], setValidating = _b[1];
    var _c = useState(false), deleting = _c[0], setDeleting = _c[1];
    var _d = useState([]), validationResults = _d[0], setValidationResults = _d[1];
    var _e = useState(''), deleteReason = _e[0], setDeleteReason = _e[1];
    var _f = useState(false), forceDelete = _f[0], setForceDelete = _f[1];
    var _g = useToast(), success = _g.success, showError = _g.error;
    // Validar cuentas al abrir el modal
    useEffect(function () {
        validateAccounts();
    }, [selectedAccounts]);
    var validateAccounts = function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountIds, results, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setValidating(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    accountIds = selectedAccounts.map(function (account) { return account.id; });
                    return [4 /*yield*/, AccountService.validateDeletion(accountIds)];
                case 2:
                    results = _a.sent();
                    setValidationResults(results);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : 'Error al validar las cuentas';
                    showError(errorMessage);
                    onClose();
                    return [3 /*break*/, 5];
                case 4:
                    setValidating(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var accountIds, result, error_2, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deleteReason.trim()) {
                        showError('Por favor ingresa una razón para la eliminación');
                        return [2 /*return*/];
                    }
                    setDeleting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    accountIds = selectedAccounts.map(function (account) { return account.id; });
                    return [4 /*yield*/, AccountService.bulkDeleteAccounts({
                            account_ids: accountIds,
                            force_delete: forceDelete,
                            delete_reason: deleteReason.trim()
                        })];
                case 2:
                    result = _a.sent();
                    success("Eliminaci\u00F3n completada: ".concat(result.success_count, " exitosas, ").concat(result.failure_count, " fallos"));
                    onSuccess(result);
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    errorMessage = error_2 instanceof Error ? error_2.message : 'Error al eliminar las cuentas';
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setDeleting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var canDeleteAccounts = validationResults.filter(function (v) { return v.can_delete; });
    var blockedAccounts = validationResults.filter(function (v) { return !v.can_delete; });
    var accountsWithWarnings = validationResults.filter(function (v) { return v.can_delete && v.warnings.length > 0; });
    if (validating) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
                backgroundColor: 'transparent',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}>
        <div className="w-96 max-w-[90vw] transform transition-all duration-300 ease-out">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden p-8 text-center">
            <div className="flex justify-center mb-4">
              <Spinner size="lg"/>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Validando eliminación
            </h3>
            <p className="text-gray-600">
              Verificando {selectedAccounts.length} cuenta{selectedAccounts.length !== 1 ? 's' : ''} seleccionada{selectedAccounts.length !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      </div>);
    }
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <Card>
          <div className="card-header border-b">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-red-600">
                🗑️ Eliminación Masiva de Cuentas
              </h3>              
              <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </Button>
            </div>
          </div>

          <div className="card-body max-h-[70vh] overflow-y-auto">            {/* Resumen de validación */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <h4 className="font-medium text-green-900 text-sm">Se pueden eliminar</h4>
                <p className="text-2xl font-bold text-green-600 mt-1">{canDeleteAccounts.length}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-center">
                <h4 className="font-medium text-amber-900 text-sm">Con advertencias</h4>
                <p className="text-2xl font-bold text-amber-600 mt-1">{accountsWithWarnings.length}</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
                <h4 className="font-medium text-red-900 text-sm">Bloqueadas</h4>
                <p className="text-2xl font-bold text-red-600 mt-1">{blockedAccounts.length}</p>
              </div>
            </div>

            {/* Detalles de validación */}
            <div className="space-y-4">
              {/* Cuentas bloqueadas */}
              {blockedAccounts.length > 0 && (<div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-3">
                    ❌ Cuentas que NO se pueden eliminar ({blockedAccounts.length})
                  </h4>
                  <div className="space-y-2">
                    {blockedAccounts.map(function (validation) {
                var account = selectedAccounts.find(function (a) { return a.id === validation.account_id; });
                return (<div key={validation.account_id} className="bg-red-50 p-3 rounded">
                          <div className="font-medium text-red-900">
                            {account === null || account === void 0 ? void 0 : account.code} - {account === null || account === void 0 ? void 0 : account.name}
                          </div>
                          <ul className="text-sm text-red-700 mt-1">
                            {validation.blocking_reasons.map(function (reason, idx) { return (<li key={idx}>• {reason}</li>); })}
                          </ul>
                        </div>);
            })}
                  </div>
                </div>)}

              {/* Cuentas con advertencias */}
              {accountsWithWarnings.length > 0 && (<div className="border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-3">
                    ⚠️ Cuentas con advertencias ({accountsWithWarnings.length})
                  </h4>
                  <div className="space-y-2">
                    {accountsWithWarnings.map(function (validation) {
                var account = selectedAccounts.find(function (a) { return a.id === validation.account_id; });
                return (<div key={validation.account_id} className="bg-yellow-50 p-3 rounded">
                          <div className="font-medium text-yellow-900">
                            {account === null || account === void 0 ? void 0 : account.code} - {account === null || account === void 0 ? void 0 : account.name}
                          </div>
                          <ul className="text-sm text-yellow-700 mt-1">
                            {validation.warnings.map(function (warning, idx) { return (<li key={idx}>• {warning}</li>); })}
                          </ul>
                        </div>);
            })}
                  </div>
                </div>)}

              {/* Cuentas que se pueden eliminar sin problemas */}
              {canDeleteAccounts.filter(function (v) { return v.warnings.length === 0; }).length > 0 && (<div className="border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">
                    ✅ Cuentas que se pueden eliminar sin problemas ({canDeleteAccounts.filter(function (v) { return v.warnings.length === 0; }).length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {canDeleteAccounts.filter(function (v) { return v.warnings.length === 0; }).map(function (validation) {
                var account = selectedAccounts.find(function (a) { return a.id === validation.account_id; });
                return (<div key={validation.account_id} className="bg-green-50 p-2 rounded text-sm">
                          <span className="font-medium text-green-900">
                            {account === null || account === void 0 ? void 0 : account.code} - {account === null || account === void 0 ? void 0 : account.name}
                          </span>
                        </div>);
            })}
                  </div>
                </div>)}
            </div>

            {/* Formulario de eliminación */}
            {canDeleteAccounts.length > 0 && (<div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">⚙️ Configuración de eliminación</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón para la eliminación <span className="text-red-500">*</span>
                    </label>
                    <textarea value={deleteReason} onChange={function (e) { return setDeleteReason(e.target.value); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Describe el motivo de la eliminación (ej: Limpieza de cuentas obsoletas del ejercicio 2024)" disabled={deleting}/>
                  </div>

                  {accountsWithWarnings.length > 0 && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <label className="flex items-start space-x-3">
                        <input type="checkbox" checked={forceDelete} onChange={function (e) { return setForceDelete(e.target.checked); }} disabled={deleting} className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                        <div>
                          <span className="text-sm font-medium text-amber-900">
                            Forzar eliminación de cuentas con advertencias
                          </span>
                          <p className="text-xs text-amber-700 mt-1">
                            Permite eliminar cuentas con advertencias pero sin errores críticos.
                          </p>
                        </div>
                      </label>
                    </div>)}
                </div>
              </div>)}
          </div>

          <div className="card-footer border-t bg-gray-50 flex justify-between items-center">
            <Button variant="secondary" onClick={onClose} disabled={deleting} className="px-6">
              Cancelar
            </Button>

            {canDeleteAccounts.length > 0 && (<Button variant="danger" onClick={handleDelete} disabled={deleting || !deleteReason.trim()} className="px-6 min-w-[140px]">
                {deleting ? (<div className="flex items-center space-x-2">
                    <Spinner size="sm"/>
                    <span>Eliminando...</span>
                  </div>) : ("Eliminar ".concat(canDeleteAccounts.length, " cuenta").concat(canDeleteAccounts.length === 1 ? '' : 's'))}
              </Button>)}
          </div>
        </Card>
      </div>
    </div>);
};
