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
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { JOURNAL_ENTRY_STATUS_LABELS } from '../types';
export var BulkDeleteModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, selectedEntryIds = _a.selectedEntryIds, onValidate = _a.onValidate, onBulkDelete = _a.onBulkDelete, onSuccess = _a.onSuccess;
    var _b = useState([]), validationResults = _b[0], setValidationResults = _b[1];
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var _d = useState(false), validating = _d[0], setValidating = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var _f = useState(''), deleteReason = _f[0], setDeleteReason = _f[1];
    var _g = useState(false), forceDelete = _g[0], setForceDelete = _g[1];
    var _h = useState(false), showResults = _h[0], setShowResults = _h[1];
    var _j = useState(null), deleteResult = _j[0], setDeleteResult = _j[1];
    var _k = useState(false), hasValidated = _k[0], setHasValidated = _k[1]; // Para prevenir re-validaciones  // Validar automáticamente cuando se abre el modal
    var handleValidation = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        var results, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (validating)
                        return [2 /*return*/]; // Prevenir múltiples llamadas simultáneas
                    setValidating(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onValidate(selectedEntryIds)];
                case 2:
                    results = _a.sent();
                    setValidationResults(results);
                    setHasValidated(true);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1 instanceof Error ? err_1.message : 'Error al validar asientos');
                    return [3 /*break*/, 5];
                case 4:
                    setValidating(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [onValidate, selectedEntryIds, validating]);
    // Handler para revalidación manual
    var handleManualValidation = function () {
        setHasValidated(false);
        setValidationResults([]);
        handleValidation();
    };
    useEffect(function () {
        if (isOpen && selectedEntryIds.length > 0 && !validating && !hasValidated) {
            handleValidation();
        }
    }, [isOpen, selectedEntryIds.length, handleValidation, validating, hasValidated]); // Dependencias completas
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deleteReason.trim()) {
                        setError('La razón de eliminación es requerida');
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onBulkDelete({
                            journal_entry_ids: selectedEntryIds,
                            force_delete: forceDelete,
                            reason: deleteReason.trim()
                        })];
                case 2:
                    result = _a.sent();
                    setDeleteResult(result);
                    setShowResults(true);
                    if (onSuccess) {
                        onSuccess(result);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_2 = _a.sent();
                    setError(err_2 instanceof Error ? err_2.message : 'Error al eliminar asientos');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleClose = function () {
        // Limpiar todo el estado del modal
        setValidationResults([]);
        setDeleteReason('');
        setForceDelete(false);
        setError(null);
        setShowResults(false);
        setDeleteResult(null);
        setValidating(false);
        setLoading(false);
        setHasValidated(false);
        onClose();
    };
    // No mostrar el modal si no está abierto
    if (!isOpen) {
        return null;
    }
    // Categorizar resultados de validación
    var canDelete = validationResults.filter(function (result) { return result.can_delete; });
    var cannotDelete = validationResults.filter(function (result) { return !result.can_delete; });
    var hasWarnings = validationResults.filter(function (result) { return result.warnings && result.warnings.length > 0; });
    if (showResults && deleteResult) {
        return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <Card>
            <div className="card-header border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Resultado de Eliminación Masiva</h2>
                <Button variant="ghost" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                  ✕
                </Button>
              </div>
            </div>
            
            <div className="card-body max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Resumen */}
                <Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4">Resumen de la Operación</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{deleteResult.total_requested}</div>
                        <div className="text-sm text-gray-600">Solicitados</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{deleteResult.total_deleted}</div>
                        <div className="text-sm text-gray-600">Eliminados</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{deleteResult.total_failed}</div>
                        <div className="text-sm text-gray-600">Fallidos</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Asientos eliminados exitosamente */}
                {deleteResult.deleted_entries.length > 0 && (<Card>
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-green-600 mb-4">
                        ✅ Asientos Eliminados ({deleteResult.deleted_entries.length})
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {deleteResult.deleted_entries.map(function (entry) { return (<div key={entry.journal_entry_id} className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium">{entry.journal_entry_number}</div>
                            <div className="text-sm text-gray-600">{entry.journal_entry_description}</div>
                          </div>); })}
                      </div>
                    </div>
                  </Card>)}

                {/* Asientos que fallaron */}
                {deleteResult.failed_entries.length > 0 && (<Card>
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">
                        ❌ Asientos No Eliminados ({deleteResult.failed_entries.length})
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {deleteResult.failed_entries.map(function (entry) { return (<div key={entry.journal_entry_id} className="p-3 bg-red-50 rounded-lg">
                            <div className="font-medium">{entry.journal_entry_number}</div>
                            <div className="text-sm text-gray-600 mb-2">{entry.journal_entry_description}</div>
                            {entry.errors.map(function (error, index) { return (<div key={index} className="text-sm text-red-600">• {error}</div>); })}
                          </div>); })}
                      </div>
                    </div>
                  </Card>)}                {/* Advertencias globales */}
                {deleteResult.warnings && deleteResult.warnings.length > 0 && (<Card>
                    <div className="card-body">
                      <h3 className="text-lg font-semibold text-yellow-600 mb-4">⚠️ Advertencias</h3>
                      <div className="space-y-2">
                        {deleteResult.warnings.map(function (warning, index) { return (<div key={index} className="p-2 bg-yellow-50 rounded text-sm text-yellow-800">
                            {warning}
                          </div>); })}
                      </div>
                    </div>
                  </Card>)}

                <div className="flex justify-end">
                  <Button variant="primary" onClick={handleClose}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>);
    }
    if (validating) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
                backgroundColor: 'transparent',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}>        <div className="w-[448px] max-w-[90vw] transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center" style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}>
            <Spinner size="lg"/>
            <h3 className="text-lg font-medium text-gray-900 mt-4">
              Validando asientos contables
            </h3>            <p className="text-gray-600 mt-2">
              Verificando {selectedEntryIds.length} asientos seleccionados...
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
      <div className="w-[768px] max-w-[90vw] max-h-[90vh] overflow-hidden">
        <Card>
          <div className="card-header border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Eliminar {selectedEntryIds.length} Asientos Contables</h2>
              <Button variant="ghost" onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </Button>
            </div>
          </div>
          
          <div className="card-body max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {error && (<ValidationMessage type="error" message={error}/>)}

              {/* Resumen de validación */}
              <Card>
                <div className="card-body">
                  <h3 className="text-lg font-semibold mb-4">Resumen de Validación</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{canDelete.length}</div>
                      <div className="text-sm text-gray-600">Pueden eliminarse</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{cannotDelete.length}</div>
                      <div className="text-sm text-gray-600">No pueden eliminarse</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{hasWarnings.length}</div>
                      <div className="text-sm text-gray-600">Con advertencias</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Asientos que pueden eliminarse */}
              {canDelete.length > 0 && (<Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-green-600 mb-4">
                      ✅ Pueden Eliminarse ({canDelete.length})
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {canDelete.map(function (entry) { return (<div key={entry.journal_entry_id} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium">{entry.journal_entry_number}</div>
                              <div className="text-sm text-gray-600">{entry.journal_entry_description}</div>
                              <div className="text-xs text-gray-500">
                                Estado: {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
                              </div>
                            </div>
                          </div>                          {entry.warnings && entry.warnings.length > 0 && (<div className="mt-2 space-y-1">
                              {entry.warnings.map(function (warning, index) { return (<div key={index} className="text-xs text-yellow-600">⚠️ {warning}</div>); })}
                            </div>)}
                        </div>); })}
                    </div>
                  </div>
                </Card>)}

              {/* Asientos que NO pueden eliminarse */}
              {cannotDelete.length > 0 && (<Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">
                      ❌ No Pueden Eliminarse ({cannotDelete.length})
                    </h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cannotDelete.map(function (entry) { return (<div key={entry.journal_entry_id} className="p-3 bg-red-50 rounded-lg">
                          <div className="font-medium">{entry.journal_entry_number}</div>
                          <div className="text-sm text-gray-600 mb-2">{entry.journal_entry_description}</div>
                          <div className="text-xs text-gray-500 mb-2">
                            Estado: {JOURNAL_ENTRY_STATUS_LABELS[entry.status]}
                          </div>
                          {entry.errors.map(function (error, index) { return (<div key={index} className="text-sm text-red-600">• {error}</div>); })}
                        </div>); })}
                    </div>
                  </div>
                </Card>)}

              {/* Formulario de eliminación */}
              {canDelete.length > 0 && (<Card>
                  <div className="card-body">
                    <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Razón de la eliminación *
                        </label>
                        <textarea value={deleteReason} onChange={function (e) { return setDeleteReason(e.target.value); }} placeholder="Describa el motivo de la eliminación (requerido para auditoría)" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} disabled={loading}/>
                      </div>

                      {/* Checkbox para forzar eliminación - siempre visible */}
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="forceDelete" checked={forceDelete} onChange={function (e) { return setForceDelete(e.target.checked); }} disabled={loading} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                        <label htmlFor="forceDelete" className="text-sm text-gray-700">
                          <span className="font-medium">Forzar eliminación</span>
                          <span className="text-gray-500 ml-1">(Omitir validaciones de seguridad)</span>
                        </label>
                      </div>

                      {hasWarnings.length > 0 && (<div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-start space-x-2">
                            <span className="text-orange-600">⚠️</span>
                            <div className="text-sm text-orange-800">
                              <strong>Advertencias detectadas:</strong> Algunos asientos tienen restricciones.
                              {!forceDelete && " Marque 'Forzar eliminación' para proceder."}
                            </div>
                          </div>
                        </div>)}

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                          <span className="text-yellow-600">⚠️</span>
                          <div className="text-sm text-yellow-800">
                            <strong>Advertencia:</strong> Esta acción no se puede deshacer. 
                            Se eliminarán {canDelete.length} asientos contables de forma permanente.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>)}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="card-footer border-t bg-gray-50">
            <div className="flex justify-between">
              <Button variant="secondary" onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              
              <div className="space-x-3">                <Button variant="secondary" onClick={handleManualValidation} disabled={loading || validating}>
                  🔄 Revalidar
                </Button>
                
                {canDelete.length > 0 && (<Button variant="danger" onClick={handleDelete} disabled={loading || !deleteReason.trim() || (hasWarnings.length > 0 && !forceDelete)} className={hasWarnings.length > 0 && !forceDelete ? "opacity-50" : ""}>
                    {loading ? (<>
                        <Spinner size="sm"/>
                        <span className="ml-2">Eliminando...</span>
                      </>) : ("\uD83D\uDDD1\uFE0F Eliminar ".concat(canDelete.length, " Asientos"))}
                  </Button>)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);
};
