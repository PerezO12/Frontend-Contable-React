/**
 * Componente de búsqueda y selección de términos de pago para facturas
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { usePaymentTermsList } from '@/features/payment-terms/hooks/usePaymentTerms';
export function PaymentTermsSearch(_a) {
    var _b = _a.value, value = _b === void 0 ? '' : _b, onChange = _a.onChange, onSelect = _a.onSelect, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.placeholder, placeholder = _d === void 0 ? "Buscar plan de pago..." : _d, error = _a.error;
    var _e = useState(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = useState(false), dropdownOpen = _f[0], setDropdownOpen = _f[1];
    var _g = useState(''), selectedPaymentTermName = _g[0], setSelectedPaymentTermName = _g[1];
    var inputRef = useRef(null);
    var dropdownRef = useRef(null);
    var _h = usePaymentTermsList({
        initialFilters: { is_active: true }
    }), paymentTerms = _h.paymentTerms, loading = _h.loading;
    // Convertir a formato de opciones para búsqueda
    var paymentTermsOptions = (paymentTerms === null || paymentTerms === void 0 ? void 0 : paymentTerms.map(function (term) { return ({
        value: term.id,
        label: term.name,
        code: term.code,
        days: term.max_days || 0
    }); })) || [];
    // Filtrar términos de pago basado en el término de búsqueda
    var getFilteredPaymentTerms = useCallback(function (term) {
        if (!term || term.length === 0) {
            return paymentTermsOptions.slice(0, 10);
        }
        if (term.length < 2) {
            return [];
        }
        var searchLower = term.toLowerCase();
        return paymentTermsOptions
            .filter(function (paymentTerm) {
            return paymentTerm.label.toLowerCase().includes(searchLower) ||
                (paymentTerm.code && paymentTerm.code.toLowerCase().includes(searchLower));
        })
            .slice(0, 20);
    }, [paymentTermsOptions]);
    // Manejar selección de término de pago
    var handlePaymentTermSelect = function (paymentTerm) {
        setSearchTerm('');
        setSelectedPaymentTermName(paymentTerm.label);
        setDropdownOpen(false);
        if (onSelect) {
            onSelect({
                id: paymentTerm.value,
                name: paymentTerm.label,
                code: paymentTerm.code,
                days: paymentTerm.days || 0
            });
        }
        else if (onChange) {
            onChange(paymentTerm.value, {
                name: paymentTerm.label,
                days: paymentTerm.days,
                code: paymentTerm.code
            });
        }
    };
    // Manejar cambio en el input
    var handleInputChange = function (inputValue) {
        setSearchTerm(inputValue);
        setDropdownOpen(true);
        if (!inputValue) {
            setSelectedPaymentTermName('');
            if (onChange) {
                onChange('', { name: '', days: 0, code: '' });
            }
        }
    };
    var displayValue = value ? selectedPaymentTermName : searchTerm;
    useEffect(function () {
        if (value && !selectedPaymentTermName) {
            var selectedPaymentTerm = paymentTermsOptions.find(function (p) { return p.value === value; });
            if (selectedPaymentTerm) {
                setSelectedPaymentTermName(selectedPaymentTerm.label);
            }
        }
    }, [value, paymentTermsOptions, selectedPaymentTermName]);
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var filteredPaymentTerms = getFilteredPaymentTerms(searchTerm);
    return (<div className="relative" ref={dropdownRef}>
      <Input ref={inputRef} type="text" value={displayValue} onChange={function (e) { return handleInputChange(e.target.value); }} onFocus={function () { return setDropdownOpen(true); }} placeholder={placeholder} disabled={disabled} error={error} className={"".concat(value ? 'bg-purple-50 border-purple-300' : '')}/>
      
      {loading && (<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm"/>
        </div>)}

      {dropdownOpen && filteredPaymentTerms.length > 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredPaymentTerms.map(function (paymentTerm) { return (<button key={paymentTerm.value} onClick={function () { return handlePaymentTermSelect(paymentTerm); }} className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {paymentTerm.label}
                  </div>
                  {paymentTerm.code && (<div className="text-sm text-gray-500">
                      Código: {paymentTerm.code}
                    </div>)}
                </div>
                <div className="text-sm font-medium text-purple-600">
                  {paymentTerm.days} días
                </div>
              </div>
            </button>); })}
        </div>)}

      {dropdownOpen && searchTerm.length >= 2 && filteredPaymentTerms.length === 0 && !loading && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron términos de pago
          </div>
        </div>)}

      {value && selectedPaymentTermName && !dropdownOpen && (<div className="mt-2 p-2 bg-purple-50 rounded-md border border-purple-200">
          <div className="text-sm text-purple-800">
            ✓ Términos seleccionados: {selectedPaymentTermName}
          </div>
        </div>)}
    </div>);
}
