import React, { useState, useEffect, useRef } from 'react';
import { useProductsForSelector, useProductSearch } from '../hooks';
import type { ProductSummary } from '../types';
import { ProductTypeLabels, MeasurementUnitLabels } from '../types';

interface ProductSelectorProps {
  value?: string; // product_id
  onSelect: (product: ProductSummary | null) => void;
  onPriceSelect?: (price: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function ProductSelector({
  value,
  onSelect,
  onPriceSelect,
  disabled = false,
  placeholder = 'Buscar producto...',
  className = '',
  required = false
}: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks para productos
  const { products: allProducts } = useProductsForSelector(200);
  const { results: searchResults, searchProducts, clearSearch } = useProductSearch();

  // Lista de productos a mostrar (search results o todos)
  const productsToShow = searchTerm.trim() ? searchResults : allProducts.slice(0, 50);

  // Encontrar producto seleccionado cuando cambia el value
  useEffect(() => {
    if (value && allProducts.length > 0) {
      const product = allProducts.find(p => p.id === value);
      setSelectedProduct(product || null);
      if (product) {
        setSearchTerm(`${product.code} - ${product.name}`);
      }
    } else {
      setSelectedProduct(null);
      setSearchTerm('');
    }
  }, [value, allProducts]);

  // Buscar productos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() && searchTerm.trim().length > 2) {
      const timeoutId = setTimeout(() => {
        searchProducts(searchTerm.trim());
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      clearSearch();
    }
  }, [searchTerm, searchProducts, clearSearch]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    
    // Si se borra el input, limpiar selección
    if (!term.trim()) {
      setSelectedProduct(null);
      onSelect(null);
    }
  };

  const handleProductSelect = (product: ProductSummary) => {
    setSelectedProduct(product);
    setSearchTerm(`${product.code} - ${product.name}`);
    setIsOpen(false);
    onSelect(product);
    
    // Auto-llenar precio si está disponible
    if (onPriceSelect && product.sale_price) {
      onPriceSelect(product.sale_price);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const formatPrice = (price?: string) => {
    if (!price) return '';
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getStockStatusColor = (product: ProductSummary) => {
    if (!product.current_stock) return 'text-gray-500';
    const stock = parseFloat(product.current_stock);
    if (stock <= 0) return 'text-red-500';
    if (stock <= 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${selectedProduct ? 'text-gray-900' : 'text-gray-500'}
        `}
      />

      {/* Indicador de producto seleccionado */}
      {selectedProduct && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      )}

      {/* Dropdown de productos */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {productsToShow.length > 0 ? (
            <ul className="py-1">
              {productsToShow.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => handleProductSelect(product)}
                    className={`
                      w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 
                      focus:outline-none transition-colors duration-150
                      ${selectedProduct?.id === product.id ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{product.code}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {ProductTypeLabels[product.product_type]}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          {product.sale_price && (
                            <span className="text-sm font-medium text-green-600">
                              ${formatPrice(product.sale_price)}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {MeasurementUnitLabels[product.measurement_unit]}
                          </span>
                          {product.current_stock && (
                            <span className={`text-xs ${getStockStatusColor(product)}`}>
                              Stock: {parseFloat(product.current_stock).toLocaleString('es-ES')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              {searchTerm.trim() ? 'No se encontraron productos' : 'Escribe para buscar productos'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
