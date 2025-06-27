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
import React, { useState, useRef } from 'react';
import { BulkStatusDropdown } from './BulkStatusDropdown';
import { ReasonPromptModal } from './ReasonPromptModal';
import { JournalEntryStatus } from '../types';
export var BulkStatusChanger = function (_a) {
    var selectedEntryIds = _a.selectedEntryIds, onStatusChange = _a.onStatusChange, onSuccess = _a.onSuccess;
    var _b = useState(false), showDropdown = _b[0], setShowDropdown = _b[1];
    var _c = useState(false), showReasonModal = _c[0], setShowReasonModal = _c[1];
    var _d = useState(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = useState(null), pendingStatusChange = _e[0], setPendingStatusChange = _e[1];
    var buttonRef = useRef(null);
    var handleButtonClick = function () {
        if (!isLoading) {
            setShowDropdown(!showDropdown);
        }
    };
    var handleStatusSelect = function (status, requiresReason) { return __awaiter(void 0, void 0, void 0, function () {
        var titles, placeholders;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!requiresReason) return [3 /*break*/, 1];
                    titles = (_a = {},
                        _a[JournalEntryStatus.DRAFT] = 'Restaurar a Borrador',
                        _a[JournalEntryStatus.POSTED] = 'Contabilizar Asientos',
                        _a[JournalEntryStatus.CANCELLED] = 'Cancelar Asientos',
                        _a['REVERSE'] = 'Revertir Asientos',
                        _a);
                    placeholders = (_b = {},
                        _b[JournalEntryStatus.DRAFT] = 'Ingrese la razón para restaurar a borrador...',
                        _b[JournalEntryStatus.POSTED] = 'Ingrese la razón para contabilizar...',
                        _b[JournalEntryStatus.CANCELLED] = 'Ingrese la razón para cancelar...',
                        _b['REVERSE'] = 'Ingrese la razón para revertir los asientos...',
                        _b);
                    setPendingStatusChange({
                        status: status,
                        title: titles[status] || 'Cambiar Estado',
                        placeholder: placeholders[status] || 'Ingrese la razón...'
                    });
                    setShowReasonModal(true);
                    return [3 /*break*/, 3];
                case 1: 
                // Si no requiere razón, ejecutar directamente
                return [4 /*yield*/, executeStatusChange(status)];
                case 2:
                    // Si no requiere razón, ejecutar directamente
                    _c.sent();
                    _c.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var executeStatusChange = function (status, reason, forceOperation) { return __awaiter(void 0, void 0, void 0, function () {
        var result, message, error_1, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onStatusChange(selectedEntryIds, status, reason, forceOperation)];
                case 2:
                    result = _a.sent();
                    // Mostrar mensaje de resultado si hay fallos
                    if ((result === null || result === void 0 ? void 0 : result.total_failed) > 0) {
                        message = "".concat(result.total_updated, " asientos actualizados correctamente, ").concat(result.total_failed, " fallaron.");
                        alert(message);
                    }
                    if (onSuccess) {
                        onSuccess();
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al cambiar estado:', error_1);
                    errorMessage = error_1.message || 'Error desconocido al cambiar el estado';
                    alert("Error: ".concat(errorMessage));
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleReasonConfirm = function (reason, forceOperation) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!pendingStatusChange) return [3 /*break*/, 2];
                    return [4 /*yield*/, executeStatusChange(pendingStatusChange.status, reason, forceOperation)];
                case 1:
                    _a.sent();
                    setPendingStatusChange(null);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleCloseReasonModal = function () {
        setShowReasonModal(false);
        setPendingStatusChange(null);
    };
    var getForceOptionLabel = function (status) {
        var _a;
        var labels = (_a = {},
            _a[JournalEntryStatus.DRAFT] = 'Forzar restauración',
            _a[JournalEntryStatus.APPROVED] = 'Forzar aprobación',
            _a[JournalEntryStatus.POSTED] = 'Forzar contabilización',
            _a[JournalEntryStatus.CANCELLED] = 'Forzar cancelación',
            _a['REVERSE'] = 'Forzar reversión',
            _a);
        return labels[status] || 'Forzar operación';
    };
    var getForceOptionDescription = function (status) {
        var _a;
        var descriptions = (_a = {},
            _a[JournalEntryStatus.DRAFT] = 'Permite restaurar a borrador asientos que normalmente no pueden ser restaurados debido a validaciones de negocio.',
            _a[JournalEntryStatus.APPROVED] = 'Permite aprobar asientos que normalmente no pueden ser aprobados debido a validaciones de negocio.',
            _a[JournalEntryStatus.POSTED] = 'Permite contabilizar asientos que normalmente no pueden ser contabilizados debido a validaciones de negocio.',
            _a[JournalEntryStatus.CANCELLED] = 'Permite cancelar asientos que normalmente no pueden ser cancelados debido a validaciones de negocio.',
            _a['REVERSE'] = 'Permite revertir asientos que normalmente no pueden ser revertidos debido a validaciones de negocio.',
            _a);
        return descriptions[status] || 'Permite ejecutar la operación aún si no se cumplen algunas validaciones de negocio.';
    };
    return (<div className="relative">      
    <button ref={buttonRef} onClick={handleButtonClick} disabled={isLoading || selectedEntryIds.length === 0} className={"inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ".concat(isLoading || selectedEntryIds.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500')}>
        {isLoading ? (<>
            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </>) : (<>🔄 Cambiar Estado ({selectedEntryIds.length})</>)}
      </button>
      
      <BulkStatusDropdown isOpen={showDropdown} onClose={function () { return setShowDropdown(false); }} onStatusSelect={handleStatusSelect} buttonRef={buttonRef}/>      {pendingStatusChange && (<ReasonPromptModal isOpen={showReasonModal} onClose={handleCloseReasonModal} onConfirm={handleReasonConfirm} title={pendingStatusChange.title} placeholder={pendingStatusChange.placeholder} showForceOption={true} forceOptionLabel={getForceOptionLabel(pendingStatusChange.status)} forceOptionDescription={getForceOptionDescription(pendingStatusChange.status)}/>)}
    </div>);
};
