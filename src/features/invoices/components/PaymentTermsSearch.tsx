/**
 * Componente de búsqueda y selección de términos de pago para facturas
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { usePaymentTermsList } from '@/features/payment-terms/hooks/usePaymentTerms';

interface PaymentTermsSearchProps {
  value?: string;
  onChange?: (paymentTermId: string, paymentTermInfo: { name: string; days?: number; code?: string }) => void;
  onSelect?: (paymentTerms: {
    id: string;
    name: string;
    code?: string;
    days: number;
  }) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
}

export function PaymentTermsSearch({ 
  value = '', 
  onChange, 
  onSelect,
  disabled = false, 
  placeholder = "Buscar plan de pago...",
  error 
}: PaymentTermsSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPaymentTermName, setSelectedPaymentTermName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { paymentTerms, loading } = usePaymentTermsList({
    initialFilters: { is_active: true }
  });

  // Convertir a formato de opciones para búsqueda
  const paymentTermsOptions = paymentTerms?.map(term => ({
    value: term.id,
    label: term.name,
    code: term.code,
    days: term.max_days || 0
  })) || [];

  // Filtrar términos de pago basado en el término de búsqueda
  const getFilteredPaymentTerms = useCallback((term: string) => {
    if (!term || term.length === 0) {
      return paymentTermsOptions.slice(0, 10);
    }
    
    if (term.length < 2) {
      return [];
    }
    
    const searchLower = term.toLowerCase();
    return paymentTermsOptions
      .filter(paymentTerm => 
        paymentTerm.label.toLowerCase().includes(searchLower) ||
        (paymentTerm.code && paymentTerm.code.toLowerCase().includes(searchLower))
      )
      .slice(0, 20);
  }, [paymentTermsOptions]);

  // Manejar selección de término de pago
  const handlePaymentTermSelect = (paymentTerm: { value: string; label: string; days?: number; code?: string }) => {
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
    } else if (onChange) {
      onChange(paymentTerm.value, { 
        name: paymentTerm.label,
        days: paymentTerm.days,
        code: paymentTerm.code
      });
    }
  };

  // Manejar cambio en el input
  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
    setDropdownOpen(true);
      
    if (!inputValue) {
      setSelectedPaymentTermName('');
      if (onChange) {
        onChange('', { name: '', days: 0, code: '' });
      }
    }
  };

  const displayValue = value ? selectedPaymentTermName : searchTerm;

  useEffect(() => {
    if (value && !selectedPaymentTermName) {
      const selectedPaymentTerm = paymentTermsOptions.find(p => p.value === value);
      if (selectedPaymentTerm) {
        setSelectedPaymentTermName(selectedPaymentTerm.label);
      }
    }
  }, [value, paymentTermsOptions, selectedPaymentTermName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPaymentTerms = getFilteredPaymentTerms(searchTerm);

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
        className={`${value ? 'bg-purple-50 border-purple-300' : ''}`}
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}

      {dropdownOpen && filteredPaymentTerms.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredPaymentTerms.map((paymentTerm) => (
            <button
              key={paymentTerm.value}
              onClick={() => handlePaymentTermSelect(paymentTerm)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {paymentTerm.label}
                  </div>
                  {paymentTerm.code && (
                    <div className="text-sm text-gray-500">
                      Código: {paymentTerm.code}
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-purple-600">
                  {paymentTerm.days} días
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {dropdownOpen && searchTerm.length >= 2 && filteredPaymentTerms.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron términos de pago
          </div>
        </div>
      )}

      {value && selectedPaymentTermName && !dropdownOpen && (
        <div className="mt-2 p-2 bg-purple-50 rounded-md border border-purple-200">
          <div className="text-sm text-purple-800">
            ✓ Términos seleccionados: {selectedPaymentTermName}
          </div>
        </div>
      )}
    </div>
  );
}