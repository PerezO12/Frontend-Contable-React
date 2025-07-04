/**
 * Account Selector Component
 * Dropdown component for selecting accounts with search functionality
 */
import React, { useState, useEffect, useRef } from 'react';
import { AccountsSettingsService, type Account } from '../services/accountsService';

interface AccountSelectorProps {
  value?: string;
  onChange: (accountId: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  accountType?: string; // Filter by account type if needed
  className?: string;
}

// Mock accounts service - replace with real API call
const mockAccounts: Account[] = [
  { id: '1', code: '1105', name: 'Cuentas por Cobrar Clientes', account_type: 'receivable', is_active: true },
  { id: '2', code: '2105', name: 'Cuentas por Pagar Proveedores', account_type: 'payable', is_active: true },
  { id: '3', code: '1110', name: 'Cuentas por Cobrar Empleados', account_type: 'receivable', is_active: true },
  { id: '4', code: '2110', name: 'Cuentas por Pagar Otros', account_type: 'payable', is_active: true },
  { id: '5', code: '1305', name: 'Inventarios', account_type: 'asset', is_active: true },
  { id: '6', code: '4105', name: 'Ventas', account_type: 'revenue', is_active: true },
  { id: '7', code: '5105', name: 'Costo de Ventas', account_type: 'expense', is_active: true },
];

// Icons
const ChevronDownIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar cuenta...",
  error,
  disabled = false,
  accountType,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load accounts
  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      try {
        let loadedAccounts: Account[];
        
        if (accountType === 'receivable') {
          loadedAccounts = await AccountsSettingsService.getReceivableAccounts();
        } else if (accountType === 'payable') {
          loadedAccounts = await AccountsSettingsService.getPayableAccounts();
        } else {
          // Get all active accounts
          loadedAccounts = await AccountsSettingsService.getAccounts({ is_active: true });
        }
        
        setAccounts(loadedAccounts);
      } catch (error) {
        console.error('Error loading accounts:', error);
        // Fallback to mock data if API fails
        let filteredAccounts = mockAccounts;
        
        if (accountType) {
          filteredAccounts = mockAccounts.filter(account => 
            account.account_type === accountType
          );
        }
        
        setAccounts(filteredAccounts);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, [accountType]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter(account =>
    account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find selected account
  const selectedAccount = accounts.find(account => account.id === value);

  // Handle account selection
  const handleSelect = (accountId: string) => {
    onChange(accountId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full bg-white border rounded-md pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
      >
        <span className="block truncate">
          {selectedAccount ? (
            <span>
              <span className="font-medium">{selectedAccount.code}</span>
              <span className="text-gray-500 ml-2">{selectedAccount.name}</span>
            </span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon />
        </span>
      </button>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md border border-gray-300 overflow-hidden">
          {/* Search box */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <SearchIcon />
              <input
                type="text"
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Cargando cuentas...
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {searchTerm ? 'No se encontraron cuentas' : 'No hay cuentas disponibles'}
              </div>
            ) : (
              filteredAccounts.map((account) => {
                const isSelected = account.id === value;
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleSelect(account.id)}
                    className={`
                      w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 flex items-center justify-between
                      ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    `}
                  >
                    <div>
                      <span className="font-medium">{account.code}</span>
                      <span className="text-gray-500 ml-2">{account.name}</span>
                    </div>
                    {isSelected && (
                      <CheckIcon />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
