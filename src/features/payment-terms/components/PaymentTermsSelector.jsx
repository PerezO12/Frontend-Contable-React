import React, { useState, useCallback } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { usePaymentTermsList } from '../hooks/usePaymentTerms';
export var PaymentTermsSelector = function (_a) {
    var value = _a.value, onChange = _a.onChange, onPaymentTermsSelect = _a.onPaymentTermsSelect, error = _a.error, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.placeholder, placeholder = _c === void 0 ? "Seleccionar condiciones de pago..." : _c, _d = _a.className, className = _d === void 0 ? "" : _d;
    var _e = usePaymentTermsList({
        initialFilters: { is_active: true },
        autoLoad: true
    }), paymentTerms = _e.paymentTerms, loading = _e.loading, serviceError = _e.error;
    var _f = useState(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = useState(false), isOpen = _g[0], setIsOpen = _g[1];
    // Asegurar que paymentTerms sea siempre un array válido
    var safePaymentTerms = Array.isArray(paymentTerms) ? paymentTerms : [];
    var selectedPaymentTerms = safePaymentTerms.find(function (pt) { return pt.id === value; });
    var filteredPaymentTerms = useCallback(function () {
        if (!searchTerm)
            return safePaymentTerms.slice(0, 10);
        var term = searchTerm.toLowerCase();
        return safePaymentTerms
            .filter(function (paymentTerm) {
            var _a;
            return paymentTerm.code.toLowerCase().includes(term) ||
                paymentTerm.name.toLowerCase().includes(term) ||
                (((_a = paymentTerm.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term)) || false);
        })
            .slice(0, 10);
    }, [safePaymentTerms, searchTerm]);
    var handlePaymentTermsSelect = function (paymentTerm) {
        onChange(paymentTerm.id);
        onPaymentTermsSelect === null || onPaymentTermsSelect === void 0 ? void 0 : onPaymentTermsSelect(paymentTerm);
        setSearchTerm('');
        setIsOpen(false);
    };
    var handleClear = function () {
        onChange(undefined);
        onPaymentTermsSelect === null || onPaymentTermsSelect === void 0 ? void 0 : onPaymentTermsSelect(null);
        setSearchTerm('');
        setIsOpen(false);
    };
    var handleInputChange = function (e) {
        var newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setIsOpen(true);
        if (newSearchTerm === '' && value) {
            handleClear();
        }
    };
    var displayValue = selectedPaymentTerms
        ? "".concat(selectedPaymentTerms.code, " - ").concat(selectedPaymentTerms.name)
        : searchTerm;
    return (<div className={"relative ".concat(className)}>
      <div className="relative">
        <Input value={displayValue} onChange={handleInputChange} onFocus={function () { return setIsOpen(true); }} onBlur={function () { return setTimeout(function () { return setIsOpen(false); }, 200); }} placeholder={placeholder} disabled={disabled} error={error} className="text-sm"/>
        
        {value && (<Button type="button" variant="secondary" size="sm" onClick={handleClear} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 text-xs" disabled={disabled}>
            ×
          </Button>)}
        
        {loading && (<div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <Spinner size="sm"/>
          </div>)}
      </div>      {/* Dropdown */}
      {isOpen && !disabled && (<div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-auto max-h-80 w-full mt-1">
          {loading && (<div className="px-4 py-3 text-center">
              <Spinner size="sm"/>
              <span className="ml-2 text-sm text-gray-500">Cargando condiciones de pago...</span>
            </div>)}
          
          {!loading && filteredPaymentTerms().map(function (paymentTerm) {
                var _a, _b, _c;
                return (<div key={paymentTerm.id} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors" onClick={function () { return handlePaymentTermsSelect(paymentTerm); }}>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {paymentTerm.code}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {paymentTerm.name}
                  </span>                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {paymentTerm.description}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {(((_a = paymentTerm.payment_schedules) === null || _a === void 0 ? void 0 : _a.length) || 0) === 1 ? 'Plazo fijo' : 'Cronograma'} • 
                  {(((_b = paymentTerm.payment_schedules) === null || _b === void 0 ? void 0 : _b.length) || 0) === 1
                        ? " ".concat(paymentTerm.max_days, " d\u00EDas")
                        : " ".concat(((_c = paymentTerm.payment_schedules) === null || _c === void 0 ? void 0 : _c.length) || 0, " cuotas")}
                </div>
              </div>
            </div>);
            })}
          
          {!loading && filteredPaymentTerms().length === 0 && (<div className="px-4 py-3 text-center text-gray-500 text-sm">
              {searchTerm
                    ? "No se encontraron condiciones de pago que coincidan con \"".concat(searchTerm, "\"")
                    : safePaymentTerms.length === 0
                        ? "No hay condiciones de pago disponibles"
                        : "No se encontraron condiciones de pago"}
            </div>)}
        </div>)}      {(error || serviceError) && (<ValidationMessage type="error" message={error || serviceError || 'Error desconocido'}/>)}

      {/* Selected payment terms details */}
      {selectedPaymentTerms && (<div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
          <div className="font-medium">{selectedPaymentTerms.name}</div>
          <div className="text-blue-600">{selectedPaymentTerms.description}</div>
        </div>)}
    </div>);
};
