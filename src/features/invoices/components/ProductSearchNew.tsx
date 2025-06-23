/**
 * Componente de búsqueda de productos para líneas de factura
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useProductsForInvoices } from '../hooks/useProductsForInvoices';
import { formatCurrency } from '@/shared/utils/formatters';

interface ProductSearchProps {
  value?: string;
  onChange?: (productId: string, productInfo: {
    code?: string;
    name: string;
    price?: number;
    description?: string;
  }) => void;
  onSelect?: (product: {
    id: string;
    code: string;
    name: string;
    sale_price: number;
    purchase_price: number;
    income_account_id?: string;
    expense_account_id?: string;
    tax_ids?: string[];
  }) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export function ProductSearch({ 
  value = '', 
  onChange, 
  onSelect,
  disabled = false, 
  placeholder = "Buscar producto...",
  error 
}: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { options: products, loading } = useProductsForInvoices();

  // Filtrar productos basado en el término de búsqueda
  const getFilteredProducts = useCallback((term: string) => {
    if (!term || term.length === 0) {
      return products.slice(0, 10);
    }
    
    if (term.length < 2) {
      return [];
    }
    
    const searchLower = term.toLowerCase();
    return products
      .filter(product => 
        product.label.toLowerCase().includes(searchLower) ||
        (product.code && product.code.toLowerCase().includes(searchLower))
      )
      .slice(0, 20);
  }, [products]);

  // Manejar selección de producto
  const handleProductSelect = (product: { 
    value: string; 
    label: string; 
    code?: string; 
    price?: number;
  }) => {
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
    } else if (onChange) {
      onChange(product.value, { 
        code: product.code, 
        name: product.label,
        price: product.price,
        description: product.label
      });
    }
  };

  // Manejar cambio en el input
  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
    setDropdownOpen(true);
    
    if (!inputValue) {
      setSelectedProductName('');
      if (onChange) {
        onChange('', { name: '', description: '' });
      }
    }
  };

  const displayValue = value ? selectedProductName : searchTerm;

  useEffect(() => {
    if (value && !selectedProductName) {
      const selectedProduct = products.find(p => p.value === value);
      if (selectedProduct) {
        setSelectedProductName(selectedProduct.label);
      }
    }
  }, [value, products, selectedProductName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = getFilteredProducts(searchTerm);

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setDropdownOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        className={`${value ? 'bg-blue-50 border-blue-300' : ''}`}
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}

      {dropdownOpen && filteredProducts.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.value}
              onClick={() => handleProductSelect(product)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {product.label}
                  </div>
                  {product.code && (
                    <div className="text-sm text-gray-500">
                      Código: {product.code}
                    </div>
                  )}
                </div>
                {product.price && (
                  <div className="text-sm font-medium text-blue-600">
                    {formatCurrency(product.price)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {dropdownOpen && searchTerm.length >= 2 && filteredProducts.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron productos
          </div>
        </div>
      )}

      {value && selectedProductName && !dropdownOpen && (
        <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
          <div className="text-sm text-blue-800">
            ✓ Producto seleccionado: {selectedProductName}
          </div>
        </div>
      )}
    </div>
  );
}
