/**
 * Componente de búsqueda de clientes para facturas
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useThirdPartiesForInvoices } from '../hooks/useThirdPartiesForInvoices';
import { ThirdPartyType } from '@/features/third-parties/types';
export function CustomerSearch(_a) {
    var _b = _a.value, value = _b === void 0 ? '' : _b, onChange = _a.onChange, onSelect = _a.onSelect, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.placeholder, placeholder = _d === void 0 ? "Buscar cliente..." : _d, error = _a.error, _e = _a.filterByType, filterByType = _e === void 0 ? 'customer' : _e;
    var _f = useState(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = useState(false), dropdownOpen = _g[0], setDropdownOpen = _g[1];
    var _h = useState(''), selectedCustomerName = _h[0], setSelectedCustomerName = _h[1];
    var inputRef = useRef(null);
    var dropdownRef = useRef(null);
    var _j = useThirdPartiesForInvoices({
        type: ThirdPartyType.CUSTOMER
    }), customers = _j.options, loading = _j.loading;
    // Filtrar clientes basado en el término de búsqueda
    var getFilteredCustomers = useCallback(function (term) {
        if (!term || term.length === 0) {
            // Si no hay término, mostrar los primeros 10 clientes como sugerencias iniciales
            return customers.slice(0, 10);
        }
        if (term.length < 2) {
            return [];
        }
        var searchLower = term.toLowerCase();
        return customers
            .filter(function (customer) {
            return customer.label.toLowerCase().includes(searchLower) ||
                (customer.code && customer.code.toLowerCase().includes(searchLower));
        })
            .slice(0, 20); // Limitar a 20 resultados
    }, [customers]);
    // Manejar selección de cliente
    var handleCustomerSelect = function (customer) {
        setSearchTerm('');
        setSelectedCustomerName(customer.label);
        setDropdownOpen(false);
        // Usar onSelect si está disponible (nuevo patrón Odoo)
        if (onSelect) {
            onSelect({
                id: customer.value,
                name: customer.label,
                code: customer.code,
                document_number: customer.code, // Por compatibilidad
                third_party_type: filterByType,
                default_account_id: undefined // Por ahora undefined
            });
        }
        else if (onChange) {
            // Fallback al patrón anterior
            onChange(customer.value, {
                code: customer.code,
                name: customer.label
            });
        }
    }; // Manejar cambio en el input
    var handleInputChange = function (inputValue) {
        setSearchTerm(inputValue);
        setDropdownOpen(true); // Siempre abrir dropdown, incluso sin texto
        // Si se borra el input, limpiar selección
        if (!inputValue) {
            setSelectedCustomerName('');
            if (onChange) {
                onChange('', { name: '' });
            }
        }
    };
    // Mostrar el nombre del cliente seleccionado o el término de búsqueda
    var displayValue = value ? selectedCustomerName : searchTerm;
    // Efecto para cargar el nombre del cliente si ya hay un value
    useEffect(function () {
        if (value && !selectedCustomerName) {
            var selectedCustomer = customers.find(function (c) { return c.value === value; });
            if (selectedCustomer) {
                setSelectedCustomerName(selectedCustomer.label);
            }
        }
    }, [value, customers, selectedCustomerName]);
    // Cerrar dropdown al hacer clic fuera
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var filteredCustomers = getFilteredCustomers(searchTerm);
    return (<div className="relative" ref={dropdownRef}>
      <Input ref={inputRef} type="text" value={displayValue} onChange={function (e) { return handleInputChange(e.target.value); }} onFocus={function () {
            setDropdownOpen(true); // Mostrar dropdown al hacer foco
        }} placeholder={placeholder} disabled={disabled} error={error} className={"".concat(value ? 'bg-green-50 border-green-300' : '')}/>
      
      {loading && (<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm"/>
        </div>)}

      {/* Dropdown de resultados */}
      {dropdownOpen && filteredCustomers.length > 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCustomers.map(function (customer) { return (<button key={customer.value} onClick={function () { return handleCustomerSelect(customer); }} className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {customer.label}
                  </div>
                  {customer.code && (<div className="text-sm text-gray-500">
                      Código: {customer.code}
                    </div>)}
                </div>
              </div>
            </button>); })}
        </div>)}      {/* Mensaje cuando no hay resultados */}
      {dropdownOpen && searchTerm.length >= 2 && filteredCustomers.length === 0 && !loading && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron clientes
          </div>
        </div>)}

      {/* Información del cliente seleccionado */}
      {value && selectedCustomerName && !dropdownOpen && (<div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
          <div className="text-sm text-green-800">
            ✓ Cliente seleccionado: {selectedCustomerName}
          </div>
        </div>)}
    </div>);
}
