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
import { CostCenterService } from '../services/costCenterService';
export var BulkDeleteModal = function (_a) {
    var selectedCostCenters = _a.selectedCostCenters, onClose = _a.onClose, onSuccess = _a.onSuccess;
    var _b = useState(false), validating = _b[0], setValidating = _b[1];
    var _c = useState(false), deleting = _c[0], setDeleting = _c[1];
    var _d = useState([]), validationResults = _d[0], setValidationResults = _d[1];
    var _e = useState(''), deleteReason = _e[0], setDeleteReason = _e[1];
    var _f = useState(false), forceDelete = _f[0], setForceDelete = _f[1];
    var _g = useToast(), success = _g.success, showError = _g.error;
    // Validar centros de costo al abrir el modal
    useEffect(function () {
        validateCostCenters();
    }, [selectedCostCenters]);
    var validateCostCenters = function () { return __awaiter(void 0, void 0, void 0, function () {
        var costCenterIds, results, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setValidating(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    costCenterIds = selectedCostCenters.map(function (costCenter) { return costCenter.id; });
                    return [4 /*yield*/, CostCenterService.validateDeletion(costCenterIds)];
                case 2:
                    results = _a.sent();
                    setValidationResults(results);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : 'Error al validar los centros de costo';
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
        var costCenterIds, result, error_2, errorMessage;
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
                    costCenterIds = selectedCostCenters.map(function (costCenter) { return costCenter.id; });
                    return [4 /*yield*/, CostCenterService.bulkDeleteCostCenters({
                            cost_center_ids: costCenterIds,
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
                    errorMessage = error_2 instanceof Error ? error_2.message : 'Error al eliminar los centros de costo';
                    showError(errorMessage);
                    return [3 /*break*/, 5];
                case 4:
                    setDeleting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var canDeleteCostCenters = validationResults.filter(function (v) { return v.can_delete; });
    var blockedCostCenters = validationResults.filter(function (v) { return !v.can_delete; });
    var costCentersWithWarnings = validationResults.filter(function (v) { return v.can_delete && v.warnings.length > 0; });
    if (validating) {
        return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
                backgroundColor: 'transparent',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}>
        <div className="w-[448px] max-w-[90vw] transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-8 text-center" style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}>
            <Spinner size="lg"/>
            <h3 className="text-lg font-medium text-gray-900 mt-4">
              Validando eliminación
            </h3>
            <p className="text-gray-600 mt-2">
              Verificando {selectedCostCenters.length} centros de costo seleccionados...
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
              <h3 className="card-title text-red-600">
                🗑️ Eliminación Masiva de Centros de Costo
              </h3>              
              <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </Button>
            </div>
          </div>

          <div className="card-body max-h-[70vh] overflow-y-auto">
            {/* Resumen de validación */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">Se pueden eliminar</h4>
                <p className="text-2xl font-bold text-green-600">{canDeleteCostCenters.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900">Con advertencias</h4>
                <p className="text-2xl font-bold text-yellow-600">{costCentersWithWarnings.length}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900">Bloqueados</h4>
                <p className="text-2xl font-bold text-red-600">{blockedCostCenters.length}</p>
              </div>
            </div>

            {/* Detalles de validación */}
            <div className="space-y-4">
              {/* Centros de costo bloqueados */}
              {blockedCostCenters.length > 0 && (<div className="border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-3">
                    ❌ Centros de Costo que NO se pueden eliminar ({blockedCostCenters.length})
                  </h4>
                  <div className="space-y-2">
                    {blockedCostCenters.map(function (validation) {
                var costCenter = selectedCostCenters.find(function (cc) { return cc.id === validation.cost_center_id; });
                return (<div key={validation.cost_center_id} className="bg-red-50 p-3 rounded">
                          <div className="font-medium text-red-900">
                            {costCenter === null || costCenter === void 0 ? void 0 : costCenter.code} - {costCenter === null || costCenter === void 0 ? void 0 : costCenter.name}
                          </div>
                          <ul className="text-sm text-red-700 mt-1">
                            {validation.blocking_reasons.map(function (reason, idx) { return (<li key={idx}>• {reason}</li>); })}
                          </ul>
                        </div>);
            })}
                  </div>
                </div>)}

              {/* Centros de costo con advertencias */}
              {costCentersWithWarnings.length > 0 && (<div className="border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-3">
                    ⚠️ Centros de Costo con advertencias ({costCentersWithWarnings.length})
                  </h4>
                  <div className="space-y-2">
                    {costCentersWithWarnings.map(function (validation) {
                var costCenter = selectedCostCenters.find(function (cc) { return cc.id === validation.cost_center_id; });
                return (<div key={validation.cost_center_id} className="bg-yellow-50 p-3 rounded">
                          <div className="font-medium text-yellow-900">
                            {costCenter === null || costCenter === void 0 ? void 0 : costCenter.code} - {costCenter === null || costCenter === void 0 ? void 0 : costCenter.name}
                          </div>
                          <ul className="text-sm text-yellow-700 mt-1">
                            {validation.warnings.map(function (warning, idx) { return (<li key={idx}>• {warning}</li>); })}
                          </ul>
                        </div>);
            })}
                  </div>
                </div>)}

              {/* Centros de costo que se pueden eliminar sin problemas */}
              {canDeleteCostCenters.filter(function (v) { return v.warnings.length === 0; }).length > 0 && (<div className="border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">
                    ✅ Centros de Costo que se pueden eliminar sin problemas ({canDeleteCostCenters.filter(function (v) { return v.warnings.length === 0; }).length})
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {canDeleteCostCenters.filter(function (v) { return v.warnings.length === 0; }).map(function (validation) {
                var costCenter = selectedCostCenters.find(function (cc) { return cc.id === validation.cost_center_id; });
                return (<div key={validation.cost_center_id} className="bg-green-50 p-2 rounded text-sm">
                          <span className="font-medium text-green-900">
                            {costCenter === null || costCenter === void 0 ? void 0 : costCenter.code} - {costCenter === null || costCenter === void 0 ? void 0 : costCenter.name}
                          </span>
                        </div>);
            })}
                  </div>
                </div>)}
            </div>

            {/* Formulario de eliminación */}
            {canDeleteCostCenters.length > 0 && (<div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Configuración de eliminación</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Razón para la eliminación *
                    </label>
                    <textarea value={deleteReason} onChange={function (e) { return setDeleteReason(e.target.value); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe el motivo de la eliminación (ej: Reorganización de centros de costo del ejercicio 2024)" disabled={deleting}/>
                  </div>

                  {costCentersWithWarnings.length > 0 && (<div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" checked={forceDelete} onChange={function (e) { return setForceDelete(e.target.checked); }} disabled={deleting} className="rounded border-gray-300 text-red-600 focus:ring-red-500"/>
                        <span className="text-sm text-gray-700">
                          Forzar eliminación de centros de costo con advertencias
                        </span>
                      </label>
                    </div>)}
                </div>
              </div>)}
          </div>

          <div className="card-footer border-t bg-gray-50 flex justify-between">
            <Button variant="secondary" onClick={onClose} disabled={deleting}>
              Cancelar
            </Button>

            {canDeleteCostCenters.length > 0 && (<Button variant="danger" onClick={handleDelete} disabled={deleting || !deleteReason.trim()}>
                {deleting ? (<>
                    <Spinner size="sm" className="mr-2"/>
                    Eliminando...
                  </>) : ("Eliminar ".concat(canDeleteCostCenters.length, " centro").concat(canDeleteCostCenters.length === 1 ? '' : 's', " de costo"))}
              </Button>)}
          </div>
        </Card>
      </div>
    </div>);
};
