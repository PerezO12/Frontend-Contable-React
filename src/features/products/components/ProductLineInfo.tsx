import React from 'react';
import type { ProductSummary } from '../types';
import { ProductTypeLabels, MeasurementUnitLabels } from '../types';
import Decimal from 'decimal.js';

interface ProductLineInfoProps {
  product: ProductSummary;
  quantity?: string;
  unitPrice?: string;
  discountPercentage?: string;
  discountAmount?: string;
  taxPercentage?: string;
  taxAmount?: string;
  onQuantityChange?: (quantity: string) => void;
  onUnitPriceChange?: (price: string) => void;
  onDiscountPercentageChange?: (percentage: string) => void;
  onDiscountAmountChange?: (amount: string) => void;
  disabled?: boolean;
  showCalculations?: boolean;
}

export function ProductLineInfo({
  product,
  quantity = '',
  unitPrice = '',
  discountPercentage = '',
  discountAmount = '',
  taxPercentage = '',
  taxAmount = '',
  onQuantityChange,
  onUnitPriceChange,
  onDiscountPercentageChange,
  onDiscountAmountChange,
  disabled = false,
  showCalculations = true
}: ProductLineInfoProps) {
  
  // Cálculos automáticos
  const calculateSubtotal = () => {
    if (!quantity || !unitPrice) return new Decimal(0);
    return new Decimal(quantity).mul(new Decimal(unitPrice));
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (subtotal.equals(0)) return new Decimal(0);

    if (discountAmount) {
      return new Decimal(discountAmount);
    }
    
    if (discountPercentage) {
      return subtotal.mul(new Decimal(discountPercentage)).div(100);
    }
    
    return new Decimal(0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const taxableAmount = subtotal.minus(discount);

    if (taxableAmount.lessThanOrEqualTo(0)) return new Decimal(0);

    if (taxAmount) {
      return new Decimal(taxAmount);
    }

    if (taxPercentage) {
      return taxableAmount.mul(new Decimal(taxPercentage)).div(100);
    }

    // Usar tax_rate del producto si está disponible
    if (product.tax_rate) {
      return taxableAmount.mul(new Decimal(product.tax_rate)).div(100);
    }

    return new Decimal(0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal.minus(discount).plus(tax);
  };

  const formatDecimal = (value: Decimal) => {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatPrice = (price?: string) => {
    if (!price) return '';
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getStockStatusColor = () => {
    if (!product.current_stock) return 'text-gray-500';
    const stock = parseFloat(product.current_stock);
    if (stock <= 0) return 'text-red-500';
    if (stock <= 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      onQuantityChange?.(value);
    }
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      onUnitPriceChange?.(value);
    }
  };

  const handleDiscountPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) && parseFloat(value || '0') <= 100) {
      onDiscountPercentageChange?.(value);
    }
  };

  const handleDiscountAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      onDiscountAmountChange?.(value);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Información del producto */}
      <div className="bg-white rounded-lg p-3 border border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-900">{product.code}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {ProductTypeLabels[product.product_type]}
            </span>
          </div>
          {product.sale_price && (
            <span className="text-sm font-medium text-green-600">
              Precio sugerido: ${formatPrice(product.sale_price)}
            </span>
          )}
        </div>
        
        <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>Unidad: {MeasurementUnitLabels[product.measurement_unit]}</span>
          {product.current_stock && (
            <span className={getStockStatusColor()}>
              Stock: {parseFloat(product.current_stock).toLocaleString('es-ES')}
            </span>
          )}
          {product.tax_rate && (
            <span>IVA: {parseFloat(product.tax_rate).toFixed(1)}%</span>
          )}
        </div>
      </div>

      {/* Campos de cantidad y precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad *
          </label>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            disabled={disabled}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio Unitario *
          </label>
          <input
            type="text"
            value={unitPrice}
            onChange={handleUnitPriceChange}
            disabled={disabled}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Campos de descuento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descuento (%)
          </label>
          <input
            type="text"
            value={discountPercentage}
            onChange={handleDiscountPercentageChange}
            disabled={disabled || !!discountAmount}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descuento (Monto)
          </label>
          <input
            type="text"
            value={discountAmount}
            onChange={handleDiscountAmountChange}
            disabled={disabled || !!discountPercentage}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Cálculos automáticos */}
      {showCalculations && (quantity || unitPrice) && (
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Cálculos</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${formatDecimal(calculateSubtotal())}</span>
            </div>
            
            {(discountPercentage || discountAmount) && (
              <div className="flex justify-between text-red-600">
                <span>Descuento:</span>
                <span className="font-medium">-${formatDecimal(calculateDiscount())}</span>
              </div>
            )}
            
            {(taxPercentage || taxAmount || product.tax_rate) && (
              <div className="flex justify-between text-blue-600">
                <span>
                  Impuesto 
                  {product.tax_rate && !taxPercentage && !taxAmount && (
                    <span className="text-xs ml-1">({parseFloat(product.tax_rate).toFixed(1)}%)</span>
                  )}:
                </span>
                <span className="font-medium">${formatDecimal(calculateTax())}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
              <span>Total:</span>
              <span>${formatDecimal(calculateTotal())}</span>
            </div>
          </div>
        </div>
      )}

      {/* Advertencias de stock */}
      {product.current_stock && quantity && parseFloat(quantity) > parseFloat(product.current_stock) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Stock insuficiente
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                La cantidad solicitada ({parseFloat(quantity).toLocaleString('es-ES')}) excede el stock disponible ({parseFloat(product.current_stock).toLocaleString('es-ES')}).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
