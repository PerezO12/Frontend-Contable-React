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
 * Componente de barra de acciones para operaciones bulk en facturas
 * Incluye validación, confirmación y feedback de resultados
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/shared/utils/formatters';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, TrashIcon, DocumentDuplicateIcon, EyeIcon } from '@/shared/components/icons';
import { NFEBulkInfo } from './NFEBulkInfo';
var operationConfigs = {
    post: {
        label: 'Contabilizar',
        color: 'green',
        icon: CheckCircleIcon,
        description: 'Contabilizar facturas (DRAFT → POSTED)',
        confirmMessage: 'Esta acción generará asientos contables automáticamente. ¿Está seguro?'
    },
    cancel: {
        label: 'Cancelar',
        color: 'red',
        icon: XCircleIcon,
        description: 'Cancelar facturas (POSTED → CANCELLED)',
        confirmMessage: 'Esta acción creará asientos de reversión. ¿Está seguro?'
    }, reset: {
        label: 'Reset a Borrador',
        color: 'yellow',
        icon: DocumentDuplicateIcon,
        description: 'Restablecer a borrador (POSTED/CANCELLED → DRAFT)',
        confirmMessage: 'Esta acción eliminará los asientos contables asociados o de reversión. ¿Está seguro?'
    },
    delete: {
        label: 'Eliminar',
        color: 'red',
        icon: TrashIcon,
        description: 'Eliminar facturas (solo DRAFT)',
        confirmMessage: 'Esta acción es IRREVERSIBLE. ¿Está absolutamente seguro?'
    }
};
export function BulkActionsBar(_a) {
    var _this = this;
    var selectedCount = _a.selectedCount, selectedInvoices = _a.selectedInvoices, isProcessing = _a.isProcessing, validationData = _a.validationData, onValidateOperation = _a.onValidateOperation, onBulkPost = _a.onBulkPost, onBulkCancel = _a.onBulkCancel, onBulkResetToDraft = _a.onBulkResetToDraft, onBulkDelete = _a.onBulkDelete, onClearSelection = _a.onClearSelection;
    var _b = useState(false), showModal = _b[0], setShowModal = _b[1];
    var _c = useState(null), currentOperation = _c[0], setCurrentOperation = _c[1];
    var _d = useState({
        posting_date: new Date().toISOString().split('T')[0],
        notes: '',
        reason: '',
        force_post: false,
        force_reset: false,
        stop_on_error: false
    }), formData = _d[0], setFormData = _d[1];
    var _e = useState(false), showValidationDetails = _e[0], setShowValidationDetails = _e[1];
    if (selectedCount === 0)
        return null;
    var handleOperationClick = function (operation) { return __awaiter(_this, void 0, void 0, function () {
        var validation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCurrentOperation(operation);
                    return [4 /*yield*/, onValidateOperation(operation)];
                case 1:
                    validation = _a.sent();
                    if (!validation)
                        return [2 /*return*/];
                    // Si no se puede proceder, mostrar solo los detalles
                    if (!validation.can_proceed) {
                        setShowValidationDetails(true);
                        return [2 /*return*/];
                    }
                    // Si hay advertencias pero se puede proceder, mostrar modal de confirmación
                    setShowModal(true);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleConfirmOperation = function () {
        if (!currentOperation)
            return;
        var baseOptions = {
            notes: formData.notes,
            reason: formData.reason,
            stop_on_error: formData.stop_on_error
        };
        switch (currentOperation) {
            case 'post':
                onBulkPost(__assign(__assign({}, baseOptions), { posting_date: formData.posting_date, force_post: formData.force_post }));
                break;
            case 'cancel':
                onBulkCancel(baseOptions);
                break;
            case 'reset':
                onBulkResetToDraft(__assign(__assign({}, baseOptions), { force_reset: formData.force_reset }));
                break;
            case 'delete':
                onBulkDelete({
                    confirmation: 'CONFIRM_DELETE',
                    reason: formData.reason
                });
                break;
        }
        setShowModal(false);
        setCurrentOperation(null);
        setFormData({
            posting_date: new Date().toISOString().split('T')[0],
            notes: '',
            reason: '',
            force_post: false,
            force_reset: false,
            stop_on_error: false
        });
    };
    var config = currentOperation ? operationConfigs[currentOperation] : null;
    return (<>
      {/* Barra de acciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge color="blue" variant="subtle">
                {selectedCount} seleccionada{selectedCount !== 1 ? 's' : ''}
              </Badge>
              
              {validationData && (<Button variant="outline" size="sm" onClick={function () { return setShowValidationDetails(true); }} className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4"/>
                  Ver detalles
                </Button>)}
            </div>

            {isProcessing && (<div className="flex items-center gap-2 text-blue-600">
                <LoadingSpinner size="sm"/>
                <span className="text-sm">Procesando...</span>
              </div>)}
          </div>

          <div className="flex items-center gap-2">
            {/* Botones de acción */}
            <Button variant="outline" size="sm" onClick={function () { return handleOperationClick('post'); }} disabled={isProcessing} className="flex items-center gap-1 text-green-600 hover:text-green-700">
              <CheckCircleIcon className="h-4 w-4"/>
              Contabilizar
            </Button>

            <Button variant="outline" size="sm" onClick={function () { return handleOperationClick('cancel'); }} disabled={isProcessing} className="flex items-center gap-1 text-red-600 hover:text-red-700">
              <XCircleIcon className="h-4 w-4"/>
              Cancelar
            </Button>            <Button variant="outline" size="sm" onClick={function () { return handleOperationClick('reset'); }} disabled={isProcessing} className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700">
              <DocumentDuplicateIcon className="h-4 w-4"/>
              Reset
            </Button>

            <Button variant="outline" size="sm" onClick={function () { return handleOperationClick('delete'); }} disabled={isProcessing} className="flex items-center gap-1 text-red-600 hover:text-red-700">
              <TrashIcon className="h-4 w-4"/>
              Eliminar
            </Button>

            <Button variant="outline" size="sm" onClick={onClearSelection} disabled={isProcessing}>
              Limpiar
            </Button>
          </div>
        </div>
      </div>      {/* Modal de confirmación */}
      {showModal && config && (<Modal isOpen={showModal} onClose={function () { return setShowModal(false); }} title={"".concat(config.label, " Facturas")} size="md">
          <div className="space-y-6">
            {/* Información de la operación */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <config.icon className={"h-6 w-6 mt-1 text-".concat(config.color, "-600")}/>
              <div>
                <h3 className="font-medium text-gray-900">{config.description}</h3>
                <p className="text-sm text-gray-600 mt-1">{config.confirmMessage}</p>
              </div>
            </div>

            {/* Resumen de validación */}
            {validationData && (<div className="space-y-3">
                <h4 className="font-medium text-gray-900">Resumen de validación:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Total solicitadas:</span>
                    <span className="font-medium">{validationData.total_requested}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Válidas:</span>
                    <span className="font-medium text-green-600">{validationData.valid_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Inválidas:</span>
                    <span className="font-medium text-red-600">{validationData.invalid_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No encontradas:</span>
                    <span className="font-medium text-gray-600">{validationData.not_found_count}</span>
                  </div>
                </div>
              </div>)}

            {/* Formulario según operación */}
            <div className="space-y-4">
              {currentOperation === 'post' && (<>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de contabilización
                    </label>
                    <Input type="date" value={formData.posting_date} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { posting_date: e.target.value })); }); }}/>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="force_post" checked={formData.force_post} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { force_post: e.target.checked })); }); }} className="rounded border-gray-300"/>
                    <label htmlFor="force_post" className="text-sm text-gray-700">
                      Forzar contabilización (ignorar validaciones menores)
                    </label>
                  </div>
                </>)}

              {(currentOperation === 'cancel' || currentOperation === 'reset' || currentOperation === 'delete') && (<div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo {currentOperation === 'delete' ? '(obligatorio)' : '(opcional)'}
                  </label>
                  <Textarea value={formData.reason} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { reason: e.target.value })); }); }} placeholder="Explique el motivo de esta operación..." rows={3} required={currentOperation === 'delete'}/>
                </div>)}

              {currentOperation === 'reset' && (<div className="flex items-center gap-2">
                  <input type="checkbox" id="force_reset" checked={formData.force_reset} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { force_reset: e.target.checked })); }); }} className="rounded border-gray-300"/>
                  <label htmlFor="force_reset" className="text-sm text-gray-700">
                    Forzar reset (incluso si hay pagos aplicados)
                  </label>
                </div>)}

              <div className="flex items-center gap-2">
                <input type="checkbox" id="stop_on_error" checked={formData.stop_on_error} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { stop_on_error: e.target.checked })); }); }} className="rounded border-gray-300"/>
                <label htmlFor="stop_on_error" className="text-sm text-gray-700">
                  Detener en el primer error
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <Textarea value={formData.notes} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { notes: e.target.value })); }); }} placeholder="Notas internas sobre esta operación..." rows={2}/>
              </div>
            </div>            
            {/* Información específica para facturas NFE */}
            {currentOperation && (<NFEBulkInfo selectedInvoices={selectedInvoices} operation={currentOperation}/>)}
            
            {/* Advertencia para eliminación */}
            {currentOperation === 'delete' && (<Alert>
                <ExclamationCircleIcon className="h-5 w-5"/>
                <div>
                  <h4 className="font-medium text-red-600">¡Advertencia de eliminación!</h4>
                  <p className="text-sm mt-1 text-red-600">
                    Esta acción eliminará permanentemente las facturas seleccionadas y no se puede deshacer.
                    Solo se pueden eliminar facturas en estado BORRADOR.
                  </p>
                </div>
              </Alert>)}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={function () { return setShowModal(false); }} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmOperation} disabled={isProcessing || (currentOperation === 'delete' && !formData.reason.trim())} className={"bg-".concat(config.color, "-600 hover:bg-").concat(config.color, "-700")}>
                {isProcessing ? (<>
                    <LoadingSpinner size="sm" className="mr-2"/>
                    Procesando...
                  </>) : ("Confirmar ".concat(config.label))}
              </Button>
            </div>
          </div>
        </Modal>)}      {/* Modal de detalles de validación */}
      {showValidationDetails && validationData && (<Modal isOpen={showValidationDetails} onClose={function () { return setShowValidationDetails(false); }} title="Detalles de Validación" size="xl">
          <div className="space-y-6">
            {/* Facturas válidas */}
            {validationData.valid_count > 0 && (<div>
                <h4 className="font-medium text-green-600 mb-3">
                  Facturas válidas ({validationData.valid_count})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-green-50">                  {validationData.valid_invoices.map(function (invoice) { return (<div key={invoice.id} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="font-medium">{String(invoice.invoice_number || '')}</span>
                      <div className="text-sm text-gray-600">
                        <span className="mr-3">{String(invoice.status || '')}</span>
                        <span>{formatCurrency(Number(invoice.total_amount) || 0)}</span>
                      </div>
                    </div>); })}
                </div>
              </div>)}

            {/* Facturas inválidas */}
            {validationData.invalid_count > 0 && (<div>
                <h4 className="font-medium text-red-600 mb-3">
                  Facturas inválidas ({validationData.invalid_count})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 bg-red-50">                  {validationData.invalid_invoices.map(function (invoice) { return (<div key={invoice.id} className="p-3 bg-white rounded border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{String(invoice.invoice_number || '')}</span>
                        <span className="text-sm text-gray-600">{String(invoice.status || '')}</span>
                      </div>                      <div className="text-sm text-red-600">
                        {Array.isArray(invoice.reasons) ? invoice.reasons.map(function (reason, idx) { return (<div key={idx}>• {typeof reason === 'string' ? reason : typeof reason === 'object' ? JSON.stringify(reason) : String(reason || '')}</div>); }) : null}
                      </div>
                    </div>); })}
                </div>
              </div>)}

            {/* Facturas no encontradas */}
            {validationData.not_found_count > 0 && (<div>
                <h4 className="font-medium text-gray-600 mb-3">
                  Facturas no encontradas ({validationData.not_found_count})
                </h4>                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg border">
                  {Array.isArray(validationData.not_found_ids) ? validationData.not_found_ids.map(String).join(', ') : String(validationData.not_found_ids || '')}
                </div>
              </div>)}

            <div className="flex justify-end pt-4 border-t sticky bottom-0 bg-white">
              <Button onClick={function () { return setShowValidationDetails(false); }}>
                Cerrar
              </Button>
            </div>
          </div>
        </Modal>)}
    </>);
}
