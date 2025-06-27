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
export var ReasonPromptModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onConfirm = _a.onConfirm, title = _a.title, placeholder = _a.placeholder, _b = _a.showForceOption, showForceOption = _b === void 0 ? false : _b, _c = _a.forceOptionLabel, forceOptionLabel = _c === void 0 ? "Forzar operación" : _c, _d = _a.forceOptionDescription, forceOptionDescription = _d === void 0 ? "Activa esta opción para forzar la operación aún si no se cumplen algunas validaciones. Usar con precaución." : _d;
    var _e = useState(''), reason = _e[0], setReason = _e[1];
    var _f = useState(false), forceOperation = _f[0], setForceOperation = _f[1];
    var _g = useState(false), isSubmitting = _g[0], setIsSubmitting = _g[1];
    useEffect(function () {
        if (isOpen) {
            setReason('');
            setForceOperation(false);
            setIsSubmitting(false);
        }
    }, [isOpen]);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!reason.trim())
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onConfirm(reason.trim(), showForceOption ? forceOperation : undefined)];
                case 2:
                    _a.sent();
                    onClose();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error al confirmar:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleBackdropClick = function (e) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    if (!isOpen)
        return null;
    return (<>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
        }} onClick={handleBackdropClick}>        {/* Modal Container */}
        <div className="w-full max-w-md transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95">
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}>
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100" aria-label="Cerrar">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="px-6 py-6">
              <div className="mb-6">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-3">
                  Ingrese la razón para esta acción
                </label>
                <textarea id="reason" value={reason} onChange={function (e) { return setReason(e.target.value); }} placeholder={placeholder} rows={4} required disabled={isSubmitting} autoFocus className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-400" style={{
            backgroundColor: '#fafafa',
            fontSize: '14px',
            lineHeight: '1.5',
        }}/>                <p className="mt-2 text-xs text-gray-500">
                  Proporcione una explicación clara para esta operación
                </p>
              </div>              {/* Force Operation Checkbox */}
              {showForceOption && (<div className="mb-6">
                  <label className="flex items-start space-x-3">
                    <input type="checkbox" checked={forceOperation} onChange={function (e) { return setForceOperation(e.target.checked); }} disabled={isSubmitting} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">
                        {forceOptionLabel}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {forceOptionDescription}
                        <span className="text-yellow-600 font-medium"> Usar con precaución.</span>
                      </p>
                    </div>
                  </label>
                </div>)}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50">
                  Cancelar
                </button>
                <button type="submit" disabled={!reason.trim() || isSubmitting} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2">
                  {isSubmitting ? (<>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Procesando...</span>
                    </>) : (<span>Confirmar</span>)}
                </button>
              </div>
            </form>          </div>
        </div>
      </div>
    </>);
};
