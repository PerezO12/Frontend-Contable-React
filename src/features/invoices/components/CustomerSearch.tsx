/**
 * Componente de búsqueda de clientes para facturas
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useThirdPartiesForInvoices } from '../hooks/useThirdPartiesForInvoices';
import { ThirdPartyType } from '@/features/third-parties/types';

interface CustomerSearchProps {
  value?: string;
  onChange?: (customerId: string, customerInfo: { code?: string; name: string }) => void;
  onSelect?: (thirdParty: { id: string; name: string; code?: string; document_number?: string; third_party_type?: string; default_account_id?: string }) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  filterByType?: 'customer' | 'supplier';
}

export function CustomerSearch({ 
  value = '', 
  onChange, 
  onSelect,
  disabled = false, 
  placeholder = "Buscar cliente...",
  error,
  filterByType = 'customer'
}: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { options: customers, loading } = useThirdPartiesForInvoices({ 
    type: ThirdPartyType.CUSTOMER 
  });
  // Filtrar clientes basado en el término de búsqueda
  const getFilteredCustomers = useCallback((term: string) => {
    if (!term || term.length === 0) {
      // Si no hay término, mostrar los primeros 10 clientes como sugerencias iniciales
      return customers.slice(0, 10);
    }
    
    if (term.length < 2) {
      return [];
    }
    
    const searchLower = term.toLowerCase();
    return customers
      .filter(customer => 
        customer.label.toLowerCase().includes(searchLower) ||
        (customer.code && customer.code.toLowerCase().includes(searchLower))
      )
      .slice(0, 20); // Limitar a 20 resultados
  }, [customers]);
  // Manejar selección de cliente
  const handleCustomerSelect = (customer: { value: string; label: string; code?: string }) => {
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
    } else if (onChange) {
      // Fallback al patrón anterior
      onChange(customer.value, { 
        code: customer.code, 
        name: customer.label 
      });
    }
  };  // Manejar cambio en el input
  const handleInputChange = (inputValue: string) => {
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
  const displayValue = value ? selectedCustomerName : searchTerm;

  // Efecto para cargar el nombre del cliente si ya hay un value
  useEffect(() => {
    if (value && !selectedCustomerName) {
      const selectedCustomer = customers.find(c => c.value === value);
      if (selectedCustomer) {
        setSelectedCustomerName(selectedCustomer.label);
      }
    }
  }, [value, customers, selectedCustomerName]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCustomers = getFilteredCustomers(searchTerm);

  return (
    <div className="relative" ref={dropdownRef}>
      <Input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={(e) => handleInputChange(e.target.value)}        onFocus={() => {
          setDropdownOpen(true); // Mostrar dropdown al hacer foco
        }}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        className={`${value ? 'bg-green-50 border-green-300' : ''}`}
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Spinner size="sm" />
        </div>
      )}

      {/* Dropdown de resultados */}
      {dropdownOpen && filteredCustomers.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.value}
              onClick={() => handleCustomerSelect(customer)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    {customer.label}
                  </div>
                  {customer.code && (
                    <div className="text-sm text-gray-500">
                      Código: {customer.code}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}      {/* Mensaje cuando no hay resultados */}
      {dropdownOpen && searchTerm.length >= 2 && filteredCustomers.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="px-4 py-3 text-gray-500 text-center">
            No se encontraron clientes
          </div>
        </div>
      )}

      {/* Información del cliente seleccionado */}
      {value && selectedCustomerName && !dropdownOpen && (
        <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-200">
          <div className="text-sm text-green-800">
            ✓ Cliente seleccionado: {selectedCustomerName}
          </div>
        </div>
      )}
    </div>
  );
}
