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
import { Modal } from '../../../components/ui/Modal';
import { Spinner } from '../../../components/ui/Spinner';
import { useBulkDeleteValidation } from '../hooks';
export var BulkDeleteModal = function (_a) {
    var onClose = _a.onClose, onSuccess = _a.onSuccess, selectedThirdParties = _a.selectedThirdParties;
    var _b = useState('validation'), step = _b[0], setStep = _b[1];
    var _c = useState(false), confirmDelete = _c[0], setConfirmDelete = _c[1];
    var _d = useState(''), deleteReason = _d[0], setDeleteReason = _d[1];
    var _e = useState(false), forceDelete = _e[0], setForceDelete = _e[1];
    var _f = useBulkDeleteValidation(), validationData = _f.validationData, validateDeletion = _f.validateDeletion, bulkDeleteReal = _f.bulkDeleteReal, loading = _f.loading, error = _f.error;
    // Validar al cargar el modal
    useEffect(function () {
        var thirdPartyIds = selectedThirdParties.map(function (tp) { return tp.id; });
        validateDeletion(thirdPartyIds);
    }, [selectedThirdParties, validateDeletion]);
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var thirdPartyIds, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirmDelete)
                        return [2 /*return*/];
                    setStep('deleting');
                    thirdPartyIds = selectedThirdParties.map(function (tp) { return tp.id; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, bulkDeleteReal(thirdPartyIds, forceDelete, deleteReason)];
                case 2:
                    result = _a.sent();
                    if (result) {
                        // Éxito: cerrar modal inmediatamente y notificar
                        onSuccess(result);
                        onClose();
                    }
                    else {
                        // Error: volver al estado de confirmación
                        setStep('confirmation');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    // Error: volver al estado de confirmación
                    setStep('confirmation');
                    console.error('Error en eliminación masiva:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Verificar si hay terceros que no se pueden eliminar
    var cannotDelete = validationData.filter(function (v) { return !v.can_delete; });
    var canDelete = validationData.filter(function (v) { return v.can_delete; });
    return (<Modal isOpen={true} onClose={onClose} title="Eliminar Terceros Masivamente" size="lg">      
    <div className="max-h-[80vh] overflow-hidden flex flex-col">
        {/* Contenido principal con scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {error && (<div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>)}

        {/* Estado de carga de validación */}
        {loading && step === 'validation' && (<div className="flex items-center justify-center py-8">
            <Spinner size="md"/>
            <span className="ml-3 text-gray-600">Validando terceros...</span>
          </div>)}

        {/* Mostrar resultados de validación */}
        {!loading && validationData.length > 0 && (<>
            {/* Advertencia principal */}
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Advertencia: Eliminación Permanente
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Está a punto de <strong>eliminar permanentemente</strong> terceros.
                      Esta acción <strong>NO se puede deshacer</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terceros que NO se pueden eliminar */}
            {cannotDelete.length > 0 && (<div className="bg-red-50 border border-red-200 rounded-md p-4">                <h4 className="text-sm font-medium text-red-800 mb-3">
                  ❌ Terceros que NO se pueden eliminar ({cannotDelete.length})
                </h4>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                  {cannotDelete.map(function (validation) {
                    var thirdParty = selectedThirdParties.find(function (tp) { return tp.id === validation.third_party_id; });
                    return (<div key={validation.third_party_id} className="text-sm text-red-700 mb-2">
                        <span className="font-medium">
                          {(thirdParty === null || thirdParty === void 0 ? void 0 : thirdParty.commercial_name) || (thirdParty === null || thirdParty === void 0 ? void 0 : thirdParty.name)}
                        </span>
                        <ul className="ml-4 mt-1">
                          {validation.blocking_reasons.map(function (reason, idx) { return (<li key={idx}>• {reason}</li>); })}
                        </ul>
                      </div>);
                })}
                </div>
              </div>)}

            {/* Terceros que SÍ se pueden eliminar */}
            {canDelete.length > 0 && (<div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">                <h4 className="text-sm font-medium text-yellow-800 mb-3">
                  ✅ Terceros que se pueden eliminar ({canDelete.length})
                </h4>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                  {canDelete.map(function (validation) {
                    var thirdParty = selectedThirdParties.find(function (tp) { return tp.id === validation.third_party_id; });
                    return (<div key={validation.third_party_id} className="text-sm text-yellow-700 mb-1">
                        <span className="font-medium">
                          {(thirdParty === null || thirdParty === void 0 ? void 0 : thirdParty.commercial_name) || (thirdParty === null || thirdParty === void 0 ? void 0 : thirdParty.name)}
                        </span>
                        {validation.warnings.length > 0 && (<ul className="ml-4 mt-1 text-yellow-600">
                            {validation.warnings.map(function (warning, idx) { return (<li key={idx}>⚠️ {warning}</li>); })}
                          </ul>)}
                      </div>);
                })}
                </div>
              </div>)}

            {/* Opción de forzar eliminación si hay bloqueados */}
            {cannotDelete.length > 0 && (<div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                <label className="flex items-center">
                  <input type="checkbox" checked={forceDelete} onChange={function (e) { return setForceDelete(e.target.checked); }} className="mr-2"/>
                  <span className="text-sm text-orange-800">
                    <strong>Forzar eliminación</strong> de terceros bloqueados (use con extrema precaución)
                  </span>
                </label>
              </div>)}

            {/* Campo de razón para eliminación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón para la eliminación (opcional):
              </label>
              <textarea value={deleteReason} onChange={function (e) { return setDeleteReason(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" rows={3} placeholder="Explique por qué está eliminando estos terceros..."/>
            </div>            {/* Confirmación con checkbox */}
            {(canDelete.length > 0 || forceDelete) && (<div className="bg-red-50 border border-red-200 rounded-md p-4">
                <label className="flex items-start">
                  <input type="checkbox" checked={confirmDelete} onChange={function (e) { return setConfirmDelete(e.target.checked); }} className="mt-1 mr-3 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"/>
                  <div className="text-sm">
                    <span className="font-medium text-red-800">
                      Confirmo que entiendo que esta acción eliminará permanentemente los terceros seleccionados
                    </span>
                    <p className="text-red-700 mt-1">
                      Esta acción <strong>NO se puede deshacer</strong>. Los terceros serán eliminados definitivamente del sistema.
                    </p>
                  </div>
                </label>
              </div>)}

            {/* Resumen de la operación */}
            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen de la Operación:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Terceros seleccionados: {selectedThirdParties.length}</li>
                <li>• Se pueden eliminar: <span className="text-green-600 font-medium">{canDelete.length}</span></li>
                <li>• No se pueden eliminar: <span className="text-red-600 font-medium">{cannotDelete.length}</span></li>
                <li>• Con advertencias: <span className="text-yellow-600 font-medium">{validationData.filter(function (v) { return v.warnings.length > 0; }).length}</span></li>
                <li>• Tipo de operación: <span className="text-red-600 font-medium">Eliminación Permanente</span></li>
              </ul>
            </div>          </>)}
        </div>

        {/* Botones de acción - fijos en la parte inferior */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>

            <Button onClick={handleDelete} disabled={loading ||
            !confirmDelete ||
            (canDelete.length === 0 && !forceDelete) ||
            step === 'deleting'} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300">
              {step === 'deleting' ? (<>
                  <Spinner size="sm" className="mr-2"/>
                  Eliminando...
                </>) : ("\uD83D\uDDD1\uFE0F Eliminar ".concat(forceDelete ? selectedThirdParties.length : canDelete.length, " Terceros"))}
            </Button>
          </div>
        </div>
      </div>
    </Modal>);
};
