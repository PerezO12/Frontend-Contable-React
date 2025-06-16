import { useState, useCallback, useEffect } from 'react';
import { ProductSelector, ProductLineInfo } from '../../products';
import { Button } from '../../../components/ui/Button';
import type { ProductSummary } from '../../products/types';
import type { JournalEntryLineFormData } from '../types';
import Decimal from 'decimal.js';

interface JournalEntryProductLineProps {
  line: JournalEntryLineFormData;
  lineIndex: number;
  onLineChange: (index: number, field: keyof JournalEntryLineFormData, value: string) => void;
  disabled?: boolean;
  showProductInfo?: boolean;
}

export function JournalEntryProductLine({
  line,
  lineIndex,
  onLineChange,
  disabled = false,
  showProductInfo = true
}: JournalEntryProductLineProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  // Manejar selección de producto
  const handleProductSelect = useCallback((product: ProductSummary | null) => {
    setSelectedProduct(product);
    
    if (product) {
      // Limpiar campos de producto existentes
      onLineChange(lineIndex, 'product_id', product.id);
      
      // Auto-llenar precio sugerido si no hay precio actual
      if (product.sale_price && (!line.unit_price || line.unit_price === '0' || line.unit_price === '0.00')) {
        onLineChange(lineIndex, 'unit_price', product.sale_price);
      }
      
      // Auto-llenar impuesto si el producto tiene tax_rate
      if (product.tax_rate && (!line.tax_percentage || line.tax_percentage === '0' || line.tax_percentage === '0.00')) {
        onLineChange(lineIndex, 'tax_percentage', product.tax_rate);
      }
      
      // Si no hay descripción, usar el nombre del producto
      if (!line.description?.trim()) {
        onLineChange(lineIndex, 'description', product.name);
      }
      
      setShowCalculator(true);
    } else {
      // Limpiar todos los campos relacionados con productos
      onLineChange(lineIndex, 'product_id', '');
      onLineChange(lineIndex, 'quantity', '');
      onLineChange(lineIndex, 'unit_price', '');
      onLineChange(lineIndex, 'discount_percentage', '');
      onLineChange(lineIndex, 'discount_amount', '');
      onLineChange(lineIndex, 'tax_percentage', '');
      onLineChange(lineIndex, 'tax_amount', '');
      setShowCalculator(false);
    }
  }, [lineIndex, onLineChange, line.unit_price, line.tax_percentage, line.description]);
  // Manejar cambios en campos de producto
  const handleProductFieldChange = useCallback((field: string, value: string) => {
    onLineChange(lineIndex, field as keyof JournalEntryLineFormData, value);
    
    // No ejecutar auto-cálculo automáticamente para evitar conflictos con la entrada del usuario
    // El usuario puede usar el botón "Aplicar Cálculo" cuando esté listo
  }, [lineIndex, onLineChange]);
  // Actualizar monto de línea basado en cálculos de producto
  const updateLineAmountFromProduct = useCallback(() => {
    if (!line.quantity || !line.unit_price) return;

    try {
      const quantity = new Decimal(line.quantity);
      const unitPrice = new Decimal(line.unit_price);
      let total = quantity.mul(unitPrice);

      // Aplicar descuentos
      if (line.discount_amount) {
        total = total.minus(new Decimal(line.discount_amount));
      } else if (line.discount_percentage) {
        const discountAmount = total.mul(new Decimal(line.discount_percentage)).div(100);
        total = total.minus(discountAmount);
      }

      // El impuesto se maneja separadamente en la contabilidad
      const finalAmount = total.toFixed(2);

      // Determinar si actualizar débito o crédito basado en los valores actuales
      const currentDebit = parseFloat(line.debit_amount || '0');
      const currentCredit = parseFloat(line.credit_amount || '0');

      if (currentDebit > 0 || (currentDebit === 0 && currentCredit === 0)) {
        // Si hay débito o ambos están en cero, actualizar débito
        onLineChange(lineIndex, 'debit_amount', finalAmount);
        if (currentCredit > 0) {
          onLineChange(lineIndex, 'credit_amount', '0.00');
        }
      } else if (currentCredit > 0) {
        // Si hay crédito, actualizar crédito
        onLineChange(lineIndex, 'credit_amount', finalAmount);
      }
    } catch (error) {
      console.error('Error calculando monto de línea:', error);
    }
  }, [line, lineIndex, onLineChange]);

  // Auto-cálculo inteligente con debounce para no interferir con la escritura
  useEffect(() => {
    // Solo auto-calcular si hay cantidad, precio y ambos montos están en cero
    if (line.quantity && line.unit_price && 
        parseFloat(line.debit_amount || '0') === 0 && 
        parseFloat(line.credit_amount || '0') === 0) {
      
      const timer = setTimeout(() => {
        updateLineAmountFromProduct();
      }, 2000); // 2 segundos de delay para dar tiempo al usuario

      return () => clearTimeout(timer);
    }
  }, [line.quantity, line.unit_price, line.debit_amount, line.credit_amount, updateLineAmountFromProduct]);

  const handleToggleCalculator = () => {
    setShowCalculator(!showCalculator);
  };

  const clearProduct = () => {
    setSelectedProduct(null);
    handleProductSelect(null);
  };

  return (
    <div className="space-y-3">
      {/* Selector de producto */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-blue-900">
            Producto (Opcional)
          </label>
          {selectedProduct && (
            <div className="flex items-center space-x-2">
              {showProductInfo && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleToggleCalculator}
                  className="text-xs"
                >
                  {showCalculator ? '📊 Ocultar' : '🧮 Calcular'}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="danger"
                onClick={clearProduct}
                className="text-xs"
                title="Quitar producto"
              >
                ✕
              </Button>
            </div>
          )}
        </div>
        
        <ProductSelector
          value={line.product_id}
          onSelect={handleProductSelect}
          onPriceSelect={(price) => {
            if (!line.unit_price || line.unit_price === '0' || line.unit_price === '0.00') {
              handleProductFieldChange('unit_price', price);
            }
          }}
          disabled={disabled}
          placeholder="Buscar producto por código o nombre..."
          className="w-full"
        />
      </div>

      {/* Información detallada del producto y calculadora */}
      {selectedProduct && showCalculator && showProductInfo && (
        <div className="border border-gray-200 rounded-lg">
          <ProductLineInfo
            product={selectedProduct}
            quantity={line.quantity || ''}
            unitPrice={line.unit_price || ''}
            discountPercentage={line.discount_percentage || ''}
            discountAmount={line.discount_amount || ''}
            taxPercentage={line.tax_percentage || ''}
            taxAmount={line.tax_amount || ''}
            onQuantityChange={(value) => handleProductFieldChange('quantity', value)}
            onUnitPriceChange={(value) => handleProductFieldChange('unit_price', value)}
            onDiscountPercentageChange={(value) => {
              handleProductFieldChange('discount_percentage', value);
              if (value) {
                handleProductFieldChange('discount_amount', '');
              }
            }}
            onDiscountAmountChange={(value) => {
              handleProductFieldChange('discount_amount', value);
              if (value) {
                handleProductFieldChange('discount_percentage', '');
              }
            }}
            disabled={disabled}
            showCalculations={true}
          />
            {/* Botón para aplicar cálculo al monto de línea */}
          {line.quantity && line.unit_price && (
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <Button
                type="button"
                onClick={updateLineAmountFromProduct}
                variant="primary"
                size="sm"
                className={`w-full ${
                  parseFloat(line.debit_amount || '0') === 0 && parseFloat(line.credit_amount || '0') === 0
                    ? 'bg-green-600 hover:bg-green-700 animate-pulse'
                    : ''
                }`}
                disabled={disabled}
              >
                📝 Aplicar Cálculo al Monto de Línea
                {parseFloat(line.debit_amount || '0') === 0 && parseFloat(line.credit_amount || '0') === 0 && (
                  <span className="ml-2">✨</span>
                )}
              </Button>
              <p className="text-xs text-gray-600 mt-1 text-center">
                {parseFloat(line.debit_amount || '0') === 0 && parseFloat(line.credit_amount || '0') === 0
                  ? '¡Listo para calcular! Los montos están en cero.'
                  : 'Esto actualizará automáticamente el monto de débito o crédito'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Información resumida cuando el calculador está oculto */}
      {selectedProduct && !showCalculator && showProductInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900">{selectedProduct.code}</span>
              <span className="text-sm text-gray-600">{selectedProduct.name}</span>
            </div>
            {line.quantity && line.unit_price && (
              <div className="text-sm text-gray-600">
                {parseFloat(line.quantity).toLocaleString('es-ES')} × $
                {parseFloat(line.unit_price).toLocaleString('es-ES', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campos ocultos para el formulario (cuando no se muestra la información) */}
      {selectedProduct && !showProductInfo && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="text"
              value={line.quantity || ''}
              onChange={(e) => handleProductFieldChange('quantity', e.target.value)}
              disabled={disabled}
              placeholder="0.00"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Precio Unit.
            </label>
            <input
              type="text"
              value={line.unit_price || ''}
              onChange={(e) => handleProductFieldChange('unit_price', e.target.value)}
              disabled={disabled}
              placeholder="0.00"
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
