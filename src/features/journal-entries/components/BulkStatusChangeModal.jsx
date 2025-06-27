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
import { JournalEntryStatus, JOURNAL_ENTRY_STATUS_LABELS } from '../types';
var STATUS_OPTIONS = [
    {
        value: JournalEntryStatus.DRAFT,
        label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.DRAFT],
        description: 'Restaurar los asientos a estado borrador para edición',
        requiresReason: true,
        icon: '📝'
    },
    {
        value: JournalEntryStatus.PENDING,
        label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.PENDING],
        description: 'Marcar como pendientes de revisión',
        requiresReason: false,
        icon: '⏳'
    },
    {
        value: JournalEntryStatus.APPROVED,
        label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.APPROVED],
        description: 'Aprobar los asientos seleccionados',
        requiresReason: false,
        icon: '✅'
    },
    {
        value: JournalEntryStatus.POSTED,
        label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.POSTED],
        description: 'Contabilizar los asientos (afectará saldos)',
        requiresReason: true,
        icon: '📊'
    },
    {
        value: JournalEntryStatus.CANCELLED,
        label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.CANCELLED],
        description: 'Cancelar los asientos seleccionados',
        requiresReason: true,
        icon: '❌'
    }
];
export var BulkStatusChangeModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, selectedEntryIds = _a.selectedEntryIds, onChangeStatus = _a.onChangeStatus, onSuccess = _a.onSuccess;
    var _b = useState(null), selectedStatus = _b[0], setSelectedStatus = _b[1];
    var _c = useState(''), reason = _c[0], setReason = _c[1];
    var _d = useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    var selectedOption = STATUS_OPTIONS.find(function (option) { return option.value === selectedStatus; });
    var requiresReason = (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.requiresReason) || false;
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!selectedStatus) {
                        setError('Debe seleccionar un estado');
                        return [2 /*return*/];
                    }
                    if (requiresReason && !reason.trim()) {
                        setError('Debe proporcionar una razón para esta operación');
                        return [2 /*return*/];
                    }
                    setIsSubmitting(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onChangeStatus(selectedEntryIds, selectedStatus, requiresReason ? reason.trim() : undefined)];
                case 2:
                    result = _a.sent();
                    if (onSuccess) {
                        onSuccess(result);
                    }
                    handleClose();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al cambiar estado:', error_1);
                    setError(error_1.message || 'Error al cambiar el estado de los asientos');
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleClose = function () {
        setSelectedStatus(null);
        setReason('');
        setError(null);
        onClose();
    };
    var handleStatusSelect = function (status) {
        var _a;
        setSelectedStatus(status);
        setError(null);
        // Limpiar razón si el nuevo estado no la requiere
        if (!((_a = STATUS_OPTIONS.find(function (opt) { return opt.value === status; })) === null || _a === void 0 ? void 0 : _a.requiresReason)) {
            setReason('');
        }
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }}>
      <div className="w-full max-w-2xl transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95">
        <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Cambiar Estado de Asientos
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
              <span className="sr-only">Cerrar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Se cambiarán <strong>{selectedEntryIds.length}</strong> asiento{selectedEntryIds.length !== 1 ? 's' : ''} contable{selectedEntryIds.length !== 1 ? 's' : ''} al estado seleccionado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selector de Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Seleccionar nuevo estado
              </label>
              <div className="space-y-2">
                {STATUS_OPTIONS.map(function (option) { return (<div key={option.value} className={"\n                      border rounded-lg p-4 cursor-pointer transition-all\n                      ".concat(selectedStatus === option.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50', "\n                    ")} onClick={function () { return handleStatusSelect(option.value); }}>
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{option.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input type="radio" name="status" value={option.value} checked={selectedStatus === option.value} onChange={function () { return handleStatusSelect(option.value); }} className="text-blue-600 focus:ring-blue-500"/>
                          <span className="font-medium text-gray-900">
                            {option.label}
                          </span>
                          {option.requiresReason && (<span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Requiere razón
                            </span>)}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>); })}
              </div>
            </div>

            {/* Campo de Razón */}
            {requiresReason && (<div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón *
                </label>
                <textarea value={reason} onChange={function (e) { return setReason(e.target.value); }} placeholder={"Ingrese la raz\u00F3n para ".concat(selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label.toLowerCase(), " los asientos...")} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" disabled={isSubmitting}/>
              </div>)}

            {/* Error */}
            {error && (<div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>)}

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!selectedStatus || isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? 'Procesando...' : 'Cambiar Estado'}
              </Button>            </div>
          </form>
        </div>
        </div>
      </div>
    </div>);
};
