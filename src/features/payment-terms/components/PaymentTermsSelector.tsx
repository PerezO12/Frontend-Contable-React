import React, { useState, useCallback } from 'react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { ValidationMessage } from '../../../components/forms/ValidationMessage';
import { usePaymentTermsList } from '../hooks/usePaymentTerms';
import type { PaymentTerms } from '../types';

interface PaymentTermsSelectorProps {
  value?: string; // payment_terms_id
  onChange: (paymentTermsId: string | undefined) => void;
  onPaymentTermsSelect?: (paymentTerms: PaymentTerms | null) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const PaymentTermsSelector: React.FC<PaymentTermsSelectorProps> = ({
  value,
  onChange,
  onPaymentTermsSelect,
  error,
  disabled = false,
  placeholder = "Seleccionar condiciones de pago...",
  className = ""
}) => {  const { paymentTerms, loading, error: serviceError } = usePaymentTermsList({ 
    initialFilters: { is_active: true },
    autoLoad: true 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Asegurar que paymentTerms sea siempre un array válido
  const safePaymentTerms = Array.isArray(paymentTerms) ? paymentTerms : [];
  
  const selectedPaymentTerms = safePaymentTerms.find((pt: PaymentTerms) => pt.id === value);
  const filteredPaymentTerms = useCallback(() => {
    if (!searchTerm) return safePaymentTerms.slice(0, 10);
    
    const term = searchTerm.toLowerCase();
    return safePaymentTerms
      .filter((paymentTerm: PaymentTerms) => 
        paymentTerm.code.toLowerCase().includes(term) ||
        paymentTerm.name.toLowerCase().includes(term) ||
        (paymentTerm.description?.toLowerCase().includes(term) || false)
      )
      .slice(0, 10);
  }, [safePaymentTerms, searchTerm]);

  const handlePaymentTermsSelect = (paymentTerm: PaymentTerms) => {
    onChange(paymentTerm.id);
    onPaymentTermsSelect?.(paymentTerm);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(undefined);
    onPaymentTermsSelect?.(null);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);
    
    if (newSearchTerm === '' && value) {
      handleClear();
    }
  };

  const displayValue = selectedPaymentTerms 
    ? `${selectedPaymentTerms.code} - ${selectedPaymentTerms.name}`
    : searchTerm;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          className="text-sm"
        />
        
        {value && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 text-xs"
            disabled={disabled}
          >
            ×
          </Button>
        )}
        
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <Spinner size="sm" />
          </div>
        )}
      </div>      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl overflow-auto max-h-80 w-full mt-1">
          {loading && (
            <div className="px-4 py-3 text-center">
              <Spinner size="sm" />
              <span className="ml-2 text-sm text-gray-500">Cargando condiciones de pago...</span>
            </div>
          )}
          
          {!loading && filteredPaymentTerms().map((paymentTerm: PaymentTerms) => (
            <div
              key={paymentTerm.id}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handlePaymentTermsSelect(paymentTerm)}
            >
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
                  {(paymentTerm.payment_schedules?.length || 0) === 1 ? 'Plazo fijo' : 'Cronograma'} • 
                  {(paymentTerm.payment_schedules?.length || 0) === 1 
                    ? ` ${paymentTerm.max_days} días`
                    : ` ${paymentTerm.payment_schedules?.length || 0} cuotas`
                  }
                </div>
              </div>
            </div>          ))}
          
          {!loading && filteredPaymentTerms().length === 0 && (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              {searchTerm 
                ? `No se encontraron condiciones de pago que coincidan con "${searchTerm}"`
                : safePaymentTerms.length === 0 
                  ? "No hay condiciones de pago disponibles"
                  : "No se encontraron condiciones de pago"
              }
            </div>
          )}
        </div>
      )}      {(error || serviceError) && (
        <ValidationMessage type="error" message={error || serviceError || 'Error desconocido'} />
      )}

      {/* Selected payment terms details */}
      {selectedPaymentTerms && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
          <div className="font-medium">{selectedPaymentTerms.name}</div>
          <div className="text-blue-600">{selectedPaymentTerms.description}</div>
        </div>
      )}
    </div>
  );
};
