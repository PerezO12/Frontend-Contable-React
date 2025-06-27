/**
 * Componente de búsqueda de productos para líneas de factura
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useProductsForInvoices } from '../hooks/useProductsForInvoices';
import { formatCurrency } from '@/shared/utils/formatters';
export function ProductSearch(_a) {
    var _b = _a.value, value = _b === void 0 ? '' : _b, onChange = _a.onChange, onSelect = _a.onSelect, _c = _a.disabled, disabled = _c === void 0 ? false : _c, _d = _a.placeholder, placeholder = _d === void 0 ? "Buscar producto..." : _d, error = _a.error;
    var _e = useState(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = useState(false), dropdownOpen = _f[0], setDropdownOpen = _f[1];
    var _g = useState(''), selectedProductName = _g[0], setSelectedProductName = _g[1];
    var inputRef = useRef(null);
    var dropdownRef = useRef(null);
    var _h = useProductsForInvoices(), products = _h.options, loading = _h.loading;
    // Filtrar productos basado en el término de búsqueda
    var getFilteredProducts = useCallback(function (term) {
        if (!term || term.length === 0) {
            return products.slice(0, 10);
        }
        if (term.length < 2) {
            return [];
        }
        var searchLower = term.toLowerCase();
        return products
            .filter(function (product) {
            return product.label.toLowerCase().includes(searchLower) ||
                (product.code && product.code.toLowerCase().includes(searchLower));
        })
            .slice(0, 20);
    }, [products]);
    // Manejar selección de producto
    var handleProductSelect = function (product) {
        setSearchTerm('');
        setSelectedProductName(product.label);
        setDropdownOpen(false);
        if (onSelect) {
            onSelect({
                id: product.value,
                code: product.code || '',
                name: product.label,
                sale_price: product.price || 0,
                purchase_price: product.price || 0,
                income_account_id: undefined,
                expense_account_id: undefined,
                tax_ids: []
            });
        }
        else if (onChange) {
            onChange(product.value, {
                code: product.code,
                name: product.label,
                price: product.price,
                description: product.label
            });
        }
    };
    // Manejar cambio en el input
    var handleInputChange = function (inputValue) {
        setSearchTerm(inputValue);
        setDropdownOpen(true);
        if (!inputValue) {
            setSelectedProductName('');
            if (onChange) {
                onChange('', { name: '', description: '' });
            }
        }
    };
    var displayValue = value ? selectedProductName : searchTerm;
    useEffect(function () {
        if (value && !selectedProductName) {
            var selectedProduct = products.find(function (p) { return p.value === value; });
            if (selectedProduct) {
                setSelectedProductName(selectedProduct.label);
            }
        }
    }, [value, products, selectedProductName]);
    useEffect(function () {
        var handleClickOutside = function (event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return function () { return document.removeEventListener('mousedown', handleClickOutside); };
    }, []);
    var filteredProducts = getFilteredProducts(searchTerm);
    return (<div className="relative" ref={dropdownRef}>
      <Input ref={inputRef} type="text" value={displayValue} onChange={function (e) { return handleInputChange(e.target.value); }} onFocus={function () { return setDropdownOpen(true); }} placeholder={placeholder} disabled={disabled} error={error} className={"".concat(value ? 'bg-blue-50 border-blue-300' : '')}/>
      
      {loading && (<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm"/>
        </div>)}

      {dropdownOpen && filteredProducts.length > 0 && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map(function (product) { return (<button key={product.value} onClick={function () { return handleProductSelect(product); }} className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {product.label}
                  </div>
                  {product.code && (<div className="text-sm text-gray-500">
                      Código: {product.code}
                    </div>)}
                </div>
                {product.price && (<div className="text-sm font-medium text-blue-600">
                    {formatCurrency(product.price)}
                  </div>)}
              </div>
            </button>); })}
        </div>)}

      {dropdownOpen && searchTerm.length >= 2 && filteredProducts.length === 0 && !loading && (<div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron productos
          </div>
        </div>)}

      {value && selectedProductName && !dropdownOpen && (<div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
          <div className="text-sm text-blue-800">
            ✓ Producto seleccionado: {selectedProductName}
          </div>
        </div>)}
    </div>);
}
